import React from "react";

interface FooterProps {
  onOpenEnquiry: () => void;
}

export function Footer({ onOpenEnquiry }: FooterProps) {
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-top">
          {/* Brand Column */}
          <div>
            <div className="brand-logo" style={{ marginBottom: "1rem" }}>
              <div className="brand-symbol">
                <span>Ni²</span>
              </div>
              <div className="brand-text">
                <span className="brand-name">Ni Square Packaging</span>
                <span className="brand-sub">Bespoke Gifting Atelier</span>
              </div>
            </div>

            <p className="footer-brand-bio">
              Crafting immersive, tactile gifting experiences and heirloom packaging for life’s most cherished moments. Founded by two best friends, Nikita &amp; Nikita.
            </p>

            <div style={{ marginTop: "1.5rem" }}>
              <a
                href="https://www.instagram.com/nisquarepackaging/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--gold-primary)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>@nisquarepackaging</span>
              </a>
            </div>
          </div>

          {/* Offerings Column */}
          <div>
            <h4 className="footer-col-title">Collections</h4>
            <ul className="footer-links">
              <li>
                <a href="#collections" className="footer-link">Wedding &amp; Trousseau</a>
              </li>
              <li>
                <a href="#collections" className="footer-link">Festive Hampers</a>
              </li>
              <li>
                <a href="#collections" className="footer-link">Executive Corporate</a>
              </li>
              <li>
                <a href="#collections" className="footer-link">Return Gifts &amp; Favours</a>
              </li>
              <li>
                <a href="#bespoke" className="footer-link">Custom Rigid Boxes</a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">The Atelier</h4>
            <ul className="footer-links">
              <li>
                <a href="#art-of-gifting" className="footer-link">Our Philosophy</a>
              </li>
              <li>
                <a href="#bespoke" className="footer-link">Bespoke Configurator</a>
              </li>
              <li>
                <a href="#occasions" className="footer-link">Celebration Occasions</a>
              </li>
              <li>
                <button
                  onClick={onOpenEnquiry}
                  className="footer-link"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                >
                  Start Custom Order
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 className="footer-col-title">Get In Touch</h4>
            <ul className="footer-links">
              <li style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>
                <strong>Nikita Kochar Ostwal</strong>
                <br />
                <a href="tel:+919673283594" className="footer-link">
                  +91 96732 83594
                </a>
              </li>
              <li style={{ color: "var(--text-light)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                <strong>Nikita Anil Chordiya</strong>
                <br />
                <a href="tel:+917083348221" className="footer-link">
                  +91 70833 48221
                </a>
              </li>
              <li style={{ marginTop: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Available across India &bull; Custom worldwide dispatch
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Line */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Ni Square Packaging. All rights reserved.
          </div>
          <div>
            Handcrafted with passion &bull; The Luxe Gifting Atelier
          </div>
        </div>
      </div>
    </footer>
  );
}

