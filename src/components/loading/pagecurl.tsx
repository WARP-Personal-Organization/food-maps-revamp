'use client';

import React, { useRef, useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Image from 'next/image';

const FlipPage = () => {
  const bookRef = useRef<any>(null);
  const [bookSize, setBookSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingText, setLoadingText] = useState<string>(
    'Cooking up something special just for you...'
  );

  // Responsive book sizing
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsMobile(width < 768);
      setBookSize({ width, height });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Simulate loading and auto flip page
  useEffect(() => {
    const loadingTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingTimer);
          // After loading, trigger flip
          setTimeout(() => {
            bookRef.current?.pageFlip()?.flipNext();
          }, 500);
        }
        return Math.min(prev + 1, 100);
      });
    }, 25);

    return () => clearInterval(loadingTimer);
  }, []);

  // Text transition
  useEffect(() => {
    const textSequences: string[] = [
      'Serving in 3, 2, 1...',
      'Finding food spots...',
      'Mapping delicious locations...',
      'Almost ready...',
      'Cooking up something special just for you...',
    ];
    const textIndex = Math.floor((loadingProgress / 250) * textSequences.length);
    setLoadingText(textSequences[Math.min(textIndex, textSequences.length - 1)]);
  }, [loadingProgress]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-yellow-400 z-50 overflow-hidden">
      <HTMLFlipBook
        ref={bookRef}
        swipeDistance={1}
        showPageCorners={false}
        disableFlipByClick={true}
        width={bookSize.width}
        height={bookSize.height}
        size="fixed"
        minWidth={320}
        maxWidth={1920}
        minHeight={500}
        maxHeight={2000}
        startPage={0}
        flippingTime={1000}
        drawShadow={false}
        showCover={false}
        mobileScrollSupport={false}
        usePortrait={true}
        useMouseEvents={true}
        startZIndex={0}
        autoSize={true}
        maxShadowOpacity={0.5}
        clickEventForward={true}
        className="z-10"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Page 1 - Loading screen */}
        <div className="fixed inset-0 z-40 overflow-hidden bg-white">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/DGBG.png')" }}
          />

          {/* Logo */}
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

          {/* Main content */}
          <div className="relative flex flex-col items-center justify-center h-full z-10 px-4 space-y-4">
            <div className="w-80 h-auto md:w-[500px] lg:w-[600px]">
              <Image
                src="/images/food-prints.png"
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

        <div className="w-full h-full bg-white flex items-center justify-center text-2xl font-bold text-black">
          Welcome to the experience!
        </div>
      </HTMLFlipBook>
    </div>
  );
};

export default FlipPage;
