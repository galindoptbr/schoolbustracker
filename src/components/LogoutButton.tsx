"use client";

import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redireciona para a página de login após logout
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 py-2 px-4 text-white bg-red-500 rounded-md hover:bg-red-600"
    >
      Sair
    </button>
  );
};

export default LogoutButton;
