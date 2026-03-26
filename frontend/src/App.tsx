import { useState } from 'react'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import ViewScore from './components/ViewScore'
import GrantReputation from './components/GrantReputation'
import './App.css'

type Tab = 'view' | 'grant'

export default function App() {
  const account = useCurrentAccount()
  const [tab, setTab] = useState<Tab>('view')

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="logo">⭐</span>
          <div>
            <div className="brand-name">ReputationScore</div>
            <div className="brand-sub">On-Chain Trust System</div>
          </div>
        </div>
        <ConnectButton />
      </header>

      {!account ? (
        <>
          <section className="hero">
            <div className="hero-badge">Decentralized Trust</div>
            <h1>Your Reputation,<br />Verified On-Chain</h1>
            <p className="hero-sub">
              Build credibility through transparent, immutable on-chain records.
              Every action increases your score. Trust is earned, not given.
            </p>
            <div className="hero-features">
              <div className="feature"><span>📊</span><span>Transparent</span></div>
              <div className="feature"><span>✅</span><span>Immutable</span></div>
              <div className="feature"><span>🔗</span><span>Verifiable</span></div>
              <div className="feature"><span>🚀</span><span>Instant</span></div>
            </div>
          </section>

          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-value">∞</div>
              <div className="stat-label">Possible Score</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Gatekeepers</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">100%</div>
              <div className="stat-label">Transparent</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">&lt;1s</div>
              <div className="stat-label">Finality</div>
            </div>
          </div>

          <section className="how-section">
            <div className="section-title">How Reputation Works</div>
            <p className="section-sub">Three ways to build trust</p>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-num">01</div>
                <div className="step-icon">🤝</div>
                <h3>Self-Report</h3>
                <p>Log your contributions and activities. Each report adds +1 to your score.</p>
              </div>
              <div className="step-card">
                <div className="step-num">02</div>
                <div className="step-icon">👥</div>
                <h3>Get Endorsed</h3>
                <p>Authorities can grant reputation for verified actions and achievements.</p>
              </div>
              <div className="step-card">
                <div className="step-num">03</div>
                <div className="step-icon">📈</div>
                <h3>Build Credibility</h3>
                <p>Your score is permanent, verifiable, and portable across all dApps.</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="dashboard">
          <div className="dashboard-inner">
            <nav className="tabs">
              {(['view', 'grant'] as Tab[]).map((t) => (
                <button
                  key={t}
                  className={tab === t ? 'active' : ''}
                  onClick={() => setTab(t)}
                >
                  {t === 'view' && '📊 View Score'}
                  {t === 'grant' && '⭐ Grant Reputation'}
                </button>
              ))}
            </nav>
            <main>
              {tab === 'view' && <ViewScore />}
              {tab === 'grant' && <GrantReputation />}
            </main>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>ReputationScore · OneChain Testnet</span>
        <a href="https://onescan.cc/testnet" target="_blank" rel="noreferrer">Explorer ↗</a>
      </footer>
    </div>
  )
}
