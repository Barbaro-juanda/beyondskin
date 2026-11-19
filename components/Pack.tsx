import type { Product } from "@/lib/store";

// Render ilustrado de envase de la marca ficticia Beyond Skin: forma, color y fondo varían por producto.
const SHAPE: Record<string, string> = { Sérum: "dropper", "Tratamiento acné": "dropper", "Tratamiento cuero cabelludo": "dropper", "Aceite": "dropper", Uñas: "dropper", Hidratante: "jar", Mascarilla: "jar", "Mascarilla capilar": "jar", Manos: "jar", Pies: "jar", Exfoliante: "jar", "Contorno de ojos": "tube", "Protector solar": "tube", "Protector solar corporal": "tube", "Brazos y piernas": "tube", Estilizado: "tube", Limpiador: "pump", Tónico: "tall", Shampoo: "tall", Acondicionador: "tall", "Hidratante corporal": "pump", "Jabón íntimo": "pump", "Higiene íntima": "tube", Desodorante: "stick" };
const PAL = [
  { body: "#f5dd9c", cap: "#4b2e21", ink: "#4b2e21", bg: ["#fff8dc", "#f2e6b3"], accent: "#e9c46a" },
  { body: "#4b2e21", cap: "#f5dd9c", ink: "#f5dd9c", bg: ["#f2e6b3", "#e8cf8a"], accent: "#7a5240" },
  { body: "#ffffff", cap: "#c08a5a", ink: "#4b2e21", bg: ["#f4e8e0", "#e9d3c4"], accent: "#d9a98a" },
  { body: "#c08a5a", cap: "#fff8dc", ink: "#fff8dc", bg: ["#fbefc9", "#f5dd9c"], accent: "#8a5a35" },
  { body: "#e8d9b0", cap: "#6b7a4f", ink: "#4b2e21", bg: ["#eef0dc", "#d9dfb8"], accent: "#a3b07a" },
  { body: "#a3b07a", cap: "#4b2e21", ink: "#fffdf0", bg: ["#fff8dc", "#eef0dc"], accent: "#6b7a4f" },
  { body: "#d98c6a", cap: "#fff8dc", ink: "#fff8dc", bg: ["#fdeee2", "#f5cfb5"], accent: "#b86a4a" },
  { body: "#f2e6b3", cap: "#7a5240", ink: "#4b2e21", bg: ["#4b2e21", "#7a5240"], accent: "#f5dd9c" },
];
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const wrap = (name: string) => { const out: string[] = []; let cur = ""; name.replace(/\(.*?\)/g, "").split(" ").filter(Boolean).forEach((w) => { if ((cur + " " + w).trim().length > 11) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }); if (cur) out.push(cur); return out.slice(0, 3); };

export default function Pack({ p, className = "" }: { p: Product; className?: string }) {
  const h = hash(p.id), c = PAL[h % PAL.length], kind = SHAPE[p.sub] ?? "pump", g = "g" + p.id, bgShape = h % 3;
  const lines = wrap(p.name);
  const body = { pump: { x: 28, y: 50, w: 44, h: 68 }, dropper: { x: 30, y: 58, w: 40, h: 60 }, jar: { x: 20, y: 74, w: 60, h: 44 }, tube: { x: 30, y: 30, w: 40, h: 86 }, tall: { x: 31, y: 38, w: 38, h: 80 }, stick: { x: 33, y: 32, w: 34, h: 86 } }[kind]!;
  const lx = body.x + 4, lw = body.w - 8, ly = body.y + body.h * 0.28, lh = Math.min(body.h * 0.55, 38);
  return (
    <svg viewBox="0 0 100 125" className={className} role="img" aria-label={`${p.name} (ilustración)`}>
      <defs>
        <linearGradient id={g + "b"} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c.bg[0]} /><stop offset="1" stopColor={c.bg[1]} /></linearGradient>
        <linearGradient id={g + "s"} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset=".35" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".18" /></linearGradient>
      </defs>
      <rect width="100" height="125" fill={`url(#${g}b)`} />
      {bgShape === 0 && <path d="M14 125V58a36 36 0 0 1 72 0v67z" fill={c.accent} opacity=".45" />}
      {bgShape === 1 && <circle cx="50" cy="66" r="38" fill={c.accent} opacity=".45" />}
      {bgShape === 2 && <><circle cx="76" cy="26" r="16" fill={c.accent} opacity=".5" /><circle cx="20" cy="100" r="22" fill={c.accent} opacity=".3" /></>}
      <ellipse cx="50" cy="119" rx={body.w / 2 + 8} ry="3.5" fill="#4b2e21" opacity=".18" />
      {kind === "pump" && <><rect x="43" y="40" width="14" height="10" fill={c.cap} /><rect x="44" y="30" width="12" height="10" rx="2" fill={c.cap} /><path d="M50 32h14v5h-14z" fill={c.cap} /></>}
      {kind === "dropper" && <><rect x="37" y="46" width="26" height="12" rx="2" fill={c.cap} /><rect x="42" y="18" width="16" height="30" rx="8" fill={c.cap} /></>}
      {kind === "jar" && <rect x="18" y="56" width="64" height="20" rx="5" fill={c.cap} />}
      {kind === "tube" && <><rect x="34" y="16" width="32" height="15" rx="3" fill={c.cap} /><rect x="32" y="112" width="36" height="6" rx="1" fill={c.cap} /></>}
      {kind === "tall" && <><rect x="37" y="22" width="26" height="17" rx="4" fill={c.cap} /></>}
      {kind === "stick" && <><rect x="32" y="16" width="36" height="20" rx="8" fill={c.cap} /></>}
      <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={kind === "jar" ? 8 : 10} fill={c.body} stroke="#4b2e21" strokeOpacity=".08" />
      <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={kind === "jar" ? 8 : 10} fill={`url(#${g}s)`} />
      <g fill={c.ink} style={{ fontFamily: "var(--font-anton), Impact, sans-serif", textTransform: "uppercase" }} textAnchor="middle">
        <text x="50" y={ly} fontSize="3.6" letterSpacing=".6" opacity=".8">BEYOND SKIN</text>
        {lines.map((l, i) => <text key={i} x="50" y={ly + 8 + i * 6.2} fontSize={lw < 40 ? 5.6 : 6.4}>{l}</text>)}
        <text x="50" y={ly + 9 + lines.length * 6.2} fontSize="3" opacity=".75" letterSpacing=".4">{p.sub}</text>
      </g>
    </svg>
  );
}
