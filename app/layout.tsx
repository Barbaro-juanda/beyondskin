import type { Metadata, Viewport } from "next";
import { Geist, Anton, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const dmSerif = DM_Serif_Display({ variable: "--font-dm-serif", subsets: ["latin"], weight: "400" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beyond Skin · Tu piel, tu rutina, tu comunidad",
  description: "Prototipo universitario de una marca ficticia de skincare. Productos y datos ficticios.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f5dd9c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${anton.variable} ${dmSerif.variable} antialiased`}>
      <body>
        <StoreProvider>
          <Nav />
          <main className="mx-auto w-full max-w-5xl px-4 py-4">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
