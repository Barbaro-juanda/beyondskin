// Análisis HEURÍSTICO de píxeles, 100% en el navegador. Ninguna imagen sale del dispositivo.
// NO es un diagnóstico médico. Los umbrales son aproximados y de prototipo.
//
// DÓNDE CONECTAR UN MODELO REAL:
//  - Reemplazar `analyzeFrame` por un modelo de MediaPipe Face Landmarker (ROI de frente/nariz/mejillas) o
//    un clasificador TensorFlow.js entrenado y validado dermatológicamente. Mantener la salida `FrameStats`.

export type FrameStats = { shineT: number; shineC: number; texture: number; redness: number; spots: number };
export type SkinResult = { skin: "normal" | "seca" | "grasa" | "mixta" | "sensible"; acne: boolean; stats: FrameStats; reasons: string[] };

/** Analiza el óvalo central del fotograma (la clienta debe alinear su rostro en la guía). */
export function analyzeFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): FrameStats {
  const W = 120, H = 150;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const vw = video.videoWidth, vh = video.videoHeight;
  // recorte central 3:4
  const ch = vh * 0.8, cw = ch * (W / H);
  ctx.drawImage(video, (vw - cw) / 2, (vh - ch) / 2, cw, ch, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;
  let nT = 0, nC = 0, shT = 0, shC = 0, tex = 0, nTex = 0, redSum = 0, n = 0;
  const lum = (i: number) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  const reds: number[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const nx = (x - W / 2) / (W / 2), ny = (y - H / 2) / (H / 2);
    if (nx * nx + ny * ny > 0.85) continue; // fuera del óvalo
    const i = (y * W + x) * 4, L = lum(i);
    const sat = Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]);
    const shiny = L > 205 && sat < 70 ? 1 : 0;
    const tZone = Math.abs(nx) < 0.28; // franja vertical central (frente-nariz-mentón)
    if (tZone) { nT++; shT += shiny; } else { nC++; shC += shiny; }
    if (x < W - 1) { tex += Math.abs(L - lum(i + 4)); nTex++; }
    const red = d[i] - (d[i + 1] + d[i + 2]) / 2;
    redSum += red; reds.push(red); n++;
  }
  const mean = redSum / n;
  const spots = reds.filter((r) => r > mean + 28).length / n;
  return { shineT: shT / Math.max(nT, 1), shineC: shC / Math.max(nC, 1), texture: tex / Math.max(nTex, 1), redness: mean, spots };
}

export function classify(frames: FrameStats[]): SkinResult {
  const avg = (k: keyof FrameStats) => frames.reduce((s, f) => s + f[k], 0) / Math.max(frames.length, 1);
  const stats: FrameStats = { shineT: avg("shineT"), shineC: avg("shineC"), texture: avg("texture"), redness: avg("redness"), spots: avg("spots") };
  const reasons: string[] = [];
  let skin: SkinResult["skin"] = "normal";
  const shineAll = (stats.shineT + stats.shineC) / 2;
  if (stats.redness > 42) { skin = "sensible"; reasons.push("Se observó enrojecimiento general en el rostro."); }
  else if (stats.shineT > 0.05 && stats.shineC < 0.025) { skin = "mixta"; reasons.push("Más brillo en la zona T (frente, nariz y mentón) que en las mejillas."); }
  else if (shineAll > 0.05) { skin = "grasa"; reasons.push("Brillo uniforme en gran parte del rostro."); }
  else if (stats.texture > 9 && shineAll < 0.015) { skin = "seca"; reasons.push("Textura irregular y poco brillo."); }
  else reasons.push("No se observó brillo excesivo, enrojecimiento ni textura marcada.");
  const acne = stats.spots > 0.035;
  if (acne) reasons.push("Se detectaron varias zonas rojizas puntuales (posibles imperfecciones). El acné es una condición, no un tipo de piel.");
  return { skin, acne, stats, reasons };
}

export const SKIN_INFO: Record<string, { label: string; text: string }> = {
  normal: { label: "Normal", text: "Piel equilibrada, sin molestias ni sensibilidad marcada." },
  seca: { label: "Seca", text: "Tiende a sentirse tirante o áspera; suele beneficiarse de cremas más ricas aplicadas con la piel húmeda." },
  grasa: { label: "Grasa", text: "Brillo en gran parte del rostro; suele preferir texturas ligeras tipo gel." },
  mixta: { label: "Mixta", text: "Seca en algunas zonas y grasa en otras, a menudo grasa en la zona T (frente, nariz y mentón)." },
  sensible: { label: "Sensible", text: "Puede arder o enrojecerse con ciertos productos; conviene evitar fragancia, alcohol y AHAs." },
};
