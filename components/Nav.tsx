"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const links = [
  { href: "/", t: "Inicio", i: "🏡" },
  { href: "/analisis", t: "Mi piel", i: "✨" },
  { href: "/catalogo", t: "Tienda", i: "🧴" },
  { href: "/kits", t: "Kits", i: "🎁" },
  { href: "/cuenta", t: "Puntos", i: "💳" },
  { href: "/carrito", t: "Carrito", i: "🛍️" },
];

export default function Nav() {
  const path = usePathname();
  const { s } = useStore();
  const count = Object.values(s.cart).reduce((a, b) => a + b, 0);
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-[#efe3b8] bg-rose/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold tracking-tight text-sage-deep">● Beyond Skin</Link>
          <span className="chip">{s.points} pts</span>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#efe3b8] bg-white/95 backdrop-blur">
        <ul className="mx-auto flex max-w-2xl justify-around py-1.5">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`relative flex flex-col items-center px-2 py-1 text-[11px] ${path === l.href ? "font-bold text-sage-deep" : "text-[#8a7458]"}`}>
                <span className="text-lg">{l.i}</span>{l.t}
                {l.href === "/carrito" && count > 0 && <span className="absolute -right-0.5 top-0 rounded-full bg-rose-deep px-1.5 text-[10px] text-white">{count}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
