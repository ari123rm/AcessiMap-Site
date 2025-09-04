import React, { useState, useEffect } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import './SearchBox.style.scss';
import { IconButton, InputAdornment, TextField,Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

interface SearchBoxProps {
  onPlaceSelected: (placeId: string) => void;
}

function SearchBox({ onPlaceSelected }: SearchBoxProps) {
  // Estado para guardar a referência do objeto de busca
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const { text, isListening, startListening, hasRecognitionSupport } = useSpeechRecognition();
  const [inputValue, setInputValue] = useState('');

  const onLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };
  useEffect(() => {
    if (text) {
      // 1. Coloca o texto falado no campo de busca
      setInputValue(text);

      // 2. USA O SERVIÇO DE AUTOCOMPLETE PARA BUSCAR A SUGESTÃO PRINCIPAL
      const autocompleteService = new window.google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        { input: text, componentRestrictions: { country: 'br' } },
        (predictions, status) => {
          if (status === 'OK' && predictions && predictions.length > 0) {
            const firstPrediction = predictions[0];
            console.log('Sugestão encontrada por voz:', firstPrediction.description);

            // 3. ATUALIZA O INPUT com a descrição completa para o usuário ver
            setInputValue(firstPrediction.description);

            // 4. CHAMA A FUNÇÃO PRINCIPAL com o place_id encontrado
            if (firstPrediction.place_id) {
              onPlaceSelected(firstPrediction.place_id);
            }
          } else {
            console.warn('Nenhuma sugestão encontrada para o texto falado:', text);
          }
        }
      );
    }
  }, [text, onPlaceSelected]);

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      const place = places?.[0];

      if (place && place.place_id) {
        
        setInputValue(place.name || '');
        onPlaceSelected(place.place_id);
      }
    }
  };

  return (
    <Box className="search-box-container">
      <StandaloneSearchBox
        onLoad={onLoad}
        onPlacesChanged={onPlacesChanged}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pesquisar um estabelecimento..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: 'white',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {/* ESTA É A PARTE QUE MOSTRA O ÍCONE */}
                {hasRecognitionSupport && (
                  <IconButton onClick={startListening} color={isListening ? 'error' : 'default'}>
                    <MicIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
        
      </StandaloneSearchBox>
      
    </Box>
  );
}

export default SearchBox;