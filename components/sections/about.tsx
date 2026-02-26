"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Users, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    
    title: "Community & Culture",
    description:
      "Connect with students from all backgrounds, celebrate Tunisian heritage, and build lifelong friendships in a welcoming, inclusive environment.",
  },
  {
    
    title: "Personal Growth",
    description:
      "Access networking opportunities,  funny and interactive event and  workshops. Open to all students looking to grow .",
  },
  {
    
    title: "Events & Volunteering",
    description:
      "Join exciting events, cultural celebrations, and community activities. Everyone is welcome to experience Tunisian culture and traditions.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function About() {
  const prefersReducedMotion = useReducedMotion();
  const [showAnimated, setShowAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setShowAnimated(true);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || typeof window === "undefined") return;

    // 3D flip cards on scroll
    const cards = sectionRef.current.querySelectorAll(".feature-card");
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          rotationY: 90,
          opacity: 0,
          z: -200,
        },
        {
          rotationY: 0,
          opacity: 1,
          z: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: index * 0.2,
        }
      );
    });
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} id="about" className="section-padding bg-muted/30 tunisian-tile hypnotic-section perspective-3d relative overflow-hidden">
      {/* Floating 3D shapes */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl floating-3d" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-brand-blue/8 rounded-full blur-2xl morphing-shape" />
      
      <div className="container mx-auto px-4 relative z-10 transform-3d">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={showAnimated && !prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          whileInView={showAnimated && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center md:mb-16"
          suppressHydrationWarning
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Your Home Away from <span className="gradient-text">Home</span>!
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We&apos;re more than just a club, we&apos;re a family. Here&apos;s what makes
            TSA special at the University of Ottawa.
          </p>
        </motion.div>

        <motion.div
          variants={showAnimated && !prefersReducedMotion ? containerVariants : undefined}
          initial={showAnimated && !prefersReducedMotion ? "hidden" : "visible"}
          whileInView={showAnimated && !prefersReducedMotion ? "visible" : undefined}
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 md:grid-cols-3"
          suppressHydrationWarning
        >
          {features.map((feature) => {
        
            return (
              <motion.div
                key={feature.title}
                variants={showAnimated && !prefersReducedMotion ? itemVariants : undefined}
                initial={showAnimated && !prefersReducedMotion ? "hidden" : "visible"}
                suppressHydrationWarning
              >
                <Card className="feature-card h-full border-none glass-effect shadow-soft transition-all hover:shadow-soft-lg hover:-translate-y-1 card-hover transform-gpu floating-3d" style={{ transformStyle: "preserve-3d" }}>
                  <CardContent className="p-6 md:p-8">
                   
                    <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}