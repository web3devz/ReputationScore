import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID, SCOREBOARD_ID, txUrl } from '../config/network'

export default function GrantReputation() {
  const account = useCurrentAccount()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()
  const [user, setUser] = useState('')
  const [amount, setAmount] = useState('')
  const [isPositive, setIsPositive] = useState(true)
  const [txDigest, setTxDigest] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!account || !user || !amount) return
    setError('')
    setTxDigest('')

    const tx = new Transaction()
    const fn = isPositive ? 'grant' : 'slash'
    tx.moveCall({
      target: `${PACKAGE_ID}::score::${fn}`,
      arguments: [
        tx.object(SCOREBOARD_ID),
        tx.pure.address(user),
        tx.pure.u64(BigInt(amount)),
      ],
    })

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (r) => { setTxDigest(r.digest); setUser(''); setAmount('') },
        onError: (e) => setError(e.message),
      }
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Grant or Slash Reputation</h2>
        <p className="card-desc">Authority-only: adjust user reputation scores.</p>
      </div>

      <form onSubmit={submit} className="form">
        <div className="form-row">
          <label>
            User Address *
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="0x..."
              required
            />
          </label>
          <label>
            Amount *
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10"
              min="1"
              required
            />
          </label>
        </div>

        <label>
          <input
            type="checkbox"
            checked={isPositive}
            onChange={(e) => setIsPositive(e.target.checked)}
          />
          {' '}Grant (uncheck to slash)
        </label>

        {error && <p className="error">⚠ {error}</p>}

        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? 'Processing...' : isPositive ? 'Grant Reputation' : 'Slash Reputation'}
        </button>
      </form>

      {txDigest && (
        <div className="tx-success">
          <span>✅ Reputation {isPositive ? 'granted' : 'slashed'}</span>
          <a href={txUrl(txDigest)} target="_blank" rel="noreferrer">View tx ↗</a>
        </div>
      )}
    </div>
  )
}
