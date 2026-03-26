# ReputationScore ⭐

**Decentralized Trust Layer on OneChain — Build, Measure, and Verify Credibility On-Chain**

ReputationScore is a decentralized reputation system that tracks user contributions and interactions directly on-chain. It transforms trust into a transparent, quantifiable, and verifiable metric that can power marketplaces, DAOs, and collaborative ecosystems.

## 🌐 Overview

Trust is a fundamental component of any system — yet most platforms rely on centralized scoring mechanisms that are opaque, manipulable, and platform-specific.

ReputationScore introduces a **fully on-chain reputation layer** where credibility is:

* **Transparent** → publicly verifiable by anyone
* **Immutable** → cannot be altered arbitrarily
* **Composable** → usable across multiple dApps
* **User-linked** → tied directly to wallet addresses

This creates a universal trust primitive for Web3 applications.

## ❗ The Problem

* Reputation systems are centralized and opaque
* Users cannot carry trust across platforms
* Scores can be manipulated or reset
* No standardized trust layer in Web3
* Difficult to evaluate credibility in decentralized systems

## 💡 The Solution

ReputationScore maintains a **shared on-chain ScoreBoard** that tracks reputation points for each wallet.

Users gain or lose reputation through actions, and their score determines their **trust tier**. This system enables applications to build **trust-aware experiences** without relying on centralized authorities.

## ✨ Key Features

* **On-Chain Reputation Tracking**
  Store and manage trust scores directly on the blockchain

* **Tier-Based System**
  Categorize users into Bronze, Silver, Gold, and Platinum tiers

* **Permissioned Reputation Control**
  Authorities can grant or slash reputation

* **Self-Reported Activity**
  Users can incrementally build reputation through participation

* **AI-Powered Reputation Analysis**
  Generate detailed trust reports, scores, and behavioral insights

* **Shared ScoreBoard Object**
  Centralized logic with decentralized access

## ⚙️ How It Works

1. A shared ScoreBoard object is deployed on-chain
2. Users interact with the system (self-report or receive grants)
3. Reputation scores are updated based on actions
4. Scores determine user tiers and trust level
5. Frontend displays scores and analytics
6. AI analyzes activity for deeper insights

## 📦 Deployed Contract

* **Network:** OneChain Testnet

* **Package ID:**
  `0x722a42b32d71cdd3c293c1ffbe7b3667fb5d4b4193e5b4552f13de093bfd3b0a`

* **ScoreBoard Object:**
  `0xa1c692919c6c2e75a1c932a9322f88233a1e255bef14ddfdafeb21d995470dce`

* **Deploy Transaction:**
  `613W2yHWTxHxtz7YJ822FxkV2sbtNKub2Ab1vX1AtshW`

* **Explorer Links:**
  [https://onescan.cc/testnet/packageDetail?packageId=0x722a42b32d71cdd3c293c1ffbe7b3667fb5d4b4193e5b4552f13de093bfd3b0a](https://onescan.cc/testnet/packageDetail?packageId=0x722a42b32d71cdd3c293c1ffbe7b3667fb5d4b4193e5b4552f13de093bfd3b0a)
  [https://onescan.cc/testnet/objectDetails?address=0xa1c692919c6c2e75a1c932a9322f88233a1e255bef14ddfdafeb21d995470dce](https://onescan.cc/testnet/objectDetails?address=0xa1c692919c6c2e75a1c932a9322f88233a1e255bef14ddfdafeb21d995470dce)
  [https://onescan.cc/testnet/transactionBlocksDetail?digest=613W2yHWTxHxtz7YJ822FxkV2sbtNKub2Ab1vX1AtshW](https://onescan.cc/testnet/transactionBlocksDetail?digest=613W2yHWTxHxtz7YJ822FxkV2sbtNKub2Ab1vX1AtshW)

## 🛠 Tech Stack

**Smart Contract**

* Move (OneChain)

**Frontend**

* React
* TypeScript
* Vite

**Wallet Integration**

* @mysten/dapp-kit

**AI Integration**

* GPT-4o-mini (reputation analysis & scoring)

**Network**

* OneChain Testnet

## 🔍 Use Cases

* **Decentralized Marketplaces**
  Evaluate seller and buyer trustworthiness

* **DAO Governance**
  Weight votes based on reputation

* **Freelancer Platforms**
  Build verifiable work credibility

* **Social Platforms**
  Rank users based on contributions

* **Collaborative Ecosystems**
  Incentivize meaningful participation

## 🚀 Why ReputationScore Stands Out

* **Transparent Trust System** — fully on-chain visibility
* **Portable Reputation** — usable across multiple dApps
* **Tamper-Proof Scores** — immutable credibility tracking
* **AI-Enhanced Analysis** — deeper trust insights
* **Composable Infrastructure** — plug into any Web3 app
* **Hackathon-Ready Impact** — solves a core Web3 problem

## 🔮 Future Improvements

* Decentralized reputation validation (multi-signer approvals)
* Cross-chain reputation aggregation
* Advanced scoring algorithms
* ZK-based privacy-preserving reputation
* Integration with identity systems like ChainProfile
* Gamified incentives and leaderboards

## ⚙️ Contract API

```move id="7qj2xp"
// Self-report +1 reputation (any user)
public fun self_report(board: &mut ScoreBoard, ctx: &mut TxContext)

// Authority grants reputation to a user
public fun grant(board: &mut ScoreBoard, user: address, amount: u64, ctx: &mut TxContext)

// Authority slashes reputation from a user
public fun slash(board: &mut ScoreBoard, user: address, amount: u64, ctx: &mut TxContext)

// Read a user's score (no tx needed)
public fun get_score(board: &ScoreBoard, user: address): u64
```

## 💻 Local Development

```bash id="q9lm2w"
~/.cargo/bin/one move build --path contracts
~/.cargo/bin/one client publish --gas-budget 50000000 contracts
cd frontend && npm install && npm run dev
```

Set in `frontend/.env`:

```env id="m2xk9d"
VITE_PACKAGE_ID=<package_id>
VITE_SCOREBOARD_ID=<scoreboard_object_id>
VITE_OPENAI_KEY=<openai_api_key>
```

## 📄 License

MIT License