"use client";
import Link from "next/link";
import { useStore, recommend, cop, kitPrice } from "@/lib/store";
import { SKIN_INFO } from "@/lib/skin";

const tiles = [
  { href: "/analisis", t: "Analiza tu piel", d: "Con cámara (en tu navegador) o con un test.", i: "✨" },
  { href: "/asesoria", t: "Asesoría con lo que ya tienes", d: "Sube una foto de tus productos.", i: "📸" },
  { href: "/catalogo", t: "Catálogo", d: "Rostro, cabello, cuerpo, manos y pies, zona íntima.", i: "🧴" },
  { href: "/kits", t: "Kits con descuento", d: "15% menos que por separado.", i: "🎁" },
  { href: "/cuenta", t: "Puntos y recordatorios", d: "Canjea y recompra a tiempo.", i: "💳" },
];

export default function Home() {
  const { s } = useStore();
  const { kit } = recommend(s.profile);
  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-gradient-to-br from-rose to-[#fff6cf] p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-sage-deep">Beyond Skin</p>
        <h1 className="h1 mt-1">Tu piel, tu rutina, tu comunidad.</h1>
        <p className="mt-2 text-sm">Descubre tu rutina ideal, acumula puntos y no te quedes sin tus productos favoritos.</p>
        <Link href="/analisis" className="btn mt-4">Empezar mi análisis</Link>
      </section>
      {s.profile.skin && kit && (
        <section className="card">
          <p className="muted">Tu último resultado (orientativo)</p>
          <p className="font-semibold">Piel {SKIN_INFO[s.profile.skin].label.toLowerCase()}{s.profile.acne ? " · con signos de acné" : ""}</p>
          <p className="muted">Te sugerimos: {kit.name} — {cop(kitPrice(kit))}</p>
          <Link href="/kits" className="btn btn-soft mt-2">Ver kit</Link>
        </section>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="card flex items-center gap-3">
            <span className="text-2xl">{t.i}</span>
            <span><b className="block text-sm">{t.t}</b><span className="muted">{t.d}</span></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
