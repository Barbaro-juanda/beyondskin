"use client";
import { useStore, productById, kitById, cop, REDEEM_DISCOUNT_COST, REDEEM_DISCOUNT_VALUE, REDEEM_KIT_COST, FREE_KIT_ID, PROMO_CODE, PROMO_MIN_LIFETIME, RESTOCK_PCT } from "@/lib/store";
import { useState } from "react";

export default function Cuenta() {
  const { s, ready, redeemKit, addRestock, skipDays, reset } = useStore();
  const [m, setM] = useState("");
  if (!ready) return null;
  const now = Date.now() + s.daysOffset * 864e5;
  const rem = s.owned.map((o) => {
    const p = productById(o.id);
    const left = Math.round(p.days - (now - o.since) / 864e5);
    return { o, p, left };
  }).sort((a, b) => a.left - b.left);
  const loyal = s.lifetime >= PROMO_MIN_LIFETIME;

  return (
    <div className="space-y-4">
      <h1 className="h1">Puntos y billetera 💳</h1>
      <div className="card bg-gradient-to-br from-rose to-[#f2e6b3] text-center">
        <p className="muted">Tus puntos</p><p className="text-4xl font-bold text-sage-deep">{s.points}</p>
        <p className="muted">1 punto por cada $1.000 COP comprados (puntos ficticios).</p>
      </div>
      <div className="card space-y-2">
        <h2 className="font-semibold">Canjes</h2>
        <p className="text-sm">• {REDEEM_DISCOUNT_COST} pts = {cop(REDEEM_DISCOUNT_VALUE)} de descuento (se aplica en el carrito).</p>
        <p className="text-sm">• {REDEEM_KIT_COST} pts = {kitById(FREE_KIT_ID).name} gratis.</p>
        <button className="btn" disabled={s.points < REDEEM_KIT_COST} onClick={() => setM(redeemKit() ? "¡Kit canjeado! Quedó en tus productos." : "Puntos insuficientes.")}>Canjear kit gratis</button>
        {m && <p className="text-sm text-sage-deep">{m}</p>}
      </div>
      <div className="card space-y-1">
        <h2 className="font-semibold">Código exclusivo 💌</h2>
        {loyal ? <p>Tu código: <b className="rounded bg-nude px-2 py-0.5">{PROMO_CODE}</b> — 15% en tu próxima compra.</p> : <p className="muted">Acumula {PROMO_MIN_LIFETIME} puntos históricos para desbloquear un código exclusivo (llevas {s.lifetime}).</p>}
      </div>
      <div className="card space-y-2">
        <div className="flex items-center justify-between"><h2 className="font-semibold">Recordatorios de recompra ⏰</h2></div>
        {!rem.length && <p className="muted">Cuando compres o canjees productos, te avisaremos cuándo se acaban.</p>}
        {rem.map(({ p, left }) => (
          <div key={p.id} className="flex items-center justify-between gap-2 border-t border-[#f3ead0] pt-2 text-sm">
            <div><b>{p.name}</b><p className={left <= 7 ? "text-xs text-rose-deep" : "muted"}>{left <= 0 ? "¡Se acabó o está por acabarse!" : `Te quedan ~${left} días`}</p></div>
            {left <= 14 && <button className="btn btn-soft !px-3 !py-1.5" onClick={() => addRestock(p.id)}>Recomprar -{RESTOCK_PCT * 100}%</button>}
          </div>
        ))}
        {rem.length > 0 && <button className="btn btn-ghost" onClick={() => skipDays(30)}>Demo: avanzar 30 días</button>}
      </div>
      {s.orders.length > 0 && (
        <div className="card"><h2 className="font-semibold">Historial</h2>{s.orders.map((o, i) => <p key={i} className="muted">{new Date(o.date).toLocaleDateString("es-CO")} · {cop(o.total)} · +{o.pts} pts</p>)}</div>
      )}
      <button className="text-xs text-[#8a7458] underline" onClick={() => { if (confirm("¿Borrar todos los datos guardados en este navegador?")) reset(); }}>Borrar mis datos locales</button>
    </div>
  );
}
