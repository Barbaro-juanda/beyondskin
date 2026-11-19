"use client";
import Link from "next/link";
import { useStore, recommend, cop, kitPrice } from "@/lib/store";
import { SKIN_INFO } from "@/lib/skin";
import Photo from "@/components/Photo";
import { Sparkles, Camera, Store, Gift, Wallet } from "lucide-react";

const tiles = [
  { href: "/analisis", t: "Analiza tu piel", d: "Con cámara (en tu navegador) o con un test.", I: Sparkles },
  { href: "/asesoria", t: "Asesoría con lo que ya tienes", d: "Sube una foto de tus productos.", I: Camera },
  { href: "/catalogo", t: "Catálogo", d: "Rostro, cabello, cuerpo, manos y pies, zona íntima.", I: Store },
  { href: "/kits", t: "Kits con descuento", d: "15% menos que por separado.", I: Gift },
  { href: "/cuenta", t: "Puntos y recordatorios", d: "Canjea y recompra a tiempo.", I: Wallet },
];

export default function Home() {
  const { s } = useStore();
  const { kit } = recommend(s.profile);
  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-gradient-to-br from-rose to-[#f2e6b3] p-6 pt-10 pb-10">
        <p className="serif text-xl text-sage-deep">Beyond Skin</p>
        <h1 className="h1 mt-1 !text-5xl">Tu piel, tu rutina, tu comunidad.</h1>
        <p className="mt-2 text-sm">Descubre tu rutina ideal, acumula puntos y no te quedes sin tus productos favoritos.</p>
        <Link href="/analisis" className="btn mt-4">Empezar mi análisis</Link>
      </section>
      <Photo id={29044029} alt="Productos de skincare minimalistas (imagen ilustrativa)" className="h-56 w-full rounded-3xl" />
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
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-nude"><t.I size={22} strokeWidth={1.5} /></span>
            <span><b className="block text-sm">{t.t}</b><span className="muted">{t.d}</span></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
