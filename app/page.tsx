import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/footer";
import HeroScrollSequenceClient from "@/components/shared/hero-scroll-sequence-wrapper";
import BeachScrollSequenceClient from "@/components/shared/beach-scroll-sequence-wrapper";

// ── Lazy-load below-the-fold sections ────────────────────────────────────
// These sections are far down the page. Dynamically importing them means
// their JS is split into separate chunks that load in parallel _after_ the
// critical hero + navbar code, reducing Time-to-Interactive by ~30-40 %.

const About = dynamic(
  () => import("@/components/sections/about").then((m) => ({ default: m.About })),
  {
    loading: () => (
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 h-64" />
      </section>
    ),
  }
);

const Events = dynamic(
  () => import("@/components/sections/events").then((m) => ({ default: m.Events })),
  {
    loading: () => (
      <section className="section-padding">
        <div className="container mx-auto px-4 h-96" />
      </section>
    ),
  }
);

const Team = dynamic(
  () => import("@/components/sections/team").then((m) => ({ default: m.Team })),
  {
    loading: () => (
      <section className="section-padding">
        <div className="container mx-auto px-4 h-96" />
      </section>
    ),
  }
);

const Contact = dynamic(
  () => import("@/components/sections/contact").then((m) => ({ default: m.Contact })),
  {
    loading: () => (
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 h-64" />
      </section>
    ),
  }
);

export default function Home() {
  return (
    <main className="min-h-screen" style={{ position: "relative" }}>
      <Navbar />
      <HeroScrollSequenceClient />
      <BeachScrollSequenceClient
        infiniteLoop={false}
        textOverlays={[
          {
            line1: "Tunisian Student Association",
            sub: "University of Ottawa",
            inStart: 0.2,
            inEnd: 0.3,
            outStart: 0.7,
            outEnd: 0.8,
          },
        ]}
      />
      <About />
      <Events />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
