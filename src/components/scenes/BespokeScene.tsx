import React, { useState } from "react";

interface BespokeSceneProps {
  onOpenEnquiry: (details?: string) => void;
  onCustomizerChange?: (state: { boxColor: string; ribbonColor: string; monogramText: string }) => void;
}

interface SilhouetteOption {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

const SILHOUETTES: SilhouetteOption[] = [
  {
    id: "rigid-drawer",
    name: "Rigid Drawer Box",
    desc: "Slide-out keepsake drawer with satin pull ribbon",
    icon: "▭",
  },
  {
    id: "magnetic-book",
    name: "Magnetic Book-Fold",
    desc: "Heirloom rigid box with concealed magnetic snaps",
    icon: "◫",
  },
  {
    id: "acrylic-vitrine",
    name: "Crystal Vitrine Lid",
    desc: "Textured rigid base paired with transparent acrylic display lid",
    icon: "◻",
  },
  {
    id: "wicker-trunk",
    name: "Handwoven Wicker Trunk",
    desc: "Artisanal celebration basket with leather buckle closures",
    icon: "⬚",
  },
];

export function BespokeScene({ onOpenEnquiry, onCustomizerChange }: BespokeSceneProps) {
  const [selectedSilhouette, setSelectedSilhouette] = useState<SilhouetteOption>(SILHOUETTES[0]);
  const [boxColor, setBoxColor] = useState<{ name: string; hex: string }>({
    name: "Deep Burgundy",
    hex: "#3B172D",
  });
  const [ribbonColor, setRibbonColor] = useState<{ name: string; hex: string }>({
    name: "Champagne Gold",
    hex: "#D6B77A",
  });
  const [monogram, setMonogram] = useState("Ni²");

  const boxColors = [
    { name: "Deep Burgundy", hex: "#3B172D" },
    { name: "Royal Wine", hex: "#702C49" },
    { name: "Warm Ivory", hex: "#F8F3EB" },
    { name: "Soft Blush", hex: "#F4EAF0" },
    { name: "Midnight Forest", hex: "#1D2F23" },
  ];

  const ribbonColors = [
    { name: "Champagne Gold Foil", hex: "#D6B77A" },
    { name: "Wine Satin", hex: "#702C49" },
    { name: "Rose Pearl", hex: "#E8C2CA" },
    { name: "Pure Ivory Silk", hex: "#FFFDF9" },
  ];

  const handleColorChange = (color: { name: string; hex: string }) => {
    setBoxColor(color);
    if (onCustomizerChange) {
      onCustomizerChange({
        boxColor: color.hex,
        ribbonColor: ribbonColor.hex,
        monogramText: monogram,
      });
    }
  };

  const handleRibbonChange = (ribbon: { name: string; hex: string }) => {
    setRibbonColor(ribbon);
    if (onCustomizerChange) {
      onCustomizerChange({
        boxColor: boxColor.hex,
        ribbonColor: ribbon.hex,
        monogramText: monogram,
      });
    }
  };

  const handleMonogramChange = (val: string) => {
    const upper = val.toUpperCase();
    setMonogram(upper);
    if (onCustomizerChange) {
      onCustomizerChange({
        boxColor: boxColor.hex,
        ribbonColor: ribbonColor.hex,
        monogramText: upper,
      });
    }
  };

  const handleRequestQuote = () => {
    const details = `Bespoke Order: ${selectedSilhouette.name} | Shade: ${boxColor.name} | Ribbon: ${ribbonColor.name} | Monogram: "${monogram}"`;
    onOpenEnquiry(details);
  };

  return (
    <section className="bespoke-section" id="bespoke">
      <div className="container">
        <div className="bespoke-grid">
          {/* Left Column: Editorial & Craft Pillars */}
          <div className="bespoke-editorial-col">
            <div className="eyebrow">
              <span>Atelier Craftsmanship</span>
            </div>

            <h2 className="bespoke-info-title serif">
              Made personal. <br />
              <span className="gold-gradient-text">Made memorable.</span>
            </h2>

            <p className="bespoke-lead-text">
              Every celebration has its own cadence. We collaborate with you to create heirloom packaging tailored to your exact palette, architectural scale, and sentiment.
            </p>

            <div className="bespoke-pillars-list">
              <div className="bespoke-pillar-item">
                <div className="pillar-badge">01</div>
                <div>
                  <h4 className="pillar-heading">Silhouette &amp; Box Architecture</h4>
                  <p className="pillar-subtext">
                    Custom heavy-gauge rigid board construction with mitered corners, slide-out drawer cases, or clear vitrine vitrines.
                  </p>
                </div>
              </div>

              <div className="bespoke-pillar-item">
                <div className="pillar-badge">02</div>
                <div>
                  <h4 className="pillar-heading">Artisan Textures &amp; Liners</h4>
                  <p className="pillar-subtext">
                    Imported textured art papers, suede cushions, plush velvet trays, and embossed paperboards.
                  </p>
                </div>
              </div>

              <div className="bespoke-pillar-item">
                <div className="pillar-badge">03</div>
                <div>
                  <h4 className="pillar-heading">Hot-Foil Stamping &amp; Seals</h4>
                  <p className="pillar-subtext">
                    Precision champagne gold hot-foil debossing of family crests, personalized monograms, and hand-poured wax seals.
                  </p>
                </div>
              </div>

              <div className="bespoke-pillar-item">
                <div className="pillar-badge">04</div>
                <div>
                  <h4 className="pillar-heading">Curated Treasures &amp; Keepsakes</h4>
                  <p className="pillar-subtext">
                    Harmonious pairings of artisanal gourmet confections, luxury fragrances, brass diyas, and handwritten calligraphy cards.
                  </p>
                </div>
              </div>
            </div>

            <button onClick={() => onOpenEnquiry("Bespoke Custom Packaging")} className="btn-primary">
              Commission a Custom Order
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Right Column: High-Contrast Atelier Specifier */}
          <div className="bespoke-specifier-panel">
            <div className="specifier-header">
              <span className="eyebrow" style={{ justifyContent: "center" }}>
                <span>Custom Curation Studio</span>
              </span>
              <h3 className="serif specifier-title">Design Your Signature Hamper</h3>
              <p className="specifier-subtitle">
                Select your silhouette, color scheme, and monogram to generate a tailored quote.
              </p>
            </div>

            {/* 1. Silhouette Selection */}
            <div className="specifier-group">
              <label className="specifier-label">
                1. Box Silhouette: <strong>{selectedSilhouette.name}</strong>
              </label>
              <div className="silhouette-options-grid">
                {SILHOUETTES.map((sil) => (
                  <button
                    key={sil.id}
                    className={`silhouette-btn ${selectedSilhouette.id === sil.id ? "active" : ""}`}
                    onClick={() => setSelectedSilhouette(sil)}
                    type="button"
                  >
                    <span className="sil-icon">{sil.icon}</span>
                    <span className="sil-name">{sil.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Color Palette */}
            <div className="specifier-group">
              <label className="specifier-label">
                2. Box Shade: <strong>{boxColor.name}</strong>
              </label>
              <div className="swatches-row">
                {boxColors.map((color) => (
                  <button
                    key={color.name}
                    className={`swatch-circle ${boxColor.name === color.name ? "active" : ""}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleColorChange(color)}
                    title={color.name}
                    aria-label={`Select box color ${color.name}`}
                    type="button"
                  />
                ))}
              </div>
            </div>

            {/* 3. Ribbon Finish */}
            <div className="specifier-group">
              <label className="specifier-label">
                3. Ribbon &amp; Accent: <strong>{ribbonColor.name}</strong>
              </label>
              <div className="swatches-row">
                {ribbonColors.map((ribbon) => (
                  <button
                    key={ribbon.name}
                    className={`swatch-circle ${ribbonColor.name === ribbon.name ? "active" : ""}`}
                    style={{ backgroundColor: ribbon.hex }}
                    onClick={() => handleRibbonChange(ribbon)}
                    title={ribbon.name}
                    aria-label={`Select ribbon ${ribbon.name}`}
                    type="button"
                  />
                ))}
              </div>
            </div>

            {/* 4. Monogram Foiling */}
            <div className="specifier-group">
              <label className="specifier-label">
                4. Personalized Foil Monogram (Max 4 Letters)
              </label>
              <div className="monogram-input-wrap">
                <input
                  type="text"
                  className="specifier-input"
                  maxLength={4}
                  value={monogram}
                  onChange={(e) => handleMonogramChange(e.target.value)}
                  placeholder="e.g. Ni² or AK"
                />
                <div className="monogram-preview-tag" style={{ borderColor: ribbonColor.hex, color: ribbonColor.hex }}>
                  <span>{monogram || "Ni²"}</span>
                </div>
              </div>
            </div>

            {/* Recipe Summary Box */}
            <div className="spec-summary-card">
              <div className="summary-row">
                <span className="summary-label">Format:</span>
                <span className="summary-val">{selectedSilhouette.name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Finish:</span>
                <span className="summary-val">{boxColor.name} &bull; {ribbonColor.name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Foil Monogram:</span>
                <span className="summary-val gold-text">“{monogram || "Ni²"}” Hot Stamping</span>
              </div>
            </div>

            {/* Request Quote Button */}
            <button onClick={handleRequestQuote} className="btn-primary" style={{ width: "100%" }} type="button">
              Request Quote for This Configuration
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
