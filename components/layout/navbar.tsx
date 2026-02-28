"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollProgress } from "@/components/shared/scroll-progress";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setIsScrolled(window.scrollY > 20);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  const handleNavClick = (href: string) => {
    if (typeof window === "undefined") return;

    // Close mobile menu immediately
    setIsMobileMenuOpen(false);

    // Delay scroll slightly so the menu close doesn't fight the scroll on mobile
    // Without this, mobile browsers treat the first tap as "close menu" and require a second tap
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 10);
  };

  return (
    <>
      <ScrollProgress />
      <motion.header
        initial={false}
        animate={isMounted && !prefersReducedMotion ? { y: 0 } : {}}
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${isScrolled
          ? "navbar-backdrop border-b border-border/50"
          : "bg-transparent"
          }`}
        suppressHydrationWarning
      >
        <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 text-xl font-bold"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-lg">
              <Image
                src="/logo.png"
                alt="TSA - Tunisian Student Association Logo"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <span className="hidden sm:inline text-brand-blue">
              TSA @ uOttawa
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-black transition-colors hover:text-blue-500"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              type="button"
              onClick={() => handleNavClick("#contact")}
              className="bg-brand-blue hover:bg-brand-blue-dark text-white transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Contact Us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 transition-colors hover:bg-muted md:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, height: 0 }
              }
              animate={{ opacity: 1, height: "auto" }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, height: 0 }
              }
              transition={{ duration: 0.2 }}
              className="border-b border-border/50 bg-background/95 backdrop-blur-lg md:hidden"
            >
              <div className="container mx-auto flex flex-col gap-4 px-4 py-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="text-left text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    style={{ touchAction: "manipulation" }}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#contact");
                  }}
                  className="mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium bg-brand-blue hover:bg-brand-blue-dark text-white h-10 px-4 py-2"
                  style={{ touchAction: "manipulation" }}
                >
                  Contact Us
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
