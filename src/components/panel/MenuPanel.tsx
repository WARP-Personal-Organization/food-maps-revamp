"use client";

import React from "react";
import Image from "next/image";
import CloseButton from "../buttons/closeButton";
interface MenuPanelProps {
  onClose: () => void;
  onOpenHome: () => void;
  onOpenAbout: () => void;
  isVisible: boolean;
}

const MenuPanel: React.FC<MenuPanelProps> = ({
  onClose,
  onOpenHome,
  onOpenAbout,
  isVisible,
}) => {
  const handleHomeClick = () => {
    onOpenHome();
  };

  return (
    <>
      {/* Backdrop Blur */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 bg-black/20 backdrop-blur-sm ${
          isVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transition-transform duration-300
          w-[50vw] sm:w-1/6 md:w-1/5
          ${isVisible ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4 sm:p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div className="w-20 sm:w-24 md:w-28">
              <Image
                src="/images/foodprints-logo-menu.png"
                alt="Logo"
                width={100}
                height={110}
                className="w-full h-auto"
                priority
              />
            </div>
            <CloseButton
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-full transition-all duration-300 shadow-sm touch-manipulation"
              aria-label="Close menu"
            />
          </div>

          <ul className="space-y-3 sm:space-y-4 flex-grow">
            <li
              className="text-black text-2xl sm:text-3xl font-bold hover:text-yellow-500 cursor-pointer flex justify-between items-center px-2 sm:px-0"
              onClick={handleHomeClick}
              aria-label="Go to Home"
              tabIndex={0}
            >
              Home{" "}
              <span className="text-xs sm:text-sm font-light text-amber-300">
                01
              </span>
            </li>
            <hr className="border-amber-300 my-6 sm:my-8" />
            <li
              className="text-black text-2xl sm:text-3xl font-bold hover:text-yellow-500 cursor-pointer flex justify-between items-center px-2 sm:px-0"
              onClick={onOpenAbout}
              aria-label="About"
              tabIndex={0}
            >
              About{" "}
              <span className="text-xs sm:text-sm font-light text-amber-300">
                02
              </span>
            </li>
          </ul>

          <section className="text-xs sm:text-sm font-medium mt-6 sm:mt-8">
            <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 gap-x-0 sm:gap-x-16 my-6 sm:my-8">
              <div className="flex flex-col gap-y-2 sm:gap-y-3">
                <h2 className="text-amber-300 font-bold">WEBSITE</h2>
                <a
                  href="https://dailyguardian.com.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline break-all"
                  aria-label="Visit dailyguardian.com.ph"
                >
                  dailyguardian.com.ph
                </a>
              </div>
              <div className="flex flex-col gap-y-2 sm:gap-y-3 mt-4 sm:mt-0">
                <h2 className="text-amber-300 font-bold">EXPLORE</h2>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <a
                    href="https://www.facebook.com/DailyGuardianPH/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:underline"
                    aria-label="Facebook"
                  >
                    FACEBOOK
                  </a>
                  <span className="hidden sm:inline">/</span>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:underline"
                    aria-label="Instagram"
                  >
                    INSTAGRAM
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default MenuPanel;
