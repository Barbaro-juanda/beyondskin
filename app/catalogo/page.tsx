"use client";
import { useState } from "react";
import { PRODUCTS } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

const CATS = [["todas", "Todo"], ["rostro", "Rostro"], ["cabello", "Cabello"], ["cuerpo", "Cuerpo"], ["manos-pies", "Manos y pies"], ["intima", "Zona íntima"]];
const SKINS = ["todas", "normal", "seca", "grasa", "mixta", "sensible", "acne"];
const HAIRS = ["todos", "graso", "seco", "rizado", "caida", "normal"];

export default function Catalogo() {
  const [cat, setCat] = useState("todas");
  const [skin, setSkin] = useState("todas");
  const [hair, setHair] = useState("todos");
  const list = PRODUCTS.filter((p) => (cat === "todas" || p.cat === cat) && (skin === "todas" || p.skin.includes(skin) || p.skin.includes("todas")) && (hair === "todos" || p.hair.includes(hair)));
  const Row = ({ items, v, set }: { items: string[] | string[][]; v: string; set: (x: string) => void }) => (
    <div className="flex gap-2 overflow-x-auto pb-1">{items.map((i) => { const [k, l] = Array.isArray(i) ? i : [i, i]; return <button key={k} onClick={() => set(k)} className={`chip whitespace-nowrap capitalize ${v === k ? "chip-on" : ""}`}>{l}</button>; })}</div>
  );
  return (
    <div className="space-y-3">
      <div className="border-b border-[#efe3b8] pb-4"><h1 className="h1 !text-4xl">Catálogo</h1><p className="muted mt-1">{list.length} productos</p></div>
      <p className="muted">Todos los productos son ficticios (prototipo).</p>
      <Row items={CATS} v={cat} set={setCat} />
      <p className="muted">Tipo de piel</p><Row items={SKINS} v={skin} set={setSkin} />
      <p className="muted">Tipo de cabello</p><Row items={HAIRS} v={hair} set={setHair} />
      {cat === "intima" && <p className="rounded-xl bg-nude p-2 text-xs">Productos de higiene y cuidado externo. No tratan ni previenen infecciones. Consulta a un profesional de la salud ante molestias.</p>}
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      {!list.length && <p className="muted">Sin resultados con estos filtros.</p>}
    </div>
  );
}
