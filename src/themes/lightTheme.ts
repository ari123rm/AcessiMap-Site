import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4AC7F5', // Azul padrão
    },
    secondary: {
      main: '#dc004e', // Rosa/Vinho
    },
    background: {
      default: '#f4f6f8', // Fundo um pouco cinza
      paper: '#ffffff',   // Fundo dos "cards" e painéis
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontFamily: 'Poppins, sans-serif' },
    h2: { fontFamily: 'Poppins, sans-serif' },
    h3: { fontFamily: 'Poppins, sans-serif' },
    h4: { fontFamily: 'Poppins, sans-serif' },
    h5: { fontFamily: 'Poppins, sans-serif' },
    h6: { fontFamily: 'Poppins, sans-serif' },
  },
});

export default lightTheme;