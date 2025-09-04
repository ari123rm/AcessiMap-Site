import { Routes, Route } from 'react-router-dom';
import { Box, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useAppTheme } from './hooks/useAppTheme'; // Importa nosso hook principal
import { Tooltip } from 'react-tooltip';

// Importe suas páginas e componentes
import Navbar from './components/navbar/Navbar';
import MapPage from './pages/map/MapPage';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import GoogleAuthCallback from './pages/google/GoogleAuthCallback';
import VerifyEmailPage from './pages/verifyEmail/VerifyEmailPage';
import RankingsPage from './pages/rankings/RankingsPage';

function App() {
  // 1. Agora o App consome o hook. Isso funciona porque o Provedor estará acima dele (no index.tsx).
  const { theme } = useAppTheme();

  return (
    // 2. O App agora aplica o tema do MUI para todos os seus filhos.
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto', position: 'relative' }}>
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/auth-success" element={<GoogleAuthCallback />} />
            <Route path="/verificar-email" element={<VerifyEmailPage />} />
            <Route path="/rankings" element={<RankingsPage />} /> 
          </Routes>
        </Box>
        <Tooltip id="category-tooltip" />
      </Box>
    </MuiThemeProvider>
  );
}

export default App;