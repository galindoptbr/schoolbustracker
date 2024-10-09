"use client";

import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { CiLogout } from "react-icons/ci";

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
      className="flex items-center gap-4 text-xl mt-4 text-black rounded-m"
    >
      <CiLogout size={25} />
      Deslogar
    </button>
  );
};

export default LogoutButton;
