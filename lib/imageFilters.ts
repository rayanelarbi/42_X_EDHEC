export function simulateAfter(
  source: HTMLImageElement | HTMLCanvasElement,
  productKey: "duo-eclat" | "repairing-serum"
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context non disponible");

  canvas.width = source.width;
  canvas.height = source.height;

  ctx.drawImage(source, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  if (productKey === "duo-eclat") {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = r * 0.88;

      const brightnessFactor = 1.08;
      data[i] = Math.min(255, data[i] * brightnessFactor);
      data[i + 1] = Math.min(255, g * brightnessFactor);
      data[i + 2] = Math.min(255, b * brightnessFactor);

      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i] * 0.95 + avg * 0.05;
      data[i + 1] = data[i + 1] * 0.95 + avg * 0.05;
      data[i + 2] = data[i + 2] * 0.95 + avg * 0.05;
    }
  } else {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = r * 0.82;

      const brightnessFactor = 1.04;
      data[i] = Math.min(255, data[i] * brightnessFactor);
      data[i + 1] = Math.min(255, g * brightnessFactor);
      data[i + 2] = Math.min(255, b * brightnessFactor);

      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i] * 0.9 + avg * 0.1;
      data[i + 1] = data[i + 1] * 0.9 + avg * 0.1;
      data[i + 2] = data[i + 2] * 0.9 + avg * 0.1;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) return canvas;

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.filter = "blur(0.5px)";
  tempCtx.drawImage(canvas, 0, 0);

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