# ReputationScore

A decentralized on-chain trust mechanism built on **OneChain** that tracks user contributions and interactions. Every meaningful action increases a user's credibility, creating a verifiable and transparent trust layer.

ReputationScore can power marketplaces, DAOs, and collaborative platforms where trust is essential.

---

## Deployed Contracts (Testnet)

| Name | Address |
|------|---------|
| Package ID | `0x722a42b32d71cdd3c293c1ffbe7b3667fb5d4b4193e5b4552f13de093bfd3b0a` |
| ScoreBoard (shared) | `0xa1c692919c6c2e75a1c932a9322f88233a1e255bef14ddfdafeb21d995470dce` |
| Deploy Transaction | `613W2yHWTxHxtz7YJ822FxkV2sbtNKub2Ab1vX1AtshW` |

- [View Package](https://onescan.cc/testnet/packageDetail?packageId=0x722a42b32d71cdd3c293c1ffbe7b3667fb5d4b4193e5b4552f13de093bfd3b0a)
- [View ScoreBoard](https://onescan.cc/testnet/objectDetails?address=0xa1c692919c6c2e75a1c932a9322f88233a1e255bef14ddfdafeb21d995470dce)
- [View Deploy Tx](https://onescan.cc/testnet/transactionBlocksDetail?digest=613W2yHWTxHxtz7YJ822FxkV2sbtNKub2Ab1vX1AtshW)

---

## Contract API

```move
// Self-report +1 reputation (any user)
public fun self_report(board: &mut ScoreBoard, ctx: &mut TxContext)

// Authority grants reputation to a user
public fun grant(board: &mut ScoreBoard, user: address, amount: u64, ctx: &mut TxContext)

// Authority slashes reputation from a user
public fun slash(board: &mut ScoreBoard, user: address, amount: u64, ctx: &mut TxContext)

// Read a user's score (no tx needed)
public fun get_score(board: &ScoreBoard, user: address): u64
```

---

## Local Development

```bash
# Build
~/.cargo/bin/one move build --path contracts

# Deploy
~/.cargo/bin/one client publish --gas-budget 50000000 contracts

# Frontend
cd frontend && npm install && npm run dev
```

Set in `frontend/.env`:
```env
VITE_PACKAGE_ID=<package_id>
VITE_SCOREBOARD_ID=<scoreboard_object_id>
```

## License
MIT
