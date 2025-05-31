#!/bin/bash

# Initialize Prisma and create the database
# Using db push for a quick setup without migration history
echo "Initializing database with Prisma..."
npx prisma db push

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Database setup complete!"