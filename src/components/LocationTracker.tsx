import React, { useEffect } from "react";
import useGeolocation from "../hooks/useGeolocation";
import { db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import useAuth from "../hooks/useAuth";

const LocationTracker: React.FC = () => {
  const { coordinates, error } = useGeolocation();
  const { user } = useAuth();

  useEffect(() => {
    const saveLocation = async () => {
      if (coordinates && user) {
        try {
          // Salvar a localização do motorista no Firestore
          await setDoc(doc(db, "locations", user.uid), {
            driverId: user.uid,
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
  }, [coordinates, user]);

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
