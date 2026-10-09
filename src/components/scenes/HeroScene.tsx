import React from "react";
import { GiftBoxCanvas } from "../3d/GiftBoxCanvas";

interface HeroSceneProps {
  onOpenEnquiry: () => void;
}

export function HeroScene({ onOpenEnquiry }: HeroSceneProps) {
  return (
    <section className="hero-section" id="hero">
      {/* 3D WebGL Background Canvas */}
      <GiftBoxCanvas />

      {/* Hero Typography & Overlay UI */}
      <div className="container hero-overlay">
        {/* Main Content Block */}
        <div className="hero-content">
          <div className="eyebrow">
            <span>Ni Square Packaging Atelier</span>
          </div>

          <h1 className="hero-title">
            Some moments <br />
            <em>deserve more.</em>
          </h1>

          <p className="hero-subtitle">
            Thoughtfully curated hampers and bespoke packaging, crafted with meticulous artistry to make every celebration unforgettable.
          </p>

          <div className="hero-cta-group">
            <a href="#collections" className="btn-primary">
              Explore Our Collection
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <button onClick={onOpenEnquiry} className="btn-secondary">
              Create a Custom Gift
            </button>
          </div>
        </div>

        {/* Hero Footer Bar */}
        <div className="hero-footer-bar">
          <div className="hero-stat-group">
            <div className="hero-stat">
              <span className="hero-stat-val">Bespoke</span>
              <span className="hero-stat-lbl">Custom Form &amp; Finish</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-val">Artisan</span>
              <span className="hero-stat-lbl">Handmade Precision</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-val">Curated</span>
              <span className="hero-stat-lbl">Gourmet &amp; Keepsakes</span>
            </div>
          </div>

          <a href="#art-of-gifting" className="scroll-indicator" aria-label="Scroll to learn more">
            <div className="scroll-mouse">
              <div className="scroll-wheel" />
            </div>
            <span>Discover More</span>
          </a>
        </div>
      </div>
    </section>
  );
}

