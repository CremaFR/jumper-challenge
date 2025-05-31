import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Function to generate a random Ethereum address
function generateRandomAddress(): string {
  // Generate a random hex string for the address (40 chars = 20 bytes)
  let addr = '0x';
  const chars = '0123456789abcdef';
  for (let i = 0; i < 40; i++) {
    addr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return addr;
}

// Function to generate a random date within the last 30 days
function generateRandomDate(): Date {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(
    thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
  );
}

// Function to populate the leaderboard with random entries
async function populateLeaderboard(count: number): Promise<void> {
  console.log(`Adding ${count} random entries to the leaderboard...`);
  
  // Track success count
  let successCount = 0;
  
  // Generate random addresses and data
  const entries = Array.from({ length: count }, () => {
    const logins = Math.floor(Math.random() * 10) + 1; // 1-10 logins
    const basePoints = logins * 10; // Base points from logins
    
    return {
      address: generateRandomAddress(),
      chainId: Math.random() > 0.3 ? 1 : 137, // 70% chance for Ethereum (1), 30% for Polygon (137)
      points: basePoints,
      logins,
      lastLogin: generateRandomDate(),
      createdAt: generateRandomDate(),
      updatedAt: new Date(),
    };
  });
  
  // Insert entries one by one to handle duplicates
  try {
    for (const entry of entries) {
      try {
        // Try to create the entry, if it fails due to duplicate, we'll just skip it
        await prisma.leaderboardEntry.create({
          data: entry
        });
        successCount++;
      } catch (err) {
        // If it's not a duplicate error, log it
        if (!(err as any).message?.includes('Unique constraint')) {
          console.error('Error creating entry:', err);
        }
      }
    }
    
    console.log(`Successfully added ${successCount} new entries to the leaderboard.`);
  } catch (error) {
    console.error('Error populating leaderboard:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Function to clear existing entries if needed
async function clearLeaderboard(): Promise<void> {
  try {
    const deleted = await prisma.leaderboardEntry.deleteMany({});
    console.log(`Cleared ${deleted.count} existing entries from the leaderboard.`);
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
  }
}

// Default number of entries
const DEFAULT_COUNT = 50;

// Hard-coded option - use process.env to override if needed
const SHOULD_CLEAR = false; // Set to true if you want to clear existing entries

// Main function 
async function main() {
  if (SHOULD_CLEAR) {
    await clearLeaderboard();
  }
  
  await populateLeaderboard(DEFAULT_COUNT);
}

// Run the main function
main()
  .catch((e) => {
    console.error(e);
  });
