# Blockchain Loyalty Points

A React + TypeScript demo application implementing a simplified blockchain used to issue, transfer, and mine loyalty points between customer wallets and merchants. It visualizes blocks, pending transactions, and allows mining to confirm transactions. Built with Vite and Tailwind.

## Key Features
- In-browser blockchain simulation (`src/lib/blockchain.ts`)
- Wallet management and point balances (`src/lib/wallet.ts`)
- Transaction creation & validation (`src/lib/transaction.ts`)
- Simple mining (proof-of-work style hash difficulty) to confirm pending transactions
- UI panels for merchants, mining, transactions, and history (`src/components/*`)
- Reusable UI components (Radix + shadcn style system) in `src/components/ui`

## Tech Stack
- React 19 + TypeScript
- Vite for dev/build
- Tailwind CSS + shadcn/ui component patterns
- Zustand for state management
- React Hook Form + Zod for form validation
- Radix UI primitives

## Getting Started

### Prerequisites
- Node.js (recommend LTS ≥ 18)
- pnpm (project uses `packageManager` field)  
  Install pnpm globally if needed:
  ```bash
  npm install -g pnpm
  ```

### Install Dependencies
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
```
Then open http://localhost:5173 (default Vite port) in your browser.

### Lint
```bash
pnpm lint
```

### Production Build
```bash
pnpm build
```
Output goes to `dist/`.

### Preview Production Build
```bash
pnpm preview
```

## Project Structure (selected)
```
src/
  lib/
    blockchain.ts     # Core blockchain class (blocks, mining, difficulty)
    transaction.ts    # Transaction model & validation
    wallet.ts         # Wallet generation & balance tracking
    utils.ts          # Helpers (hashing, formatting, etc.)
  components/         # Feature components (panels, forms, visualizer)
  components/ui/      # Reusable UI primitives / wrappers
  pages/              # Routed pages (Index, NotFound)
  hooks/              # Custom hooks (toast, mobile detection)
```

## Environment Variables
Currently no required environment variables for core blockchain simulation. If/when integrating external services (e.g. Supabase), create a `.env` and add keys, then provide an `.env.example` for contributors.

## Blockchain Simulation Notes
- This is an educational model; security and consensus are simplified.
- Mining difficulty & reward can be tuned in `blockchain.ts`.
- Transactions are not cryptographically signed; consider adding real signatures (e.g. using elliptic curve) for authenticity later.

## Suggested Improvements / Next Steps
- Persist chain & wallets to localStorage or Supabase.
- Add digital signatures to transactions.
- Implement adjustable mining difficulty via UI.
- Add tests for block validation and transaction flows.
- Add dark/light theme toggle (using `next-themes`).

## Contributing
1. Fork and clone.
2. Create feature branch: `git checkout -b feat/awesome-thing`.
3. Commit changes: `git commit -m "feat: add awesome thing"`.
4. Push & open PR.

## License
MIT
