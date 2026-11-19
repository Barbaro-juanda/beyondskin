"use client";
import { KITS, productById, cop, kitPrice, kitFullPrice, useStore, recommend } from "@/lib/store";

export default function Kits() {
  const { add, s } = useStore();
  const rec = recommend(s.profile).kit?.id;
  return (
    <div className="space-y-3">
      <h1 className="h1">Kits 🎁</h1>
      <p className="muted">15% menos que comprar por separado. Productos ficticios.</p>
      {[...KITS].sort((a, b) => (a.id === rec ? -1 : b.id === rec ? 1 : 0)).map((k) => (
        <div key={k.id} className={`card space-y-2 ${k.id === rec ? "ring-2 ring-sage" : ""}`}>
          {k.id === rec && <span className="chip chip-on">Recomendado para ti</span>}
          <h2 className="font-semibold">{k.name}</h2>
          <p className="muted">{k.desc}</p>
          <ul className="list-disc pl-5 text-sm">{k.items.map((i) => <li key={i}>{productById(i).name}</li>)}</ul>
          <p><b className="text-sage-deep">{cop(kitPrice(k))}</b> <s className="muted">{cop(kitFullPrice(k))}</s></p>
          <button className="btn" onClick={() => add("kit:" + k.id)}>Agregar kit</button>
        </div>
      ))}
    </div>
  );
}
