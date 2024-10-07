import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import useAuth from "../hooks/useAuth";
import LocationTracker from "./LocationTracker";
import LogoutButton from "./LogoutButton";

interface Child {
  name: string;
  age: number;
  checkedIn: boolean;
  driverId?: string;
}

const DriverProfile: React.FC = () => {
  const { user } = useAuth();
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [isSharingLocation, setIsSharingLocation] = useState<boolean>(true);

  useEffect(() => {
    const fetchChildren = async () => {
      if (user) {
        try {
          // Buscar todos os documentos na coleção "users"
          const usersQuery = collection(db, "users");
          const usersSnapshot = await getDocs(usersQuery);

          const associatedChildren: Child[] = [];

          // Iterar por cada documento dos pais para buscar crianças com driverId igual ao do motorista
          usersSnapshot.forEach((doc) => {
            const data = doc.data();
            if (Array.isArray(data.children)) {
              data.children.forEach((child: { name: string; age: number; driverId?: string }) => {
                if (child.driverId === user.uid) {
                  associatedChildren.push({
                    name: child.name,
                    age: child.age,
                    checkedIn: false, // Inicialmente não marcado
                  });
                }
              });
            }
          });

          setChildrenList(associatedChildren);
        } catch (error) {
          console.error("Erro ao buscar crianças:", error);
        }
      }
    };

    fetchChildren();
  }, [user]);

  const handleCheckIn = async (childIndex: number) => {
    if (user) {
      try {
        const updatedChildren = [...childrenList];
        updatedChildren[childIndex].checkedIn = true;
        setChildrenList(updatedChildren);

        // Iniciar o compartilhamento de localização
        setIsSharingLocation(true);

        // Atualizar o estado da criança no Firestore (se necessário)
        // Dependendo da estrutura da coleção, precisamos localizar o documento correto.
      } catch (error) {
        console.error("Erro ao dar check-in na criança:", error);
      }
    }
  };

  const handleEndTrip = () => {
    // Finalizar o compartilhamento de localização
    setIsSharingLocation(false);

    // Remover o check-in de todas as crianças
    const updatedChildren = childrenList.map((child) => ({
      ...child,
      checkedIn: false,
    }));
    setChildrenList(updatedChildren);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <LogoutButton />
      <div className="p-6 bg-white mt-4 rounded-md shadow-md max-w-md">
        <h1 className="text-2xl font-bold mb-4">Perfil do Motorista</h1>
        <div>
          <h2 className="text-xl font-semibold mb-2">Lista de Crianças</h2>
          <ul>
            {childrenList.map((child, index) => (
              <li key={index} className="mb-1">
                <strong>Nome:</strong> {child.name} | <strong>Idade:</strong> {child.age}
                <button
                  onClick={() => handleCheckIn(index)}
                  className={`ml-4 py-1 px-2 rounded-md text-white ${
                    child.checkedIn ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={child.checkedIn}
                >
                  {child.checkedIn ? "Presente" : "Dar Check-in"}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {isSharingLocation && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Localização Atual</h2>
            <LocationTracker />
          </div>
        )}
        <button
          onClick={handleEndTrip}
          className="mt-4 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Finalizar Viagem
        </button>
      </div>
    </div>
  );
};

export default DriverProfile;