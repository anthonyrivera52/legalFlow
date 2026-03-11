"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Organization } from "@/types";
import { users, organizations, memberships } from "@/data";

interface AuthContextType {
  currentUser: User | null;
  currentOrganization: Organization | null;
  switchUser: (userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUserId = localStorage.getItem("lexflow_user_id");
    if (storedUserId) {
      const user = users.find((u) => u.id === storedUserId);
      if (user) {
        setCurrentUser(user);
        
        // Find user's organization
        const membership = memberships.find((m) => m.userId === user.id && m.status === "active");
        if (membership) {
          const org = organizations.find((o) => o.id === membership.organizationId);
          setCurrentOrganization(org || null);
        }
        setIsAuthenticated(true);
      }
    } else {
      // Default to first user if none stored
      const defaultUser = users[0];
      setCurrentUser(defaultUser);
      const membership = memberships.find((m) => m.userId === defaultUser.id);
      if (membership) {
        const org = organizations.find((o) => o.id === membership.organizationId);
        setCurrentOrganization(org || null);
      }
      setIsAuthenticated(true);
      localStorage.setItem("lexflow_user_id", defaultUser.id);
    }
  }, []);

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("lexflow_user_id", userId);
      
      // Find user's organization
      const membership = memberships.find((m) => m.userId === user.id && m.status === "active");
      if (membership) {
        const org = organizations.find((o) => o.id === membership.organizationId);
        setCurrentOrganization(org || null);
        localStorage.setItem("lexflow_org_id", org?.id || "");
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentOrganization(null);
    setIsAuthenticated(false);
    localStorage.removeItem("lexflow_user_id");
    localStorage.removeItem("lexflow_org_id");
    // Redirect to login
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentOrganization,
        switchUser,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
