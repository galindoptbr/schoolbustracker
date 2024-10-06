// components/LocationTracker.tsx
import React, { useEffect } from "react";
import useGeolocation from "../hooks/useGeolocation";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

const LocationTracker: React.FC = () => {
  const { coordinates, error } = useGeolocation();

  useEffect(() => {
    const saveLocation = async () => {
      if (coordinates) {
        try {
          await addDoc(collection(db, "locations"), {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            timestamp: new Date(),
          });
        } catch (e) {
          console.error("Erro ao salvar localização:", e);
        }
      }
    };

    saveLocation();
  }, [coordinates]);

  return (
    <div className="p-4">
      {error ? (
        <p className="text-red-500">Erro: {error}</p>
      ) : coordinates ? (
        <p>
          Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
        </p>
      ) : (
        <p>Obtendo localização...</p>
      )}
    </div>
  );
};

export default LocationTracker;
