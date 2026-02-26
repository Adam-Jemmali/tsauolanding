"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

interface MarqueeProps {
  images: string[];
  alt?: string;
  className?: string;
}

export function Marquee({ images, alt = "Event image", className = "" }: MarqueeProps) {
  const prefersReducedMotion = useReducedMotion();
  const [showAnimated, setShowAnimated] = useState(false);
  
  useEffect(() => {
    setShowAnimated(true);
  }, []);

  // Use images as-is, no duplication
  const duplicatedImages = images;

  // Always render the same structure initially to avoid hydration mismatch
  // Only apply animation class after mount
  const shouldAnimate = showAnimated && !prefersReducedMotion;

  return (
    <div className={`relative overflow-hidden ${className}`} suppressHydrationWarning>
      <div className={`flex gap-4 ${shouldAnimate ? "animate-marquee" : ""}`}>
        {duplicatedImages.map((src, index) => (
          <div
            key={index}
            className="relative h-48 w-72 flex-shrink-0 overflow-hidden rounded-2xl"
          >
            <Image
              src={src}
              alt={`${alt} ${index + 1}`}
              fill
              sizes="288px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}