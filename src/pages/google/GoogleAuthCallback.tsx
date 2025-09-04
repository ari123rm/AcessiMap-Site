import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function GoogleAuthCallback() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URLSearchParams é uma API do navegador para lidar com query strings
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      console.log("Token recebido do Google Auth, salvando...");
      login(token); // Salva o token no nosso AuthContext
      navigate('/'); // Redireciona o usuário para a página principal (mapa)
    } else {
      // Se não houver token, algo deu errado
      console.error("Callback do Google não continha um token.");
      navigate('/login?error=auth_failed'); // Redireciona de volta para o login com uma mensagem de erro
    }
  }, [location, login, navigate]);

  // O usuário verá esta mensagem por um instante
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Autenticando...</h2>
    </div>
  );
}

export default GoogleAuthCallback;