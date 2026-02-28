"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Marquee } from "@/components/shared/marquee";
import { EventModal } from "@/components/shared/event-modal";

const featuredEvent = {
  id: 0,
  title: "Iftar Event",
  tag: "Signature Event",
  date: "March 2026",
  description: "A fully iftar event",
  image: "/events/iftar.png",
  location: "La Buena Gatineau",
  time: "5:30 PM - 10:00 PM",
  capacity: 40,
  googleFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSdnCJNdSZxBA74emg3HeyzMWIHvdGdMGAT_fUBfMVLo8ZvCCA/viewform?fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnj0UfSxY8eZQAd6ZZinSlU2T1KN0QX5rmK5NJOpwEJvULPj0Ql6hNtmWV_3c_aem_PPGjtF7UWVw6H2i5kYidvA",
};

const upcomingEvents = [
  {
    id: 1,
    title: "Independance Day Gala!",
    date: "March 20 2026",
    description:
      "Celebrate Tunisian independence day with music, food, and traditional performances.",
    tag: "Cultural",
    image: "/events/meetea.png",
    location: "TBD",
    time: "6:00 PM - 10:00 PM",
    capacity: 100,
    googleFormUrl: "https://forms.gle/YOUR_FORM_ID_HERE",
  },
];

const pastEvents = [
  {
    id: 1,
    title: "Meet and Tea",
    date: "February 13 2026",
    description:
      "Kick off the new semester with great food and better company!",
    tag: "Social",
    image: "/events/meetea.png",
    location: "UOttawa Campus DMS",
    time: "4-7pm",
    capacity: 40,
    googleFormUrl: " ",
  },
];

const eventImages = ["/events/teapost.png"];

export function Events() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<
    typeof featuredEvent | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shouldAnimate = isMounted && !prefersReducedMotion;

  const handleEventClick = (event: typeof featuredEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <section id="events" className="section-padding relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
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
          whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-16"
          suppressHydrationWarning
        >
          <Card className="overflow-hidden border-none shadow-soft-lg">
            <div className="grid md:grid-cols-2">
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
                  className="w-fit bg-brand-blue hover:bg-brand-blue-dark text-white cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
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
          whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          suppressHydrationWarning
        >
          {isMounted && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
            <TabsList className="mb-8 grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

              <TabsContent value="upcoming" className="mt-4">
                <div className="grid gap-6 md:grid-cols-2">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => handleEventClick(event)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="past" className="mt-4">
                <div className="grid gap-6 md:grid-cols-2">
                  {pastEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => handleEventClick(event)}
                    />
                  ))}
                </div>
              </TabsContent>
          </Tabs>
          )}
        </motion.div>

        {/* Event Gallery Marquee */}
        <div className="mt-16">
          <Marquee images={eventImages} alt="Event gallery" />
        </div>
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
  return (
    <Card
      onClick={onClick}
      className="group overflow-hidden border-none shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 cursor-pointer"
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
        <p className="text-sm text-muted-foreground mb-4">
          {event.description}
        </p>
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
