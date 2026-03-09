import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../utils/api';
import type { User } from '../types';

// Define exactly what this context will provide to the whole app
interface AuthContextType {
  user: User | null;          // the logged in user, or null if not logged in
  loading: boolean;           // true while we're checking if user is logged in
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  can: (permission: string) => boolean;  // RBAC check on the frontend
}

// Permission map — mirrors our backend PERMISSION_MAP exactly
// This controls what UI elements show/hide for each role
const PERMISSION_MAP: Record<string, string[]> = {
  view_restaurants: ['admin', 'manager', 'member'],
  create_order:     ['admin', 'manager', 'member'],
  place_order:      ['admin', 'manager'],
  cancel_order:     ['admin', 'manager'],
  update_payment:   ['admin'],
};

// Step 1: Create the context with null as default
// null means "no provider found" — we'll throw an error if that happens
const AuthContext = createContext<AuthContextType | null>(null);

// Step 2: Create the Provider component
// This wraps the whole app and makes auth data available everywhere
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // When the app first loads — check if user is already logged in
  // They might have a token in localStorage from a previous session
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Token exists — verify it's still valid by calling /api/auth/me
      api.get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          // Token is expired or invalid — clean up
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      // No token — definitely not logged in
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, []); // Empty array = run once when component mounts

  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/login', { email, password });

    // Store token so axios interceptor sends it with future requests
    localStorage.setItem('token', data.token);

    // Store user in state so whole app knows who's logged in
    setUser(data.user);

    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // This is the frontend RBAC check
  // Controls what buttons/pages are visible based on role
  // Important: this is UI only — real security is on the backend
  const can = (permission: string): boolean => {
    if (!user) return false;
    return PERMISSION_MAP[permission]?.includes(user.role) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 3: Create a custom hook
// Instead of importing useContext + AuthContext everywhere,
// components just call useAuth() — one clean import
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  // If someone uses useAuth() outside of AuthProvider, catch it immediately
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}