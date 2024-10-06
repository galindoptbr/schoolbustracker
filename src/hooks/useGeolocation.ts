import { useState, useEffect } from "react";

interface Coordinates {
  latitude: number;
  longitude: number;
}

const useGeolocation = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("Geolocalização não disponível");
    }
  }, []);

  return { coordinates, error };
};

export default useGeolocation;
