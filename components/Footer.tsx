import Link from "next/link";
export default function Footer() {
  return (
    <footer className="mt-10 bg-[#4b2e21] px-6 pb-28 pt-10 text-[#f2e6b3]">
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
        <div><p className="display mb-2 text-sm tracking-wide">Navegación</p><ul className="space-y-1 text-sm opacity-90"><li><Link href="/catalogo">Catálogo</Link></li><li><Link href="/kits">Kits</Link></li><li><Link href="/analisis">Mi piel</Link></li></ul></div>
        <div><p className="display mb-2 text-sm tracking-wide">Comunidad</p><ul className="space-y-1 text-sm opacity-90"><li><Link href="/cuenta">Puntos y recompensas</Link></li><li><Link href="/asesoria">Asesoría</Link></li></ul></div>
        <p className="serif text-4xl sm:text-right">Beyond Skin</p>
      </div>
      <p className="mx-auto mt-6 max-w-5xl text-xs opacity-70">Beyond Skin es una marca ficticia (prototipo universitario). Productos, precios y textos son de ejemplo. Nada aquí es un diagnóstico médico. Fotos ilustrativas: Pexels.</p>
    </footer>
  );
}
