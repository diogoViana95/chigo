'use client';

import { ProductPhoto } from '@/components/product-image';
import { ViewTransition } from '@/components/view-transition';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ProductGallery({ images, alt, slug }: { images: string[]; alt: string; slug: string }) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] || images[0];
  return <div className="space-y-3">
    <ViewTransition name={`product-${slug}`} share="product-image-morph" default="none"><div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted"><ProductPhoto src={current} alt={alt} fill priority sizes="(max-width: 800px) 100vw, 55vw" className="object-cover"/></div></ViewTransition>
    {images.length > 1 && <div className="flex gap-2 overflow-x-auto pb-1">{images.map((src,index)=><Button key={`${src}-${index}`} variant="outline" aria-label={`Imagem ${index+1}`} aria-pressed={selected===index} className={`relative size-20 shrink-0 overflow-hidden rounded-xl p-0 ${selected===index?'ring-2 ring-primary ring-offset-2':''}`} onClick={()=>setSelected(index)}><ProductPhoto src={src} alt="" fill sizes="80px" className="object-cover"/></Button>)}</div>}
  </div>;
}
