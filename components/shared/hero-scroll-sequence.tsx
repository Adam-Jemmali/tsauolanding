"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import NextImage from "next/image";
import { Calendar, ArrowRight } from "lucide-react";

const FRAME_START = 1;
const FRAME_END = 240;
const TOTAL_FRAMES = FRAME_END - FRAME_START + 1;

function frameSrc(index: number): string {
  const frameNum = String(index + 1).padStart(3, "0");
  return `/sequence2/sidibousaid/ezgif-frame-${frameNum}.png`;
}

function getOpacity(progress: number, inStart: number, inEnd: number, outStart: number, outEnd: number): number {
  const fadeIn = Math.min(
    Math.max((progress - inStart) / ((inEnd - inStart) || 0.01), 0),
    1
  );
  const fadeOut = Math.min(
    Math.max((outEnd - progress) / ((outEnd - outStart) || 0.01), 0),
    1
  );
  return Math.min(fadeIn, fadeOut);
}

export function HeroScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const loadedCountRef = useRef(0);
  const [loadPercent, setLoadPercent] = useState(0);
  const [ready, setReady] = useState(false);
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  // Load images - optimized for production (batched loading)
  useEffect(() => {
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let mounted = true;
    loadedCountRef.current = 0;
    const BATCH_SIZE = 20; // Load 20 images at a time
    let currentBatch = 0;

    const loadBatch = (startIndex: number, endIndex: number) => {
      for (let i = startIndex; i < endIndex && i < TOTAL_FRAMES; i++) {
        const img = new Image();
        // Set fetchpriority for critical frames (first batch)
        if (startIndex === 0 && i < 10) {
          (img as any).fetchPriority = 'high';
        }
        img.src = frameSrc(i);
        
        img.onload = () => {
          if (!mounted) return;
          imgs[i] = img;
          loadedCountRef.current++;
          setLoadPercent(Math.round((loadedCountRef.current / TOTAL_FRAMES) * 100));
          if (loadedCountRef.current >= TOTAL_FRAMES) {
            setReady(true);
          }
        };
        
        img.onerror = () => {
          if (!mounted) return;
          // Still count as loaded to prevent hanging
          loadedCountRef.current++;
          setLoadPercent(Math.round((loadedCountRef.current / TOTAL_FRAMES) * 100));
          if (loadedCountRef.current >= TOTAL_FRAMES) {
            setReady(true);
          }
        };
      }
    };

    // Load first batch immediately (critical frames)
    loadBatch(0, Math.min(BATCH_SIZE, TOTAL_FRAMES));
    imagesRef.current = imgs;

    // Load remaining batches with slight delay to avoid overwhelming the network
    const loadNextBatch = () => {
      if (!mounted) return;
      currentBatch++;
      const startIndex = currentBatch * BATCH_SIZE;
      const endIndex = Math.min(startIndex + BATCH_SIZE, TOTAL_FRAMES);
      
      if (startIndex < TOTAL_FRAMES) {
        // Use requestIdleCallback if available, otherwise setTimeout
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          requestIdleCallback(() => loadBatch(startIndex, endIndex), { timeout: 100 });
        } else {
          setTimeout(() => loadBatch(startIndex, endIndex), 50);
        }
        loadNextBatch();
      }
    };

    // Start loading next batches after a short delay
    setTimeout(() => {
      if (mounted) loadNextBatch();
    }, 100);

    return () => {
      mounted = false;
    };
  }, []);

  // Scroll progress calculation - match UI inspo pattern
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollable = containerRef.current.scrollHeight - window.innerHeight;
      setProgress(Math.min(Math.max(-rect.top / scrollable, 0), 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Canvas dimensions - match UI inspo pattern
  useEffect(() => {
    const update = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Canvas setup - match UI inspo pattern
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = dimensions.w * dpr;
    canvas.height = dimensions.h * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, [dimensions]);

  // Draw frame - simplified to match UI inspo pattern
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const dw = canvas.width / dpr;
    const dh = canvas.height / dpr;

    if (dw === 0 || dh === 0) return;

    const idx = Math.min(Math.floor(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
    const img = imagesRef.current[idx];

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, dw, dh);
      const scale = Math.max(dw / img.naturalWidth, dh / img.naturalHeight);
      const sw = img.naturalWidth * scale;
      const sh = img.naturalHeight * scale;
      ctx.drawImage(img, (dw - sw) / 2, (dh - sh) / 2, sw, sh);
    }
  }, [progress]);

  // RAF loop - match UI inspo pattern
  useEffect(() => {
    const loop = () => {
      drawFrame();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFrame]);

  // Text overlay opacity calculations
  const eventBadgeOpacity = getOpacity(progress, 0.1, 0.2, 0.4, 0.5);
  const titleOpacity = getOpacity(progress, 0.15, 0.25, 0.5, 0.6);
  const subtitleOpacity = getOpacity(progress, 0.2, 0.3, 0.55, 0.65);
  const descriptionOpacity = getOpacity(progress, 0.25, 0.35, 0.6, 0.7);
  const buttonsOpacity = getOpacity(progress, 0.3, 0.4, 0.65, 0.75);

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh]"
      id="hero"
      suppressHydrationWarning
      style={{ position: 'relative' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-br from-brand-blue/5 via-white to-brand-blue/10">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ width: dimensions.w, height: dimensions.h }}
        />

        {/* Loading state */}
        {!ready && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-gradient-to-br from-brand-blue/5 via-white to-brand-blue/10">
            <div className="relative h-px w-40 overflow-hidden bg-white/10 rounded-full">
              <div
                className="absolute inset-y-0 left-0 bg-brand-blue transition-all duration-300"
                style={{ width: `${loadPercent}%` }}
              />
            </div>
            <span className="mt-5 text-[10px] font-medium tabular-nums tracking-[0.5em] text-brand-blue/60">
              {loadPercent}%
            </span>
          </div>
        )}

        {/* Fallback image - only show when canvas is not ready */}
        {(!ready || dimensions.w === 0) && (
          <div className="absolute inset-0 z-0">
            <NextImage
              src={frameSrc(0)}
              alt="Tunisian Student Association"
              fill
              className="object-cover"
              sizes="100vw"
              priority
              suppressHydrationWarning
            />
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              {/* Event Badge */}
              {eventBadgeOpacity > 0 && (
                <motion.div
                  initial={false}
                  animate={{ opacity: eventBadgeOpacity }}
                  className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-brand-blue shadow-soft"
                  suppressHydrationWarning
                >
                  <Calendar className="h-4 w-4" />
                  <span>Iftar Event March 1 2026</span>
                </motion.div>
              )}

              {/* Main Title */}
              {titleOpacity > 0 && (
                <motion.h1
                  initial={false}
                  animate={{ opacity: titleOpacity }}
                  className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                  suppressHydrationWarning
                >
                  <span className="text-foreground">Tunisian Student</span>
                  <br />
                  <span className="text-brand-blue">Association</span>
                </motion.h1>
              )}

              {/* Subtitle */}
              {subtitleOpacity > 0 && (
                <motion.p
                  initial={false}
                  animate={{ opacity: subtitleOpacity }}
                  className="mb-6 text-xl font-semibold text-brand-blue md:text-2xl"
                  suppressHydrationWarning
                >
                  University of Ottawa
                </motion.p>
              )}

              {/* Description */}
              {descriptionOpacity > 0 && (
                <motion.p
                  initial={false}
                  animate={{ opacity: descriptionOpacity }}
                  className="mb-8 text-muted-foreground text-base md:text-lg leading-relaxed"
                  suppressHydrationWarning
                >
                  Celebrating Tunisian culture, building community, and creating lasting connections at uOttawa. Open to all students who want to experience our vibrant culture and traditions.
                </motion.p>
              )}

              {/* Buttons */}
              {buttonsOpacity > 0 && (
                <motion.div
                  initial={false}
                  animate={{ opacity: buttonsOpacity }}
                  className="flex flex-col gap-4 sm:flex-row"
                  suppressHydrationWarning
                >
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-blue-dark shadow-soft"
                  >
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </motion.a>
                  <motion.a
                    href="#events"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-brand-blue/30 bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-brand-blue transition-all duration-300 hover:border-brand-blue hover:bg-brand-blue/5 shadow-soft"
                  >
                    View Events
                  </motion.a>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        {progress < 0.04 && ready && !prefersReducedMotion && (
          <div className="absolute inset-x-0 bottom-12 z-10 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-[9px] font-semibold tracking-[0.5em] uppercase text-brand-blue/40">
                Scroll
              </span>
              <div className="h-7 w-px bg-gradient-to-b from-brand-blue/40 to-transparent" />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
