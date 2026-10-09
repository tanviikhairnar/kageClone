import React, { useState, useEffect } from "react";

interface NavigationProps {
  onOpenEnquiry: (initialOccasion?: string) => void;
}

export function Navigation({ onOpenEnquiry }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className={`site-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="container nav-inner">
          {/* Brand Logo */}
          <a href="#" className="brand-logo" aria-label="Ni Square Packaging Home">
            <div className="brand-symbol">
              <span>Ni²</span>
            </div>
            <div className="brand-text">
              <span className="brand-name">Ni Square Packaging</span>
              <span className="brand-sub">Bespoke Gifting Atelier</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              <li>
                <a href="#collections" className="nav-link">
                  Collections
                </a>
              </li>
              <li>
                <a href="#art-of-gifting" className="nav-link">
                  The Atelier
                </a>
              </li>
              <li>
                <a href="#occasions" className="nav-link">
                  Occasions
                </a>
              </li>
              <li>
                <a href="#contact" className="nav-link">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Desktop Actions */}
          <div className="nav-actions">
            <button
              onClick={() => onOpenEnquiry()}
              className="btn-secondary"
              style={{ padding: "0.65rem 1.4rem", fontSize: "0.75rem" }}
            >
              Plan a Hamper
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : "closed"}`}>
        <button
          onClick={closeMenu}
          aria-label="Close menu"
          style={{
            position: "absolute",
            top: "2rem",
            right: "2rem",
            background: "none",
            border: "none",
            color: "var(--gold-primary)",
            fontSize: "1.75rem",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <div className="brand-symbol" style={{ width: "54px", height: "54px", fontSize: "1.75rem", marginBottom: "2rem" }}>
          <span>Ni²</span>
        </div>

        <ul className="mobile-nav-links">
          <li>
            <a
              href="#collections"
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              Collections
            </a>
          </li>
          <li>
            <a
              href="#art-of-gifting"
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              The Atelier
            </a>
          </li>
          <li>
            <a
              href="#occasions"
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              Occasions
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              Contact &amp; Details
            </a>
          </li>
        </ul>

        <button
          onClick={() => {
            closeMenu();
            onOpenEnquiry();
          }}
          className="btn-primary"
          style={{ width: "100%", maxWidth: "280px" }}
        >
          Plan a Hamper
        </button>
      </div>
    </>
  );
}
