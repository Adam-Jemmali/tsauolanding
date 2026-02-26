"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Clock, Users, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: number;
    title: string;
    date: string;
    description: string;
    tag: string;
    image: string;
    location?: string;
    time?: string;
    capacity?: number;
    googleFormUrl?: string;
  };
}

export function EventModal({ isOpen, onClose, event }: EventModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Default Google Form URL - you can customize this per event
  const googleFormUrl = event.googleFormUrl || "https://docs.google.com/forms/d/e/1FAIpQLSdnCJNdSZxBA74emg3HeyzMWIHvdGdMGAT_fUBfMVLo8ZvCCA/viewform?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnj0UfSxY8eZQAd6ZZinSlU2T1KN0QX5rmK5NJOpwEJvULPj0Ql6hNtmWV_3c_aem_PPGjtF7UWVw6H2i5kYidvA";

  useEffect(() => {
    if (isOpen && modalRef.current && bubbleRef.current) {
      // Crazy entrance animation with GSAP
      gsap.fromTo(
        bubbleRef.current,
        {
          scale: 0,
          rotation: -180,
          opacity: 0,
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        }
      );

      // Floating animation
      gsap.to(bubbleRef.current, {
        y: "+=10",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Magnetic effect on mouse move
      const handleMouseMove = (e: MouseEvent) => {
        if (!bubbleRef.current) return;
        const rect = bubbleRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(bubbleRef.current, {
          x: x * 0.1,
          y: y * 0.1,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        if (!bubbleRef.current) return;
        gsap.to(bubbleRef.current, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      bubbleRef.current.addEventListener("mousemove", handleMouseMove);
      bubbleRef.current.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        bubbleRef.current?.removeEventListener("mousemove", handleMouseMove);
        bubbleRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [isOpen]);


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Bubble */}
          <div
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              ref={bubbleRef}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl pointer-events-auto"
            >
              <div className="relative overflow-hidden rounded-3xl bg-background shadow-2xl border-2 border-brand-blue/20">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 rounded-full bg-brand-blue/10 p-2 text-brand-blue transition-all hover:bg-brand-blue hover:text-white hover:rotate-90"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="grid md:grid-cols-2">
                  {/* Image Side */}
                  <div className="relative h-64 md:h-auto min-h-[300px]">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="mb-2 inline-block rounded-full bg-brand-blue px-3 py-1 text-xs font-medium">
                        {event.tag}
                      </span>
                      <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        )}
                        {event.capacity && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {event.capacity} spots
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sign Up Side */}
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-2">Sign Up for This Event</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {event.description}
                      </p>
                    </div>

                    <a
                      href={googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                    >
                      <Button
                        className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white text-lg py-6"
                      >
                        <span className="flex items-center gap-2">
                          Sign Up for Event
                          <ExternalLink className="h-5 w-5" />
                        </span>
                      </Button>
                    </a>

                    <p className="mt-4 text-xs text-center text-muted-foreground">
                      You&apos;ll be redirected to our Google Form to complete your registration
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
