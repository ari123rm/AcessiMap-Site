import { useMemo } from 'react';
import { createTheme, Theme ,ThemeOptions } from '@mui/material/styles';
import { useThemeMode } from '../context/ThemeContext';
import { lightMapStyle } from '../config/lightMapStyle';
import { darkMapStyle } from '../config/darkMapStyle';

// Defina as opções de tema base que são compartilhadas entre os modos
const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontFamily: 'Poppins, sans-serif' },
    h2: { fontFamily: 'Poppins, sans-serif' },
    h3: { fontFamily: 'Poppins, sans-serif' },
    h4: { fontFamily: 'Poppins, sans-serif' },
    h5: { fontFamily: 'Poppins, sans-serif' },
    h6: { fontFamily: 'Poppins, sans-serif' },
  },
};

export const useAppTheme = () => {
  const { mode, toggleTheme } = useThemeMode();

  // useMemo garante que o objeto de tema só seja recriado quando o 'mode' mudar
  const theme: Theme = useMemo(() => {
    const themeOptions: ThemeOptions = mode === 'light'
      ? {
          palette: {
            mode: 'light',
            primary: { main: '#1976d2' },
            background: { default: '#f4f6f8', paper: '#ffffff' },
          },
        }
      : {
          palette: {
            mode: 'dark',
            primary: { main: '#90caf9' },
            background: { default: '#121212', paper: '#1e1e1e' },
            text: { primary: '#ffffff', secondary: 'rgba(255, 255, 255, 0.7)' },
          },
        };
    
    // Une as opções base com as específicas do modo
    return createTheme({ ...baseThemeOptions, ...themeOptions });
  }, [mode]);

  // Seleciona o estilo do mapa com base no modo
  const mapStyle = useMemo(() => (mode === 'light' ? lightMapStyle : darkMapStyle), [mode]);

  return {
    theme,
    mode,
    toggleTheme,
    mapStyle,
  };
};