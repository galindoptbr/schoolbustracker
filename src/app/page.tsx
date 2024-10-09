"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";
import useAuth from "../hooks/useAuth";
import dynamic from "next/dynamic";
import DriverProfile from "../components/DriverProfile";
import MenuButton from "@/components/MenuButton";

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
  const [isChildOnTheWay, setIsChildOnTheWay] = useState<boolean>(false);

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
    let unsubscribe: (() => void) | null = null;

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

              // Reinicializar `isChildOnTheWay` para garantir um valor consistente
              let childOnTheWay = false;

              for (const child of data.children) {
                if (child.driverId) {
                  // Verificar se o motorista está compartilhando a localização
                  const driverDocRef = doc(db, "drivers", child.driverId);
                  const driverDocSnap = await getDoc(driverDocRef);
                  if (
                    driverDocSnap.exists() &&
                    driverDocSnap.data().isSharingLocation
                  ) {
                    childOnTheWay = true;
                  }

                  // Ouvinte em tempo real para a localização do motorista associado à criança
                  const locationQuery = query(
                    collection(db, "locations"),
                    where("driverId", "==", child.driverId)
                  );

                  // Usando onSnapshot para ouvir atualizações em tempo real
                  unsubscribe = onSnapshot(locationQuery, (querySnapshot) => {
                    querySnapshot.forEach((locationDoc) => {
                      const locationData = locationDoc.data();
                      console.log(
                        "Localização atualizada para motorista:",
                        locationData
                      );
                      setLocation({
                        lat: locationData.latitude,
                        lng: locationData.longitude,
                      });
                    });
                  });
                }
              }

              // Atualizar o estado `isChildOnTheWay` com base nas verificações
              setIsChildOnTheWay(childOnTheWay);
            }
          }
        } catch (error) {
          console.error("Erro ao buscar localização do motorista:", error);
        }
      };

      fetchChildLocation();
    }

    // Limpar o ouvinte em tempo real ao desmontar
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAuthenticated, userRole, user]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (userRole === "motorista") {
    return <DriverProfile />;
  }

  return (
    <div className="flex flex-col abs items-center justify-center">
      <div className="absolute top-7 left-5 z-10">
        <MenuButton />
      </div>
      {location ? (
        <DynamicGoogleMap lat={location.lat} lng={location.lng} />
      ) : (
        <p>Localização ainda não disponível...</p>
      )}
      <div className="flex flex-col absolute bg-zinc-50 rounded-t-2xl w-full text-center h-[350px] top-[600px]">
        <h1
          className={`text-3xl font-bold p-4 ${
            isChildOnTheWay ? "text-blue-500" : "text-zinc-600"
          }`}
        >
          {isChildOnTheWay
            ? "Seu filho está a caminho."
            : "Seu filho não está na carrinha."}
        </h1>
      </div>
    </div>
  );
};

export default Home;
