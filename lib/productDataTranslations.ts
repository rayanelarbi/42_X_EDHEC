import { PRODUCTS, Product } from "./productData";

export const getProducts = (language: "fr" | "en"): Record<string, Product> => {
  // For now, return English version from productData.ts
  // TODO: Add French translations if needed
  return PRODUCTS;
};

// Re-export Product type for compatibility
export type { Product };
