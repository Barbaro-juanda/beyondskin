import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Nav from "@/components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beyond Skin · Tu piel, tu rutina, tu comunidad",
  description: "Prototipo universitario de una marca ficticia de skincare. Productos y datos ficticios.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fbefb4" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} antialiased`}>
      <body>
        <StoreProvider>
          <Nav />
          <main className="mx-auto w-full max-w-2xl px-4 py-4">{children}</main>
          <p className="mx-auto max-w-2xl px-4 pb-4 text-center text-xs text-[#8a7458]">
            Beyond Skin es una marca ficticia (prototipo universitario). Productos, precios y textos son de ejemplo. Nada aquí es un diagnóstico médico.
          </p>
        </StoreProvider>
      </body>
    </html>
  );
}
