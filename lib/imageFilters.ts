/**
 * Simule un effet "après traitement" sur une image.
 * Applique: blur léger, réduction saturation rouge, luminosité accrue, watermark.
 */
export function simulateAfter(
  source: HTMLImageElement | HTMLCanvasElement
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context non disponible");

  canvas.width = source.width;
  canvas.height = source.height;

  // Dessiner l'image source
  ctx.drawImage(source, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Parcourir tous les pixels
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Réduire la saturation du rouge (atténuer rougeurs)
    const saturationFactor = 0.85;
    data[i] = r * saturationFactor;

    // Augmenter légèrement la luminosité
    const brightnessFactor = 1.05;
    data[i] = Math.min(255, data[i] * brightnessFactor);
    data[i + 1] = Math.min(255, g * brightnessFactor);
    data[i + 2] = Math.min(255, b * brightnessFactor);
  }

  ctx.putImageData(imageData, 0, 0);

  // Appliquer un léger blur via CSS filter (hack simple)
  // On crée un canvas temporaire avec filtre
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return canvas;

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.filter = "blur(0.5px)";
  tempCtx.drawImage(canvas, 0, 0);

  // Watermark "Simulation"
  tempCtx.filter = "none";
  tempCtx.font = "16px Inter, sans-serif";
  tempCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
  tempCtx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  tempCtx.lineWidth = 2;
  const text = "Simulation";
  const textWidth = tempCtx.measureText(text).width;
  const x = tempCanvas.width - textWidth - 15;
  const y = tempCanvas.height - 15;
  tempCtx.strokeText(text, x, y);
  tempCtx.fillText(text, x, y);

  return tempCanvas;
}