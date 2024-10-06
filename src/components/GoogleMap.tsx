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
    height: "500px",
  };

  const center = {
    lat: lat,
    lng: lng,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBUDGydxbHD7jbiVk8ctMaisktLCXU4k-c">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
