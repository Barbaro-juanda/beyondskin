// Ilustraciones minimalistas de envases (SVG de línea). Sustituibles por fotos reales de producto.
const SHAPE: Record<string, string> = { Sérum: "dropper", Hidratante: "jar", Mascarilla: "jar", "Mascarilla capilar": "jar", "Contorno de ojos": "tube", Limpiador: "pump", Tónico: "pump", Shampoo: "pump", Acondicionador: "pump", "Protector solar": "tube", "Protector solar corporal": "tube" };
export default function Art({ sub, className = "" }: { sub: string; className?: string }) {
  const k = SHAPE[sub] ?? "pump";
  return (
    <svg viewBox="0 0 100 120" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {k === "pump" && <><rect x="30" y="42" width="40" height="66" rx="10" /><rect x="42" y="30" width="16" height="12" rx="2" /><path d="M42 30V20h22v6" /><path d="M38 70h24M38 80h16" /></>}
      {k === "dropper" && <><rect x="32" y="52" width="36" height="56" rx="8" /><rect x="36" y="38" width="28" height="14" rx="3" /><path d="M50 38V16" /><circle cx="50" cy="12" r="7" /><path d="M40 78h20M40 88h12" /></>}
      {k === "jar" && <><rect x="22" y="56" width="56" height="48" rx="12" /><rect x="26" y="40" width="48" height="16" rx="4" /><path d="M36 80h28" /></>}
      {k === "tube" && <><path d="M34 22h32l-4 84H38z" /><rect x="36" y="12" width="28" height="10" rx="2" /><path d="M42 60h16" /></>}
    </svg>
  );
}
