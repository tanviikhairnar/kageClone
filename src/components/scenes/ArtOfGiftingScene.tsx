import React from "react";

export function ArtOfGiftingScene() {
  return (
    <section className="art-of-gifting-section" id="art-of-gifting">
      <div className="container">
        {/* Editorial Header */}
        <div className="editorial-header">
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            <span>The Philosophy</span>
          </div>

          <h2 className="editorial-headline serif">
            A little more thought. <br />
            <span className="gold-gradient-text">A lot more meaning.</span>
          </h2>

          <p className="editorial-quote">
            “Gifting is not merely the exchange of an object—it is the art of bottling an emotion, sealing it with care, and unveiling it as an unforgettable experience.”
          </p>

          <div className="founders-badge">
            <span className="founders-badge-dot" />
            <span>
              Founded by <strong>Nikita Kochar Ostwal</strong> &amp; <strong>Nikita Anil Chordiya</strong> — Ni²
            </span>
          </div>
        </div>

        {/* Four Craftsmanship Pillars */}
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-num">01</div>
            <h3 className="pillar-title">Rigid Box Architecture</h3>
            <p className="pillar-desc">
              Custom heavy-gauge rigid board structures with flawless mitered edges, soft magnetic closures, and velvet lining built to become cherished keepsakes.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-num">02</div>
            <h3 className="pillar-title">Tactile Textures &amp; Foils</h3>
            <p className="pillar-desc">
              Imported art papers, soft-touch matte finishes, lustrous double-faced satin ribbons, and precision champagne gold foil stamping.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-num">03</div>
            <h3 className="pillar-title">Bespoke Monograms</h3>
            <p className="pillar-desc">
              Every detail customized to your signature aesthetic—from wax seals and bespoke initials to tailored color palettes and printed stationery.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-num">04</div>
            <h3 className="pillar-title">Curated Harmonies</h3>
            <p className="pillar-desc">
              Thoughtful combinations of artisanal gourmet delights, scented luxuries, and keepsake items arranged with impeccable visual balance.
            </p>
          </div>
        </div>

        {/* Tactile Visual Mosaic */}
        <div className="tactile-mosaic">
          <div className="mosaic-item" style={{ height: "420px" }}>
            <img
              src="/assets/packaging/acrylic-lid-box.jpg"
              alt="Textured rigid box with crystal clear acrylic lid"
              loading="lazy"
            />
            <div className="mosaic-caption">
              <span>Crystal Acrylic Vitrine Lid &bull; Bespoke Hamper</span>
            </div>
          </div>

          <div className="mosaic-item" style={{ height: "350px" }}>
            <img
              src="/assets/packaging/white-gold-dots-box.jpg"
              alt="Handcrafted white and champagne gold foiled celebration box"
              loading="lazy"
            />
            <div className="mosaic-caption">
              <span>Gold Foil Polka Dots &bull; Satin Bow Ribbonry</span>
            </div>
          </div>

          <div className="mosaic-item" style={{ height: "420px" }}>
            <img
              src="/assets/gifting/mari3.jpg"
              alt="Artisan wedding trousseau hamper presentation"
              loading="lazy"
            />
            <div className="mosaic-caption">
              <span>Heirloom Keepsake Presentation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

