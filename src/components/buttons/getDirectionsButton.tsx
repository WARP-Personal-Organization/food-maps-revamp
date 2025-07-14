import React from "react";

interface GetDirectionsButtonProps {
  onClick?: () => void;
  className?: string;
}

const GetDirectionsButton: React.FC<GetDirectionsButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      aria-label="Get Directions"
      className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-black bg-yellow-400 font-semibold text-sm sm:text-base shadow-md hover:bg-yellow-500 transition duration-200 ${className}`}
    >
      <svg
        className="w-5 h-5 mr-2 shrink-0"
        viewBox="0 0 24 24"
        fill="black"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M22.43 10.59l-9.01-9.01c-.75-.75-2.07-.76-2.83 0l-9 9c-.78.78-.78 2.04 0 2.82l9 9c.39.39.9.58 1.41.58.51 0 1.02-.19 1.41-.58l8.99-8.99c.79-.76.8-2.02.03-2.82zm-10.42 10.4l-9-9 9-9 9 9-9 9z" />
        <path d="M8 11v4h2v-3h4v2.5l3.5-3.5L14 7.5V10H9c-.55 0-1 .45-1 1z" />
      </svg>
      Get Directions
    </button>
  );
};

export default GetDirectionsButton;
