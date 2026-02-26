"use client";

import dynamic from "next/dynamic";
import { HeroScrollSequence } from "./hero-scroll-sequence";

// Client Component wrapper to allow ssr: false
const DynamicHeroScrollSequence = dynamic(
  () => Promise.resolve(HeroScrollSequence),
  { 
    ssr: false,
    loading: () => (
      <section className="relative h-[500vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-br from-brand-blue/5 via-white to-brand-blue/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-px w-40 bg-white/10 rounded-full" />
          </div>
        </div>
      </section>
    )
  }
);

// Export a functional component that renders the dynamically imported component
export default function HeroScrollSequenceWrapper() {
  return <DynamicHeroScrollSequence />;
}
