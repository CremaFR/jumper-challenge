# 🚀 Jumper challenge backend

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Install dependencies: `npm install`

### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables

### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`

## 🏗️ Architecture & Design Decisions

### Core Architecture
- **MVC Pattern**: Controllers, Services, and Models for clear separation

### Token Service Features
- **Parallel Processing**: Uses `Promise.all()` for concurrent API calls to Alchemy
- **In-Memory Caching**: Simple caching system for token metadata with expiration
- **Chain Flexibility**: Supports multiple EVM chains via chainId parameter

### Authentication
- **Sign-In with Ethereum (SIWE)**: Secure wallet-based authentication
- **JWT**: Session management with JSON Web Tokens
- **Middleware Protection**: Routes protected with auth middleware

## 🚀 Future Improvements

### Performance Enhancements
- **Persistent Cache**: Replace in-memory cache with Redis for persistence across restarts
- **Rate Limiting**: Implement more sophisticated rate limiting by user/IP
- **Pagination**: Add pagination for token balances to handle large wallets``
- **Filter spam tokens**: Integrate counter value service to remove spam tokens.
- **Git pre-commit hooks**: Should have done it first thing haha
