# Leaderboard Population Script

This script helps populate the leaderboard with randomly generated data for testing and demonstration purposes.

## Usage

You can run the script with:

```bash
# Add the default number of random entries (50)
npx tsx scripts/populate-leaderboard.ts
```

## Configuration

To modify the script behavior, you need to edit the script directly:

1. Open `scripts/populate-leaderboard.ts`
2. Change the `DEFAULT_COUNT` constant to adjust the number of entries to create
3. Change the `SHOULD_CLEAR` constant to `true` if you want to clear existing entries before adding new ones

## What it does

- Generates random Ethereum wallet addresses
- Creates random login counts (1-10)
- Calculates points based on logins (10 points per login)
- Sets random dates for last login and account creation
- Distributes entries between Ethereum and Polygon chains