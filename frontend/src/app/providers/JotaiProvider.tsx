'use client';

import { createStore, Provider } from 'jotai';
import { ReactNode } from 'react';

// Create a store instance to be used across the app
export const store = createStore();

interface JotaiProviderProps {
  children: ReactNode;
}

export function JotaiProvider({ children }: JotaiProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
