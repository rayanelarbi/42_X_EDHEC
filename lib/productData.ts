export type Product = {
  id: string;
  name: string;
  shortName: string;
  price: number;
  image: string;
  url: string;
  description: string;
  traceability: {
    origin: string[];
    inci: string[];
    certifications: string[];
    manufacturing: string;
  };
};

export const PRODUCTS: Record<string, Product> = {
  "duo-eclat": {
    id: "duo-eclat",
    name: "Duo Éclat & Protection (BHA 2% + Vitamine C + SPF)",
    shortName: "Duo Éclat & Protection",
    price: 89.0,
    image: "/placeholder-duo-eclat.jpg",
    url: "https://www.paulaschoice.fr/skin-perfecting-2pct-bha-liquid-exfoliant/201.html",
    description:
      "Exfoliation douce BHA 2% + Vitamine C illuminatrice + Protection solaire SPF 30 pour une peau éclatante et protégée.",
    traceability: {
      origin: [
        "Acide salicylique : synthétisé en laboratoire (origine végétale écorce de saule)",
        "Vitamine C : acide L-ascorbique, production Europe",
        "Filtres UV : approuvés UE, origine Allemagne/France",
      ],
      inci: [
        "Aqua",
        "Salicylic Acid (2%)",
        "Ascorbic Acid (Vitamin C)",
        "Butylene Glycol",
        "Ethylhexyl Methoxycinnamate",
        "Dipropylene Glycol",
        "Sodium Hydroxide",
        "Tetrasodium EDTA",
      ],
      certifications: [
        "Cruelty-Free (Leaping Bunny)",
        "Sans parfum",
        "Non comédogène",
        "Testé dermatologiquement",
      ],
      manufacturing:
        "Fabriqué aux États-Unis selon normes GMP (Good Manufacturing Practice). Contrôles qualité à chaque étape. Formules science-based développées par Paula Begoun.",
    },
  },
  "repairing-serum": {
    id: "repairing-serum",
    name: "Resist Repairing Serum & Intensive Moisturiser",
    shortName: "Repairing Serum Duo",
    price: 95.0,
    image: "/placeholder-repairing-serum.jpg",
    url: "https://www.paulaschoice.fr/resist-anti-aging-body-oil/7870.html",
    description:
      "Sérum réparateur peptides + Niacinamide 5% + Crème hydratante intensive pour apaiser, renforcer et hydrater intensément.",
    traceability: {
      origin: [
        "Peptides : synthèse biotechnologique, origine Suisse",
        "Niacinamide : vitamine B3, production pharmaceutique Europe",
        "Acide hyaluronique : fermentation bactérienne, origine France",
        "Céramides : origine végétale (riz, blé)",
      ],
      inci: [
        "Aqua",
        "Niacinamide (5%)",
        "Pentapeptide-48",
        "Sodium Hyaluronate",
        "Glycerin",
        "Ceramide NP",
        "Tocopherol (Vitamin E)",
        "Panthenol",
        "Allantoin",
      ],
      certifications: [
        "Cruelty-Free (Leaping Bunny)",
        "Vegan",
        "Sans parfum",
        "Hypoallergénique",
        "Testé dermatologiquement",
      ],
      manufacturing:
        "Fabriqué aux États-Unis dans des installations certifiées FDA. Formulation clinique testée. Conservation sans parabènes.",
    },
  },
};