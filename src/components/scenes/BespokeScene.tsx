import React, { useState } from "react";

interface BespokeSceneProps {
  onOpenEnquiry: (details?: string) => void;
}

export function BespokeScene({ onOpenEnquiry }: BespokeSceneProps) {
  // Configurator state
  const [boxColor, setBoxColor] = useState<{ name: string; hex: string; textCol: string }>({
    name: "Deep Burgundy",
    hex: "#3B172D",
    textCol: "#F8F3EB",
  });
  const [ribbonColor, setRibbonColor] = useState<{ name: string; hex: string }>({
    name: "Champagne Gold",
    hex: "#D6B77A",
  });
  const [monogram, setMonogram] = useState("Ni²");

  const boxColors = [
    { name: "Deep Burgundy", hex: "#3B172D", textCol: "#F8F3EB" },
    { name: "Royal Wine", hex: "#702C49", textCol: "#F8F3EB" },
    { name: "Warm Ivory", hex: "#F8F3EB", textCol: "#2A1121" },
    { name: "Soft Blush", hex: "#F4EAF0", textCol: "#2A1121" },
    { name: "Midnight Forest", hex: "#1D2F23", textCol: "#F8F3EB" },
  ];

  const ribbonColors = [
    { name: "Champagne Gold", hex: "#D6B77A" },
    { name: "Wine Satin", hex: "#702C49" },
    { name: "Rose Pearl", hex: "#E8C2CA" },
    { name: "Pure Ivory", hex: "#FFFDF9" },
  ];

  const handleConfigSubmit = () => {
    const bespokeDetails = `Bespoke Box (${boxColor.name} Box + ${ribbonColor.name} Ribbon + Monogram: "${monogram}")`;
    onOpenEnquiry(bespokeDetails);
  };

  return (
    <section className="bespoke-section" id="bespoke">
      <div className="container">
        <div className="bespoke-grid">
          {/* Left: Atelier Story & Process */}
          <div>
            <div className="eyebrow">
              <span>The Atelier Process</span>
            </div>

            <h2 className="bespoke-info-title serif">
              Made personal. <br />
              <span className="gold-gradient-text">Made memorable.</span>
            </h2>

            <p style={{ color: "var(--text-muted)", fontSize: "1.0625rem", lineHeight: "1.7", maxWidth: "560px" }}>
              Every love story, milestone, and celebration has its own cadence. Our bespoke studio collaborates closely with you to design tailor-made packaging that mirrors your aesthetic.
            </p>

            <div className="bespoke-steps">
              <div className="bespoke-step-item">
                <div className="step-num">1</div>
                <div>
                  <h4 className="step-heading">Silhouette &amp; Architecture</h4>
                  <p className="step-text">
                    Choose from rigid drawer boxes, book-fold magnetic closures, handcrafted trunks, or transparent acrylic display cases.
                  </p>
                </div>
              </div>

              <div className="bespoke-step-item">
                <div className="step-num">2</div>
                <div>
                  <h4 className="step-heading">Tactile Paper &amp; Liners</h4>
                  <p className="step-text">
                    Select from textured European art papers, plush velvet inlays, suede cushions, or metallic micro-embossed boards.
                  </p>
                </div>
              </div>

              <div className="bespoke-step-item">
                <div className="step-num">3</div>
                <div>
                  <h4 className="step-heading">Foiling, Seals &amp; Ribbonry</h4>
                  <p className="step-text">
                    Custom champagne gold hot-foil debossing of family crests or monograms, coupled with hand-poured wax seals and satin ribbons.
                  </p>
                </div>
              </div>

              <div className="bespoke-step-item">
                <div className="step-num">4</div>
                <div>
                  <h4 className="step-heading">Curated Treasures</h4>
                  <p className="step-text">
                    Pair your packaging with artisanal chocolates, organic dry fruits, custom fragrances, luxury candles, or bespoke souvenirs.
                  </p>
                </div>
              </div>
            </div>

            <button onClick={handleConfigSubmit} className="btn-primary">
              Design Your Gift
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Right: Live Interactive Bespoke Configurator */}
          <div className="bespoke-configurator">
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span className="eyebrow" style={{ justifyContent: "center" }}>
                <span>Interactive Studio Preview</span>
              </span>
              <h3 className="serif" style={{ fontSize: "1.75rem", marginTop: "0.5rem" }}>
                Visualize Your Signature Box
              </h3>
            </div>

            {/* Live Visual Box Mockup */}
            <div className="preview-box-container">
              <div
                className="preview-box-mockup"
                style={{
                  backgroundColor: boxColor.hex,
                  border: `1px solid ${ribbonColor.hex}55`,
                }}
              >
                {/* Vertical Ribbon */}
                <div
                  className="preview-ribbon-v"
                  style={{ backgroundColor: ribbonColor.hex }}
                />
                {/* Horizontal Ribbon */}
                <div
                  className="preview-ribbon-h"
                  style={{ backgroundColor: ribbonColor.hex }}
                />
                {/* Central Monogrammed Plaque */}
                <div
                  className="preview-bow"
                  style={{
                    backgroundColor: boxColor.hex,
                    borderColor: ribbonColor.hex,
                    color: ribbonColor.hex,
                  }}
                >
                  <span>{monogram || "Ni²"}</span>
                </div>
              </div>
            </div>

            {/* Customization Controls */}
            <div className="config-group">
              <label className="config-label">
                1. Box Shade: <strong>{boxColor.name}</strong>
              </label>
              <div className="config-options">
                {boxColors.map((color) => (
                  <button
                    key={color.name}
                    className={`swatch-btn ${boxColor.name === color.name ? "active" : ""}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setBoxColor(color)}
                    title={color.name}
                    aria-label={`Select box color ${color.name}`}
                  />
                ))}
              </div>
            </div>

            <div className="config-group">
              <label className="config-label">
                2. Ribbon &amp; Accent: <strong>{ribbonColor.name}</strong>
              </label>
              <div className="config-options">
                {ribbonColors.map((ribbon) => (
                  <button
                    key={ribbon.name}
                    className={`swatch-btn ${ribbonColor.name === ribbon.name ? "active" : ""}`}
                    style={{ backgroundColor: ribbon.hex }}
                    onClick={() => setRibbonColor(ribbon)}
                    title={ribbon.name}
                    aria-label={`Select ribbon color ${ribbon.name}`}
                  />
                ))}
              </div>
            </div>

            <div className="config-group">
              <label className="config-label">3. Monogram / Initial Foiling (Max 4 chars)</label>
              <input
                type="text"
                className="monogram-input"
                maxLength={4}
                value={monogram}
                onChange={(e) => setMonogram(e.target.value.toUpperCase())}
                placeholder="e.g. Ni² or RS"
              />
            </div>

            <button
              onClick={handleConfigSubmit}
              className="btn-primary"
              style={{ width: "100%", marginTop: "1rem" }}
            >
              Request Custom Quote for This Build
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

