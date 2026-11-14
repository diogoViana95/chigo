import { ProductPhoto } from '@/components/product-image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProductGallery } from '@/components/product-gallery';
import { prisma } from '@/lib/prisma';
import { products as starterProducts } from '@/lib/products';
import { parseProductImages } from '@/lib/product-media';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const revalidate = 3600;
function parseStringList(value: unknown): string[] { if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string'); if (typeof value !== 'string') return []; try { const parsed: unknown = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []; } catch { return []; } }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug, published: true } }).catch(() => null);
  const item = product ? { ...product, price: Number(product.price), imageUrl: product.imageUrl || '/chigo-logo.png' } : starterProducts.find(p => p.slug === slug);
  if (!item) notFound();
  const galleryImages = product ? parseProductImages(product.imageUrls).map(image => image.url) : [];
  const images = [...new Set([...galleryImages, item.imageUrl].filter(Boolean))];
  const relatedIds = product ? parseStringList(product.relatedProductIds) : [];
  const catalog = product ? await prisma.product.findMany({ where: { published: true }, orderBy: { featured: 'desc' }, take: 100 }).catch(() => []) : [];
  const dbRelated = product ? catalog.filter(p => p.id !== product.id && (relatedIds.includes(p.id) || parseStringList(p.relatedProductIds).includes(product.id))).slice(0, 4) : [];
  const related = dbRelated.length ? dbRelated.map(p => ({ ...p, price: Number(p.price), imageUrl: p.imageUrl || '/chigo-logo.png' })) : starterProducts.filter(p => p.slug !== item.slug && p.category === item.category).slice(0, 4);
  return <main className="min-h-screen">
    <header className="border-b"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link href="/" className="text-xl font-bold tracking-tight">chigo<span className="text-primary">.</span><span className="ml-2 text-[10px] font-normal uppercase tracking-widest text-muted-foreground">Creative Studio</span></Link><Button render={<Link href="/#collection"/>} variant="ghost" size="sm"><ArrowLeft/>Voltar à coleção</Button></div></header>
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-16"><ProductGallery images={images} alt={item.namePt}/><section className="flex flex-col items-start justify-center"><Badge variant="secondary" className="rounded-full">{item.category} · CHIGO STUDIO</Badge><h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{item.namePt}</h1><p className="mt-5 text-2xl font-medium tabular-nums">€ {item.price.toFixed(2)}</p><p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">{item.descriptionPt}</p><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{item.descriptionEn}</p><Button render={<Link href="/#collection"/>} size="lg" className="mt-8 rounded-full">Explorar a coleção<ArrowRight/></Button><p className="mt-4 text-xs text-muted-foreground">Feito por encomenda · Produzido em Portugal</p></section></div>
    {related.length>0&&<section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"><div className="mb-6"><p className="text-sm font-medium text-primary">TAMBÉM PODE GOSTAR</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Peças relacionadas</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map(p=><Link key={p.id} href={`/produtos/${p.slug}`}><Card className="overflow-hidden rounded-2xl py-0 transition-shadow hover:shadow-md"><div className="relative aspect-square bg-muted"><ProductPhoto src={p.imageUrl} alt={p.namePt} fill sizes="(max-width: 700px) 50vw, 25vw" className="object-cover"/></div><CardContent className="space-y-1 p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">{p.category}</p><h3 className="font-medium">{p.namePt}</h3><p className="text-sm">€ {p.price.toFixed(2)}</p></CardContent></Card></Link>)}</div></section>}
  </main>;
}
