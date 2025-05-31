# 🚀 Jumper Challenge Frontend

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 🏗️ Architecture & Design Decisions

### Core Architecture
- **React Query**: For data fetching, caching, and state management
- **Jotai**: Lightweight atomic state management for global state
- **Styled Components**: For styling and component system - CSS mostly AI generated on this

### Web3 Integration
- **Wagmi & Viem**: For wallet connection and blockchain interactions
- **ConnectKit**: For easy wallet connection UX
- **SIWE (Sign-In with Ethereum)**: For secure wallet-based authentication
- **Chain Flexibility**: Support for multiple EVM networks via network selector

### Frontend Features
- **Error Handling**: Comprehensive error states and user feedback
- **Workflow**: Should gracefully handle deconnection - clearing tokens and state
- **Auth**: JWT-based authentication with token persistence
 
## 🚀 Future Improvements

### Feature Additions
- **Auth Persistence**: Saving tokens (auth/refresh) to handle page refresh 

### Testing & Quality
- **Unit Tests**: Add Jest tests for components
- **Storybook**: Add component documentation with Storybook
