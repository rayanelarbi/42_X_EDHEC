export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  url: string;
  description: string;
  targetGender?: "male" | "female" | "all";
  traceability: {
    origin: string[];
    inci: string[];
    certifications: string[];
    manufacturing: string;
  };
};

export const PRODUCTS: Record<string, Product> = {
  "vitamin-c-moisturizer": {
    id: "vitamin-c-moisturizer",
    name: "5% Vitamin C Sheer Moisturizer Cream SPF 50",
    price: 49.0,
    image: "https://media.paulaschoice-eu.com/image/upload/f_auto,q_auto,dpr_auto/products/images/11360?_i=AG",
    url: "https://www.paulaschoice.fr/fr/cplus-5percent-vitamin-c-sheer-moisturizer-spf-50/91360.html",
    targetGender: "female",
    description:
      "Lightweight moisturizer with 5% Vitamin C for brightening, plus SPF 50 broad-spectrum sun protection. Perfect for daily defense against environmental damage.",
    traceability: {
      origin: [
        "Vitamin C: L-ascorbic acid, pharmaceutical grade from Europe",
        "UV Filters: EU-approved, origin Germany/France",
        "Antioxidants: Natural extracts from sustainable sources",
      ],
      inci: [
        "Aqua",
        "Ascorbic Acid (Vitamin C 5%)",
        "Ethylhexyl Methoxycinnamate",
        "Butylene Glycol",
        "Glycerin",
        "Dimethicone",
        "Tocopherol (Vitamin E)",
        "Sodium Hyaluronate",
      ],
      certifications: [
        "Cruelty-Free (Leaping Bunny)",
        "Fragrance-Free",
        "Non-comedogenic",
        "Dermatologist-tested",
      ],
      manufacturing:
        "Made in USA following GMP (Good Manufacturing Practice) standards. Science-backed formulas developed by Paula Begoun.",
    },
  },
  "bha-exfoliant": {
    id: "bha-exfoliant",
    name: "2% BHA Exfoliant Skin Perfecting",
    price: 35.0,
    image: "https://www.paulaschoice.com/dw/image/v2/BBNX_PRD/on/demandware.static/-/Sites-pc-catalog/default/dwcf36de14/images/products/2-percent-bha-liquid-exfoliant-2010-portrait.png?sw=2000&sfrm=png",
    url: "https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201.html",
    targetGender: "female",
    description:
      "Gentle 2% BHA (salicylic acid) liquid exfoliant that unclogs pores, evens skin tone, and smooths fine lines. Best-selling treatment for all skin types.",
    traceability: {
      origin: [
        "Salicylic Acid: Lab-synthesized from willow bark derivative",
        "Green Tea Extract: Organic cultivation, Asia",
        "Methylpropanediol: Synthetic humectant, pharmaceutical grade",
      ],
      inci: [
        "Aqua",
        "Methylpropanediol",
        "Butylene Glycol",
        "Salicylic Acid (2%)",
        "Polysorbate 20",
        "Camellia Oleifera (Green Tea) Leaf Extract",
        "Sodium Hydroxide",
        "Tetrasodium EDTA",
      ],
      certifications: [
        "Cruelty-Free (Leaping Bunny)",
        "Fragrance-Free",
        "Non-comedogenic",
        "Dermatologist-tested",
      ],
      manufacturing:
        "Made in USA in FDA-certified facilities. Quality controls at every step. Science-based formulas by Paula Begoun.",
    },
  },
  "rescue-repair-moisturizer": {
    id: "rescue-repair-moisturizer",
    name: "Rescue & Repair Intensive Moisturizer",
    price: 45.0,
    image: "https://media.paulaschoice-eu.com/image/upload/f_auto,q_auto,dpr_auto/products/images/9257?_i=AG",
    url: "https://www.paulaschoice.fr/fr/calm-rescue-repair-intensive-moisturiser-travel-size/9257-01.html",
    targetGender: "male",
    description:
      "Rich ceramide-packed moisturizer that repairs skin barrier, intensely hydrates, and strengthens skin resilience. Ideal for sensitive or compromised skin.",
    traceability: {
      origin: [
        "Ceramides: Plant-derived from rice and wheat",
        "Niacinamide: Pharmaceutical-grade Vitamin B3, Europe",
        "Hyaluronic Acid: Bacterial fermentation, France",
        "Peptides: Biotechnology synthesis, Switzerland",
      ],
      inci: [
        "Aqua",
        "Niacinamide (5%)",
        "Glycerin",
        "Ceramide NP",
        "Ceramide AP",
        "Ceramide EOP",
        "Sodium Hyaluronate",
        "Pentapeptide-48",
        "Tocopherol (Vitamin E)",
        "Panthenol",
        "Allantoin",
      ],
      certifications: [
        "Cruelty-Free (Leaping Bunny)",
        "Vegan",
        "Fragrance-Free",
        "Hypoallergenic",
        "Dermatologist-tested",
      ],
      manufacturing:
        "Made in USA in FDA-certified facilities. Clinical formulation tested. Preservative system without parabens.",
    },
  },
  "repairing-serum": {
    id: "repairing-serum",
    name: "Resist Anti-Aging Repairing Serum",
    price: 50.0,
    image: "https://media.paulaschoice-eu.com/image/upload/f_auto,q_auto,dpr_auto/products/images/3720?_i=AG",
    url: "https://www.paulaschoice.fr/fr/calm-repairing-serum-full-size/3720-01.html",
    targetGender: "male",
    description:
      "Concentrated peptide and retinol serum that repairs signs of aging, reduces wrinkles, and firms skin. Powerful anti-aging treatment for all skin types.",
    traceability: {
      origin: [
        "Retinol: Pharmaceutical-grade Vitamin A, USA",
        "Peptides: Biotechnology synthesis, Switzerland",
        "Niacinamide: Pharmaceutical-grade Vitamin B3, Europe",
        "Hyaluronic Acid: Bacterial fermentation, France",
      ],
      inci: [
        "Aqua",
        "Niacinamide (5%)",
        "Pentapeptide-48",
        "Retinol (0.3%)",
        "Sodium Hyaluronate",
        "Glycerin",
        "Tocopherol (Vitamin E)",
        "Panthenol",
        "Allantoin",
      ],
      certifications: [
        "Cruelty-Free (Leaping Bunny)",
        "Vegan",
        "Fragrance-Free",
        "Hypoallergenic",
        "Dermatologist-tested",
      ],
      manufacturing:
        "Made in USA in FDA-certified facilities. Clinical formulation tested. Preservative system without parabens.",
    },
  },
};