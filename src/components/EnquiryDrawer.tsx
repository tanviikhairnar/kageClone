import React, { useState, useEffect } from "react";

interface EnquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialOccasion?: string;
}

export function EnquiryDrawer({ isOpen, onClose, initialOccasion }: EnquiryDrawerProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState(initialOccasion || "Wedding & Trousseau");
  const [quantity, setQuantity] = useState("10 - 50 Hampers");
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");
  const [contactFounder, setContactFounder] = useState<"nikita_k" | "nikita_a">("nikita_k");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialOccasion) {
      setOccasion(initialOccasion);
    }
  }, [initialOccasion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const founderNumber = contactFounder === "nikita_k" ? "919673283594" : "917083348221";
    const founderName = contactFounder === "nikita_k" ? "Nikita Kochar" : "Nikita Anil";

    const messageText = `*Ni Square Packaging Enquiry*\n` +
      `Hello ${founderName},\n` +
      `I would like to inquire about bespoke packaging/gifting from Ni Square Packaging.\n\n` +
      `*Client Name:* ${name}\n` +
      `*Contact:* ${phone}\n` +
      `*Occasion:* ${occasion}\n` +
      `*Estimated Quantity:* ${quantity}\n` +
      (eventDate ? `*Required By:* ${eventDate}\n` : "") +
      (notes ? `*Custom Notes:* ${notes}\n` : "");

    const whatsappUrl = `https://wa.me/${founderNumber}?text=${encodeURIComponent(messageText)}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`} onClick={onClose} role="dialog" aria-modal="true">
      <div className="enquiry-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close form">
          ✕
        </button>

        {!submitted ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div className="eyebrow" style={{ justifyContent: "center" }}>
                <span>Bespoke Gifting Studio</span>
              </div>
              <h3 className="serif" style={{ fontSize: "2.25rem", marginTop: "0.5rem" }}>
                Begin Your Curation
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Share your requirements with our founders. We will tailor every box, ribbon, and keepsake to perfection.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ayesha Sharma"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Occasion / Theme *</label>
                  <select
                    className="form-select"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                  >
                    <option value="Wedding & Trousseau">Wedding &amp; Trousseau Packing</option>
                    <option value="Festive Splendor Hampers">Festive Splendor (Diwali, Rakhi)</option>
                    <option value="Executive & Corporate Gifting">Corporate &amp; Executive Gifting</option>
                    <option value="Return Gifts & Favours">Return Gifts &amp; Intimate Favours</option>
                    <option value="Baby Announcements & Welcomes">Baby Announcements &amp; Welcomes</option>
                    <option value="Birthdays & Anniversaries">Birthdays &amp; Anniversaries</option>
                    <option value="Bespoke Box Construction">Bespoke Custom Box Only</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Quantity</label>
                  <select
                    className="form-select"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  >
                    <option value="1 - 10 Hampers">1 - 10 Hampers (Intimate)</option>
                    <option value="10 - 50 Hampers">10 - 50 Hampers (Signature)</option>
                    <option value="50 - 200 Hampers">50 - 200 Hampers (Celebration)</option>
                    <option value="200+ Hampers">200+ Hampers (Grand / Corporate)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Approximate Event Date / Deadline</label>
                <input
                  type="text"
                  className="form-input"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="e.g. Mid November 2026"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Customization Notes / Preferences</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about your color theme, budget, preferred box style (wicker, acrylic, rigid box), or specific gourmet items..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Connect Directly With:</label>
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="founder"
                      checked={contactFounder === "nikita_k"}
                      onChange={() => setContactFounder("nikita_k")}
                    />
                    Nikita Kochar Ostwal
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="founder"
                      checked={contactFounder === "nikita_a"}
                      onChange={() => setContactFounder("nikita_a")}
                    />
                    Nikita Anil Chordiya
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                Send Enquiry via WhatsApp
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(214, 183, 122, 0.15)",
                border: "1px solid var(--gold-primary)",
                color: "var(--gold-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                fontSize: "1.75rem",
              }}
            >
              ✓
            </div>
            <h3 className="serif" style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
              Enquiry Initiated!
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: "1.7", marginBottom: "2rem" }}>
              Your customized details have been sent to our founder team. We will respond promptly with design concepts, material samples, and tailored quotes.
            </p>
            <button onClick={handleReset} className="btn-secondary">
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

