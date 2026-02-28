"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const teamMembers = [
  {
    name: "Ines Essousi",
    role: "President",
    bio: "The one who leads the club with passion and vision for our community.",
    image: "/team/pres.png",
  },
  {
    name: "Emna Hamida & Mariam Trabelsi",
    role: "Vice Presidents",
    bio: "The 2 smooth operators of the club",
    image: "/team/vps.png",
  },
  {
    name: "Ludovic Lachance & Yasmine Trigui",
    role: "VP Finance",
    bio: "The two musketeers of finance",
    image: "/team/vp finance.png",
  },
  {
    name: "Sabrina Temimi & Aicha Ben Miled",
    role: "VP Events",
    bio: "Two brains working together to make events unforgettable",
    image: "/team/vp events.png",
  },
  {
    name: "Maïssa Zemni & Yasmine Ghorbel",
    role: "VP Marketing",
    bio: "Two marketing geniuses bringing our brand to life",
    image: "/team/vp marketing.png",
  },
  {
    name: "Nour G-Mekki & Nour Benfikih",
    role: "VP Social Media",
    bio: "Same name, same mission",
    image: "/team/vp socials.png",
  },
  {
    name: "Adam Jemmali",
    role: "VP Graphic Designer",
    bio: "The creative mind behind our brand",
    image: "/team/vp gd.png",
  },
  {
    name: "Maiy Chaabani & Malek Behareth",
    role: "VP External Affairs",
    bio: "The two plugs of external affairs",
    image: "/team/vp ea.png",
  },
];

export function Team() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right
  const [isMounted, setIsMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = teamMembers.length;

  const goTo = useCallback(
    (index: number) => {
      const newDir = index > activeIndex ? 1 : -1;
      setDirection(newDir);
      setActiveIndex(((index % total) + total) % total);
    },
    [activeIndex, total]
  );

  const next = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play
  useEffect(() => {
    if (prefersReducedMotion || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(next, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, prefersReducedMotion, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  // Get indices for the visible cards: [prev, current, next]
  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  // Swipe handling via drag
  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 50;
    const velocityThreshold = 300;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      next();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      prev();
    }
  };

  const shouldAnimate = isMounted && !prefersReducedMotion;

  // Slide animation variants
  const easing: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.85,
      rotateY: dir > 0 ? 25 : -25,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.5,
        ease: easing,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.85,
      rotateY: dir > 0 ? -25 : 25,
      transition: {
        duration: 0.4,
        ease: easing,
      },
    }),
  };

  return (
    <section id="team" className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Meet Our <span className="gradient-text">Team</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We&apos;re students building a home away from Tunisia. Whether
            you&apos;re Tunisian or just curious about our culture, come say hi
            at our events!
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative mx-auto max-w-5xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ perspective: "1200px" }}
        >
          {/* 3-card layout: side cards + center card */}
          <div className="relative flex items-center justify-center gap-4 md:gap-6">
            {/* Left peek card (desktop only) */}
            <div className="hidden md:block w-56 lg:w-64 flex-shrink-0">
              <button
                onClick={prev}
                className="w-full text-left focus:outline-none group"
                aria-label="Previous team member"
              >
                <SideCard
                  member={teamMembers[prevIndex]}
                  side="left"
                  shouldAnimate={shouldAnimate}
                />
              </button>
            </div>

            {/* Center card with AnimatePresence */}
            <div className="w-full max-w-sm md:max-w-md flex-shrink-0 relative min-h-[460px] md:min-h-[500px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={shouldAnimate ? slideVariants : undefined}
                  initial={shouldAnimate ? "enter" : false}
                  animate="center"
                  exit={shouldAnimate ? "exit" : undefined}
                  drag={shouldAnimate ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <ActiveCard member={teamMembers[activeIndex]} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right peek card (desktop only) */}
            <div className="hidden md:block w-56 lg:w-64 flex-shrink-0">
              <button
                onClick={next}
                className="w-full text-left focus:outline-none group"
                aria-label="Next team member"
              >
                <SideCard
                  member={teamMembers[nextIndex]}
                  side="right"
                  shouldAnimate={shouldAnimate}
                />
              </button>
            </div>
          </div>

          {/* Arrow buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/90 shadow-soft text-brand-blue backdrop-blur-sm transition-all hover:bg-brand-blue hover:text-white hover:shadow-glow hover:scale-110 active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/90 shadow-soft text-brand-blue backdrop-blur-sm transition-all hover:bg-brand-blue hover:text-white hover:shadow-glow hover:scale-110 active:scale-95"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {teamMembers.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to ${teamMembers[i].name}`}
              className="group relative p-1"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${i === activeIndex
                  ? "h-3 w-8 bg-brand-blue"
                  : "h-3 w-3 bg-brand-blue/20 group-hover:bg-brand-blue/40"
                  }`}
              />
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="mt-4 text-center">
          <span className="text-sm font-medium text-muted-foreground">
            <span className="text-brand-blue font-bold">{activeIndex + 1}</span>
            {" / "}
            {total}
          </span>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 text-center text-lg text-muted-foreground"
        >
          Got any questions or ideas?{" "}
          <a
            href="#contact"
            className="font-medium text-brand-blue hover:underline"
          >
            Reach out to us!
          </a>
        </motion.p>
      </div>
    </section>
  );
}

// ─── Active (center) Card ───────────────────────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

function ActiveCard({ member }: { member: TeamMember }) {
  return (
    <div className="group h-full overflow-hidden rounded-3xl bg-white shadow-soft-lg border border-border/30 transition-shadow duration-300 hover:shadow-glow">
      {/* Image */}
      <div className="relative h-72 md:h-80 w-full overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 90vw, 400px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Role badge floating on image */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
            {member.role}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {member.bio}
        </p>
      </div>
    </div>
  );
}

// ─── Side (peek) Card ───────────────────────────────────────────────────────

function SideCard({
  member,
  side,
  shouldAnimate,
}: {
  member: TeamMember;
  side: "left" | "right";
  shouldAnimate: boolean;
}) {
  return (
    <motion.div
      className="overflow-hidden rounded-2xl bg-white/70 shadow-soft border border-border/20 transition-all duration-300 group-hover:shadow-soft-lg group-hover:bg-white/90"
      animate={
        shouldAnimate
          ? {
            rotateY: side === "left" ? 8 : -8,
            scale: 0.88,
            opacity: 0.6,
          }
          : { opacity: 0.6, scale: 0.88 }
      }
      whileHover={
        shouldAnimate
          ? {
            rotateY: side === "left" ? 4 : -4,
            scale: 0.92,
            opacity: 0.85,
          }
          : undefined
      }
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Image */}
      <div className="relative h-44 lg:h-52 w-full overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="256px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Minimal info */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-foreground truncate">{member.name}</h4>
        <p className="text-xs font-medium text-brand-blue">{member.role}</p>
      </div>
    </motion.div>
  );
}
