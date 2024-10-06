"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import useAuth from "../hooks/useAuth";
import dynamic from "next/dynamic";
import ParentProfileButton from "../components/ParentProfileButton";

// Importação dinâmica do GoogleMapComponent
const DynamicGoogleMap = dynamic(() => import("../components/GoogleMap"), {
  ssr: false,
});

const Home: React.FC = () => {
  const { loading, isAuthenticated } = useAuth();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    if (isAuthenticated) {
      const fetchLocation = async () => {
        const querySnapshot = await getDocs(collection(db, "locations"));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setLocation({ lat: data.latitude, lng: data.longitude });
        });
      };

      fetchLocation();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Onde está meu filho
      </h1>
      <div className="flex gap-4 mb-4">
        <ParentProfileButton />
        <LogoutButton />
      </div>
      {location && <DynamicGoogleMap lat={location.lat} lng={location.lng} />}
    </div>
  );
};

export default Home;
