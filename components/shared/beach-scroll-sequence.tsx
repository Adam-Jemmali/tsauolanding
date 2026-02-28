"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import NextImage from "next/image";

const TOTAL_FRAMES = 120;

function getBatchSize(): number {
  if (typeof navigator === "undefined") return 20;
  const conn = (navigator as any).connection;
  if (!conn) return 20;
  const ect = conn.effectiveType;
  if (ect === "4g") return 30;
  if (ect === "3g") return 10;
  return 6;
}

function getCanvasDPR(): number {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2);
}

function frameSrc(index: number): string {
  const frameNum = String(index + 1).padStart(3, "0");
  return `/seq-beach/frame-${frameNum}.webp`;
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
  const [ready, setReady] = useState(false);
  const rafRef = useRef(0);
  const isVisibleRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const lastDrawnFrameRef = useRef(-1);
  const startedLoadingRef = useRef(false);

  // Observe container — start loading when within 1 screen of viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || startedLoadingRef.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedLoadingRef.current) {
          startedLoadingRef.current = true;
          loadImages();
          obs.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function loadImages() {
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    const BATCH = getBatchSize();

    function onImageReady(i: number) {
      if (i === 0) setReady(true);
    }

    function loadBatch(start: number, end: number) {
      for (let i = start; i < end && i < TOTAL_FRAMES; i++) {
        const img = new Image();
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

    loadBatch(0, BATCH);
    imagesRef.current = imgs;

    let batch = 1;
    function scheduleNext() {
      const start = batch * BATCH;
      if (start >= TOTAL_FRAMES) return;
      const end = Math.min(start + BATCH, TOTAL_FRAMES);

      const schedule =
        typeof requestIdleCallback !== "undefined"
          ? (cb: () => void) => requestIdleCallback(cb, { timeout: 100 })
          : (cb: () => void) => setTimeout(cb, 30);

      schedule(() => {
        loadBatch(start, end);
        batch++;
        scheduleNext();
      });
    }
    scheduleNext();
  }

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

  // Scroll progress — throttled to rAF
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

  // Dimensions (debounced)
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

  // Draw frame — falls back to nearest loaded
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = getCanvasDPR();
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
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-black"
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
