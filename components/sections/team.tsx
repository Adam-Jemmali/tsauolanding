"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

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
    bio: " The 2 smooth operators of the club",
    image: "/team/vps.png",
  },
  {
    name: "Ludovic Lachance & Yasmine Trigui",
    role: "VP Finance",
    bio: "The two musketeers of finance",
    image: "/team/vp finance.png",
  },
  {
    name: "Sabrina Temini & Aicha Ben Miled",
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
    name: "Nour G-Mekki & Nour Benfekih",
    role: "VP Social Media",
    bio: "same name , same mission",
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export function Team() {
  const prefersReducedMotion = useReducedMotion();
  const [showAnimated, setShowAnimated] = useState(false);

  useEffect(() => {
    setShowAnimated(true);
  }, []);

  return (
    <section id="team" className="section-padding tunisian-tile relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
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
            Meet Our <span className="gradient-text">Team</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We&apos;re students building a home away from Tunisia. Whether you&apos;re Tunisian or just curious about our culture,
            come say hi at our events !
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          variants={showAnimated && !prefersReducedMotion ? containerVariants : undefined}
          initial={showAnimated && !prefersReducedMotion ? "hidden" : "visible"}
          whileInView={showAnimated && !prefersReducedMotion ? "visible" : undefined}
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          suppressHydrationWarning
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={showAnimated && !prefersReducedMotion ? itemVariants : undefined}
              initial={showAnimated && !prefersReducedMotion ? "hidden" : "visible"}
              suppressHydrationWarning
            >
              <TeamCard member={member} />
            </motion.div>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 1 }}
          animate={showAnimated && !prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
          whileInView={showAnimated && !prefersReducedMotion ? { opacity: 1 } : undefined}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center text-lg text-muted-foreground"
          suppressHydrationWarning
        >
           Got any questions or ideas?{" "}
          <a
            href="#contact"
            className="font-medium text-brand-blue hover:underline"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Reach out to us !
          </a>
        </motion.p>
      </div>
    </section>
  );
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

function TeamCard({ member }: { member: TeamMember }) {
  const prefersReducedMotion = useReducedMotion();
  const [showAnimated, setShowAnimated] = useState(false);

  useEffect(() => {
    setShowAnimated(true);
  }, []);

  return (
    <Card className="group relative overflow-hidden border-none shadow-soft transition-all hover:shadow-soft-lg card-hover">
      {/* Spotlight effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity group-hover:opacity-100"
        style={
          showAnimated && !prefersReducedMotion
            ? {
                background:
                  "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 102, 204, 0.1) 0%, transparent 50%)",
              }
            : {}
        }
        onMouseMove={(e) => {
          if (prefersReducedMotion || !showAnimated) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
          e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
        }}
        suppressHydrationWarning
      />

      <CardContent className="p-0">
        {/* Image */}
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="text-lg font-semibold">{member.name}</h3>
          <p className="mb-2 text-sm font-medium text-brand-blue">{member.role}</p>
          <p className="text-sm text-muted-foreground">{member.bio}</p>
        </div>
      </CardContent>
    </Card>
  );
}