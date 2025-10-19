/**
 * Compresse une image Base64 pour réduire la taille de stockage
 * @param base64Image Image en Base64
 * @param maxWidth Largeur maximale (défaut: 800px)
 * @param quality Qualité JPEG 0-1 (défaut: 0.7)
 * @returns Image compressée en Base64
 */
export async function compressImage(
  base64Image: string,
  maxWidth: number = 800,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Calculer les nouvelles dimensions en gardant le ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir en Base64 avec compression JPEG
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

      console.log(`📦 Image compressed: ${Math.round(base64Image.length / 1024)}KB → ${Math.round(compressedBase64.length / 1024)}KB`);

      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = base64Image;
  });
}

/**
 * Calcule la taille d'une image Base64 en KB
 */
export function getBase64Size(base64: string): number {
  return Math.round(base64.length / 1024);
}
