"use client";
import { useState } from "react";
import { PRODUCTS, useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

// LECTURA REAL DE ETIQUETA: OCR (Tesseract.js) en el navegador. La imagen no se sube a ningún servidor.
// (Tesseract descarga los datos de idioma desde un CDN la primera vez; la foto nunca sale del dispositivo.)
// Luego se buscan palabras clave en el texto leído para identificar el tipo de producto.
// DÓNDE CONECTAR UNA API DE VISIÓN: reemplazar `readLabel` por una llamada a un modelo de visión en una ruta de servidor.
const RULES: { type: string; sub: string; words: string[]; tip: string }[] = [
  { type: "Protector solar", sub: "Protector solar", words: ["bloqueador", "protector solar", "sunscreen", "sun screen", "spf", "fps", "uva", "uvb", "sunblock"], tip: "Aplícalo como último paso de la mañana, unos 15 minutos antes de salir, en rostro, cuello y orejas. Reaplica cada 2 horas si estás al sol o sudas." },
  { type: "Limpiador", sub: "Limpiador", words: ["limpiador", "cleanser", "cleansing", "desmaquillante", "espuma limpiadora", "face wash", "micelar", "micellar"], tip: "Úsalo mañana y noche sobre la piel húmeda, masajea 30-60 segundos y enjuaga con agua tibia." },
  { type: "Tónico", sub: "Tónico", words: ["tonico", "toner", "tonic", "esencia", "essence"], tip: "Después de limpiar, aplícalo con las manos o un algodón, antes del sérum." },
  { type: "Sérum", sub: "Sérum", words: ["serum", "ampoule", "ampolla", "vitamina c", "niacinamida", "niacinamide", "hialuronico", "hyaluronic", "retinol"], tip: "Pon 2-3 gotas sobre la piel limpia, antes de la hidratante. Si contiene ácidos o retinol, empieza pocas veces por semana y usa protector solar de día." },
  { type: "Hidratante", sub: "Hidratante", words: ["hidratante", "moisturizer", "moisturiser", "crema facial", "face cream", "gel crema", "gel-cream", "hydrating"], tip: "Aplícala después del sérum, mañana y noche. En piel seca, con la piel todavía un poco húmeda." },
  { type: "Contorno de ojos", sub: "Contorno de ojos", words: ["contorno", "eye cream", "eye contour", "ojos", "eye gel"], tip: "Toca suavemente con el dedo anular, una cantidad del tamaño de un grano de arroz, sin acercarte al borde del ojo." },
  { type: "Mascarilla", sub: "Mascarilla", words: ["mascarilla", "mask", "masque", "arcilla", "clay"], tip: "Usa 1-2 veces por semana siguiendo el tiempo indicado en el envase y retira con agua." },
  { type: "Exfoliante", sub: "Exfoliante", words: ["exfoliante", "scrub", "peeling", "exfoliating"], tip: "1-2 veces por semana, con masaje suave y sin presionar. Evítalo si la piel está irritada." },
  { type: "Shampoo", sub: "Shampoo", words: ["shampoo", "champu", "champú"], tip: "Masajea el cuero cabelludo con la punta de los dedos y enjuaga bien; no hace falta frotar el largo." },
  { type: "Acondicionador", sub: "Acondicionador", words: ["acondicionador", "conditioner", "enjuague"], tip: "Aplícalo en medios y puntas (no en la raíz), deja unos minutos y enjuaga." },
  { type: "Hidratante corporal", sub: "Hidratante corporal", words: ["body lotion", "locion corporal", "loción corporal", "body cream", "crema corporal", "body butter"], tip: "Aplícala después del baño con la piel todavía húmeda." },
  { type: "Manos", sub: "Manos", words: ["hand cream", "crema de manos", "manos", "hands"], tip: "Aplica cuando lo necesites y después de lavarte las manos." },
  { type: "Desodorante", sub: "Desodorante", words: ["desodorante", "deodorant", "antiperspirant", "antitranspirante"], tip: "Aplícalo sobre la piel limpia y seca de las axilas." },
];
const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function Asesoria() {
  const { s } = useStore();
  const [img, setImg] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [found, setFound] = useState<string[] | null>(null);
  const [manual, setManual] = useState<string[]>([]);

  async function readLabel() {
    if (!file) return;
    setBusy(true); setFound(null);
    try {
      const { createWorker } = await import("tesseract.js");
      const w = await createWorker(["spa", "eng"]);
      const { data } = await w.recognize(file);
      await w.terminate();
      const t = norm(data.text);
      setText(data.text.trim());
      setFound(RULES.filter((r) => r.words.some((k) => t.includes(norm(k)))).map((r) => r.type));
    } catch {
      setText(""); setFound([]);
    }
    setBusy(false);
  }

  const types = Array.from(new Set([...(found ?? []), ...manual]));
  const matched = RULES.filter((r) => types.includes(r.type));
  const subs = matched.map((r) => r.sub);
  const comp = PRODUCTS.filter((p) => !subs.includes(p.sub) && ["Limpiador", "Hidratante", "Protector solar", "Sérum", "Tónico"].includes(p.sub) && (p.skin.includes("todas") || !s.profile.skin || p.skin.includes(s.profile.skin))).slice(0, 4);

  return (
    <div className="space-y-4">
      <h1 className="h1">Asesoría</h1>
      <p className="muted">Sube una foto de la etiqueta de un producto que tengas en casa y te decimos qué es y cómo usarlo.</p>
      <p className="rounded-xl bg-nude p-2 text-xs">La lectura se hace en tu navegador (OCR): la foto no se envía a ningún servidor. Funciona mejor con la etiqueta de frente, bien iluminada y sin reflejos. Es orientativo; sigue siempre las instrucciones del envase.</p>
      <input type="file" accept="image/*" className="input" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setImg(URL.createObjectURL(f)); setFound(null); setManual([]); } }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {img && <img src={img} alt="Tu producto" className="max-h-72 w-full rounded-2xl object-contain" />}
      {img && <button className="btn" disabled={busy} onClick={readLabel}>{busy ? "Leyendo etiqueta…" : "Identificar producto"}</button>}

      {found && found.length === 0 && (
        <div className="card space-y-2">
          <p className="text-sm">No pudimos reconocer el producto en la etiqueta. Elígelo tú:</p>
          <div className="flex flex-wrap gap-2">{RULES.map((r) => <button key={r.type} className={`chip ${manual.includes(r.type) ? "chip-on" : ""}`} onClick={() => setManual((m) => (m.includes(r.type) ? m.filter((x) => x !== r.type) : [...m, r.type]))}>{r.type}</button>)}</div>
        </div>
      )}
      {text && <details className="card text-xs"><summary>Texto leído de la etiqueta</summary><p className="mt-2 whitespace-pre-wrap">{text}</p></details>}

      {matched.length > 0 && (
        <div className="space-y-3">
          {matched.map((r) => (
            <div key={r.type} className="card space-y-1">
              <p className="muted">Identificado</p>
              <h2 className="text-xl">{r.type}</h2>
              <p className="text-sm">{r.tip}</p>
            </div>
          ))}
          <p className="muted">Si tienes dudas sobre ingredientes o reacciones, consulta a un profesional de la salud.</p>
          <h2 className="serif text-2xl">Complementa tu rutina con Beyond Skin</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{comp.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </div>
      )}
    </div>
  );
}
