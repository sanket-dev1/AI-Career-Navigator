"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  targetRole: string | null;
  learningHoursPerWeek: number | null;
  learningStyle: string | null;
  theme: string | null;
  isAdmin?: boolean | null;
};

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initial);
  const [loading, setLoading] = useState(!initial);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    if (typeof window !== "undefined") window.location.href = "/";
  }, []);

  useEffect(() => {
    if (!initial) refresh();
  }, [initial, refresh]);

  const value = useMemo(
    () => ({ user, loading, refresh, logout }),
    [user, loading, refresh, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
