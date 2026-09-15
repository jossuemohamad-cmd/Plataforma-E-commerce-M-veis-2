import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { UserAccount } from '../types';
import { isSupabaseConfigured, requireSupabase, supabase } from '../lib/supabase';

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  firmName?: string;
  accountType: 'residential' | 'architect';
}

interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  isAdmin: boolean;
  isArchitect: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<UserAccount>;
  register: (data: RegistrationData) => Promise<{ needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function profileFromUser(authUser: User): Promise<UserAccount> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('profiles')
    .select('id,full_name,role,account_type,firm_name,nuit,phone,avatar_url')
    .eq('id', authUser.id)
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.full_name || authUser.user_metadata.full_name || authUser.email || 'Cliente EDEN',
    email: authUser.email || '',
    role: data.role === 'admin' ? 'admin' : data.account_type === 'architect' ? 'architect' : 'client',
    accountType: data.account_type,
    firmName: data.firm_name ?? undefined,
    nuit: data.nuit ?? undefined,
    phone: data.phone ?? undefined,
    avatar: data.avatar_url ?? undefined
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadProfile = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setUser(await profileFromUser(authUser));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    void supabase.auth.getUser().then(({ data, error }) => {
      if (error) setUser(null);
      void loadProfile(data.user);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadProfile(session?.user ?? null);
    });
    return () => subscription.subscription.unsubscribe();
  }, [loadProfile]);

  const login = async (email: string, password: string) => {
    const client = requireSupabase();
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });
    if (error) throw error;
    const profile = await profileFromUser(data.user);
    setUser(profile);
    return profile;
  };

  const register = async (data: RegistrationData) => {
    const client = requireSupabase();
    const { data: result, error } = await client.auth.signUp({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      options: {
        data: {
          full_name: data.name.trim(),
          account_type: data.accountType,
          firm_name: data.firmName?.trim() || null
        }
      }
    });
    if (error) throw error;
    if (result.session && result.user) setUser(await profileFromUser(result.user));
    return { needsEmailConfirmation: !result.session };
  };

  const logout = async () => {
    const { error } = await requireSupabase().auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const redirectTo = `${window.location.origin}/`;
    const { error } = await requireSupabase().auth.resetPasswordForEmail(email.trim(), { redirectTo });
    if (error) throw error;
  };

  const refreshProfile = async () => {
    const { data, error } = await requireSupabase().auth.getUser();
    if (error) throw error;
    await loadProfile(data.user);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      configured: isSupabaseConfigured,
      isAdmin: user?.role === 'admin',
      isArchitect: user?.role === 'architect',
      login,
      register,
      logout,
      resetPassword,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
