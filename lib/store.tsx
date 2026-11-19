"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import products from "@/data/products.json";
import kits from "@/data/kits.json";

export type Product = { id: string; name: string; cat: string; sub: string; skin: string[]; hair: string[]; price: number; desc: string; days: number };
export type Kit = (typeof kits)[number];
export const PRODUCTS = products as unknown as Product[];
export const KITS = kits as Kit[];
export const KIT_DISCOUNT = 0.15;
export const cop = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");
export const productById = (id: string) => PRODUCTS.find((p) => p.id === id)!;
export const kitById = (id: string) => KITS.find((k) => k.id === id)!;
export const kitPrice = (k: Kit) => Math.round(k.items.reduce((s, id) => s + productById(id).price, 0) * (1 - KIT_DISCOUNT));
export const kitFullPrice = (k: Kit) => k.items.reduce((s, id) => s + productById(id).price, 0);

// Reglas de puntos (ficticias): 1 punto por cada $1.000 COP
export const POINTS_PER_1000 = 1;
export const REDEEM_DISCOUNT_COST = 150; // 150 pts = $15.000 de descuento
export const REDEEM_DISCOUNT_VALUE = 15000;
export const REDEEM_KIT_COST = 500; // 500 pts = kit gratis
export const FREE_KIT_ID = "k-cuerpo";
export const PROMO_CODE = "CIRCULO15"; // exclusivo clientas fieles (>= 100 puntos históricos)
export const PROMO_MIN_LIFETIME = 100;
export const PROMO_PCT = 0.15;
export const RESTOCK_PCT = 0.1;

export type Profile = { skin?: string; acne?: boolean; hair?: string; goal?: string; source?: "camara" | "test" };
export type Owned = { id: string; since: number };
export type State = {
  cart: Record<string, number>; // clave: id de producto o "kit:<id>"
  points: number;
  lifetime: number;
  profile: Profile;
  owned: Owned[];
  restock: string[];
  daysOffset: number;
  orders: { date: number; total: number; pts: number; items: string[] }[];
  freeKits: string[];
  consent: boolean;
};
const initial: State = { cart: {}, points: 0, lifetime: 0, profile: {}, owned: [], restock: [], daysOffset: 0, orders: [], freeKits: [], consent: false };

type Ctx = {
  s: State; ready: boolean;
  add: (key: string, q?: number) => void; remove: (key: string) => void; setQty: (key: string, q: number) => void;
  setProfile: (p: Profile) => void; setConsent: (v: boolean) => void;
  addOwned: (id: string) => void; addRestock: (id: string) => void; skipDays: (d: number) => void;
  checkout: (o: { total: number; useDiscount: boolean }) => number;
  redeemKit: () => boolean; reset: () => void;
};
const C = createContext<Ctx>(null as unknown as Ctx);
export const useStore = () => useContext(C);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem("beyond-skin"); if (raw) setS({ ...initial, ...JSON.parse(raw) }); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem("beyond-skin", JSON.stringify(s)); } catch {} }, [s, ready]);

  const add = useCallback((key: string, q = 1) => setS((p) => ({ ...p, cart: { ...p.cart, [key]: (p.cart[key] || 0) + q } })), []);
  const remove = useCallback((key: string) => setS((p) => { const c = { ...p.cart }; delete c[key]; return { ...p, cart: c, restock: p.restock.filter((r) => r !== key) }; }), []);
  const setQty = useCallback((key: string, q: number) => setS((p) => (q <= 0 ? { ...p, cart: Object.fromEntries(Object.entries(p.cart).filter(([k]) => k !== key)) } : { ...p, cart: { ...p.cart, [key]: q } })), []);
  const setProfile = useCallback((pr: Profile) => setS((p) => ({ ...p, profile: { ...p.profile, ...pr } })), []);
  const setConsent = useCallback((v: boolean) => setS((p) => ({ ...p, consent: v })), []);
  const addOwned = useCallback((id: string) => setS((p) => (p.owned.some((o) => o.id === id) ? p : { ...p, owned: [...p.owned, { id, since: Date.now() - p.daysOffset * 864e5 * -1 }] })), []);
  const addRestock = useCallback((id: string) => setS((p) => ({ ...p, cart: { ...p.cart, [id]: 1 }, restock: p.restock.includes(id) ? p.restock : [...p.restock, id] })), []);
  const skipDays = useCallback((d: number) => setS((p) => ({ ...p, daysOffset: p.daysOffset + d })), []);
  const checkout = useCallback(({ total, useDiscount }: { total: number; useDiscount: boolean }) => {
    const pts = Math.floor(total / 1000) * POINTS_PER_1000;
    setS((p) => {
      const now = Date.now() + p.daysOffset * 864e5;
      const bought: string[] = [];
      Object.entries(p.cart).forEach(([k, q]) => {
        if (k.startsWith("kit:")) kitById(k.slice(4)).items.forEach((i) => bought.push(i));
        else for (let n = 0; n < q; n++) bought.push(k);
      });
      const owned = [...p.owned.filter((o) => !bought.includes(o.id)), ...Array.from(new Set(bought)).map((id) => ({ id, since: now }))];
      return { ...p, cart: {}, restock: [], owned, points: p.points - (useDiscount ? REDEEM_DISCOUNT_COST : 0) + pts, lifetime: p.lifetime + pts, orders: [{ date: now, total, pts, items: bought }, ...p.orders] };
    });
    return pts;
  }, []);
  const redeemKit = useCallback(() => {
    let ok = false;
    setS((p) => {
      if (p.points < REDEEM_KIT_COST) return p;
      ok = true;
      const now = Date.now() + p.daysOffset * 864e5;
      const kit = kitById(FREE_KIT_ID);
      return { ...p, points: p.points - REDEEM_KIT_COST, freeKits: [...p.freeKits, FREE_KIT_ID], owned: [...p.owned.filter((o) => !kit.items.includes(o.id)), ...kit.items.map((id) => ({ id, since: now }))] };
    });
    return ok;
  }, []);
  const reset = useCallback(() => setS(initial), []);
  return <C.Provider value={{ s, ready, add, remove, setQty, setProfile, setConsent, addOwned, addRestock, skipDays, checkout, redeemKit, reset }}>{children}</C.Provider>;
}

export function recommend(profile: Profile) {
  const skin = profile.skin;
  const kit = profile.acne ? kitById("k-acne") : skin ? KITS.find((k) => k.need === skin) : undefined;
  const picks = PRODUCTS.filter((p) => {
    if (p.cat === "rostro") return (!!skin && (p.skin.includes(skin) || p.skin.includes("todas"))) || (!!profile.acne && p.skin.includes("acne"));
    if (p.cat === "cabello") return !!profile.hair && p.hair.includes(profile.hair);
    return false;
  });
  return { kit, picks };
}
