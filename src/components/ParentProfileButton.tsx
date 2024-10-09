import { useRouter } from "next/navigation";
import React from "react";
import { CiUser } from "react-icons/ci";

const ParentProfileButton: React.FC = () => {
  const router = useRouter();

  const handleProfile = () => {
    router.push("/parentprofile");
  };

  return (
    <button
      className="flex items-center gap-4 text-xl mt-4 text-black rounded-m"
      onClick={handleProfile}
    >
      <CiUser size={25} />
      Perfil
    </button>
  );
};

export default ParentProfileButton;
