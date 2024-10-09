// GoogleMap.tsx
import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface GoogleMapProps {
  lat: number;
  lng: number;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = ({ lat, lng }) => {
  const mapContainerStyle = {
    width: "100%",
    height: "800px",
  };

  const center = {
    lat: lat,
    lng: lng,
  };

  const options = {
    disableDefaultUI: true, // Remove todos os controles padrões
    zoomControl: false, // Opcional: também desabilitar o controle de zoom separadamente
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAklI2XvDEYhmjfypu8cq4PTNvfA__0v7U">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={options}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
