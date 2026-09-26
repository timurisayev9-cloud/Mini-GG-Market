import { useCallback, useEffect, useState } from 'react';

export type MarketSession = {
  name: string;
  email: string;
  isOwner: boolean;
};

const SESSION_KEY = 'mini-gg-market-session';
const OWNER_EMAIL = 'timurisayev9@gmail.com';

export function useMarketSession() {
  const [session, setSession] = useState<MarketSession | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setSession(JSON.parse(stored) as MarketSession);
      } catch {
        window.localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const signIn = useCallback((name: string, email: string) => {
    const next = { name: name || email.split('@')[0], email, isOwner: email.toLowerCase() === OWNER_EMAIL };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setSession(next);
    return next;
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  return { session, signIn, signOut, ownerEmail: OWNER_EMAIL };
}