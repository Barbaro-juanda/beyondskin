"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Product, cop, useStore } from "@/lib/store";
import Pack from "./Pack";
import { px } from "./Photo";

const SHAPE: Record<string, string> = { Sérum: "dropper", Hidratante: "jar", Mascarilla: "jar", "Mascarilla capilar": "jar", Manos: "jar", Pies: "jar", "Contorno de ojos": "tube", "Protector solar": "tube", "Protector solar corporal": "tube", "Brazos y piernas": "tube", Limpiador: "pump", Tónico: "pump", Shampoo: "pump", Acondicionador: "pump", "Hidratante corporal": "pump", "Jabón íntimo": "pump", Desodorante: "tube" };
const PHOTO: Record<string, number> = { dropper: 8101521, jar: 7319126, tube: 8015462, pump: 10574057 };
export const productPhoto = (sub: string) => px(PHOTO[SHAPE[sub] ?? "pump"] , 600);

export const tone = (id: string) => ["bg-[#f2e6b3] text-[#4b2e21]", "bg-[#f5dd9c] text-[#4b2e21]", "bg-[#4b2e21] text-[#f2e6b3]", "bg-[#efe3b8] text-[#4b2e21]"][id.charCodeAt(id.length - 1) % 4];

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useStore();
  return (
    <div className="group flex flex-col">
      <Link href={`/producto/${p.id}`} className={`relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl transition group-hover:shadow-lg ${tone(p.id)}`}>
        <Pack p={p} className="absolute inset-0 h-full w-full transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2 py-0.5 text-[10px] uppercase tracking-widest text-[#4b2e21]">{p.sub}</span>
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
