"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";
import useAuth from "../hooks/useAuth";
import dynamic from "next/dynamic";
import ParentProfileButton from "../components/ParentProfileButton";
import DriverProfile from "../components/DriverProfile";

// Importação dinâmica do GoogleMapComponent
const DynamicGoogleMap = dynamic(() => import("../components/GoogleMap"), {
  ssr: false,
});

const Home: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isSharingLocation, setIsSharingLocation] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserRole(data.role || null);
            console.log("Papel do usuário:", data.role);
          }
        } catch (error) {
          console.error("Erro ao buscar papel do usuário:", error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user && userRole === "pai") {
      const fetchChildLocation = async () => {
        try {
          // Buscar todas as crianças do pai
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.children) {
              console.log("Crianças encontradas:", data.children);
              for (const child of data.children) {
                if (child.driverId) {
                  // Buscar localização do motorista associado à criança
                  const locationQuery = query(
                    collection(db, "locations"),
                    where("driverId", "==", child.driverId)
                  );
                  const querySnapshot = await getDocs(locationQuery);
                  querySnapshot.forEach((locationDoc) => {
                    const locationData = locationDoc.data();
                    console.log(
                      "Localização encontrada para motorista:",
                      locationData
                    );
                    setLocation({
                      lat: locationData.latitude,
                      lng: locationData.longitude,
                    });
                    setIsSharingLocation(true);
                  });
                }
              }
            }
          }
        } catch (error) {
          console.error("Erro ao buscar localização do motorista:", error);
        }
      };

      fetchChildLocation();
    }
  }, [isAuthenticated, userRole, user]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (userRole === "motorista") {
    return <DriverProfile />;
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
      {isSharingLocation && location && (
        <DynamicGoogleMap lat={location.lat} lng={location.lng} />
      )}
    </div>
  );
};

export default Home;
