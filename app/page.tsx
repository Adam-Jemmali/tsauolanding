import { Navbar } from "@/components/layout/navbar";
import { About } from "@/components/sections/about";
import { Events } from "@/components/sections/events";
import { Team } from "@/components/sections/team";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import { GSAPScrollEffects } from "@/components/shared/gsap-scroll";
import { HypnoticScroll } from "@/components/shared/hypnotic-scroll";
import { MorphingShapes } from "@/components/shared/morphing-shapes";
import BeachScrollSequenceClient from "@/components/shared/beach-scroll-sequence-wrapper";
import HeroScrollSequenceClient from "@/components/shared/hero-scroll-sequence-wrapper";
import SmoothScroll from "@/components/shared/smooth-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen perspective-3d" style={{ position: 'relative' }}>
        <MorphingShapes />
        <GSAPScrollEffects />
        <HypnoticScroll />
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
    </SmoothScroll>
  );
}