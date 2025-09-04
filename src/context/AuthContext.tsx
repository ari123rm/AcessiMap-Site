import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';


interface UserPayload {
  id: number;
  nome: string;
  email: string;
  photo_url: string | null;
  role: 'user' | 'admin';
}

interface AuthContextType {
token: string | null;
  user: UserPayload | null; // Agora temos o objeto de usuário
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [user, setUser] = useState<UserPayload | null>(null);


  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((newToken: string) => {
    try {
      const decodedUser = jwtDecode<UserPayload>(newToken);
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(decodedUser);
    } catch (error) {
      console.error("Falha ao processar token de login:", error);
      // Garante que o estado seja limpo em caso de token inválido
      logout();
    }
  }, [logout]);

  useEffect(() => {
    // Quando o app carrega, se houver um token, decodifica-o
    if (token) {
      try {
        const decodedUser = jwtDecode<UserPayload>(token);
        
        if (decodedUser.id !== user?.id) {
          setUser(decodedUser);
        }
        console.log("Usuário autenticado:", decodedUser);
      } catch (error) {
        console.error("Token inválido:", error);
        logout();
      }
    }else{
      setUser(null);
    }
  }, [token, user, logout]);

  
  const contextValue = useMemo(
      () => ({ token, user, login, logout }),
      [token, user, login, logout]
    );
  

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};