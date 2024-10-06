"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import useAuth from "../hooks/useAuth";

interface Child {
  name: string;
  age: number;
}

interface ParentProfileProps {
  name: string;
  email: string;
  phone: string;
  address: string;
  childList: { name: string; age: number }[];
}

const ParentProfile: React.FC<ParentProfileProps> = ({
  name,
  email,
  phone,
  address,
  childList,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [newChildName, setNewChildName] = useState<string>("");
  const [newChildAge, setNewChildAge] = useState<number | "">("");
  const [currentPhone, setCurrentPhone] = useState<string>(phone);
  const [currentAddress, setCurrentAddress] = useState<string>(address);
  const [updatedPhone, setUpdatedPhone] = useState<string>("");
  const [updatedAddress, setUpdatedAddress] = useState<string>("");
  const [profileChildren, setProfileChildren] = useState<Child[]>(childList);

  useEffect(() => {
    setCurrentPhone(phone);
    setCurrentAddress(address);
    setProfileChildren(childList);
  }, [phone, address, childList]);

  const handleAddChild = async () => {
    if (user && newChildName && newChildAge !== "") {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        children: arrayUnion({ name: newChildName, age: newChildAge }),
      });
      setNewChildName("");
      setNewChildAge("");

      // Recarregar os dados do documento após adicionar um filho
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const updatedData = docSnap.data();
        setProfileChildren(updatedData.children || []);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);

        // Atualizar telefone e endereço no Firestore
        await updateDoc(docRef, {
          phone: updatedPhone,
          address: updatedAddress,
        });

        // Atualizar a exibição dos dados
        setCurrentPhone(updatedPhone);
        setCurrentAddress(updatedAddress);

        // Limpar os inputs
        setUpdatedPhone("");
        setUpdatedAddress("");
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
      }
    }
  };

  // Função para voltar para a página inicial
  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-md shadow-md max-w-md">
        <h1 className="text-2xl font-bold mb-4">Perfil de Pai/Mãe</h1>
        <div>
          <div className="mb-2">
            <strong>Nome:</strong> {name}
          </div>
          <div className="mb-2">
            <strong>Email:</strong> {email}
          </div>
          <div className="mb-2">
            <strong>Telefone:</strong> {currentPhone || "N/A"}
          </div>
          <div className="mb-2">
            <strong>Endereço:</strong> {currentAddress || "N/A"}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Filhos</h2>
          <ul>
            {profileChildren.map((child, index) => (
              <li key={index} className="mb-1">
                <strong>Nome:</strong> {child.name} | <strong>Idade:</strong>{" "}
                {child.age}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 mt-6 text-center">
              Atualizar dados
            </h3>
            <label className="block mb-1">
              <strong>Atualizar Telefone:</strong>
            </label>
            <input
              type="text"
              value={updatedPhone}
              onChange={(e) => setUpdatedPhone(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              <strong>Atualizar Endereço:</strong>
            </label>
            <input
              type="text"
              value={updatedAddress}
              onChange={(e) => setUpdatedAddress(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            onClick={handleUpdateProfile}
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
          >
            Atualizar Perfil
          </button>

          <div className="mt-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">Adicionar Filho</h3>
              <input
                type="text"
                placeholder="Nome do filho"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                className="mb-2 p-2 border rounded-md w-full"
              />
              <input
                type="number"
                placeholder="Idade do filho"
                value={newChildAge}
                onChange={(e) => setNewChildAge(Number(e.target.value) || "")}
                className="mb-2 p-2 border rounded-md w-full"
              />
              <button
                onClick={handleAddChild}
                className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Adicionar Filho
              </button>
              <button
                onClick={handleGoBack}
                className="py-2 px-4 ml-44 bg-gray-500 text-white rounded-md hover:bg-gray-600 mb-4"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
