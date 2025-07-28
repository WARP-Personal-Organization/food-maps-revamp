import React from "react";
import { FiMenu } from "react-icons/fi";

interface MenuButtonProps {
  onClick: () => void;
  className?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open Menu"
      className={`${className} fixed top-6 right-4 z-20 text-2xl text-black bg-white rounded-full p-2 shadow-lg h-12 w-12 flex items-center justify-center hover:bg-yellow-100 active:bg-yellow-200 transition-all duration-150`}
    >
      <FiMenu />
    </button>
  );
};

export default MenuButton;
