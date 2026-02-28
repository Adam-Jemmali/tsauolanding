"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import NextImage from "next/image";
import { Calendar, ArrowRight } from "lucide-react";

const TOTAL_FRAMES = 240;

// Detect connection speed & choose batch size accordingly
function getBatchSize(): number {
  if (typeof navigator === "undefined") return 20;
  const conn = (navigator as any).connection;
  if (!conn) return 20;
  const ect = conn.effectiveType;
  if (ect === "4g") return 30;
  if (ect === "3g") return 10;
  return 6; // 2g / slow-2g
}

// Lower DPR on mobile to save GPU work
function getCanvasDPR(): number {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2);
}

function frameSrc(index: number): string {
  const frameNum = String(index + 1).padStart(3, "0");
  return `/sequence2s/sidibousaid/ezgif-frame-${frameNum}.png`;
}

function getOpacity(
  progress: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number
): number {
  const fadeIn = Math.min(
    Math.max((progress - inStart) / (inEnd - inStart || 0.01), 0),
    1
  );
  const fadeOut = Math.min(
    Math.max((outEnd - progress) / (outEnd - outStart || 0.01), 0),
    1
  );
  return Math.min(fadeIn, fadeOut);
}

export function HeroScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const rafRef = useRef(0);
  const isVisibleRef = useRef(true);
  const prefersReducedMotion = useReducedMotion();
  const lastDrawnFrameRef = useRef(-1);

  // Load images in network-aware batches
  useEffect(() => {
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let mounted = true;
    const BATCH = getBatchSize();

    function onImageReady(i: number) {
      if (!mounted) return;
      if (i === 0 && !ready) setReady(true);
    }

    function loadBatch(start: number, end: number) {
      for (let i = start; i < end && i < TOTAL_FRAMES; i++) {
        const img = new Image();
        // First 10 frames high priority
        if (i < 10) (img as any).fetchPriority = "high";
        img.decoding = "async";
        img.src = frameSrc(i);
        const idx = i;
        img.onload = () => {
          imgs[idx] = img;
          onImageReady(idx);
        };
        img.onerror = () => onImageReady(idx);
      }
    }

    // Load first batch immediately
    loadBatch(0, BATCH);
    imagesRef.current = imgs;

    // Schedule remaining batches — use requestIdleCallback when available
    let batch = 1;
    function scheduleNext() {
      if (!mounted) return;
      const start = batch * BATCH;
      if (start >= TOTAL_FRAMES) return;
      const end = Math.min(start + BATCH, TOTAL_FRAMES);

      const schedule =
        typeof requestIdleCallback !== "undefined"
          ? (cb: () => void) => requestIdleCallback(cb, { timeout: 100 })
          : (cb: () => void) => setTimeout(cb, 30);

      schedule(() => {
        if (!mounted) return;
        loadBatch(start, end);
        batch++;
        scheduleNext();
      });
    }
    scheduleNext();

    return () => {
      mounted = false;
    };
  }, []);

  // Track visibility — pause RAF when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll progress — only setState when text overlays would visibly change
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const scrollable = el.scrollHeight - window.innerHeight;
        const p = Math.min(Math.max(-rect.top / scrollable, 0), 1);
        progressRef.current = p;
        setProgress((prev) => (Math.abs(prev - p) > 0.005 ? p : prev));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dimensions (debounced resize)
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    const update = () =>
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    update();
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(update, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.w === 0) return;
    const dpr = getCanvasDPR();
    canvas.width = dimensions.w * dpr;
    canvas.height = dimensions.h * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    lastDrawnFrameRef.current = -1;
  }, [dimensions]);

  // Draw frame — only redraws when frame index changes, falls back to nearest loaded
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = getCanvasDPR();
    const dw = canvas.width / dpr;
    const dh = canvas.height / dpr;
    if (dw === 0 || dh === 0) return;

    const idx = Math.min(
      Math.floor(progressRef.current * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1
    );

    if (idx === lastDrawnFrameRef.current) return;

    let img = imagesRef.current[idx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let j = idx - 1; j >= 0; j--) {
        const fallback = imagesRef.current[j];
        if (fallback && fallback.complete && fallback.naturalWidth > 0) {
          img = fallback;
          break;
        }
      }
    }

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, dw, dh);
      const scale = Math.max(dw / img.naturalWidth, dh / img.naturalHeight);
      const sw = img.naturalWidth * scale;
      const sh = img.naturalHeight * scale;
      ctx.drawImage(img, (dw - sw) / 2, (dh - sh) / 2, sw, sh);
      lastDrawnFrameRef.current = idx;
    }
  }, []);

  // RAF loop — only runs when visible
  useEffect(() => {
    let active = true;
    const loop = () => {
      if (!active) return;
      if (isVisibleRef.current) {
        drawFrame();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  // Text overlay opacities
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
      style={{ position: "relative" }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-br from-brand-blue/5 via-white to-brand-blue/10"
        style={{ willChange: "transform" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            width: dimensions.w,
            height: dimensions.h,
            willChange: "contents",
          }}
        />

        {/* Fallback */}
        {(!ready || dimensions.w === 0) && (
          <div className="absolute inset-0 z-0">
            <NextImage
              src={frameSrc(0)}
              alt="Tunisian Student Association"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              {eventBadgeOpacity > 0 && (
                <div
                  className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-brand-blue shadow-soft"
                  style={{ opacity: eventBadgeOpacity }}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Iftar Event March 1 2026</span>
                </div>
              )}

              {titleOpacity > 0 && (
                <h1
                  className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                  style={{ opacity: titleOpacity }}
                >
                  <span className="text-foreground">Tunisian Student</span>
                  <br />
                  <span className="text-brand-blue">Association</span>
                </h1>
              )}

              {subtitleOpacity > 0 && (
                <p
                  className="mb-6 text-xl font-semibold text-brand-blue md:text-2xl"
                  style={{ opacity: subtitleOpacity }}
                >
                  University of Ottawa
                </p>
              )}

              {descriptionOpacity > 0 && (
                <p
                  className="mb-8 text-muted-foreground text-white text-base md:text-lg leading-relaxed"
                  style={{ opacity: descriptionOpacity }}
                >
                  Celebrating Tunisian culture, building community, and creating
                  lasting connections at uOttawa. Open to all students who want
                  to experience our vibrant culture and traditions.
                </p>
              )}

              {buttonsOpacity > 0 && (
                <div
                  className="flex flex-col gap-4 sm:flex-row"
                  style={{ opacity: buttonsOpacity }}
                >
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-blue-dark shadow-soft"
                  >
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#events"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-brand-blue/30 bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-brand-blue transition-colors duration-200 hover:border-brand-blue hover:bg-brand-blue/5 shadow-soft"
                  >
                    View Events
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        {progress < 0.04 && ready && !prefersReducedMotion && (
          <div className="absolute inset-x-0 bottom-12 z-10 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
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
