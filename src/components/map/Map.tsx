import React, { useState, useCallback,useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
// --- Estilos e Configurações Iniciais ---
const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)', // Ajuste para considerar a altura do header
};



// --- Tipagem para os Lugares que vêm da nossa API ---
interface Place {
  id: number;
  google_place_id: string;
  nome: string;
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  onLoad: (map: google.maps.Map) => void;
  onMarkerClick: (googlePlaceId: string) => void;
  center: google.maps.LatLngLiteral;
  // Prop para saber qual lugar está selecionado no componente pai (App.tsx)
  selectedPlaceId: string | null; 
  markerPosition: google.maps.LatLngLiteral | null;
  mapStyle: google.maps.MapTypeStyle[];
  userPosition: google.maps.LatLngLiteral | null;
}




// --- O Componente Principal ---
function MapComponent({ onLoad,onMarkerClick, selectedPlaceId ,markerPosition,  mapStyle, userPosition ,center}: MapComponentProps) {
  // Hook da biblioteca para carregar o script do Google Maps


  // Estado para guardar a instância do mapa
  const [map, setMap] = useState<google.maps.Map | null>(null);
  // Estado para guardar a lista de lugares (marcadores) vinda do nosso backend
   const [activeMarker, setActiveMarker] = useState<google.maps.LatLngLiteral | null>(null);

  // Callback que é executado quando o mapa é carregado pela primeira vez
  
  // Callback para limpar a referência do mapa quando o componente é desmontado
  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    onLoad(mapInstance); 
  }, [onLoad]);

   const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    const iconMouseEvent = e as google.maps.IconMouseEvent;
    if (iconMouseEvent.placeId) {
      e.stop();
      // 1. Define a posição do novo marcador ativo
      if (iconMouseEvent.latLng) {
        setActiveMarker(iconMouseEvent.latLng.toJSON());
      }
      // 2. Avisa o componente pai para buscar os dados
      onMarkerClick(iconMouseEvent.placeId);
    }
  }, [onMarkerClick]);

    useEffect(() => {
      if (selectedPlaceId === null) {
        setActiveMarker(null);
      }
    }, [selectedPlaceId]);

    

  // --- Renderização do Componente ---
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      onLoad={handleMapLoad}
      onClick={onMapClick}
      options={{ styles: mapStyle, clickableIcons: true }}
    >
      {activeMarker && <MarkerF position={activeMarker} />}
      {markerPosition && <MarkerF position={markerPosition} />}
      {userPosition && (
        <MarkerF 
          position={userPosition}
          title="Sua Localização"
          // Ícone customizado para diferenciar o marcador do usuário
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "white",
          }}
        />
      )}
    </GoogleMap>
  );
}

// Usar React.memo para evitar re-renderizações desnecessárias do componente
export default React.memo(MapComponent);