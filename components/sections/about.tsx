"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Community & Culture",
    description:
      "Connect with students from all backgrounds, celebrate Tunisian heritage, and build lifelong friendships in a welcoming, inclusive environment.",
  },
  {
    title: "Personal Growth",
    description:
      "Access networking opportunities, funny and interactive event and workshops. Open to all students looking to grow.",
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
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function About() {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shouldAnimate = isMounted && !prefersReducedMotion;

  return (
    <section id="about" className="section-padding bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
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
          variants={shouldAnimate ? containerVariants : undefined}
          initial={shouldAnimate ? "hidden" : "visible"}
          whileInView={shouldAnimate ? "visible" : undefined}
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 md:grid-cols-3"
          suppressHydrationWarning
        >
          {features.map((feature) => (
              <motion.div
                key={feature.title}
              variants={shouldAnimate ? itemVariants : undefined}
              initial={shouldAnimate ? "hidden" : "visible"}
              suppressHydrationWarning
              >
              <Card className="h-full border-none shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
