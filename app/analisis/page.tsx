"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useStore, recommend, cop, kitPrice, kitFullPrice, Profile } from "@/lib/store";
import { analyzeFrame, classify, SKIN_INFO, SkinResult } from "@/lib/skin";
import ProductCard from "@/components/ProductCard";
import Photo from "@/components/Photo";

type Mode = "inicio" | "consent" | "camara" | "test" | "resultado";
const SKIN_Q = [
  { v: "seca", t: "Se siente tirante o áspera" },
  { v: "grasa", t: "Brillo en todo el rostro" },
  { v: "mixta", t: "Brillo solo en frente, nariz y mentón" },
  { v: "sensible", t: "Arde o se enrojece con facilidad" },
  { v: "normal", t: "Cómoda, sin brillo ni tirantez" },
];
const GOALS = ["Hidratar", "Controlar brillo", "Manchas / luminosidad", "Reducir imperfecciones", "Protección solar", "Cuidado general"];
const HAIR = [["graso", "Graso"], ["seco", "Seco"], ["rizado", "Rizado"], ["caida", "Con caída"], ["normal", "Normal"]];

export default function Analisis() {
  const { s, setProfile, setConsent } = useStore();
  const [mode, setMode] = useState<Mode>("inicio");
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SkinResult | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [q, setQ] = useState<Profile>({});

  const stopCam = () => { stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null; };
  useEffect(() => stopCam, []);

  async function startCamera() {
    setMsg("");
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      setMode("camara");
      setTimeout(() => { if (video.current) { video.current.srcObject = stream.current; video.current.play(); } }, 50);
    } catch {
      setMsg("No pudimos abrir la cámara (permiso denegado o no disponible). Puedes usar el test manual.");
    }
  }

  async function runAnalysis() {
    const frames = [];
    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, 2000)); // un fotograma cada 2 s durante ~10 s
      if (video.current && canvas.current) frames.push(analyzeFrame(video.current, canvas.current));
      setProgress((i + 1) * 20);
    }
    stopCam();
    const r = classify(frames); // los fotogramas solo existen en memoria; no se guardan ni se envían
    setResult(r);
    setProfile({ skin: r.skin, acne: r.acne, source: "camara" });
    setMode("resultado");
  }

  const profile = s.profile;
  const { kit, picks } = recommend(profile);

  return (
    <div className="space-y-4">
      <h1 className="h1">Mi piel</h1>
      <p className="muted">Resultado orientativo, no es un diagnóstico médico.</p>

      {mode === "inicio" && <Photo id={6642970} alt="Textura de piel (imagen ilustrativa)" className="h-44 w-full rounded-3xl" />}
      {mode === "inicio" && (
        <div className="space-y-3">
          <button className="card w-full text-left" onClick={() => setMode(s.consent ? "consent" : "consent")}>
            <b> Análisis con cámara</b><span className="muted block">~10 segundos. Se procesa en tu navegador.</span>
          </button>
          <button className="card w-full text-left" onClick={() => setMode("test")}>
            <b> Test manual</b><span className="muted block">Sin cámara: unas preguntas rápidas.</span>
          </button>
        </div>
      )}

      {mode === "consent" && (
        <div className="card space-y-3">
          <h2 className="font-semibold">Antes de abrir la cámara</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Usaremos la imagen de tu rostro solo para estimar tu tipo de piel.</li>
            <li>El análisis ocurre en tu dispositivo: <b>no guardamos ni enviamos</b> ninguna imagen.</li>
            <li>Las imágenes faciales son datos biométricos sensibles (Ley 1581 de 2012, Colombia). Es voluntario y puedes rechazar; no necesitas la cámara para usar la app.</li>
          </ul>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" checked={s.consent} onChange={(e) => setConsent(e.target.checked)} />
            Autorizo, de forma libre e informada, el uso de mi imagen facial para este análisis puntual.
          </label>
          {msg && <p className="text-sm text-rose-deep">{msg}</p>}
          <div className="flex gap-2">
            <button className="btn" disabled={!s.consent} onClick={startCamera}>Aceptar y abrir cámara</button>
            <button className="btn btn-ghost" onClick={() => { setConsent(false); setMode("test"); }}>Rechazar, usar test</button>
          </div>
        </div>
      )}

      {mode === "camara" && (
        <div className="card space-y-3 text-center">
          <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl bg-black">
            <video ref={video} playsInline muted className="aspect-[3/4] w-full -scale-x-100 object-cover" />
            <div className="pointer-events-none absolute inset-0 m-auto h-[85%] w-[65%] rounded-[50%] border-2 border-dashed border-white/80" />
          </div>
          <canvas ref={canvas} className="hidden" />
          <p className="muted">Ubica tu rostro en el óvalo, con luz natural y sin maquillaje si es posible.</p>
          {progress > 0 ? (
            <div><div className="h-2 rounded-full bg-nude"><div className="h-2 rounded-full bg-sage-deep transition-all" style={{ width: `${progress}%` }} /></div><p className="muted mt-1">Analizando… {progress}%</p></div>
          ) : (
            <button className="btn" onClick={runAnalysis}>Iniciar análisis (10 s)</button>
          )}
          <button className="btn btn-ghost" onClick={() => { stopCam(); setProgress(0); setMode("inicio"); }}>Cancelar</button>
        </div>
      )}

      {mode === "test" && (
        <div className="card space-y-4">
          <div>
            <h2 className="font-semibold">1. Una hora después de lavar tu rostro, ¿cómo se siente?</h2>
            <div className="mt-2 flex flex-wrap gap-2">{SKIN_Q.map((o) => <button key={o.v} className={`chip ${q.skin === o.v ? "chip-on" : ""}`} onClick={() => setQ({ ...q, skin: o.v })}>{o.t}</button>)}</div>
          </div>
          <div>
            <h2 className="font-semibold">2. ¿Qué buscas principalmente?</h2>
            <div className="mt-2 flex flex-wrap gap-2">{GOALS.map((g) => <button key={g} className={`chip ${q.goal === g ? "chip-on" : ""}`} onClick={() => setQ({ ...q, goal: g })}>{g}</button>)}</div>
          </div>
          <div>
            <h2 className="font-semibold">3. Tu tipo de cabello</h2>
            <div className="mt-2 flex flex-wrap gap-2">{HAIR.map(([v, l]) => <button key={v} className={`chip ${q.hair === v ? "chip-on" : ""}`} onClick={() => setQ({ ...q, hair: v })}>{l}</button>)}</div>
          </div>
          <div>
            <h2 className="font-semibold">4. Preocupaciones</h2>
            <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={!!q.acne} onChange={(e) => setQ({ ...q, acne: e.target.checked })} /> Tengo granitos / acné con frecuencia</label>
          </div>
          <div className="flex gap-2">
            <button className="btn" disabled={!q.skin} onClick={() => { setProfile({ ...q, source: "test" }); setResult(null); setMode("resultado"); }}>Ver resultado</button>
            <button className="btn btn-ghost" onClick={() => setMode("inicio")}>Volver</button>
          </div>
        </div>
      )}

      {mode === "resultado" && profile.skin && (
        <div className="space-y-4">
          <div className="card space-y-2">
            <p className="muted">Resultado {profile.source === "camara" ? "del análisis por cámara (heurístico)" : "del test manual"}</p>
            <h2 className="text-xl font-bold">Piel {SKIN_INFO[profile.skin].label.toLowerCase()}</h2>
            <p className="text-sm">{SKIN_INFO[profile.skin].text}</p>
            {profile.source === "camara" && (
              <div className="rounded-xl bg-nude p-2 text-xs">
                <p className="mb-1">La cámara es una estimación. ¿Tu piel se siente distinta? Corrígela:</p>
                <div className="flex flex-wrap gap-1.5">{Object.entries(SKIN_INFO).map(([k, v]) => <button key={k} className={`chip ${profile.skin === k ? "chip-on" : ""}`} onClick={() => setProfile({ skin: k })}>{v.label}</button>)}</div>
              </div>
            )}
            {profile.acne && <p className="chip">Signos de acné (etiqueta adicional, no es un tipo de piel)</p>}
            {result?.reasons.map((r) => <p key={r} className="muted">• {r}</p>)}
            <p className="rounded-xl bg-nude p-2 text-xs">Resultado orientativo, no es un diagnóstico médico. Si tienes acné intenso, dolor, cicatrices o dudas, consulta a un dermatólogo.</p>
          </div>
          {kit && (
            <div className="card space-y-2">
              <h3 className="font-semibold"> {kit.name}</h3>
              <p className="muted">{kit.desc}</p>
              <p><b className="text-sage-deep">{cop(kitPrice(kit))}</b> <s className="muted">{cop(kitFullPrice(kit))}</s></p>
              <Link href="/kits" className="btn">Ver kit y agregar</Link>
            </div>
          )}
          <div className="space-y-2">
            <h3 className="serif text-2xl">No estás sola: tu piel es parte de la comunidad</h3>
            <div className="grid grid-cols-4 gap-2">{[3431739, 7479659, 9038626, 5007995].map((id) => <Photo key={id} id={id} alt="Persona con piel natural (imagen ilustrativa)" className="aspect-[3/4] w-full rounded-2xl" />)}</div>
            <p className="muted">Pieles distintas, una misma comunidad. Fotos ilustrativas de Pexels: no representan un tipo de piel ni un resultado.</p>
          </div>
          <h3 className="font-semibold">Productos sugeridos</h3>
          <div className="grid grid-cols-2 gap-3">{picks.slice(0, 6).map((p) => <ProductCard key={p.id} p={p} />)}</div>
          <button className="btn btn-ghost" onClick={() => { setMode("inicio"); setProgress(0); }}>Repetir análisis</button>
        </div>
      )}
    </div>
  );
}
