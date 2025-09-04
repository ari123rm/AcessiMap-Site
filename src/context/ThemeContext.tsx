import React, { createContext, useState, useMemo, useContext, ReactNode, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('themeMode');
    if (storedTheme) {
      return storedTheme as ThemeMode;
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // --- GARANTA QUE ESTE BLOCO ESTÁ EXATAMENTE ASSIM ---
  useEffect(() => {
    const body = window.document.body;
    // Remove a classe do tema oposto para garantir que não haja conflito
    body.classList.remove(mode === 'light' ? 'theme-dark' : 'theme-light');
    // Adiciona a classe do tema atual
    body.classList.add(`theme-${mode}`);
  }, [mode]); // Este efeito executa toda vez que o 'mode' muda

  const toggleTheme = useMemo(
    () => () => {
      setMode((prevMode) => {
        const newMode = prevMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('themeMode', newMode);
        return newMode;
      });
    },
    []
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a CustomThemeProvider');
  }
  return context;
};