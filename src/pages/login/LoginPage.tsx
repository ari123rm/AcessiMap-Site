import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';

// 1. Importe os componentes do MUI e os ícones
import { Container, Box, Typography, TextField, Button, Divider, Alert,Grid,Link} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';




import './LoginPage.scss';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setsenha] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();



  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error')) {
      setError('Falha na autenticação com o Google.');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha no login');
      login(data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const googleLoginUrl = 'http://localhost:3001/api/auth/google';

  return (
    // 2. Use <Container> e <Box> para criar a estrutura e centralizar
    <Container component="main" className="login-page-container">
      <Box className="login-box">
        <Typography component="h1" variant="h2">
          Login
        </Typography>
        
        {/* Mostra o alerta de erro se existir */}
        {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Endereço de Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="senha"
            label="Senha"
            type="password"
            id="senha"
            autoComplete="current-senha"
            value={senha}
            onChange={e => setsenha(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
        </Box>
        <Grid container justifyContent="flex-end">
          {/* --- CORREÇÃO AQUI --- */}
          {/* A Grid 'item' deve estar dentro da Grid 'container' */}
          
            <Link component={RouterLink} to="/registro" variant="body2">
              Não tem uma conta? Registre-se
            </Link>
          
        </Grid>
        <Divider sx={{ width: '100%' }}>OU</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          href={googleLoginUrl} // Um botão MUI pode agir como um link
          sx={{ textTransform: 'none', fontSize: '1rem' }}
          className="google-btn"
        >
          Entrar com Google
        </Button>
      </Box>
    </Container>
  );
}

export default LoginPage;