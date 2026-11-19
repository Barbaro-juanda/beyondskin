"use client";
import { useState } from "react";
import { PRODUCTS, useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

// SIMULADO: no se reconoce la imagen. La clienta marca qué tipos de producto aparecen en su foto.
// DÓNDE CONECTAR UNA API REAL: enviar la imagen a un modelo de visión (por ejemplo la API de Claude con imágenes)
// desde una ruta de servidor (/api/asesoria) y devolver la lista de tipos detectados en lugar de `have`.
const TYPES = ["Limpiador", "Tónico", "Sérum", "Hidratante", "Protector solar", "Mascarilla", "Shampoo", "Acondicionador"];
const TIPS: Record<string, string> = {
  Limpiador: "Úsalo mañana y noche sobre la piel húmeda y enjuaga con agua tibia.",
  Tónico: "Después de limpiar, aplica con las manos o algodón antes del sérum.",
  Sérum: "De textura más ligera a más espesa: el sérum va antes de la hidratante.",
  Hidratante: "Aplica después del sérum; en piel seca, con la piel todavía un poco húmeda.",
  "Protector solar": "Es el último paso de la mañana y se reaplica durante el día.",
  Mascarilla: "1-2 veces por semana, siguiendo el tiempo indicado en el envase.",
  Shampoo: "Masajea el cuero cabelludo; no hace falta frotar el largo.",
  Acondicionador: "Aplícalo en medios y puntas, no en la raíz.",
};

export default function Asesoria() {
  const { s } = useStore();
  const [img, setImg] = useState<string | null>(null);
  const [have, setHave] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const missing = TYPES.filter((t) => !have.includes(t));
  const sugg = PRODUCTS.filter((p) => missing.includes(p.sub) && (p.skin.includes("todas") || !s.profile.skin || p.skin.includes(s.profile.skin) || p.cat !== "rostro") && (p.cat !== "cabello" || !s.profile.hair || p.hair.includes(s.profile.hair)));
  const toggle = (t: string) => setHave((h) => (h.includes(t) ? h.filter((x) => x !== t) : [...h, t]));

  return (
    <div className="space-y-4">
      <h1 className="h1">Asesoría</h1>
      <p className="muted">Sube una foto de los productos que ya tienes. La foto se queda en tu dispositivo.</p>
      <p className="rounded-xl bg-nude p-2 text-xs">Función simulada: aún no reconocemos productos en la imagen; marca tú los tipos que aparecen en la foto.</p>
      <input type="file" accept="image/*" className="input" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImg(URL.createObjectURL(f)); setDone(false); } }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {img && <img src={img} alt="Tus productos" className="max-h-60 w-full rounded-2xl object-contain" />}
      {img && (
        <div className="card space-y-3">
          <p className="font-semibold">¿Qué hay en tu foto?</p>
          <div className="flex flex-wrap gap-2">{TYPES.map((t) => <button key={t} className={`chip ${have.includes(t) ? "chip-on" : ""}`} onClick={() => toggle(t)}>{t}</button>)}</div>
          <button className="btn" disabled={!have.length} onClick={() => setDone(true)}>Obtener asesoría</button>
        </div>
      )}
      {done && (
        <div className="space-y-3">
          <div className="card space-y-1">
            <h2 className="font-semibold">Cómo usar lo que tienes</h2>
            {have.map((t) => <p key={t} className="text-sm"><b>{t}:</b> {TIPS[t]}</p>)}
            <p className="muted pt-1">Orden sugerido: limpiador → tónico → sérum → hidratante → protector solar (mañana).</p>
          </div>
          <h2 className="font-semibold">Complementos de Beyond Skin</h2>
          <div className="grid grid-cols-2 gap-3">{sugg.slice(0, 6).map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </div>
      )}
    </div>
  );
}
