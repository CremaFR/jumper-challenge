import { atom } from 'jotai'

// Define a JWT atom to store the authentication token
export const authTokenAtom = atom<string | null>(null)