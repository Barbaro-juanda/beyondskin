// Análisis HEURÍSTICO de píxeles, 100% en el navegador. Ninguna imagen sale del dispositivo.
// NO es un diagnóstico médico. Los umbrales son aproximados y de prototipo.
//
// DÓNDE CONECTAR UN MODELO REAL:
//  - Reemplazar `analyzeFrame` por un modelo de MediaPipe Face Landmarker (ROI de frente/nariz/mejillas) o
//    un clasificador TensorFlow.js entrenado y validado dermatológicamente. Mantener la salida `FrameStats`.

export type FrameStats = { shineT: number; shineC: number; texture: number; redness: number; spots: number };
export type SkinResult = { skin: "normal" | "seca" | "grasa" | "mixta" | "sensible"; acne: boolean; stats: FrameStats; reasons: string[] };

/** Analiza el óvalo central. Usa métricas RELATIVAS al propio rostro/iluminación (no valores absolutos de brillo). */
export function analyzeFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): FrameStats {
  const W = 120, H = 150;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const vw = video.videoWidth, vh = video.videoHeight;
  const ch = vh * 0.8, cw = ch * (W / H);
  ctx.drawImage(video, (vw - cw) / 2, (vh - ch) / 2, cw, ch, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;
  const L: number[] = [], S: number[] = [], Z: boolean[] = [], R: number[] = [], X: number[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const nx = (x - W / 2) / (W / 2), ny = (y - H / 2) / (H / 2);
    if (nx * nx + ny * ny > 0.85) continue;
    const i = (y * W + x) * 4, r = d[i], g = d[i + 1], b = d[i + 2];
    L.push(0.299 * r + 0.587 * g + 0.114 * b);
    S.push(Math.max(r, g, b) - Math.min(r, g, b));
    R.push((r - g) / (r + g + 1));
    Z.push(Math.abs(nx) < 0.28); // franja central = zona T
    X.push(x);
  }
  const mean = (a: number[]) => a.reduce((p, c) => p + c, 0) / Math.max(a.length, 1);
  const mL = mean(L), mS = mean(S), mR = mean(R);
  let nT = 0, nC = 0, sT = 0, sC = 0, tex = 0, spots = 0;
  for (let k = 0; k < L.length; k++) {
    const shiny = L[k] > mL * 1.18 && L[k] > 140 && S[k] < mS * 0.85 ? 1 : 0;
    if (Z[k]) { nT++; sT += shiny; } else { nC++; sC += shiny; }
    if (k > 0 && X[k] === X[k - 1] + 1) tex += Math.abs(L[k] - L[k - 1]) / Math.max(mL, 1);
    if (R[k] > mR + 0.07) spots++;
  }
  return { shineT: sT / Math.max(nT, 1), shineC: sC / Math.max(nC, 1), texture: tex / Math.max(L.length, 1), redness: mR, spots: spots / Math.max(L.length, 1) };
}

export function classify(frames: FrameStats[]): SkinResult {
  const avg = (k: keyof FrameStats) => frames.reduce((s, f) => s + f[k], 0) / Math.max(frames.length, 1);
  const stats: FrameStats = { shineT: avg("shineT"), shineC: avg("shineC"), texture: avg("texture"), redness: avg("redness"), spots: avg("spots") };
  const reasons: string[] = [];
  const diff = stats.shineT - stats.shineC, shineAll = (stats.shineT + stats.shineC) / 2;
  let skin: SkinResult["skin"] = "normal";
  if (stats.redness > 0.2) { skin = "sensible"; reasons.push("Se observó enrojecimiento general en el rostro."); }
  else if (diff > 0.04 && stats.shineT > 0.07) { skin = "mixta"; reasons.push("Más brillo en la zona T (frente, nariz y mentón) que en las mejillas."); }
  else if (shineAll > 0.1) { skin = "grasa"; reasons.push("Brillo en gran parte del rostro, también en las mejillas."); }
  else if (stats.texture > 0.045 && shineAll < 0.05) { skin = "seca"; reasons.push("Textura más irregular y poco brillo."); }
  else reasons.push("Brillo y textura equilibrados, sin enrojecimiento marcado.");
  const acne = stats.spots > 0.06;
  if (acne) reasons.push("Se detectaron varias zonas rojizas puntuales (posibles imperfecciones). El acné es una condición, no un tipo de piel.");
  reasons.push(`Medición: brillo zona T ${(stats.shineT * 100).toFixed(0)}%, mejillas ${(stats.shineC * 100).toFixed(0)}%, textura ${(stats.texture * 100).toFixed(1)}, enrojecimiento ${stats.redness.toFixed(2)}.`);
  return { skin, acne, stats, reasons };
}

export const SKIN_INFO: Record<string, { label: string; text: string }> = {
  normal: { label: "Normal", text: "Piel equilibrada, sin molestias ni sensibilidad marcada." },
  seca: { label: "Seca", text: "Tiende a sentirse tirante o áspera; suele beneficiarse de cremas más ricas aplicadas con la piel húmeda." },
  grasa: { label: "Grasa", text: "Brillo en gran parte del rostro; suele preferir texturas ligeras tipo gel." },
  mixta: { label: "Mixta", text: "Seca en algunas zonas y grasa en otras, a menudo grasa en la zona T (frente, nariz y mentón)." },
  sensible: { label: "Sensible", text: "Puede arder o enrojecerse con ciertos productos; conviene evitar fragancia, alcohol y AHAs." },
};
