import React, { useState,useCallback, useEffect } from 'react';
import MapComponent from '../../components/map/Map';
import PlaceDetails, { PlaceDetailsData } from '../../components/placeDetails/PlaceDetails';
import { useJsApiLoader } from '@react-google-maps/api';
import SearchBox from '../../components/search/SearchBox';
import './Map.scss';


import { lightMapStyle } from '../../config/lightMapStyle'; 
import { darkMapStyle } from '../../config/darkMapStyle'; 

import { CircularProgress } from '@mui/material';
import { useAppTheme } from '../../hooks/useAppTheme';


const libraries: ("places")[] = ['places'];

function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetailsData | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: -3.731864, lng: -38.526669 });
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
    language: 'pt-BR', 
    region: 'BR'       
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { mapStyle } = useAppTheme();
  const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    // Verifica se a geolocalização é suportada pelo navegador
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentUserPosition = { lat: latitude, lng: longitude };
          
          console.log("Localização do usuário encontrada:", currentUserPosition);
          
          // Atualiza o centro do mapa e a posição do marcador do usuário
          setMapCenter(currentUserPosition);
          setUserPosition(currentUserPosition);
        },
        (error) => {
          console.error("Erro ao obter a localização do usuário:", error);
          // Se o usuário negar, o mapa permanecerá no centro padrão (Fortaleza)
        }
      );
    } else {
      console.log("Geolocalização não é suportada por este navegador.");
    }
  }, []);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleMarkerClick = useCallback((googlePlaceId: string) => {
    //if (selectedPlace?.google_place_id === googlePlaceId) return;

    setIsLoadingDetails(true);
    setSelectedPlace(null);

    const apiUrl = `http://localhost:3001/api/estabelecimentos/${googlePlaceId}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then((data: PlaceDetailsData & { latitude?: number, longitude?: number }) => {
        setSelectedPlace(data);
        
        // 3. COMANDO DIRETO: Se temos a instância do mapa e as coordenadas, movemos o mapa
        if (data.latitude && data.longitude) {
          const newCenter = { lat: data.latitude, lng: data.longitude };
          
          // 2. ATUALIZE A POSIÇÃO DO MARCADOR QUANDO A BUSCA FOR BEM-SUCEDIDA
          setMarkerPosition(newCenter);

          if (map) {
            map.panTo(newCenter);
            map.setZoom(16);
          }
        }
      })
      .catch(error => console.error("Erro ao buscar detalhes:", error))
      .finally(() => setIsLoadingDetails(false));
  }, [ map]); 


 const handleCloseDetails = () => {
    setSelectedPlace(null);
    setMarkerPosition(null); 
 }
  if (loadError) return <div>Erro ao carregar o mapa. Verifique sua chave de API.</div>;
  if (!isLoaded) return <CircularProgress />;

   const refreshSelectedPlace = () => {
    if (selectedPlace) {
      // Re-chama a mesma função de busca com o ID do lugar que já está selecionado
      handleMarkerClick(selectedPlace.google_place_id);
    }
  };


  return (
    <div className="App">
      <SearchBox onPlaceSelected={handleMarkerClick} />

      <div className="map-container">
        <MapComponent 
        onLoad={onMapLoad} 
          center={mapCenter}
          onMarkerClick={handleMarkerClick} 
          selectedPlaceId={selectedPlace?.google_place_id || null}
          markerPosition={markerPosition}
           mapStyle={mapStyle}
          userPosition={userPosition}
        />
      </div>
      
      {isLoadingDetails && <CircularProgress />}
      
      {selectedPlace && (
        <PlaceDetails place={selectedPlace} onClose={handleCloseDetails} onDataNeedsRefresh={refreshSelectedPlace}
        />
      )}
    </div>
  );
}

export default MapPage;