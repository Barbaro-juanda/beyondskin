# Beyond Skin — *Tu piel, tu rutina, tu comunidad.*

Prototipo universitario (Next.js App Router + TypeScript + Tailwind). **Beyond Skin es una marca ficticia**: productos, precios, puntos y textos son de ejemplo. **Ningún resultado es un diagnóstico médico.**

Paleta: butter yellow `#F5DD9C` / whipped butter `#F2E6B3` (primario), blanco (secundario), café cuero `#4B2E21` (terciario). Tipografías: Anton (títulos) y DM Serif Display (marca).

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Sin backend: el estado (carrito, puntos, perfil, recordatorios) vive en `localStorage`. El botón "Borrar mis datos locales" (pestaña Puntos) lo limpia. La cámara requiere `localhost` o HTTPS.

## Qué funciona de verdad

- Catálogo de 38 productos ficticios (rostro, cabello, cuerpo, manos y pies, zona íntima) con filtros por categoría, tipo de piel y tipo de cabello (`data/products.json`).
- Carrito, checkout **simulado** (no se piden ni procesan datos de pago), kits con 15 % de descuento (`data/kits.json`).
- Puntos (1 por cada $1.000 COP), canje de $15.000 de descuento por 150 pts o kit gratis por 500 pts, código `CIRCULO15` (15 %) que se desbloquea con 100 puntos históricos.
- Recordatorios de recompra según la duración estimada de cada producto, con 10 % de descuento; botón de demo para avanzar 30 días.
- Pantalla de consentimiento antes de la cámara (con opción de rechazar) y test manual alternativo.
- Captura de fotogramas con `getUserMedia` (uno cada 2 s durante ~10 s) y análisis de píxeles en el navegador: **ninguna imagen se guarda ni se envía**.
- Recomendación de kit/productos según el resultado, conectada al carrito y a los puntos.

## Qué está simulado o es heurístico

- **Análisis por cámara** (`lib/skin.ts`): no es un modelo de visión entrenado. Mide brillo (zona T vs. mejillas), textura, enrojecimiento y puntos rojizos en un óvalo central, con umbrales aproximados que **no están validados** clínicamente. Para conectar un modelo real (MediaPipe Face Landmarker o TensorFlow.js) hay comentarios en ese archivo. El acné se muestra como etiqueta adicional, no como tipo de piel.
- **Asesoría con productos que ya tiene** (`app/asesoria`): lee la etiqueta con OCR en el navegador (Tesseract.js, español e inglés) y busca palabras clave ("bloqueador", "serum", "shampoo"…) para identificar el producto y explicar su uso. Es real pero limitado: depende de la calidad de la foto y de las palabras clave; si falla, la clienta elige el tipo. Los datos de idioma de Tesseract se descargan de un CDN; la foto no se envía a ningún servidor.
- Pagos, puntos, códigos y "usuarias" son locales y ficticios; cualquiera podría modificar `localStorage`.

## Fuentes (tipos de piel)

Consultadas en la American Academy of Dermatology (AAD):

- [Skin care tips dermatologists use](https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-tips-dermatologists-use) — la AAD clasifica la piel en oily, dry, normal, combination y sensitive (esta página las enumera, sin definirlas).
- [How to pick the right moisturizer for your skin](https://www.aad.org/public/everyday-care/skin-care-basics/dry/pick-moisturizer) — piel mixta con zona T (frente, nariz, mentón); recomendaciones de hidratante por tipo; en piel sensible evitar fragancia, alcohol y AHAs.
- [Acne: Signs and symptoms](https://www.aad.org/public/diseases/acne/really-acne/symptoms) y [Acne: Overview](https://www.aad.org/public/diseases/acne/really-acne/overview) — signos de acné y cuándo acudir a un dermatólogo.

Importante: la AAD **no publica un método de clasificación por imagen**. Los criterios de píxeles de este prototipo son una aproximación propia y las descripciones breves de cada tipo (p. ej. "tirante", "brillo") son heurísticas del prototipo, no citas de la AAD. Conviene revisarlos con un profesional.

## Avisos legales

- **Ley 1581 de 2012 (Colombia)**: la imagen del rostro es un dato biométrico sensible. En este prototipo se pide consentimiento explícito y no se almacena ni transmite. Si se llevara a producción, se necesitaría política de tratamiento de datos, autorización previa, expresa e informada, y revisión jurídica.
- **Zona íntima**: solo higiene externa, sin afirmaciones de tratamiento; aviso de consultar a un profesional de la salud.
- Productos cosméticos reales requieren cumplimiento sanitario (INVIMA, notificación sanitaria cosmética) y las alegaciones publicitarias deben ser verificables. Aquí todo es ficticio.

## Despliegue en Vercel

1. Entra a <https://vercel.com/new> e inicia sesión con GitHub.
2. *Import Git Repository* → elige `Barbaro-juanda/beyondskin` (si no aparece, "Adjust GitHub App Permissions" y da acceso al repo).
3. Framework: Next.js (autodetectado). No hace falta variable de entorno. *Deploy*.
4. Cada `git push` a `main` redespliega solo.
