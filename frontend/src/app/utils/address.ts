/**
 * Truncates an Ethereum address for display purposes.
 * 
 * @param address - The full Ethereum address
 * @param startChars - Number of characters to keep at the start (default: 6)
 * @param endChars - Number of characters to keep at the end (default: 4)
 * @returns The truncated address (e.g., "0x1234...5678")
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return '';
  
  if (address.length <= startChars + endChars) {
    return address;
  }
  
  const start = address.substring(0, startChars);
  const end = address.substring(address.length - endChars);
  
  return `${start}...${end}`;
}
