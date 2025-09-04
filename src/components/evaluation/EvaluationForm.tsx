import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import './EvaluationForm.scss';
import { Star } from '@smastrom/react-rating'; // <-- Importe da nova biblioteca
import '@smastrom/react-rating/style.css'; // <-- Importe o CSS também aqui
import CommentForm from '../comments/CommentForm';

import { Rating } from '@mui/material';


const customStyles = {
  itemShapes: Star,
  activeFillColor: '#ffb400',
  inactiveFillColor: '#a1a1a1',
  halfFillMode: 'svg' as const,
};

// Tipagem para os itens que vêm do backend
interface AccessibilityItem {
  id: number;
  nome: string;
  categoria_nome: string;
  id_categoria: number;
}

interface EvaluationFormProps {
  estabelecimentoId: number;
  onEvaluationSuccess: () => void; // Callback para avisar o pai que a avaliação foi um sucesso
  onDataNeedsRefresh: () => void;
  initialComment?: string;
}

function EvaluationForm({ estabelecimentoId, onEvaluationSuccess ,onDataNeedsRefresh,initialComment}: EvaluationFormProps) {
  const [items, setItems] = useState<AccessibilityItem[]>([]);
  const [votes, setVotes] = useState<Record<number, boolean>>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categoryRatings, setCategoryRatings] = useState<Record<number, number>>({});
  const { token } = useAuth();


  
  // Busca a lista de todos os itens de acessibilidade quando o componente monta
  useEffect(() => {
  fetch('http://localhost:3001/api/itens')
    .then(res => res.json())
    .then(data => {
      // Defensive Check: Ensure data is an array before setting it.
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        // If the data is not an array, log an error and set items to an empty array.
        console.error("API response for items is not an array:", data);
        setItems([]);
      }
    })
    .catch(() => {
      setError('Não foi possível carregar os itens de avaliação.');
      setItems([]); // Also set to empty array on fetch failure
    });
}, []);

   const handleRatingChange = (newRating: number, categoryId: number) => {
    setCategoryRatings(prev => ({ ...prev, [categoryId]: newRating }));
  };

  const handleVote = (itemId: number, vote: boolean) => {
    setVotes(prev => ({ ...prev, [itemId]: vote }));
  };


   const handleSubmit = async () => {
    
    setIsLoading(true);
    setError('');

    // Prepara os dados do checklist
    const checklistEvaluations = Object.entries(votes).map(([itemId, vote]) => ({
    id_estabelecimento: estabelecimentoId,
    id_item_acessibilidade: Number(itemId),
    possui_item: vote,
  }));
  
  const categoryRatingEvaluations = Object.entries(categoryRatings).map(([catId, rating]) => ({
    id_estabelecimento: estabelecimentoId,
    id_categoria: Number(catId),
    nota: rating,
  }));

    if (checklistEvaluations.length === 0 && categoryRatingEvaluations.length === 0) {
      setError('Você precisa avaliar pelo menos um item ou categoria.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Cria um array de promessas para as chamadas de API
      const apiCalls = [];

      // Adiciona a chamada para o checklist se houver dados
      if (checklistEvaluations.length > 0) {
        apiCalls.push(fetch('http://localhost:3001/api/avaliacoes', {
        method: 'POST', // Define o método como POST
        headers: {
          'Content-Type': 'application/json', // Informa que estamos enviando JSON
          'Authorization': `Bearer ${token}`   // Adiciona o token de autorização
        },
        body: JSON.stringify(checklistEvaluations) // Converte o array de avaliações para uma string JSON
      }));
      }
      // Adiciona a chamada para as notas se houver dados
      if (categoryRatingEvaluations.length > 0) {
        apiCalls.push(fetch('http://localhost:3001/api/avaliacoes/categorias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(categoryRatingEvaluations)
        }));
      }
      if (categoryRatingEvaluations.length > 0) {
        apiCalls.push(
          fetch('http://localhost:3001/api/avaliacoes/categorias', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(categoryRatingEvaluations)
          })
       );
      }

      // Executa todas as chamadas em paralelo e espera por todas
      const responses = await Promise.all(apiCalls);
      // Verifica se alguma das respostas falhou
      for (const response of responses) {
        if (!response.ok) throw new Error('Falha ao enviar uma ou mais avaliações.');
      }

      
      onEvaluationSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
   const itemsByCategory = useMemo(() => {
    return items.reduce<Record<number, AccessibilityItem[]>>((acc, item) => {
      const categoryId = item.id_categoria;
      (acc[categoryId] = acc[categoryId] || []).push(item);
      return acc;
    }, {});
  }, [items]);
  const categoryIdToNameMap = useMemo(() => {
      return items.reduce<Record<number, string>>((acc, item) => {
        acc[item.id_categoria] = item.categoria_nome;
        return acc;
      }, {});
    }, [items]);

    useEffect(() => {
    if (token) {
      const fetchMyEvaluations = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/avaliacoes/me/${estabelecimentoId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) return; // Não faz nada se não houver avaliações antigas

          const data = await response.json();

          // Transforma o array do checklist em um objeto para o estado 'votes'
          const previousVotes = data.checklist.reduce((acc: Record<number, boolean>, item: any) => {
            acc[item.id_item_acessibilidade] = item.possui_item;
            return acc;
          }, {});
          let previousVotesArray = Object.values(previousVotes);
          console.log(previousVotesArray)
          previousVotesArray.map((vote,index)=>{
            setVotes(prev => ({ ...prev, [index+1]: vote? true : false }));
          }

          )
          
          
          
          // Transforma o array de notas em um objeto para o estado 'categoryRatings'
          const previousRatings = data.ratings.reduce((acc: Record<number, number>, item: any) => {
            acc[item.id_categoria] = parseFloat(item.nota);
            return acc;
          }, {});
          setCategoryRatings(previousRatings);
          
        } catch (err) {
          console.error("Não foi possível buscar avaliações antigas.", err);
        }
      };
      fetchMyEvaluations();
    }
  }, [token, estabelecimentoId]);

   return (
    <form className="evaluation-form" onSubmit={handleSubmit}>
      <h4>Avalie os itens e dê uma nota geral para cada categoria</h4>
      
      {/* 3. A lógica de renderização agora usa o novo agrupamento */}
      
      {Object.entries(itemsByCategory).map(([categoryId, categoryItems]) => {
        const categoryName = categoryIdToNameMap[Number(categoryId)];
        return (
          <div key={categoryId} className="category-group">
            <h5>{categoryName}</h5>

            {/* --- BLOCO QUE ESTÁ FALTANDO --- */}
            {/* Adicione este .map() de volta para renderizar o checklist */}
            {categoryItems.map(item => (
              <div key={item.id} className="evaluation-item">
                <span>{item.nome}</span>
                <div className="vote-buttons">
                  <button
                    type="button"
                    className={`vote-btn yes ${votes[item.id] === true ? 'selected' : ''}`}
                    onClick={() => handleVote(item.id, true)}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    className={`vote-btn no ${votes[item.id] === false ? 'selected' : ''}`}
                    onClick={() => handleVote(item.id, false)}
                  >
                    Não
                  </button>
                </div>
              </div>
            ))}
            {/* --- FIM DO BLOCO QUE FALTAVA --- */}

            <div className="category-rating">
              <span>Sua nota geral para esta categoria:</span>
              
              <Rating
                style={{ maxWidth: 150 }}
                 value={categoryRatings[Number(categoryId)] || 0}
            // A chamada aqui não muda, mas a função que ela chama agora está correta.
            onChange={(event, newRating) => {
              if(newRating)handleRatingChange(newRating, Number(categoryId))}}
                
                precision={0.5}
              />
            </div>
          </div>
        )
      })}
       
      {error && <p className="error-message">{error}</p>}

      <CommentForm
                estabelecimentoId={estabelecimentoId}
                onCommentSuccess={onDataNeedsRefresh}
                submitPlaceDetails={async () => {handleSubmit()}}
                initialComment={initialComment}
              />
      
    </form>
  );
}

export default EvaluationForm;