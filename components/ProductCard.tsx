"use client";
import { Product, cop, useStore } from "@/lib/store";

const ICON: Record<string, string> = { rostro: "🧴", cabello: "💆‍♀️", cuerpo: "🛁", "manos-pies": "🤲", intima: "🌸" };

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useStore();
  return (
    <div className="card flex flex-col gap-1">
      <div className="flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-nude to-[#fff6cf] text-3xl">{ICON[p.cat]}</div>
      <span className="chip w-fit">{p.sub}</span>
      <h3 className="text-sm font-semibold leading-tight">{p.name}</h3>
      <p className="muted">{p.desc}</p>
      {p.cat === "intima" && <p className="text-[11px] text-[#8a7458]">Solo higiene externa. Consulta a un profesional de la salud ante molestias.</p>}
      <p className="text-[11px] text-[#8a7458]">{[...p.skin.filter((x) => x !== "todas"), ...p.hair].join(" · ") || "Todos los tipos"}</p>
      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="font-bold text-sage-deep">{cop(p.price)}</span>
        <button className="btn !px-3 !py-1.5" onClick={() => add(p.id)}>Agregar</button>
      </div>
      <p className="text-[10px] text-[#b6a9a5]">Producto ficticio</p>
    </div>
  );
}
