import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { Container, Box, Typography, TextField, Button, Alert, Grid, Link,Divider, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';


import './RegisterPage.scss';



function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha no registro');
      
      // Opcional: Logar automaticamente após o registro.
      // Se o seu backend não retorna um token no registro, remova as duas linhas abaixo.
      if (data.token) {
        login(data.token);
      }
      navigate('/login'); // Redireciona para o login após o registro
      if (!response.ok) throw new Error(data.message || 'Falha no registro');
        
        // NÃO FAZ LOGIN AQUI
        setSuccessMessage('Registro realizado com sucesso! Por favor, verifique seu e-mail para ativar sua conta.');

    } catch (err: any) {
      setError(err.message);
    } finally{
      setLoading(false);
    }
  };
  if (successMessage) {
    return (
      <div>
        <h2>Sucesso!</h2>
        <p>{successMessage}</p>
      </div>
    );
  }
  
 const googleLoginUrl = 'http://localhost:3001/api/auth/google';
  return (
    <Container component="main" className="register-page-container">
      <Box className="register-box">
        <Typography component="h1" variant="h5">
          Criar Conta
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nome"
            label="Nome Completo"
            name="nome"
            autoComplete="name"
            autoFocus
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Endereço de Email"
            name="email"
            autoComplete="email"
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
            autoComplete="new-senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />
          
          { loading ? <CircularProgress />:
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrar
          </Button>

          }
           
            <Grid container justifyContent="flex-end">
              
              <Grid container justifyContent="flex-end">
              {/* --- CORREÇÃO AQUI --- */}
              {/* A Grid 'item' deve estar dentro da Grid 'container' */}
              
                <Link component={RouterLink} to="/login" variant="body2">
                  Já tem uma conta? Faça login
                </Link>
              
            </Grid>
            <Divider sx={{ width: '100%' }}>OU</Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              href={googleLoginUrl} // Um botão MUI pode agir como um link
              sx={{ textTransform: 'none', fontSize: '1rem' }}
            >
              Entrar com Google
            </Button>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;