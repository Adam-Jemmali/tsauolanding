"use client";

import dynamic from "next/dynamic";

// Client Component wrapper to allow ssr: false
// In Next.js 16, ssr: false can only be used in Client Components
const BeachScrollSequenceClient = dynamic(
  () => import("./beach-scroll-sequence").then((mod) => ({ default: mod.BeachScrollSequence })),
  { 
    ssr: false,
    loading: () => (
      <section className="relative h-[500vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-px w-40 bg-white/10 rounded-full" />
          </div>
        </div>
      </section>
    )
  }
);

export default BeachScrollSequenceClient;
