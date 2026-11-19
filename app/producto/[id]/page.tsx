import products from "@/data/products.json";
import Detail from "./Detail";
export function generateStaticParams() { return products.map((p) => ({ id: p.id })); }
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Detail id={id} />;
}
