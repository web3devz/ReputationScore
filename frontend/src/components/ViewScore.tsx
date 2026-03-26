import { useState } from 'react'
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit'
import { SCOREBOARD_ID } from '../config/network'
import AIScore from './AIScore'

export default function ViewScore() {
  const account = useCurrentAccount()
  const client = useSuiClient()
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [queryAddr, setQueryAddr] = useState('')
  const [aiMode, setAiMode] = useState(false)

  const getTier = (s: number) => {
    if (s >= 1000) return { name: 'Platinum', class: 'tier-platinum' }
    if (s >= 500) return { name: 'Gold', class: 'tier-gold' }
    if (s >= 100) return { name: 'Silver', class: 'tier-silver' }
    if (s > 0) return { name: 'Bronze', class: 'tier-bronze' }
    return { name: 'Unranked', class: '' }
  }

  const lookup = async (addr?: string) => {
    const target = addr || queryAddr || account?.address
    if (!target) return
    setLoading(true)
    setError('')
    setScore(null)
    setSearched(false)

    try {
      const res = await client.getObject({
        id: SCOREBOARD_ID,
        options: { showContent: true },
      })
      const content = res.data?.content
      if (content?.dataType !== 'moveObject') return
      const fields = content.fields as { scores?: { fields?: { contents?: { fields: { key: string; value: string } }[] } } }
      const contents = fields?.scores?.fields?.contents ?? []
      const entry = contents.find((c) => c.fields.key === target)
      setScore(entry ? parseInt(entry.fields.value) : 0)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch score')
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const myScore = score !== null && (!queryAddr || queryAddr === account?.address)

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>View Reputation Score</h2>
          <p className="card-desc">Check on-chain reputation or run an AI analysis.</p>
        </div>
        <div className="ai-toggle-wrap">
          <span className="ai-toggle-label">{aiMode ? '🤖 AI Mode' : '⛓ Chain Mode'}</span>
          <button
            className={`ai-toggle ${aiMode ? 'on' : ''}`}
            onClick={() => setAiMode(!aiMode)}
            title="Switch between on-chain score and AI analysis"
          >
            <span className="ai-toggle-knob" />
          </button>
        </div>
      </div>

      {aiMode ? (
        <AIScore address={queryAddr || account?.address || ''} />
      ) : (
        <>
          <div className="search-row">
            <input
              value={queryAddr}
              onChange={(e) => setQueryAddr(e.target.value)}
              placeholder="0x address (leave blank for your score)"
              onKeyDown={(e) => e.key === 'Enter' && lookup()}
            />
            <button className="btn-primary" onClick={() => lookup()} disabled={loading}>
              {loading ? 'Loading...' : 'Look Up'}
            </button>
          </div>

          {error && <p className="error">⚠ {error}</p>}

          {searched && score !== null && (
            <div className="score-display">
              <div className="score-big">{score}</div>
              <div className="score-label">Reputation Points</div>
              {(() => {
                const tier = getTier(score)
                return tier.class ? <div className={`score-tier ${tier.class}`}>{tier.name}</div> : null
              })()}
              {myScore && (
                <button className="btn-ghost" onClick={() => lookup(account?.address)}>
                  ↻ Refresh My Score
                </button>
              )}
            </div>
          )}

          {searched && score === null && !error && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No score found</h3>
              <p>This address hasn't earned any reputation yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
