"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import { InteractiveButton } from "@/components/shared/interactive-button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Letter slide-up animation ──────────────────────────────────────────────
const letterVariants = {
  hidden: { y: "110%", opacity: 0, rotateZ: 4 },
  visible: {
    y: "0%",
    opacity: 1,
    rotateZ: 0,
    transition: { type: "spring" as const, stiffness: 130, damping: 15 },
  },
};

const gradientLetterVariants = {
  hidden: { y: "120%", opacity: 0, rotateZ: -6, scale: 0.88 },
  visible: {
    y: "0%",
    opacity: 1,
    rotateZ: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 110, damping: 13 },
  },
};

function SlidingText({
  text,
  isGradient = false,
  delayStart = 0,
  stagger = 0.045,
}: {
  text: string;
  isGradient?: boolean;
  delayStart?: number;
  stagger?: number;
}) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", lineHeight: "inherit" }}>
          <motion.span
            variants={isGradient ? gradientLetterVariants : letterVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: delayStart + i * stagger }}
            className={isGradient ? "gradient-text" : ""}
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </>
  );
}


function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, [prefersReducedMotion]);

  // Hide when scrolled more than 4% (like UI inspo)
  if (scrollProgress > 0.04) return null;

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="flex flex-col items-center gap-3"
    >
      <span className="text-[9px] font-semibold tracking-[0.5em] uppercase text-white/40">
        Scroll
      </span>
      <div className="h-7 w-px bg-gradient-to-b from-white/40 to-transparent" />
    </motion.div>
  );
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [showAnimated, setShowAnimated] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Use useEffect to show animated version only after hydration (Next.js Solution 1)
  useEffect(() => {
    setShowAnimated(true);
  }, []);

  // Scroll-based parallax using framer-motion
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false, // Use layoutEffect: false to avoid position warnings
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current || typeof window === "undefined") return;

    // 3D Parallax on scroll
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        y: -200,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    // Content parallax
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        y: -50,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "center top",
          scrub: 1,
        },
      });
    }

    // Image 3D rotation on mouse move
    if (imageRef.current) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = imageRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(imageRef.current, {
          rotationY: x * 0.05,
          rotationX: -y * 0.05,
          transformPerspective: 1000,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(imageRef.current, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      };

      imageRef.current.addEventListener("mousemove", handleMouseMove);
      imageRef.current.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        imageRef.current?.removeEventListener("mousemove", handleMouseMove);
        imageRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [prefersReducedMotion]);

  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden pt-20 tunisian-pattern perspective-3d hypnotic-section"
      style={{ position: 'relative' }}
    >
      {/* Hypnotizing Background Orbs */}
      <div className="absolute inset-0 overflow-hidden mesh-gradient">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-brand-blue/20 blur-3xl infinite-loop orb-float" />
        <div className="absolute -left-40 bottom-20 h-80 w-80 rounded-full bg-brand-blue/15 blur-3xl infinite-loop orb-float" style={{ animationDelay: "2s" }} />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-brand-blue/10 blur-2xl infinite-loop orb-float" style={{ animationDelay: "4s" }} />
        <div className="absolute left-1/3 bottom-1/3 h-96 w-96 rounded-full bg-brand-blue/8 blur-3xl morphing-shape" />
      </div>

      {/* Parallax Layers */}
      <div ref={bgRef} className="absolute inset-0 overflow-hidden parallax-element parallax-layer">
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-blue/5 rounded-full blur-xl floating-3d" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-brand-blue/8 rounded-full blur-2xl floating-3d" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container relative mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 py-12 lg:flex-row lg:gap-12 transform-3d">
        {/* Content */}
        <motion.div
          ref={contentRef}
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          animate={showAnimated && !prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={
            prefersReducedMotion
              ? {}
              : {
                y: contentY,
                opacity: contentOpacity,
              }
          }
          className="max-w-2xl text-center lg:text-left parallax-layer z-10"
          suppressHydrationWarning
        >
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
            animate={showAnimated && !prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass-effect px-4 py-2 text-sm font-medium text-brand-blue hypnotic-pulse"
            suppressHydrationWarning
          >
            <Calendar className="h-4 w-4" />
            <span>Iftar Event March 1 2026</span>
          </motion.div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" suppressHydrationWarning>
            {!showAnimated ? (
              <>
                Tunisian Student{" "}
                <span className="gradient-text">Association</span>
              </>
            ) : prefersReducedMotion ? (
              <>
                Tunisian Student{" "}
                <span className="gradient-text">Association</span>
              </>
            ) : (
              <>
                <SlidingText text="Tunisian" delayStart={0.3} stagger={0.04} />
                <span style={{ display: "inline-block" }}>&nbsp;</span>
                <SlidingText text="Student" delayStart={0.62} stagger={0.04} />
                {" "}
                <SlidingText text="Association" isGradient delayStart={0.95} stagger={0.055} />
              </>
            )}
          </h1>

          <p className="mb-2 text-lg font-semibold text-brand-blue sm:text-xl">
            University of Ottawa
          </p>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            Celebrating Tunisian culture, building community, and creating lasting connections at uOttawa.
            Open to all students who want to experience our vibrant culture and traditions.
          </p>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            animate={showAnimated && !prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
            suppressHydrationWarning
          >
            <InteractiveButton
              onClick={() => handleScroll("#contact")}
              variant="primary"
              className="px-8 py-3 rounded-lg font-semibold text-lg"
            >
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4 inline" />
            </InteractiveButton>
            <InteractiveButton
              onClick={() => handleScroll("#events")}
              variant="outline"
              className="px-8 py-3 rounded-lg font-semibold text-lg"
            >
              View Events
            </InteractiveButton>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          animate={showAnimated && !prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={
            prefersReducedMotion
              ? {}
              : {
                y: imageY,
                scale: imageScale,
              }
          }
          className="relative mt-12 lg:mt-0"
          suppressHydrationWarning
        >
          <div
            ref={imageRef}
            className="relative h-[300px] w-[350px] sm:h-[400px] sm:w-[450px] lg:h-[450px] lg:w-[500px] transform-gpu"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Animated border glow with 3D effect */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                    boxShadow: [
                      "0 0 30px rgba(0, 102, 204, 0.3)",
                      "0 0 50px rgba(0, 102, 204, 0.5)",
                      "0 0 30px rgba(0, 102, 204, 0.3)",
                    ],
                    rotateY: [0, 5, -5, 0],
                  }
              }
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-blue/20 to-brand-blue/5 tunisian-border floating-3d glass-effect"
            />
            {/* Image container */}
            <div className="absolute inset-2 overflow-hidden rounded-2xl bg-muted">
              <Image
                src="/team/tsa logo.png"
                alt="TSA Logo"
                fill
                sizes="(max-width: 640px) 350px, (max-width: 1024px) 450px, 500px"
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator - hides when scrolled */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
        animate={showAnimated && !prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
        suppressHydrationWarning
      >
        <ScrollIndicator />
      </motion.div>
    </section>
  );
}