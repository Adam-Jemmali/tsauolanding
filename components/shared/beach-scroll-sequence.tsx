"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import NextImage from "next/image";

const TOTAL_FRAMES = 240;
const BATCH_SIZE = 20;

function frameSrc(index: number): string {
  const frameNum = String(index + 1).padStart(3, "0");
  return `/sequence/beach/ezgif-frame-${frameNum}.png`;
}

interface TextOverlay {
  line1?: string;
  sub?: string;
  cta?: string;
  inStart: number;
  inEnd: number;
  outStart: number;
  outEnd: number;
}

interface BeachScrollSequenceProps {
  infiniteLoop?: boolean;
  textOverlays?: TextOverlay[];
  className?: string;
  id?: string;
}

function getOverlayOpacity(progress: number, o: TextOverlay): number {
  const fadeIn = Math.min(
    Math.max((progress - o.inStart) / (o.inEnd - o.inStart || 0.01), 0),
    1
  );
  const fadeOut = Math.min(
    Math.max((o.outEnd - progress) / (o.outEnd - o.outStart || 0.01), 0),
    1
  );
  return Math.min(fadeIn, fadeOut);
}

export function BeachScrollSequence({
  infiniteLoop = false,
  textOverlays = [],
  className = "",
  id,
}: BeachScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const loadedCountRef = useRef(0);
  const [ready, setReady] = useState(false);
  const rafRef = useRef(0);
  const isVisibleRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const lastDrawnFrameRef = useRef(-1);

  // Load images in batches
  useEffect(() => {
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let mounted = true;
    loadedCountRef.current = 0;

    function onImageReady() {
      if (!mounted) return;
      loadedCountRef.current++;
      if (loadedCountRef.current >= TOTAL_FRAMES) {
        setReady(true);
      }
    }

    function loadBatch(start: number, end: number) {
      for (let i = start; i < end && i < TOTAL_FRAMES; i++) {
        const img = new Image();
        if (i < 5) (img as any).fetchPriority = "high";
        img.src = frameSrc(i);
        img.onload = () => {
          imgs[i] = img;
          onImageReady();
        };
        img.onerror = onImageReady;
      }
    }

    loadBatch(0, BATCH_SIZE);
    imagesRef.current = imgs;

    let batch = 1;
    function scheduleNext() {
      if (!mounted) return;
      const start = batch * BATCH_SIZE;
      if (start >= TOTAL_FRAMES) return;
      const end = Math.min(start + BATCH_SIZE, TOTAL_FRAMES);
      setTimeout(() => {
        loadBatch(start, end);
        batch++;
        scheduleNext();
      }, 50);
    }
    scheduleNext();

    return () => {
      mounted = false;
    };
  }, []);

  // Track visibility
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

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.scrollHeight - window.innerHeight;
      const p = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      progressRef.current = p;
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dimensions
  useEffect(() => {
    const update = () =>
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.w === 0) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = dimensions.w * dpr;
    canvas.height = dimensions.h * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    lastDrawnFrameRef.current = -1;
  }, [dimensions]);

  // Draw frame
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const dw = canvas.width / dpr;
    const dh = canvas.height / dpr;
    if (dw === 0 || dh === 0) return;

    const effectiveProgress = infiniteLoop
      ? progressRef.current % 1
      : progressRef.current;
    const idx = Math.min(
      Math.floor(effectiveProgress * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1
    );

    if (idx === lastDrawnFrameRef.current) return;

    const img = imagesRef.current[idx];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, dw, dh);
      const scale = Math.max(dw / img.naturalWidth, dh / img.naturalHeight);
      const sw = img.naturalWidth * scale;
      const sh = img.naturalHeight * scale;
      ctx.drawImage(img, (dw - sw) / 2, (dh - sh) / 2, sw, sh);
      lastDrawnFrameRef.current = idx;
    }
  }, [infiniteLoop]);

  // RAF loop — only when visible
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

  return (
    <section
      ref={containerRef}
      className={`relative h-[500vh] ${className}`}
      id={id}
      style={{ position: "relative" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ width: dimensions.w, height: dimensions.h }}
        />

        {/* Fallback */}
        {(!ready || dimensions.w === 0) && (
          <div className="absolute inset-0 z-0">
            <NextImage
              src={frameSrc(0)}
              alt="Beach scene"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {/* Text overlays */}
        {textOverlays.map((overlay, i) => {
          const opacity = getOverlayOpacity(progress, overlay);
          if (opacity <= 0) return null;

          return (
            <div
              key={i}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
              style={{ opacity }}
            >
              {overlay.line1 && (
                <h1
                  className="text-center font-bold leading-[0.88] text-white"
                  style={{
                    fontSize: "clamp(3rem, 12vw, 10rem)",
                    letterSpacing: "0.08em",
                    textShadow:
                      "0 4px 60px rgba(0, 0, 0, 0.8), 0 2px 12px rgba(0, 0, 0, 0.6)",
                  }}
                >
                  {overlay.line1}
                </h1>
              )}
              {overlay.sub && (
                <p
                  className="mt-6 text-center text-xl font-medium tracking-[0.12em] text-white md:text-3xl"
                  style={{
                    textShadow: "0 2px 30px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  {overlay.sub}
                </p>
              )}
              {overlay.cta && (
                <a
                  href="#contact"
                  className="mt-12 border border-white/30 px-14 py-4 text-[11px] font-semibold tracking-[0.4em] uppercase text-white transition-colors duration-300 hover:bg-white hover:text-brand-blue"
                >
                  {overlay.cta}
                </a>
              )}
            </div>
          );
        })}

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
              <span className="text-[9px] font-semibold tracking-[0.5em] uppercase text-white/40">
                Scroll
              </span>
              <div className="h-7 w-px bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
