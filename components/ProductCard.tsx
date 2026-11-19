"use client";
import Link from "next/link";
import { Product, cop, useStore } from "@/lib/store";

export const tone = (id: string) => ["bg-[#4b2e21] text-[#f2e6b3]", "bg-[#f5dd9c] text-[#4b2e21]", "bg-[#7a5240] text-[#f2e6b3]", "bg-[#f2e6b3] text-[#4b2e21]"][id.charCodeAt(id.length - 1) % 4];
const ICON: Record<string, string> = { rostro: "🧴", cabello: "💆‍♀️", cuerpo: "🛁", "manos-pies": "🤲", intima: "🌸" };

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useStore();
  return (
    <div className="flex flex-col gap-2">
      <Link href={`/producto/${p.id}`} className={`relative flex aspect-[4/5] flex-col justify-between rounded-3xl p-3 ${tone(p.id)}`}>
        <span className="display text-xl leading-none">{p.sub}</span>
        <span className="self-end text-5xl">{ICON[p.cat]}</span>
        <span className="absolute right-3 top-3 text-[10px] opacity-70">Ficticio</span>
      </Link>
      <h3 className="px-1 text-sm font-semibold leading-tight">{p.name}</h3>
      <div className="mt-auto flex items-center gap-2">
        <span className="btn btn-soft !px-3 !py-1.5">{cop(p.price)}</span>
        <button className="btn flex-1 !px-3 !py-1.5" onClick={() => add(p.id)}>🛍️ Agregar</button>
      </div>
    </div>
  );
}
