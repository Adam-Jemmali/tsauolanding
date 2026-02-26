"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Marquee } from "@/components/shared/marquee";
import { EventModal } from "@/components/shared/event-modal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const featuredEvent = {
  id: 0,
  title: "Iftar Event",
  tag: "Signature Event",
  date: "March 2026",
  description:
    "A fully  iftar event ",
  image: "/events/iftar.png",
  location: "La Buena Gatineau ",
  time: "5:30 PM - 10:00 PM",
  capacity: 40,
  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdnCJNdSZxBA74emg3HeyzMWIHvdGdMGAT_fUBfMVLo8ZvCCA/viewform?fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnj0UfSxY8eZQAd6ZZinSlU2T1KN0QX5rmK5NJOpwEJvULPj0Ql6hNtmWV_3c_aem_PPGjtF7UWVw6H2i5kYidvA", // Replace with your actual Google Form URL
};

const upcomingEvents = [
  {
    id: 1,
    title: "Independance  Day Gala!",
    date: "March 20 2026",
    description: "Celebrate Tunisian independence day with music, food, and traditional performances.",
    tag: "Cultural",
    image: "/events/meetea.png",
    location: "TBD",
    time: "6:00 PM - 10:00 PM",
    capacity: 100,
    googleFormUrl: "https://forms.gle/YOUR_FORM_ID_HERE", // Replace with your actual Google Form URL
  },
  // {
  //   id: 2,
  //   title: "Networking Mixer",
  //   date: "May 2026",
  //   description: "Connect with professionals and expand your network in a relaxed setting.",
  //   tag: "Career",
  //   image: "/events/upcoming-2.jpg",
  //   location: "Downtown Ottawa",
  //   time: "5:00 PM - 8:00 PM",
  //   capacity: 50,
  // },
];

const pastEvents = [
  {
    id: 1,
    title: "Meet and Tea",
    date: "February 13 2026",
    description: "Kick off the new semester with great food and  better company ! ",
    tag: "Social",
    image: "/events/meetea.png",
    location: "UOttawa Campus DMS ",
    time: "4-7pm",
    capacity: 40,
    googleFormUrl: " ", // Replace with your actual Google Form URL
  },

];


const eventImages = [
 "/events/teapost.png",


];



export function Events() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<typeof featuredEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAnimated, setShowAnimated] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setShowAnimated(true);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion || typeof window === "undefined") return;

    // 3D scroll effect for event cards
    const cards = sectionRef.current.querySelectorAll(".event-card-3d");
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          rotationY: -20,
          opacity: 0,
          z: -100,
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
          delay: index * 0.1,
        }
      );
    });
  }, [activeTab, prefersReducedMotion]);

  const handleEventClick = (event: typeof featuredEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <section ref={sectionRef} id="events" className="section-padding tunisian-pattern relative hypnotic-section perspective-3d">
      {/* Hypnotizing background */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />

      {/* Decorative arch divider */}
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="container mx-auto px-4 relative z-10 transform-3d">
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
            Our <span className="gradient-text">Events</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            From cultural celebrations to career workshops, there&apos;s always
            something exciting happening.
          </p>
        </motion.div>

        {/* Featured Event */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={showAnimated && !prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          whileInView={showAnimated && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
          suppressHydrationWarning
        >
          < Card className="overflow-hidden border-none shadow-soft-lg">
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 md:h-auto">
                <Image
                  src={featuredEvent.image}
                  alt={featuredEvent.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-gradient-to-t md:from-black/30" />
              </div>

              {/* Content before clicking on sign up now */}
              <CardContent className="flex flex-col justify-center p-6 md:p-8 lg:p-12">
                <div className="mb-4 inline-flex items-center gap-2 self-start rounded-full bg-brand-blue/10 px-3 py-1 text-sm font-medium text-brand-blue">

                  {featuredEvent.tag}
                </div>

                <h3 className="mb-4 text-2xl font-bold md:text-3xl">
                  {featuredEvent.title}
                </h3>

                <p className="mb-6 text-muted-foreground">
                  {featuredEvent.description}
                </p>

                <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-blue" />
                    {featuredEvent.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-blue" />
                    {featuredEvent.location}
                  </div>
                </div>

                <Button
                  onClick={() => handleEventClick(featuredEvent)}
                  className="w-fit bg-brand-blue hover:bg-brand-blue-dark text-white cursor-pointer transform transition-all hover:scale-110 hover:shadow-glow"
                >
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Events Tabs */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={showAnimated && !prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          whileInView={showAnimated && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          suppressHydrationWarning
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-4">
              <motion.div
                key={`upcoming-${activeTab}`}
                initial={{ opacity: 1, y: 0 }}
                animate={showAnimated && !prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                exit={showAnimated && !prefersReducedMotion ? { opacity: 0, y: -20 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2"
                suppressHydrationWarning
              >
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                  />
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="past" className="mt-4">
              <motion.div
                key={`past-${activeTab}`}
                initial={{ opacity: 1, y: 0 }}
                animate={showAnimated && !prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                exit={showAnimated && !prefersReducedMotion ? { opacity: 0, y: -20 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2"
                suppressHydrationWarning
              >
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                  />
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Event Gallery Marquee */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={showAnimated && !prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
          whileInView={showAnimated && !prefersReducedMotion ? { opacity: 1 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
          suppressHydrationWarning
        >
          <Marquee images={eventImages} alt="Event gallery" />
        </motion.div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTimeout(() => setSelectedEvent(null), 300);
          }}
          event={selectedEvent}
        />
      )}
    </section>
  );
}

interface EventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    description: string;
    tag: string;
    image: string;
  };
  onClick?: () => void;
}

function EventCard({ event, onClick }: EventCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!cardRef.current || prefersReducedMotion || typeof window === "undefined") return;

    const card = cardRef.current;

    // Continuous subtle 3D rotation
    gsap.to(card, {
      rotationY: 5,
      rotationX: 2,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 8;
      const rotateY = (centerX - x) / 8;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        z: 50,
        transformPerspective: 1000,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <Card
      ref={cardRef}
      onClick={onClick}
      className="event-card-3d group overflow-hidden border-none glass-effect shadow-soft transition-all hover:shadow-soft-lg card-hover cursor-pointer transform-gpu floating-3d"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative h-48">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground">
            {event.tag}
          </span>
        </div>
      </div>
      <CardContent className="p-5">
        <h4 className="mb-2 text-lg font-semibold">{event.title}</h4>
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {event.date}
        </div>
        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
        <Button
          variant="outline"
          className="w-full border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          Sign Up
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}