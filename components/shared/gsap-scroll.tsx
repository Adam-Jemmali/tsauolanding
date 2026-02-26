"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function GSAPScrollEffects() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    // Parallax Background Elements
    const parallaxElements = document.querySelectorAll(".parallax-element");
    parallaxElements.forEach((el) => {
      gsap.to(el, {
        y: -100,
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    // Crazy reveal animations with 3D
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    revealElements.forEach((el) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 100,
          rotationX: -90,
          z: -200,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          z: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Focus/Unfocus animations for interactive elements
    const interactiveElements = document.querySelectorAll("button, a, input, textarea");
    interactiveElements.forEach((el) => {
      el.addEventListener("focus", () => {
        gsap.to(el, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      el.addEventListener("blur", () => {
        gsap.to(el, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    // Scroll progress indicator with 3D effect
    const progressBar = document.querySelector(".scroll-progress");
    if (progressBar) {
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          gsap.to(progressBar, {
            scaleX: self.progress,
            transformOrigin: "left",
            duration: 0.1,
          });
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMounted]);

  return null;
}
