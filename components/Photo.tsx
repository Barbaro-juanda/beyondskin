/* eslint-disable @next/next/no-img-element */
// Fotos de Pexels (licencia gratuita de Pexels). Se enlazan desde su CDN; ilustrativas, no muestran el resultado de la clienta.
export const px = (id: number, w = 900) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
export default function Photo({ id, alt, className = "" }: { id: number; alt: string; className?: string }) {
  return <img src={px(id)} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}
