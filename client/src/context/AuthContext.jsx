/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "abdidelivery-session";

const loadStoredSession = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getDisplayNameFromEmail = (email) => {
  if (!email) {
    return "Guest";
  }

  const prefix = email.split("@")[0] || "Guest";
  return prefix
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getInitials = (displayName) => {
  const parts = (displayName || "Guest").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "G";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(loadStoredSession);

  const persistSession = (nextSession) => {
    setSession(nextSession);

    if (typeof window === "undefined") {
      return;
    }

    if (nextSession) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo(() => {
    const profile = session
      ? {
          ...session,
          displayName:
            session.displayName || getDisplayNameFromEmail(session.email),
          initials: getInitials(
            session.displayName || getDisplayNameFromEmail(session.email),
          ),
        }
      : null;

    return {
      isAuthenticated: Boolean(profile),
      profile,
      signIn: ({ email, name }) => {
        const nextSession = {
          email,
          displayName: name || getDisplayNameFromEmail(email),
        };
        persistSession(nextSession);
      },
      signUp: ({ email, name }) => {
        const nextSession = {
          email,
          displayName: name || getDisplayNameFromEmail(email),
        };
        persistSession(nextSession);
      },
      signOut: () => persistSession(null),
    };
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
