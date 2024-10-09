import { useRouter } from "next/navigation";
import React from "react";
import { IoMenu } from "react-icons/io5";

const MenuButton: React.FC = () => {
  const router = useRouter();

  const handleMenu = () => {
    router.push("/menu");
  };

  return (
    <button
      className="mt-4 py-2 px-2 bg-zinc-100 drop-shadow-md text-zinc-600 rounded-md"
      onClick={handleMenu}
    >
      <IoMenu size={30} />
    </button>
  );
};

export default MenuButton;
