import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button } from '@mui/material';
import { Box } from '@mui/material';
import { on } from 'events';
import { API_BASE_URL } from '../../services/api';

interface CommentFormProps {
  estabelecimentoId: number;
  onCommentSuccess: () => void; // Para recarregar os dados
  submitPlaceDetails?: () => void; 
  initialComment?: string;
}

const CommentForm = ({ estabelecimentoId, onCommentSuccess , submitPlaceDetails , initialComment }: CommentFormProps) => {
  const [comment, setComment] = useState('');
  const { token } = useAuth();

    useEffect(() => {
      setComment(initialComment || '');
    }, [initialComment]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(submitPlaceDetails) await submitPlaceDetails();
    if (!comment.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id_estabelecimento: estabelecimentoId, comentario: comment })
      });
      if (!response.ok) throw new Error('Falha ao enviar comentário.');
      setComment('');
      onCommentSuccess(); // Avisa o pai para recarregar
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box  sx={{ mt: 2 }}>
      <TextField
        label={initialComment ? "Editar seu comentário" : "Deixe seu comentário"}
        multiline
        rows={3}
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }} onClick={handleSubmit}>
        {initialComment ? "Atualizar" : "Publicar"}
      </Button>
    </Box>
  );
};

export default CommentForm;