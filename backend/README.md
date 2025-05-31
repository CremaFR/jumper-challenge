# 🚀 Jumper challenge backend

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Install dependencies: `npm install`

### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables
- Enter your ALCHEMY_API_KEY

### Step 3: 🗄️ Database Setup

- Option 1: Use the setup script: `./setup-db.sh` (Make it executable first with `chmod +x setup-db.sh`)
  - This uses `prisma db push` for a quick setup without migration history
- Option 2: Manual setup with migrations (recommended for development):
  - Initialize the database with migrations: `npx prisma migrate dev --name init` 
  - Generate Prisma client: `npx prisma generate`
- Populate leaderboard with test data (optional): `npx tsx scripts/populate-leaderboard.ts`
  - For details about the leaderboard population script, see [scripts/README.md](./scripts/README.md)

### Step 4: 🏃‍♂️ Running the Project

- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`

## 🏗️ Architecture & Design Decisions

### Core Architecture
- **MVC Pattern**: Controllers, Services, and Models for clear separation

### Database
- **Prisma ORM**: Type-safe database client with auto-generated types
- **Indexing**: Performance optimization with descending index on points for leaderboard queries

### Token Service Features
- **Parallel Processing**: Uses `Promise.all()` for concurrent API calls to Alchemy
- **In-Memory Caching**: Simple caching system for token metadata with expiration
- **Chain Flexibility**: Supports multiple EVM chains via chainId parameter

### Authentication
- **Sign-In with Ethereum (SIWE)**: Secure wallet-based authentication
- **JWT**: Session management with JSON Web Tokens
- **Middleware Protection**: Routes protected with auth middleware

### Leaderboard System
- **Point-Based Ranking**: Users earn points for logins
- **Login Tracking**: Records number of logins per user
- **Pagination**: Efficient data retrieval with limit/offset pagination
- **User Rank API**: Dedicated endpoint to check current user's position
- **Test Data Generation**: Utility script to populate with randomized data

## 🚀 Future Improvements

### Performance Enhancements
- **Persistent Cache**: Replace in-memory cache with Redis for persistence across restarts
- **Rate Limiting**: Implement more sophisticated rate limiting by user/IP
- **Pagination**: Add pagination for token balances to handle large wallets``
- **Filter spam tokens**: Integrate counter value service to remove spam tokens.
- **Git pre-commit hooks**: Should have done it first thing haha