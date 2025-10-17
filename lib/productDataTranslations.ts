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

export const getProducts = (language: "fr" | "en"): Record<string, Product> => {
  if (language === "fr") {
    return {
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
  } else {
    return {
      "duo-eclat": {
        id: "duo-eclat",
        name: "Radiance & Protection Duo (BHA 2% + Vitamin C + SPF)",
        shortName: "Radiance & Protection Duo",
        price: 89.0,
        image: "/placeholder-duo-eclat.jpg",
        url: "https://www.paulaschoice.fr/skin-perfecting-2pct-bha-liquid-exfoliant/201.html",
        description:
          "Gentle BHA 2% exfoliation + Brightening Vitamin C + SPF 30 sun protection for radiant and protected skin.",
        traceability: {
          origin: [
            "Salicylic acid: laboratory synthesized (plant origin willow bark)",
            "Vitamin C: L-ascorbic acid, European production",
            "UV filters: EU approved, origin Germany/France",
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
            "Fragrance-free",
            "Non-comedogenic",
            "Dermatologically tested",
          ],
          manufacturing:
            "Manufactured in the USA according to GMP (Good Manufacturing Practice) standards. Quality controls at every step. Science-based formulas developed by Paula Begoun.",
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
          "Repairing peptide serum + Niacinamide 5% + Intensive moisturizing cream to soothe, strengthen and intensely hydrate.",
        traceability: {
          origin: [
            "Peptides: biotechnological synthesis, Swiss origin",
            "Niacinamide: vitamin B3, pharmaceutical production Europe",
            "Hyaluronic acid: bacterial fermentation, French origin",
            "Ceramides: plant origin (rice, wheat)",
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
            "Fragrance-free",
            "Hypoallergenic",
            "Dermatologically tested",
          ],
          manufacturing:
            "Manufactured in the USA in FDA-certified facilities. Clinically tested formulation. Paraben-free preservation.",
        },
      },
    };
  }
};
