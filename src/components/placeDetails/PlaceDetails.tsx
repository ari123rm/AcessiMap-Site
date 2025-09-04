import React, { useMemo, useState } from 'react';
import './PlaceDetails.style.scss'; // Vamos criar este arquivo de CSS
import ScoreBar from '../scoreBar/ScoreBar';
import { useAuth } from '../../context/AuthContext'; 
import EvaluationForm from '../evaluation/EvaluationForm';
import StarRatingDisplay from '../star/StarRatingDisplay';

import { Drawer, Box, Typography, Button, Divider, IconButton, circularProgressClasses, CircularProgress, Chip, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';

import generateTooltipContent from '../tooltip/generateTooltipContent';

// Tipagem para os dados que este componente vai receber
export interface PlaceDetailsData {
  id: number;
  nome: string;
  google_place_id: string; 
  endereco: string;
  photoUrl?: string | null;
  totalAvaliacoes: number;
  scores: {
    categoria: string;
    score: number;
    id_categoria: number; 
    notaComunidade: number | null;
    tooltipData?: {
      items: { 
        nome: string;
        percentualSim: number;
      }[];
    };
  }[];
  avaliacoesDetalhes?: { // Pode ser opcional
    nome_item: string;
    possui_item: boolean;
  }[];
  comentarios?: {
    id: number;
    comentario: string;
    autor_id: number;
    criado_em: string;
    autor_nome: string;
    autor_nota_media: number | null; // <-- Adicione esta linha
  }[];
   tipos?: string[];
}

interface PlaceDetailsProps {
  place: PlaceDetailsData;
  onClose: () => void; // Função para fechar o painel
  onDataNeedsRefresh: () => void; 
}

function PlaceDetails({ place, onClose,onDataNeedsRefresh }: PlaceDetailsProps) {
  
 
  const { token,user } = useAuth();
  const [isEvaluating, setIsEvaluating] = useState(false);
  const meuComentario = useMemo(() => {
      return place?.comentarios?.find(c => c.autor_id === user?.id);
  }, [place?.comentarios, user?.id]);

  if (!place) {
    return <CircularProgress/> // Ou um <div>Carregando...</div>
  }


  
   const hasScores = place.scores && place.scores.length > 0;

  const nota_media = ()=>{
      if(!hasScores) return 0;
      
      const total = place.scores.reduce((acc, scoreItem) => acc + (scoreItem.notaComunidade || 0), 0);
      return total / place.scores.length;
  }
  const isOpen = !!place;
  

  return (
     <Drawer
      anchor="right" // Aparece na direita
      open={isOpen}
      onClose={onClose} // Função para fechar quando se clica fora
      PaperProps={{
        sx: { width: 380 } // Estilização do painel
      }}

      className=''
    >
      {place && ( // Garante que só renderizamos se 'place' existir
      
        <Box className="place-details">
          <IconButton onClick={onClose} className="close-button">
              <CloseIcon />
            </IconButton>
          {place.photoUrl && (
            <img 
              src={place.photoUrl} 
              alt={`Foto de ${place.nome}`} 
              className="place-photo" // Adicionamos uma classe para estilizar
            />
          )}
          <Box className ="place-name-container">
            <Typography variant="h5" component="h2">
              {place.nome}
            </Typography>
            
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {place.endereco}
          </Typography>
          {place.tipos && place.tipos.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                {place.tipos.map((tipo) => (
                  <Chip key={tipo} label={tipo} color="primary" variant="outlined" size="small" />
                ))}
              </Stack>
            )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" component="h3">
            Notas da Comunidade
          </Typography>
          <Typography variant="caption" >
            <StarRatingDisplay rating={nota_media()} />
                ({place.totalAvaliacoes} {place.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
          </Typography>
          <Divider sx={{ my: 2 }} />
       
        

      {place.scores.length > 0 ? (
        <>
          
          <div>
            {place.scores.map((scoreItem) => (
              <div key={scoreItem.categoria} className="score-item">
                <strong>{scoreItem.categoria}</strong>
                {scoreItem.notaComunidade ? (
                   <div
                        data-tooltip-id="category-tooltip"
                        // Passa o novo array 'items' para a função
                        data-tooltip-html={generateTooltipContent(scoreItem.tooltipData?.items)}
                        data-tooltip-place="top"
                      >
                        <StarRatingDisplay rating={scoreItem.notaComunidade} />
                      </div>
                ) : (
                  <span className="no-rating">(Ainda não avaliado)</span>
                )}
              </div>
            ))}
          </div>
        </>
      ): (
        <p>Ainda não há avaliações para este local. Seja o primeiro a contribuir!</p>
      )}
       <Divider sx={{ my: 2 }} />

            {/* --- SEÇÃO DE COMENTÁRIOS --- */}
          <CommentList comments={place.comentarios || []} />

          
      {/* 3. Lógica de Renderização Condicional */}
        {token && !isEvaluating && (
        <Button variant="contained" fullWidth onClick={() => setIsEvaluating(true)}>
              Avalie este local
        </Button>
      )}
      <Divider sx={{ my: 2 }} />
      {token && isEvaluating && (
        <>
          <Button variant="contained" fullWidth onClick={() => setIsEvaluating(false)}>
              Cancelar Avaliação
        </Button>
        
          <EvaluationForm 
            estabelecimentoId={place.id}
            onEvaluationSuccess={() => {
              setIsEvaluating(false); // Esconde o formulário após o sucesso
              onDataNeedsRefresh();
              
            }}
            onDataNeedsRefresh={onDataNeedsRefresh}
            initialComment={meuComentario?.comentario || ''}
          />
          
        </>
      )}

      {!token && (
            <Typography variant="body2">
              Faça login para poder avaliar este local.
            </Typography>
          )}
        </Box>
      )}
    </Drawer>
  );
}

export default PlaceDetails;