import React from 'react';
import { Rating, Star } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

interface StarRatingDisplayProps {
  rating: number;
}

// Estilo customizado para as estrelas
const customStyles = {
  itemShapes: Star,
  activeFillColor: '#ffb400',
  inactiveFillColor: '#a1a1a1',
  
  // --- ADICIONE ESTA LINHA ---
  // Define como a meia-estrela será preenchida. 'svg' usa um <stop> gradiente.
  halfFillMode: 'svg' as const, 
};

const StarRatingDisplay = ({ rating }: StarRatingDisplayProps) => {
  return (
    <Rating
      style={{ maxWidth: 120 }}
      value={rating}
      readOnly
      itemStyles={customStyles}
      // A biblioteca calcula a meia-estrela automaticamente a partir do 'value'
    />
  );
};

export default StarRatingDisplay;