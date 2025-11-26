export type ListingProfile = {
  id: string;
  name: string;
  address: string;
  heroImage: string;
  description: string;
  highlights: string[];
  amenities: string[];
  googlePlaceId?: string;
};

export const listingProfiles: ListingProfile[] = [
  {
    id: "n1-loft",
    name: "Shoreditch Heights Loft",
    address: "29 Hoxton Square, London N1",
    heroImage:
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1600&q=80",
    description:
      "Floor-to-ceiling windows, gallery-quality art, and concierge-grade services in the heart of Shoreditch.",
    highlights: [
      "Sunrise views over Hoxton Square",
      "Dedicated remote work den",
      "Curated vinyl listening nook"
    ],
    amenities: ["2BR", "2BA", "102 m²", "Fiber Wi-Fi", "In-unit laundry"],
    googlePlaceId: "ChIJ8wph5ZcbdkgRkrSp1-leMAP"
  },
  {
    id: "canary-wharf-panorama",
    name: "Canary Wharf Panorama",
    address: "Bank Street, Canary Wharf E14",
    heroImage:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    description:
      "Executive-grade living with wraparound skyline views and five-minute DLR access.",
    highlights: [
      "30th-floor skyline terrace",
      "On-call housekeeping",
      "Complimentary gym & pool"
    ],
    amenities: ["1BR", "1.5BA", "88 m²", "Sonos audio", "Weekly cleaning"]
  },
  {
    id: "southbank-mezzanine",
    name: "Southbank Mezzanine",
    address: "Upper Ground, London SE1",
    heroImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    description:
      "Design-led duplex with private atrium steps from the Tate Modern and Thames Path.",
    highlights: [
      "Private reading mezzanine",
      "Chef staging kitchen",
      "Family-ready with crib & toys"
    ],
    amenities: ["3BR", "2BA", "130 m²", "Projector suite", "Washer dryer combo"]
  }
];

export const getListingProfile = (listingId: string | undefined) =>
  listingProfiles.find((profile) => profile.id === listingId);

