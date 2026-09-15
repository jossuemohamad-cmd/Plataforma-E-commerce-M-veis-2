import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types';

interface AuthContextType {
  user: UserAccount;
  isAdmin: boolean;
  isArchitect: boolean;
  login: (email: string, password?: string) => 'admin' | 'architect' | 'client';
  quickAdminLogin: () => 'admin';
  quickArchitectLogin: () => 'architect';
  register: (data: { name: string; email: string; firmName?: string; accountType: 'residential' | 'architect' }) => 'architect' | 'client';
  logout: () => void;
}

const DEFAULT_ARCHITECT_USER: UserAccount = {
  name: 'Arq. Beatriz Mendes',
  email: 'beatriz.mendes@arquitetura.co.mz',
  role: 'architect',
  firmName: 'Mendes & Associados Arquitetura',
  nuit: '400892341',
  phone: '+258 84 392 0192',
  avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1X7_npcnp3WsXRdRLwlAatGP6-v7I2pr0CBvu6o1VAQMTGIKxcq90ZJ9f_z9dVX47dcBw5isRyGGS8Qp1O-FpN4mUafGaIHvi7kK6-sAkiqOTCQ2a7_ah0wRjNQN7rzMp_SZUktdN_13kCroYSJMWa3nFtHfIGUI6y2cKzSKExRXfY8n2w2fKpLJ6KNe8Hdyn8RxfhrpE2oYRNnnJyXGMFHTHpww8sWK_odYW1h44ANMrMY6BMkS_QkGZ6V'
};

const ADMIN_USER: UserAccount = {
  name: 'Diretor Curatorial Aethel',
  email: 'admin@aethel.mz',
  role: 'admin',
  firmName: 'Aethel Studio & Oficinas Centrais',
  nuit: '500129883',
  phone: '+258 21 490 200',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('aethel_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
    return DEFAULT_ARCHITECT_USER;
  });

  useEffect(() => {
    localStorage.setItem('aethel_current_user', JSON.stringify(user));
  }, [user]);

  const login = (email: string, _password?: string): 'admin' | 'architect' | 'client' => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.includes('admin')) {
      setUser(ADMIN_USER);
      return 'admin';
    }
    if (cleanEmail.includes('arquitet') || cleanEmail.includes('beatriz') || cleanEmail.includes('studio')) {
      const archUser: UserAccount = {
        ...DEFAULT_ARCHITECT_USER,
        email: cleanEmail
      };
      setUser(archUser);
      return 'architect';
    }
    const clientUser: UserAccount = {
      name: email.split('@')[0].replace('.', ' '),
      email: cleanEmail,
      role: 'client',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };
    setUser(clientUser);
    return 'client';
  };

  const quickAdminLogin = (): 'admin' => {
    setUser(ADMIN_USER);
    return 'admin';
  };

  const quickArchitectLogin = (): 'architect' => {
    setUser(DEFAULT_ARCHITECT_USER);
    return 'architect';
  };

  const register = (data: { name: string; email: string; firmName?: string; accountType: 'residential' | 'architect' }): 'architect' | 'client' => {
    const role = data.accountType === 'architect' ? 'architect' : 'client';
    const newUser: UserAccount = {
      name: data.name,
      email: data.email,
      role,
      firmName: data.firmName || (role === 'architect' ? 'Gabinete Autoral' : undefined),
      nuit: '400' + Math.floor(100000 + Math.random() * 900000),
      avatar: role === 'architect' ? DEFAULT_ARCHITECT_USER.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };
    setUser(newUser);
    return role;
  };

  const logout = () => {
    setUser(DEFAULT_ARCHITECT_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user.role === 'admin',
        isArchitect: user.role === 'architect',
        login,
        quickAdminLogin,
        quickArchitectLogin,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
