"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Send, Instagram, Music2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/tsa.uottawa/",
    icon: Instagram,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@tsa.uottawa",
    icon: Music2,
  },
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnimated, setShowAnimated] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setShowAnimated(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent!", {
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="section-padding bg-muted/30 tunisian-pattern relative">
      {/* Decorative arch divider */}
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="container mx-auto px-4 relative z-10">
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
            <span className="gradient-text">Get in Touch</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Have questions about our events, want to collaborate, or just want to say hello? 
            We&apos;d love to hear from you! Reach out to us through the form below or connect with us on social media.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            animate={showAnimated && !prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            whileInView={showAnimated && !prefersReducedMotion ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
            suppressHydrationWarning
          >
            {/* Logo */}
            <div className="mb-8 flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-muted">
                <Image
                  src="/logo.png"
                  alt="TSA Logo - Tunisian Student Association"
                  fill
                  sizes="64px"
                  className="object-contain p-2"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">TSA @ uOttawa</h3>
                <p className="text-sm text-muted-foreground">
                  Building community, together
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mb-8">
              <h4 className="mb-4 font-semibold">Follow Us</h4>
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-soft transition-all hover:shadow-glow hover:-translate-y-1"
                      aria-label={link.name}
                    >
                      <Icon className="h-5 w-5 transition-colors group-hover:text-brand-blue" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Email CTA */}
            <div className="mb-4">
              <h4 className="mb-4 font-semibold">Email Us</h4>
              <a href="mailto:tsa.uottawa.club@gmail.com">
                <Button
                  variant="outline"
                  className="gap-2 border-brand-blue/20 hover:border-brand-blue hover:bg-brand-blue/5"
                >
                  <Mail className="h-4 w-4" />
                  tsa.uottawa.club@gmail.com
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            animate={showAnimated && !prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            whileInView={showAnimated && !prefersReducedMotion ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            suppressHydrationWarning
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ◌
                    </motion.span>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}