"use client";

import { useRef, useEffect, ReactNode, MouseEvent } from "react";
import gsap from "gsap";

interface InteractiveButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export function InteractiveButton({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
}: InteractiveButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.15,
        y: y * 0.15,
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (!rippleRef.current) return;
      
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = rippleRef.current;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 0.6,
        },
        {
          scale: 4,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        }
      );

      // Button pulse
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    };

    button.addEventListener("mousemove", handleMouseMove as any);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("click", handleClick as any);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove as any);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("click", handleClick as any);
    };
  }, []);

  const baseClasses = "relative overflow-hidden transform transition-all duration-300";
  const variantClasses = {
    primary: "bg-brand-blue hover:bg-brand-blue-dark text-white",
    secondary: "bg-muted hover:bg-muted/80 text-foreground",
    outline: "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white",
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span className="relative z-10">{children}</span>
      <span
        ref={rippleRef}
        className="absolute rounded-full bg-white/30 pointer-events-none"
        style={{
          width: "20px",
          height: "20px",
          transform: "translate(-50%, -50%)",
        }}
      />
    </button>
  );
}
