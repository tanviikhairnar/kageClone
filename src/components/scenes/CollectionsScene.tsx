import React, { useState } from "react";

interface CollectionItem {
  id: string;
  category: "all" | "wedding" | "festive" | "corporate" | "favours";
  title: string;
  badge: string;
  image: string;
  description: string;
  features: string[];
  occasionName: string;
}

const COLLECTIONS_DATA: CollectionItem[] = [
  {
    id: "weddings",
    category: "wedding",
    title: "Wedding & Celebration Hampers",
    badge: "Signature Collection",
    image: "/assets/DP3OMVrEhOA.jpg",
    description:
      "Trousseau curation, bridal party gifts, sangeet favors, and lavish celebration hampers arranged in handwoven wicker baskets and heirloom velvet trunks.",
    features: ["Handwoven Wicker Hampers", "Velvet Keepsake Trunks", "Floral Accents", "Bespoke Monogram Seals"],
    occasionName: "Wedding & Celebration Hampers",
  },
  {
    id: "festive",
    category: "festive",
    title: "Festive Splendor Hampers",
    badge: "Seasonal Atelier",
    image: "/assets/DQB1R3MEvle.jpg",
    description:
      "Diwali, Raksha Bandhan, and New Year curations bathed in champagne gold accents, gourmet confections, artisanal fragrances, and ceremonial treasures.",
    features: ["Champagne Gold Rigid Boxes", "Artisanal Gourmet Sweets", "Brass Accents & Diyas", "Foil Ribbon Finishing"],
    occasionName: "Festive Splendor Hampers",
  },
  {
    id: "corporate",
    category: "corporate",
    title: "Executive & Corporate Gifting",
    badge: "Corporate Bespoke",
    image: "/assets/gifting/stationerynavy2.jpg",
    description:
      "Artfully crafted client appreciation hampers, milestone celebrations, and VIP conference gifts tailored with seamless brand identity and understated elegance.",
    features: ["Custom Brand Debossing", "Curated Executive Stationery", "Artisan Coffee & Gourmet Blends", "Minimalist Tray Boxes"],
    occasionName: "Executive & Corporate Gifting",
  },
  {
    id: "favours",
    category: "favours",
    title: "Return Gifts & Intimate Favours",
    badge: "Delicate Keepsakes",
    image: "/assets/packaging/acrylic-lid-box.jpg",
    description:
      "Exquisite tokens of gratitude, celebration pouches, and petite treasure boxes crafted for baby showers, birthdays, housewarmings, and puja ceremonies.",
    features: ["Crystal Acrylic Vitrines", "Custom Foil Calligraphy Tags", "Aromatic Wax Melts & Candles", "Petite Gift Boxes"],
    occasionName: "Return Gifts & Favours",
  },
];

interface CollectionsSceneProps {
  onOpenEnquiry: (initialOccasion: string) => void;
}

export function CollectionsScene({ onOpenEnquiry }: CollectionsSceneProps) {
  const [activeTab, setActiveTab] = useState<"all" | "wedding" | "festive" | "corporate" | "favours">("all");

  const filteredCollections =
    activeTab === "all"
      ? COLLECTIONS_DATA
      : COLLECTIONS_DATA.filter((item) => item.category === activeTab);

  return (
    <section className="collections-section" id="collections">
      <div className="container">
        {/* Header */}
        <div className="collections-header">
          <div>
            <div className="eyebrow" style={{ color: "var(--bg-wine)" }}>
              <span>Curated Creations</span>
            </div>
            <h2 className="collections-title">Discover Our Collections</h2>
          </div>

          {/* Interactive Category Filter */}
          <div className="collection-tabs" role="tablist">
            <button
              className={`collection-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`collection-tab ${activeTab === "wedding" ? "active" : ""}`}
              onClick={() => setActiveTab("wedding")}
            >
              Weddings
            </button>
            <button
              className={`collection-tab ${activeTab === "festive" ? "active" : ""}`}
              onClick={() => setActiveTab("festive")}
            >
              Festive
            </button>
            <button
              className={`collection-tab ${activeTab === "corporate" ? "active" : ""}`}
              onClick={() => setActiveTab("corporate")}
            >
              Corporate
            </button>
            <button
              className={`collection-tab ${activeTab === "favours" ? "active" : ""}`}
              onClick={() => setActiveTab("favours")}
            >
              Return Favours
            </button>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="collections-grid">
          {filteredCollections.map((collection) => (
            <div className="collection-card" key={collection.id}>
              <div className="card-image-wrap">
                <img
                  src={collection.image}
                  alt={collection.title}
                  loading="lazy"
                />
                <span className="card-badge">{collection.badge}</span>
              </div>

              <div className="card-content">
                <h3 className="card-title">{collection.title}</h3>
                <p className="card-desc">{collection.description}</p>

                <ul className="card-features">
                  {collection.features.map((feature, idx) => (
                    <li key={idx} className="card-tag">
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="card-actions">
                  <button
                    onClick={() => onOpenEnquiry(collection.occasionName)}
                    className="card-link"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <span>Inquire About This Collection</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

