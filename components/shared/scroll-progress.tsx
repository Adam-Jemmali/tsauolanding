"use client";

import { useEffect, useState, useRef } from "react";

export function ScrollProgress() {
  const [isMounted, setIsMounted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let ticking = false;
    const updateProgress = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (progressRef.current) {
          progressRef.current.style.width = `${scrollProgress}%`;
        }
      });
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, [isMounted]);

  return (
    <div
      ref={progressRef}
      className="scroll-progress"
      style={{ width: "0%" }}
      aria-hidden="true"
    />
  );
}
