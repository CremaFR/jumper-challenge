import { TokenData } from '@/api/tokens';
import { atom } from 'jotai';
import { store } from '@/app/providers/JotaiProvider';
import { authTokenAtom } from './authAtoms';

// Atom to store token balances data
export const tokenBalancesAtom = atom<TokenData[] | null>(null);

// Atom to store any error from fetching token balances
export const tokenBalancesErrorAtom = atom<string | null>(null);

// Setup subscription to clear token balances when auth token is cleared
export const setupAuthSubscription = () => {
  store.sub(authTokenAtom, () => {
    const authToken = store.get(authTokenAtom);
    if (authToken === null) {
      store.set(tokenBalancesAtom, null);
      store.set(tokenBalancesErrorAtom, null);
    }
  });
};
