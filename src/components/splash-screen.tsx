"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // Wait for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#DC2626] transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="flex flex-col items-center space-y-6 animate-in zoom-in-50 duration-700">
        <div className="relative w-full max-w-[300px] px-4">
           <Image
            src="/images/logo-red.JPG"
            alt="Block A Logo"
            width={600}
            height={200}
            className="w-full h-auto rounded-lg shadow-lg"
            priority
          />
        </div>
        
        <div className="text-center space-y-2 text-white">
          <h1 className="text-3xl font-bold tracking-tight drop-shadow-md">
            Block A Running Club
          </h1>
          <p className="text-lg italic font-light opacity-90">
            "There are no finish line"
          </p>
        </div>
      </div>
    </div>
  );
}
