"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HypnoticScroll() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    // Hypnotic reveal animations
    const revealElements = document.querySelectorAll(".reveal-smooth");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach((el) => observer.observe(el));

    // 3D tilt on scroll for cards
    const cards = document.querySelectorAll(".card-premium");
    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          gsap.to(card, {
            rotationY: 5,
            rotationX: 2,
            duration: 0.8,
            ease: "power2.out",
          });
        },
        onLeave: () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        },
        onEnterBack: () => {
          gsap.to(card, {
            rotationY: 5,
            rotationX: 2,
            duration: 0.8,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        },
      });
    });

    return () => {
      observer.disconnect();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMounted]);

  return null;
}
