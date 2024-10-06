import { useRouter } from "next/navigation";
import React from "react";

const ParentProfileButton: React.FC = () => {
  const router = useRouter();

  const handleProfile = () => {
    router.push("/parentprofile");
  };

  return (
    <button
      className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      onClick={handleProfile}
    >
      Perfil
    </button>
  );
};

export default ParentProfileButton;
