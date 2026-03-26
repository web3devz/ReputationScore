import { useState } from 'react'
import { useSuiClient } from '@mysten/dapp-kit'
import { RPC_URL } from '../config/network'

const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY as string

interface AIResult {
  score: number
  grade: string
  summary: string
  breakdown: { label: string; value: string }[]
}

export default function AIScore({ address }: { address: string }) {
  const client = useSuiClient()
  const [result, setResult] = useState<AIResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [queryAddr, setQueryAddr] = useState(address)

  const analyze = async () => {
    const target = queryAddr.trim()
    if (!target) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      // 1. Fetch recent transactions for the address
      const txRes = await fetch(RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 1,
          method: 'suix_queryTransactionBlocks',
          params: [
            { filter: { FromAddress: target }, options: { showInput: false, showEffects: true } },
            null, 20, false
          ],
        }),
      })
      const txData = await txRes.json()
      const txs = txData?.result?.data ?? []

      // 2. Fetch owned objects count
      const objRes = await client.getOwnedObjects({ owner: target })
      const objCount = objRes.data?.length ?? 0

      // 3. Build summary for OpenAI
      const txCount = txs.length
      const successCount = txs.filter((t: { effects?: { status?: { status: string } } }) =>
        t.effects?.status?.status === 'success'
      ).length
      const failCount = txCount - successCount

      const prompt = `You are a blockchain reputation analyst. Analyze this wallet on OneChain testnet and give a reputation score from 0-100.

Wallet: ${target}
Recent transactions (last 20): ${txCount}
Successful: ${successCount}
Failed: ${failCount}
Owned objects: ${objCount}

Respond ONLY with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "grade": "<A+|A|B|C|D|F>",
  "summary": "<2 sentence analysis>",
  "breakdown": [
    { "label": "Transaction Activity", "value": "<assessment>" },
    { "label": "Success Rate", "value": "<percentage or assessment>" },
    { "label": "Asset Holdings", "value": "<assessment>" },
    { "label": "Overall Trust", "value": "<Low|Medium|High|Very High>" }
  ]
}`

      // 4. Call OpenAI
      const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 300,
        }),
      })

      if (!aiRes.ok) throw new Error(`OpenAI error: ${aiRes.status}`)
      const aiData = await aiRes.json()
      const raw = aiData.choices?.[0]?.message?.content ?? ''
      const parsed: AIResult = JSON.parse(raw.replace(/```json|```/g, '').trim())
      setResult(parsed)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const gradeColor = (g: string) => {
    if (g.startsWith('A')) return '#4ade80'
    if (g === 'B') return '#facc15'
    if (g === 'C') return '#fb923c'
    return '#f87171'
  }

  return (
    <div className="ai-score-panel">
      <div className="ai-header">
        <span className="ai-badge">🤖 AI Powered</span>
        <p className="card-desc">Analyzes on-chain activity and generates an AI reputation score.</p>
      </div>

      <div className="search-row" style={{ marginTop: '1rem' }}>
        <input
          value={queryAddr}
          onChange={(e) => setQueryAddr(e.target.value)}
          placeholder="0x address to analyze"
          onKeyDown={(e) => e.key === 'Enter' && analyze()}
        />
        <button className="btn-primary" onClick={analyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {loading && (
        <div className="ai-loading">
          <div className="ai-spinner" />
          <span>Fetching transactions and running AI analysis...</span>
        </div>
      )}

      {error && <p className="error" style={{ marginTop: '1rem' }}>⚠ {error}</p>}

      {result && (
        <div className="ai-result">
          <div className="ai-score-row">
            <div className="ai-score-circle" style={{ borderColor: gradeColor(result.grade) }}>
              <div className="ai-score-num">{result.score}</div>
              <div className="ai-score-sub">/ 100</div>
            </div>
            <div className="ai-grade" style={{ color: gradeColor(result.grade) }}>
              {result.grade}
            </div>
          </div>

          <p className="ai-summary">{result.summary}</p>

          <div className="ai-breakdown">
            {result.breakdown.map((b) => (
              <div key={b.label} className="ai-breakdown-item">
                <span className="ai-breakdown-label">{b.label}</span>
                <span className="ai-breakdown-value">{b.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
