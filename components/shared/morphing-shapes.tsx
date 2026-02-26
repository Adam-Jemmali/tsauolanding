"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function MorphingShapes() {
  const shapesRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !shapesRef.current || typeof window === "undefined") return;

    const shapes = shapesRef.current.querySelectorAll(".morph-shape");
    
    shapes.forEach((shape, index) => {
      gsap.to(shape, {
        rotation: 360,
        duration: 20 + index * 5,
        repeat: -1,
        ease: "none",
      });

      gsap.to(shape, {
        scale: 1.2,
        duration: 3 + index,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <div ref={shapesRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="morph-shape absolute top-20 right-20 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl" />
      <div className="morph-shape absolute bottom-20 left-20 w-40 h-40 bg-brand-blue/8 rounded-full blur-3xl" style={{ animationDelay: "1s" }} />
      <div className="morph-shape absolute top-1/2 left-1/4 w-24 h-24 bg-brand-blue/6 rounded-full blur-xl" style={{ animationDelay: "2s" }} />
    </div>
  );
}
