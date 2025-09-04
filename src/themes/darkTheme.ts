import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0C00B3', // Azul mais claro para contraste
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

// src/config/lightMapStyle.ts
// Exemplo de um estilo de mapa claro "Silver" gerado pelo Styling Wizard



export default darkTheme;