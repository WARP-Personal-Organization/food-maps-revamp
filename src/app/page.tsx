"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import MapPage from "@/components/panel/Mainpage";

const loadingTexts = [
  "Serving in 3, 2, 1...",
  "Finding food spots...",
  "Mapping delicious locations...",
  "Almost ready...",
  "Cooking up something special just for you...",
];

const FlipPage = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);
  const [loading, setLoading] = useState(true);

  // Simulate loading progress
  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 800); // fade out
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [loading]);

  // Update loading text
  useEffect(() => {
    const idx = Math.floor((loadingProgress / 100) * loadingTexts.length);
    setLoadingText(loadingTexts[Math.min(idx, loadingTexts.length - 1)]);
  }, [loadingProgress]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-yellow-400 z-50 overflow-hidden">
      {/* Loading Screen */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center bg-white z-50 transition-opacity duration-700 ${
          loading
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/DGBG.png')" }}
        />
        <div className="absolute top-[7%] left-1/2 transform -translate-x-1/2 z-10 w-40 md:w-48">
          <Image
            src="/images/DGLogo.png"
            alt="Daily Guardian Logo"
            layout="responsive"
            width={180}
            height={60}
            objectFit="contain"
            priority
          />
        </div>
        <div className="flex flex-col items-center justify-center h-full z-10 px-4 space-y-4">
          <div className="w-80 h-auto md:w-[500px] lg:w-[600px]">
            <Image
              src="/images/map/food-prints.png"
              alt="Foodprints Logo"
              layout="responsive"
              width={600}
              height={200}
              objectFit="contain"
              priority
            />
          </div>
        </div>
        <div className="absolute bottom-[15%] w-full flex flex-col items-center z-10">
          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-black text-sm">{loadingText}</p>
        </div>
      </div>
      {/* Map Page */}
      <div
        className={`w-full h-full transition-opacity duration-700 ${
          loading
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        <MapPage />
      </div>
    </div>
  );
};

export default FlipPage;
