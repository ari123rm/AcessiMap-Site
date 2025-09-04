import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import StarRatingDisplay from '../../components/star/StarRatingDisplay';

// Interfaces para os dados
interface RankedPlace {
  id: number;
  nome: string;
  photoUrl: string | null;
  mediaGeral: number;
}
interface FilterOption {
  id: number;
  nome: string;
}

function RankingsPage() {
  const [rankedPlaces, setRankedPlaces] = useState<RankedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para os filtros
  const [sortBy, setSortBy] = useState('average'); // 'average' ou o ID de uma categoria
  const [filterByType, setFilterByType] = useState('all'); // 'all' ou o ID de um tipo

  // Estados para as opções dos filtros
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [placeTypes, setPlaceTypes] = useState<FilterOption[]>([]);

  // Efeito para buscar as opções dos filtros (categorias e tipos) uma vez
  useEffect(() => {
    // Em um projeto real, Promise.all seria ótimo aqui
    fetch('http://localhost:3001/api/categorias').then(res => res.json()).then(setCategories);
    fetch('http://localhost:3001/api/tipos').then(res => res.json()).then(setPlaceTypes); // Assumindo que você criou esta rota
  }, []);

  // Efeito para buscar o ranking toda vez que um filtro mudar
  useEffect(() => {
    setIsLoading(true);
    let apiUrl = `http://localhost:3001/api/rankings?sortBy=${sortBy}`;
    if (filterByType !== 'all') {
      apiUrl += `&filterByType=${filterByType}`;
    }

    fetch(apiUrl)
      .then(res => res.json())
      .then((data) => {
        setRankedPlaces(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar ranking:", error);
        setIsLoading(false);
      });
  }, [sortBy, filterByType]); // Dependências: re-executa quando elas mudam

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>Ranking de Acessibilidade</Typography>
      
      {/* Filtros */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Ordenar por Categoria</InputLabel>
          <Select value={sortBy} label="Ordenar por Categoria" onChange={e => setSortBy(e.target.value)}>
            <MenuItem value="average">Média Geral</MenuItem>
            {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.nome}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Filtrar por Tipo</InputLabel>
          <Select value={filterByType} label="Filtrar por Tipo" onChange={e => setFilterByType(e.target.value)}>
            <MenuItem value="all">Todos os Tipos</MenuItem>
            {placeTypes.map(type => <MenuItem key={type.id} value={type.id}>{type.nome}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {/* Lista de Resultados */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <List>
        {rankedPlaces.map((place, index) => (
            <ListItem key={place.id} divider>
            <Typography sx={{ mr: 2, fontWeight: 'bold' }}>#{index + 1}</Typography>
            <ListItemAvatar>
                <Avatar src={place.photoUrl || undefined} />
            </ListItemAvatar>
            <ListItemText 
                primary={place.nome} 
                secondary={<StarRatingDisplay rating={place.mediaGeral} />}
                // --- ADICIONE ESTA PROP ---
                secondaryTypographyProps={{ component: 'div' }} 
            />
            </ListItem>
        ))}
        </List>
      )}
    </Box>
  );
}

export default RankingsPage;