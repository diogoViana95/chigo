'use client';

import { ProductPhoto } from '@/components/product-image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Menu, Moon, Plus, ShoppingBag, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { Product } from '@/lib/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

export function Storefront({ items }: { items: Product[] }) {
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [orderError, setOrderError] = useState('');
  const { theme, setTheme } = useTheme();
  const en = lang === 'en';
  const featured = items.filter(product => product.featured);
  const rest = items.filter(product => !product.featured);
  const total = cart.reduce((sum, product) => sum + product.price, 0);
  const copy = {
    collection: en ? 'THE COLLECTION' : 'A COLEÇÃO',
    selected: en ? 'Objects made to stay.' : 'Objectos feitos para ficar.',
    intro: en ? 'Considered forms. Made layer by layer.' : 'Formas pensadas. Feitas camada a camada.',
    browse: en ? 'Explore collection' : 'Explorar coleção',
    featured: en ? 'Selected pieces' : 'Peças em destaque',
    all: en ? 'The full collection' : 'A coleção completa',
    order: en ? 'Request order' : 'Pedir encomenda',
    note: en ? 'Choose your pieces and leave your number. We’ll get in touch to confirm details, payment and delivery.' : 'Escolha as suas peças e deixe o seu número. Entramos em contacto para combinar os detalhes, o pagamento e a entrega.',
    name: en ? 'Your name' : 'O seu nome',
    phone: en ? 'Mobile number' : 'Número de telemóvel',
    extra: en ? 'Anything else?' : 'Alguma nota?',
  };
  const add = (product: Product) => { setCart(current => [...current, product]); setCartOpen(true); };

  return <>
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#top" className="flex items-baseline gap-2 text-2xl font-bold tracking-tight">chigo<span className="text-primary">.</span><span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:inline">Creative Studio</span></Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"><a href="#collection" className="transition-colors hover:text-foreground">{en ? 'Collection' : 'Coleção'}</a><a href="#story" className="transition-colors hover:text-foreground">{en ? 'Our process' : 'O processo'}</a></nav>
        <div className="hidden items-center gap-2 md:flex"><Button variant="ghost" size="sm" onClick={() => setLang(en ? 'pt' : 'en')}>{en ? 'PT' : 'EN'}</Button><Button variant="outline" size="icon" aria-label={en ? 'Toggle theme' : 'Mudar tema'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun/> : <Moon/>}</Button><Button variant="secondary" onClick={() => setCartOpen(true)}><ShoppingBag/><span>{en ? 'Bag' : 'Cesto'}</span><Badge variant="outline" className="ml-1 tabular-nums">{cart.length}</Badge></Button></div>
        <div className="flex items-center gap-2 md:hidden"><Button variant="outline" size="icon" aria-label={en ? 'Open cart' : 'Abrir cesto'} onClick={() => setCartOpen(true)}><ShoppingBag/><span className="sr-only">{cart.length}</span></Button><Sheet><SheetTrigger render={<Button variant="outline" size="icon" aria-label={en ? 'Open navigation' : 'Abrir navegação'}/> }><Menu/></SheetTrigger><SheetContent side="right" className="w-[min(86vw,22rem)]"><SheetHeader><SheetTitle className="text-left">chigo<span className="text-primary">.</span></SheetTitle><SheetDescription>{en ? 'Creative Studio' : 'Peças criadas com intenção'}</SheetDescription></SheetHeader><nav className="mt-8 grid gap-2"><Button render={<a href="#collection"/>} variant="ghost" className="justify-start">{en ? 'Collection' : 'Coleção'}</Button><Button render={<a href="#story"/>} variant="ghost" className="justify-start">{en ? 'Our process' : 'O processo'}</Button><Button variant="ghost" className="justify-start" onClick={() => setLang(en ? 'pt' : 'en')}>{en ? 'Mudar para Português' : 'Switch to English'}</Button><Button variant="ghost" className="justify-start" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</Button></nav><SheetFooter><SheetClose render={<Button variant="outline"/>}>{en ? 'Close' : 'Fechar'}</SheetClose></SheetFooter></SheetContent></Sheet></div>
      </div>
    </header>

    <main id="top">
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="secondary" className="gap-2 rounded-full px-3 py-1"><span className="size-1.5 rounded-full bg-primary"/>{copy.collection}</Badge>
          <div className="space-y-4"><h1 className="max-w-2xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-7xl">{en ? <>Objects<br/>with <span className="bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">character.</span></> : <>Objectos<br/>com <span className="bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">carácter.</span></>}</h1><p className="max-w-lg text-base text-muted-foreground sm:text-lg">{copy.intro}</p></div>
          <Button render={<a href="#collection"/>} size="lg" className="gap-2 rounded-full">{copy.browse}<ArrowRight/></Button>
          <div className="mt-4 flex w-full max-w-md items-center justify-between border-t pt-4 text-xs text-muted-foreground"><span>{String(items.length).padStart(2, '0')} {en ? 'OBJECTS' : 'PEÇAS'}</span><span>{en ? 'Small batch · Made to order' : 'Pequena série · Feito por encomenda'}</span></div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-[2rem] border bg-gradient-to-br from-violet-500/10 via-background to-cyan-400/15 p-6 sm:p-10">
          <div className="absolute inset-8 rounded-full border border-primary/15 bg-gradient-to-br from-violet-500/15 to-cyan-400/10"/><div className="absolute inset-14 overflow-hidden rounded-full border bg-card shadow-2xl sm:inset-20"><ProductPhoto src={items[0]?.imageUrl || '/chigo-logo.png'} alt={items[0]?.namePt || 'Peça de design chigo'} fill priority sizes="(max-width: 768px) 90vw, 50vw" className="object-cover"/></div>
          <Badge className="absolute left-5 top-5 rounded-full" variant="secondary">{en ? 'Made in Portugal' : 'Feito em Portugal'}</Badge><div className="absolute bottom-5 right-5 rounded-xl border bg-card/90 px-3 py-2 text-xs shadow-sm backdrop-blur"><span className="block font-medium">CHIGO / 01</span><span className="text-muted-foreground">3D printed design</span></div>
        </div>
      </section>

      <div className="border-y bg-muted/40"><div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-8 gap-y-2 px-4 py-4 text-center text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground sm:px-6"><span>Designed with purpose</span><span className="text-primary">✳</span><span>Printed in Portugal</span><span className="text-primary">✳</span><span>Made to last</span></div></div>

      <section id="collection" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-primary">02 / {copy.collection}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{copy.featured}</h2></div><Button render={<a href="#all-products"/>} variant="ghost" className="hidden gap-1 sm:inline-flex">{en ? 'View all' : 'Ver coleção'}<ArrowUpRight/></Button></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featured.map((product,index)=><ProductCard key={product.id} product={product} index={index} lang={lang} onAdd={add}/>)}</div>
        {rest.length>0&&<div id="all-products" className="scroll-mt-24 pt-16"><div className="mb-8 flex items-end justify-between"><div><p className="text-sm font-medium text-primary">03 / {en ? 'OBJECTS FOR EVERY DAY' : 'OBJECTOS DO DIA A DIA'}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{copy.all}</h2></div><Badge variant="outline">{String(rest.length).padStart(2,'0')} {en ? 'ITEMS' : 'PEÇAS'}</Badge></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rest.map((product,index)=><ProductCard key={product.id} product={product} index={index+featured.length} lang={lang} onAdd={add}/>)}</div></div>}
      </section>

      <section id="story" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8"><Card className="overflow-hidden rounded-[2rem] border-0 bg-foreground text-background shadow-none"><CardContent className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[0.6fr_1.4fr] lg:p-16"><div className="text-8xl font-bold tracking-[-0.1em] text-background/10 sm:text-9xl">c<span className="text-primary">.</span></div><div className="max-w-2xl"><Badge variant="secondary" className="rounded-full">04 / {en ? 'MADE DIFFERENTLY' : 'FEITO DE FORMA DIFERENTE'}</Badge><h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{en ? <>A little more thought in <span className="text-primary">every layer.</span></> : <>Mais intenção em <span className="text-primary">cada camada.</span></>}</h2><p className="mt-5 max-w-xl leading-7 text-background/65">{en ? 'We turn digital ideas into useful, tactile objects. Each piece is printed on demand, with care for form, material and the little details.' : 'Transformamos ideias digitais em objectos úteis e tácteis. Cada peça é impressa por encomenda, com atenção à forma, ao material e aos pequenos detalhes.'}</p><Button render={<a href="#collection"/>} variant="secondary" className="mt-7 rounded-full">{en ? 'Find your piece' : 'Encontre a sua peça'}<ArrowRight/></Button></div></CardContent></Card></section>
    </main>

    <footer className="border-t"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><Link href="#top" className="text-xl font-bold tracking-tight">chigo<span className="text-primary">.</span><span className="ml-2 text-[10px] font-normal uppercase tracking-widest text-muted-foreground">Creative Studio</span></Link><span className="text-xs text-muted-foreground">© 2025 CHIGO. {en ? 'All rights reserved' : 'Todos os direitos reservados'}</span><div className="flex gap-4 text-xs text-muted-foreground"><a href="https://www.instagram.com/chigo.studio" target="_blank" rel="noreferrer" className="hover:text-foreground">Instagram ↗</a><Link href="/backoffice/login" className="hover:text-foreground">Backoffice</Link></div></div></footer>

    <Sheet open={cartOpen} onOpenChange={setCartOpen}><SheetContent side="right" className="flex w-full flex-col sm:max-w-lg"><SheetHeader className="text-left"><SheetTitle>{en ? 'Your selection' : 'A sua seleção'} <Badge variant="secondary" className="ml-2 tabular-nums">{cart.length}</Badge></SheetTitle><SheetDescription>{copy.note}</SheetDescription></SheetHeader>{sent ? <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center"><div className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary"><Check/></div><h3 className="text-xl font-semibold">{en ? 'Thank you.' : 'Obrigado.'}</h3><p className="max-w-xs text-sm text-muted-foreground">{en ? 'Request received. We will be in touch soon.' : 'Pedido recebido. Entraremos em contacto em breve.'}</p><Button onClick={()=>{setCart([]);setSent(false);setCartOpen(false)}}>{en ? 'Continue exploring' : 'Continuar a explorar'}<ArrowRight/></Button></div> : cart.length===0 ? <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center"><ShoppingBag className="size-8 text-muted-foreground"/><p className="max-w-xs text-sm text-muted-foreground">{en ? 'Your bag is waiting for something special.' : 'O cesto está à espera de algo especial.'}</p><Button variant="outline" onClick={()=>setCartOpen(false)}>{en ? 'Explore pieces' : 'Explorar peças'}</Button></div> : <>
      <div className="flex-1 space-y-3 overflow-y-auto py-5">{cart.map((product,index)=><Card key={`${product.id}-${index}`} className="flex flex-row items-center gap-4 p-3"><div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted"><ProductPhoto src={product.imageUrl} alt="" fill sizes="64px" className="object-cover"/></div><div className="min-w-0 flex-1"><p className="truncate font-medium">{en?product.nameEn:product.namePt}</p><p className="text-xs text-muted-foreground">{product.category}</p><p className="mt-1 text-sm">€ {product.price.toFixed(2)}</p></div><Button variant="ghost" size="icon" aria-label={en?'Remove item':'Remover artigo'} onClick={()=>setCart(current=>current.filter((_,i)=>i!==index))}><X/></Button></Card>)}</div>
      <div className="space-y-4 border-t pt-5"><div className="flex justify-between text-sm"><span className="text-muted-foreground">{en?'Estimated total':'Total estimado'}</span><strong>€ {total.toFixed(2)}</strong></div><form className="space-y-3" onSubmit={async event=>{event.preventDefault();setOrderError('');const form=new FormData(event.currentTarget);try{const response=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:form.get('name'),phone:form.get('phone'),notes:form.get('notes'),items:cart.map(product=>product.id)})});const result=await response.json();if(!response.ok)throw new Error(result.error||'Erro ao enviar.');setSent(true)}catch(error){setOrderError(error instanceof Error?error.message:'Erro ao enviar pedido.')}}}>
        <div className="space-y-2"><label htmlFor="order-name" className="text-sm font-medium">{copy.name}</label><Input id="order-name" name="name" autoComplete="name" required/></div><div className="space-y-2"><label htmlFor="order-phone" className="text-sm font-medium">{copy.phone}</label><Input id="order-phone" name="phone" type="tel" autoComplete="tel" value={phone} onChange={event=>setPhone(event.target.value)} required/></div><div className="space-y-2"><label htmlFor="order-notes" className="text-sm font-medium">{copy.extra}</label><Textarea id="order-notes" name="notes" rows={3}/></div>{orderError&&<p role="alert" className="text-sm text-destructive">{orderError}</p>}<Button className="w-full" type="submit">{copy.order}<ArrowRight/></Button></form><p className="text-center text-xs text-muted-foreground">{en ? 'No online payment. We will contact you personally.' : 'Sem pagamento online. Contactamos pessoalmente para combinar a encomenda.'}</p></div>
    </>}</SheetContent></Sheet>
  </>;
}

function ProductCard({product,index,lang,onAdd}:{product:Product;index:number;lang:'pt'|'en';onAdd:(product:Product)=>void}) {
  const en=lang==='en';
  return <Card className="group overflow-hidden rounded-2xl py-0 transition-shadow hover:shadow-lg"><Link href={`/produtos/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-muted"><ProductPhoto src={product.imageUrl} alt={en?product.nameEn:product.namePt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"/><Badge variant="secondary" className="absolute left-3 top-3 rounded-full">{String(index+1).padStart(2,'0')}</Badge>{product.featured&&<Badge className="absolute bottom-3 left-3 rounded-full">{en?'Selected':'Destaque'}</Badge>}</Link><CardHeader className="gap-1 p-4 pb-2"><div className="flex items-center justify-between gap-3"><CardDescription className="uppercase tracking-wider">{product.category}</CardDescription><span className="text-sm font-medium tabular-nums">€ {product.price.toFixed(2)}</span></div><CardTitle className="text-lg"><Link href={`/produtos/${product.slug}`} className="hover:text-primary">{en?product.nameEn:product.namePt}</Link></CardTitle><CardDescription className="line-clamp-2 min-h-10">{en?product.descriptionEn:product.descriptionPt}</CardDescription></CardHeader><CardFooter className="p-4 pt-2"><Button variant="outline" className="w-full" onClick={()=>onAdd(product)}><Plus/>{en?'Add to bag':'Adicionar ao cesto'}</Button></CardFooter></Card>;
}
