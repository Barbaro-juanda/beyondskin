"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore, productById, kitById, kitPrice, cop, PROMO_CODE, PROMO_MIN_LIFETIME, PROMO_PCT, RESTOCK_PCT, REDEEM_DISCOUNT_COST, REDEEM_DISCOUNT_VALUE } from "@/lib/store";

export default function Carrito() {
  const { s, setQty, remove, checkout } = useStore();
  const [code, setCode] = useState("");
  const [useDisc, setUseDisc] = useState(false);
  const [done, setDone] = useState<{ total: number; pts: number } | null>(null);
  const lines = Object.entries(s.cart).map(([key, q]) => {
    const isKit = key.startsWith("kit:");
    const name = isKit ? kitById(key.slice(4)).name : productById(key).name;
    const unit = isKit ? kitPrice(kitById(key.slice(4))) : productById(key).price;
    const rs = s.restock.includes(key);
    return { key, q, name, unit: rs ? Math.round(unit * (1 - RESTOCK_PCT)) : unit, rs };
  });
  const sub = lines.reduce((a, l) => a + l.unit * l.q, 0);
  const promoOk = code.trim().toUpperCase() === PROMO_CODE && s.lifetime >= PROMO_MIN_LIFETIME;
  const promo = promoOk ? Math.round(sub * PROMO_PCT) : 0;
  const disc = useDisc ? Math.min(REDEEM_DISCOUNT_VALUE, sub - promo) : 0;
  const total = Math.max(sub - promo - disc, 0);

  if (done) return (
    <div className="card space-y-2 text-center">
      <p className="text-3xl">🎉</p><h1 className="h1">¡Compra simulada exitosa!</h1>
      <p>Total {cop(done.total)} · Ganaste <b>{done.pts} puntos</b>.</p>
      <p className="muted">No se realizó ningún pago real.</p>
      <Link href="/cuenta" className="btn">Ver mis puntos</Link>
    </div>
  );

  return (
    <div className="space-y-3">
      <h1 className="h1">Carrito 🛍️</h1>
      {!lines.length && <p className="muted">Tu carrito está vacío. <Link href="/catalogo" className="underline">Ir a la tienda</Link></p>}
      {lines.map((l) => (
        <div key={l.key} className="card flex items-center justify-between gap-2">
          <div><p className="text-sm font-semibold">{l.name}{l.rs && <span className="chip ml-1">-10% recompra</span>}</p><p className="muted">{cop(l.unit)}</p></div>
          <div className="flex items-center gap-2">
            <button className="chip" onClick={() => setQty(l.key, l.q - 1)}>−</button>{l.q}<button className="chip" onClick={() => setQty(l.key, l.q + 1)}>+</button>
            <button className="text-xs text-rose-deep" onClick={() => remove(l.key)}>Quitar</button>
          </div>
        </div>
      ))}
      {lines.length > 0 && (
        <div className="card space-y-3">
          <div>
            <input className="input" placeholder="Código promocional" value={code} onChange={(e) => setCode(e.target.value)} />
            {code && !promoOk && <p className="muted mt-1">{code.trim().toUpperCase() === PROMO_CODE ? `Exclusivo para clientas fieles (${PROMO_MIN_LIFETIME}+ puntos acumulados).` : "Código no válido."}</p>}
            {promoOk && <p className="mt-1 text-xs text-sage-deep">Código aplicado: -{PROMO_PCT * 100}%</p>}
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" disabled={s.points < REDEEM_DISCOUNT_COST} checked={useDisc} onChange={(e) => setUseDisc(e.target.checked)} /> Canjear {REDEEM_DISCOUNT_COST} pts por {cop(REDEEM_DISCOUNT_VALUE)} de descuento (tienes {s.points})</label>
          <div className="space-y-0.5 text-sm">
            <p className="flex justify-between"><span>Subtotal</span>{cop(sub)}</p>
            {promo > 0 && <p className="flex justify-between"><span>Código</span>-{cop(promo)}</p>}
            {disc > 0 && <p className="flex justify-between"><span>Puntos</span>-{cop(disc)}</p>}
            <p className="flex justify-between text-base font-bold"><span>Total</span>{cop(total)}</p>
            <p className="muted">Ganarás {Math.floor(total / 1000)} puntos con esta compra.</p>
          </div>
          <button className="btn w-full" onClick={() => { const pts = checkout({ total, useDiscount: useDisc && disc > 0 }); setDone({ total, pts }); }}>Pagar (simulado)</button>
          <p className="muted text-center">Checkout de prueba: no se pide ni procesa ningún dato de pago.</p>
        </div>
      )}
    </div>
  );
}
