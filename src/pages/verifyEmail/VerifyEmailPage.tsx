import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../services/api';

function VerifyEmailPage() {
  const [message, setMessage] = useState('Verificando sua conta...');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setMessage('Token de verificação não encontrado.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/usuarios/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setMessage(data.message);
      } catch (err: any) {
        setMessage(err.message);
      }
    };
    verifyToken();
  }, [searchParams]);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Status da Verificação</h2>
      <p>{message}</p>
      {message.includes('sucesso') && <Link to="/login">Ir para o Login</Link>}
    </div>
  );
}

export default VerifyEmailPage;