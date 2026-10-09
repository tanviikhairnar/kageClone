import React from "react";

interface OccasionCardData {
  title: string;
  category: string;
  snippet: string;
  image: string;
}

const OCCASIONS: OccasionCardData[] = [
  {
    title: "Royal Weddings & Trousseau",
    category: "Heirloom Celebrations",
    snippet: "Bespoke bridal trousseau packing, sangeet favors, and lavish bridal party hampers.",
    image: "/assets/DP3OMVrEhOA.jpg",
  },
  {
    title: "Festive Joy & Milestones",
    category: "Diwali & Celebrations",
    snippet: "Gourmet delights, handcrafted brass accents, and celebratory champagne ribbons.",
    image: "/assets/DQB1R3MEvle.jpg",
  },
  {
    title: "Baby Announcements & Welcomes",
    category: "New Beginnings",
    snippet: "Sweet pastel keepsakes, announcement treasure boxes, and delicate return favours.",
    image: "/assets/DQcPTtYgvTY.jpg",
  },
  {
    title: "Corporate & Executive Gifts",
    category: "Brand Distinction",
    snippet: "Prestigious client appreciation hampers and annual employee recognition tokens.",
    image: "/assets/DRM51Y8En-f.jpg",
  },
  {
    title: "Birthdays & Anniversaries",
    category: "Intimate Memories",
    snippet: "Personalized curated boxes packed with heartfelt sentiments and custom tokens.",
    image: "/assets/DTfb2PBkj8-.jpg",
  },
  {
    title: "Return Favours & Poojas",
    category: "Tokens of Gratitude",
    snippet: "Ceremonial blessings, housewarming gifts, and handcrafted gratitude favors.",
    image: "/assets/gifting/mari1.jpg",
  },
];

interface OccasionsSceneProps {
  onOpenEnquiry: (occasionTitle: string) => void;
}

export function OccasionsScene({ onOpenEnquiry }: OccasionsSceneProps) {
  return (
    <section className="occasions-section" id="occasions">
      <div className="container">
        <div className="occasions-header">
          <div className="eyebrow" style={{ justifyContent: "center", color: "var(--bg-wine)" }}>
            <span>Every Celebration</span>
          </div>

          <h2 className="occasions-title">Gifting for Every Occasion</h2>

          <p style={{ color: "var(--text-muted-dark)", fontSize: "1.0625rem", lineHeight: "1.7" }}>
            From grand wedding celebrations to intimate family gatherings, we tailor each package to honor the uniqueness of your moment.
          </p>
        </div>

        <div className="occasions-grid">
          {OCCASIONS.map((occ, idx) => (
            <div
              key={idx}
              className="occasion-card"
              onClick={() => onOpenEnquiry(occ.title)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenEnquiry(occ.title);
                }
              }}
              aria-label={`Inquire about ${occ.title}`}
            >
              <img src={occ.image} alt={occ.title} loading="lazy" />
              <div className="occasion-card-overlay">
                <span className="occasion-category">{occ.category}</span>
                <h3 className="occasion-name">{occ.title}</h3>
                <p className="occasion-snippet">{occ.snippet}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

