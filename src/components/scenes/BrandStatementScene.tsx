import React from "react";

interface BrandStatementSceneProps {
  onOpenEnquiry: () => void;
}

export function BrandStatementScene({ onOpenEnquiry }: BrandStatementSceneProps) {
  return (
    <section className="closing-section" id="statement">
      <div className="container">
        <div className="closing-content">
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            <span>Ni Square Atelier</span>
          </div>

          <h2 className="closing-title serif">
            Every detail <span className="gold-gradient-text">tells a story.</span>
          </h2>

          <p className="closing-desc">
            Let’s create something worth remembering. Whether you are envisioning a single bespoke keepsake or five hundred celebratory wedding hampers, our atelier is ready to craft your vision.
          </p>

          <button onClick={onOpenEnquiry} className="btn-primary" style={{ fontSize: "1rem", padding: "1.2rem 2.75rem" }}>
            Let’s Create Your Gift
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Direct Founders Contact Bar */}
          <div className="founders-contact-bar">
            <a
              href="https://wa.me/919673283594?text=Hello%20Nikita%20Kochar,%20I%20am%20interested%20in%20custom%20gifting%20and%20packaging%20from%20Ni%20Square%20Packaging."
              target="_blank"
              rel="noopener noreferrer"
              className="founder-pill"
              aria-label="Chat with Founder Nikita Kochar Ostwal on WhatsApp"
            >
              <div style={{ textAlign: "left" }}>
                <div className="founder-role">Co-Founder &amp; Creative Lead</div>
                <div className="founder-name">Nikita Kochar Ostwal &bull; +91 96732 83594</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" color="var(--gold-primary)">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
              </svg>
            </a>

            <a
              href="https://wa.me/917083348221?text=Hello%20Nikita%20Anil,%20I%20am%20interested%20in%20custom%20gifting%20and%20packaging%20from%20Ni%20Square%20Packaging."
              target="_blank"
              rel="noopener noreferrer"
              className="founder-pill"
              aria-label="Chat with Founder Nikita Anil Chordiya on WhatsApp"
            >
              <div style={{ textAlign: "left" }}>
                <div className="founder-role">Co-Founder &amp; Curation Lead</div>
                <div className="founder-name">Nikita Anil Chordiya &bull; +91 70833 48221</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" color="var(--gold-primary)">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

