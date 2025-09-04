import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import StarRatingDisplay from '../star/StarRatingDisplay'; // <-- Importe o componente de estrelas

// Atualize a interface local também
interface Comment {
  id: number;
  comentario: string;
  criado_em: string;
  autor_nome: string;
  autor_nota_media: number | null; // <-- Adicione a nota
}

interface CommentListProps {
  comments: Comment[];
}

const CommentList = ({ comments }: CommentListProps) => {
  return (
    <Box>
      <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1 }}>
        Comentários da Comunidade
      </Typography>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <Paper key={comment.id} sx={{ p: 2, mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle2">{comment.autor_nome}</Typography>
              
              {/* --- EXIBIÇÃO DAS ESTRELAS AQUI --- */}
              {comment.autor_nota_media && (
                <StarRatingDisplay rating={comment.autor_nota_media} />
              )}
            </Box>
            
            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
              "{comment.comentario}"
            </Typography>

            <Typography variant="caption" color="textSecondary">
              {new Date(comment.criado_em).toLocaleDateString('pt-BR')}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="body2">Seja o primeiro a comentar!</Typography>
      )}
    </Box>
  );
};

export default CommentList;