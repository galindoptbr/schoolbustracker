"use client";

import React, { useEffect, useState } from "react";
import ParentProfile from "../../components/ParentProfile";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import useAuth from "../../hooks/useAuth";

const ParentProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    children?: { name: string; age: number }[];
  } | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      }
    };

    if (!loading) {
      fetchProfileData();
    }
  }, [user, loading]);

  if (loading || !profileData) {
    return <p>Carregando...</p>;
  }

  return (
    <ParentProfile
      name={profileData?.name || ""}
      email={profileData?.email || ""}
      phone={profileData?.phone || ""}
      address={profileData?.address || ""}
      children={profileData?.children || []}
    />
  );
};

export default ParentProfilePage;
