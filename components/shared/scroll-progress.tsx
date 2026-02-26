"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollProgress);
      
      // Direct DOM update to avoid style prop mismatch
      if (progressRef.current) {
        progressRef.current.style.width = `${scrollProgress}%`;
      }
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div
        className="scroll-progress"
        style={{ width: "0%" }}
        aria-hidden="true"
      />
    );
  }

  if (prefersReducedMotion) {
    return (
      <div
        ref={progressRef}
        className="scroll-progress"
        style={{ width: "0%" }}
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div
      ref={progressRef}
      className="scroll-progress"
      style={{ width: "0%" }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      aria-hidden="true"
    />
  );
}