"use client";
import { useState } from "react";
import Link from "next/link";
import { PRODUCTS, productById, cop, useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import Pack from "@/components/Pack";

const TABS = ["Acerca", "Ingredientes", "Reseñas", "Modo de uso"];
export default function Detail({ id }: { id: string }) {
  const p = PRODUCTS.find((x) => x.id === id) ?? productById("r1");
  const { add } = useStore();
  const [tab, setTab] = useState(0);
  const [size, setSize] = useState(100);
  const [qty, setQty] = useState(1);
  const more = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const text = [
    p.desc + " Producto ficticio de ejemplo para el prototipo.",
    "Lista de ingredientes ficticia: agua, glicerina, extracto botánico, vitamina E. (Dato de ejemplo, no real.)",
    " 4.8 · 156 reseñas de ejemplo. Aún no hay reseñas reales.",
    "Aplica según las indicaciones del envase. Si sientes molestias, suspende el uso y consulta a un profesional de la salud.",
  ];
  return (
    <div className="space-y-5">
      <p className="muted"><Link href="/">Inicio</Link> / <Link href="/catalogo">Catálogo</Link> / {p.name}</p>
      <div className="overflow-hidden rounded-3xl"><Pack p={p} className="mx-auto max-h-[28rem] w-full" /></div>
      <div className="card space-y-3">
        <p className="muted"> 156 reseñas (ejemplo) · {p.cat}</p>
        <h1 className="h1">{p.name}</h1>
        <p className="text-sm">{p.desc}</p>
        <p className="text-2xl font-bold">{cop(p.price * (size === 150 ? 1.4 : 1))}</p>
        <div><p className="muted mb-1 uppercase">Tamaño</p>{[100, 150].map((s) => <button key={s} onClick={() => setSize(s)} className={`chip mr-2 ${size === s ? "chip-on" : ""}`}>{s} ml</button>)}</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 rounded-full border border-[#4b2e21] px-3 py-1.5"><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>{qty}<button onClick={() => setQty(qty + 1)}>+</button></div>
          <button className="btn flex-1" onClick={() => add(p.id, qty)}> Agregar al carrito</button>
        </div>
        {p.cat === "intima" && <p className="muted">Solo higiene externa. Consulta a un profesional de la salud ante molestias.</p>}
      </div>
      <div>
        <div className="flex flex-wrap justify-center gap-4 border-b border-[#efe3b8] pb-2">{TABS.map((t, i) => <button key={t} onClick={() => setTab(i)} className={`display text-lg ${tab === i ? "" : "opacity-40"}`}>{t}</button>)}</div>
        <p className="py-3 text-sm">{text[tab]}</p>
      </div>
      <h2 className="serif text-2xl">También te puede gustar</h2>
      <div className="grid grid-cols-2 gap-3">{more.map((x) => <ProductCard key={x.id} p={x} />)}</div>
    </div>
  );
}
