"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Product, cop, useStore } from "@/lib/store";
import Art from "./Art";

export const tone = (id: string) => ["bg-[#f2e6b3] text-[#4b2e21]", "bg-[#f5dd9c] text-[#4b2e21]", "bg-[#4b2e21] text-[#f2e6b3]", "bg-[#efe3b8] text-[#4b2e21]"][id.charCodeAt(id.length - 1) % 4];

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useStore();
  return (
    <div className="group flex flex-col">
      <Link href={`/producto/${p.id}`} className={`relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl transition group-hover:shadow-lg ${tone(p.id)}`}>
        <Art sub={p.sub} className="h-3/5 opacity-90 transition group-hover:scale-105" />
        <span className="absolute left-3 top-3 text-[10px] uppercase tracking-widest opacity-70">{p.sub}</span>
      </Link>
      <div className="flex items-start justify-between gap-2 px-1 pt-3">
        <div>
          <h3 className="text-sm leading-tight">{p.name}</h3>
          <p className="muted mt-0.5 !text-xs">{cop(p.price)}</p>
        </div>
        <button aria-label={`Agregar ${p.name}`} className="btn !h-9 !w-9 shrink-0 !p-0" onClick={() => add(p.id)}><Plus size={18} /></button>
      </div>
    </div>
  );
}
