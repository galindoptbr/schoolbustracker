"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isParent, setIsParent] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Salvar informações do usuário no Firestore usando setDoc com o UID do usuário
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        phone: "", // Podemos adicionar campos vazios que poderão ser preenchidos depois
        address: "",
        children: [],
        role: isParent ? "pai" : isDriver ? "motorista" : "indefinido",
      });

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Cadastre-se</h1>
      <form
        onSubmit={handleSignUp}
        className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Nome Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Tipo de Perfil</label>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={isParent}
              onChange={() => {
                setIsParent(!isParent);
                if (!isParent) setIsDriver(false); // Desmarca motorista se selecionar pai
              }}
              className="mr-2"
            />
            <label>Pai/Mãe</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isDriver}
              onChange={() => {
                setIsDriver(!isDriver);
                if (!isDriver) setIsParent(false); // Desmarca pai se selecionar motorista
              }}
              className="mr-2"
            />
            <label>Motorista</label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Cadastrar
        </button>
        <p className="mt-4 text-center">
          Já possui uma conta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
