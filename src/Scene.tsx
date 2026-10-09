import React, { useState } from "react";
import "./styles/luxe.css";
import { CinematicWorld, CustomizerState } from "./components/3d/CinematicWorld";
import { Navigation } from "./components/Navigation";
import { HeroScene } from "./components/scenes/HeroScene";
import { ArtOfGiftingScene } from "./components/scenes/ArtOfGiftingScene";
import { CollectionsScene } from "./components/scenes/CollectionsScene";
import { BespokeScene } from "./components/scenes/BespokeScene";
import { OccasionsScene } from "./components/scenes/OccasionsScene";
import { BrandStatementScene } from "./components/scenes/BrandStatementScene";
import { Footer } from "./components/Footer";
import { EnquiryDrawer } from "./components/EnquiryDrawer";

export function Scene() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [initialOccasion, setInitialOccasion] = useState<string>("Wedding & Trousseau");
  const [customizerState, setCustomizerState] = useState<CustomizerState>({
    boxColor: "#3B172D",
    ribbonColor: "#D6B77A",
    monogramText: "Ni²",
  });

  const handleOpenEnquiry = (occasionOrDetails?: string) => {
    if (occasionOrDetails) {
      setInitialOccasion(occasionOrDetails);
    }
    setEnquiryOpen(true);
  };

  const handleCloseEnquiry = () => {
    setEnquiryOpen(false);
  };

  return (
    <div className="luxe-app">
      {/* Persistent Full-Page Cinematic 3D WebGL World */}
      <CinematicWorld customizerState={customizerState} />

      {/* Navigation Bar */}
      <Navigation onOpenEnquiry={handleOpenEnquiry} />

      {/* Main Choreographed Scroll Journey Layered Over 3D World */}
      <main id="main-content" style={{ position: "relative", zIndex: 10 }}>
        {/* Scene 1 — The Reveal Hero */}
        <HeroScene onOpenEnquiry={() => handleOpenEnquiry("Custom Luxury Gift Box")} />

        {/* Scene 2 — The Art of Gifting Atelier & Philosophy */}
        <ArtOfGiftingScene />

        {/* Scene 3 — Discover Our 4 Curated Collections */}
        <CollectionsScene onOpenEnquiry={handleOpenEnquiry} />

        {/* Scene 4 — Bespoke Packaging Atelier & Interactive Configurator */}
        <BespokeScene
          onOpenEnquiry={handleOpenEnquiry}
          onCustomizerChange={setCustomizerState}
        />

        {/* Scene 5 — Gifting for Every Occasion */}
        <OccasionsScene onOpenEnquiry={handleOpenEnquiry} />

        {/* Scene 6 — The Brand Statement & Founders Direct Connect */}
        <BrandStatementScene onOpenEnquiry={() => handleOpenEnquiry("Bespoke Celebration Hamper")} />
      </main>

      {/* Luxury Footer */}
      <Footer onOpenEnquiry={() => handleOpenEnquiry("General Inquiry")} />

      {/* Direct Interactive WhatsApp Enquiry Drawer */}
      <EnquiryDrawer
        isOpen={enquiryOpen}
        onClose={handleCloseEnquiry}
        initialOccasion={initialOccasion}
      />
    </div>
  );
}
export default Scene;
