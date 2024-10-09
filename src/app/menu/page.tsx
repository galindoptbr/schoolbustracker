// src/app/menu/page.tsx
"use client";

import React from "react";
import useAuth from "../../hooks/useAuth"; // Certifique-se de importar o useAuth
import ParentProfileButton from "@/components/ParentProfileButton";
import LogoutButton from "@/components/LogoutButton";
import { IoChevronBackOutline } from "react-icons/io5";
import Link from "next/link";

const MenuPage: React.FC = () => {
  const { userData, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between border-b-2 border-zinc-100">
        <p className="font-bold text-xl mb-2">{userData?.name || "Usuário"}</p>
        <Link href={"/"}>
          <IoChevronBackOutline size={30} />
        </Link>
      </div>
      <ParentProfileButton />
      <LogoutButton />
    </div>
  );
};

export default MenuPage;
