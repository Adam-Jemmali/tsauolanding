import { Navbar } from "@/components/layout/navbar";
import { About } from "@/components/sections/about";
import { Events } from "@/components/sections/events";
import { Team } from "@/components/sections/team";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import HeroScrollSequenceClient from "@/components/shared/hero-scroll-sequence-wrapper";
import BeachScrollSequenceClient from "@/components/shared/beach-scroll-sequence-wrapper";

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
