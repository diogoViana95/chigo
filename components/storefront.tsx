'use client';

import { ProductPhoto } from '@/components/product-image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Gift, Heart, Leaf, Menu, Minus, Moon, Plus, ShoppingBag, ShoppingCart, SlidersHorizontal, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { Product } from '@/lib/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function Storefront({ items }: { items: Product[] }) {
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [sent, setSent] = useState(false);
  const [orderError, setOrderError] = useState('');
  const { theme, setTheme } = useTheme();
  const en = lang === 'en';
  const featured = items.filter(product => product.featured);
  const featuredItems = [...featured, ...items.filter(product => !product.featured)].slice(0, 4);
  const rest = items.filter(product => !featuredItems.some(selected => selected.id === product.id));
  const total = cart.reduce((sum, product) => sum + product.price, 0);
  useEffect(() => {
    const sections = ['hero', 'collection', 'all-products', 'story'];
    const updateActiveSection = () => {
      const position = window.scrollY + 150;
      let active = 'hero';
      for (const id of sections) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top + window.scrollY <= position) active = id;
      }
      setActiveSection(active);
    };
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    updateActiveSection();
    return () => { window.removeEventListener('scroll', updateActiveSection); window.removeEventListener('resize', updateActiveSection); };
  }, []);
  const copy = {
    collection: en ? 'THE COLLECTION' : 'A COLEÇÃO',
    selected: en ? 'Objects made to stay.' : 'Objectos feitos para ficar.',
    intro: en ? 'Considered forms. Made layer by layer.' : 'Formas pensadas. Feitas camada a camada.',
    browse: en ? 'Explore collection' : 'Explorar coleção',
    featured: en ? 'Featured pieces' : 'Destaques',
    all: en ? 'The full collection' : 'A coleção completa',
    order: en ? 'Request order' : 'Pedir encomenda',
    note: en ? 'Choose your pieces and leave your number. We’ll get in touch to confirm details, payment and delivery.' : 'Escolha as suas peças e deixe o seu número. Entramos em contacto para combinar os detalhes, o pagamento e a entrega.',
    name: en ? 'Your name' : 'O seu nome',
    phone: en ? 'Mobile number' : 'Número de telemóvel',
    extra: en ? 'Anything else?' : 'Alguma nota?',
  };
  const openCart = () => setCartOpen(true);
  const add = (product: Product) => setCart(current => [...current, product]);
  const navClass = (section: string) => `relative py-5 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all ${activeSection === section ? 'text-foreground after:w-full after:bg-gradient-to-r after:from-violet-500 after:to-cyan-400' : 'text-foreground/70 after:w-0 hover:text-foreground'}`;
  const sendOrder = async (formData: FormData) => {
    setOrderError('');
    try {
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: formData.get('name'), phone: formData.get('phone'), notes: formData.get('notes'), items: cart.map(product => product.id) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Erro ao enviar.');
      setSent(true);
    } catch (error) { setOrderError(error instanceof Error ? error.message : 'Erro ao enviar pedido.'); }
  };

  return <>
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#top" className="flex items-center gap-2.5 tracking-tight"><svg viewBox="0 0 36 42" aria-hidden="true" className="h-9 w-8 shrink-0"><path d="M2 5h32M8 5v6h20V5M18 11v8l-12 6 12 6 12-6-12-6M6 31l12 6 12-6M6 36l12 5 12-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="text-violet-400"/></svg><span className="text-[30px] font-bold leading-none tracking-[-.07em]">chigo<span className="text-primary">.</span></span><span className="hidden pt-1 text-[9px] font-medium uppercase leading-tight tracking-[0.24em] text-muted-foreground sm:inline">Creative<br/>Studio</span></Link>
        <nav className="hidden items-center gap-8 text-sm md:flex"><a href="#hero" aria-current={activeSection === 'hero' ? 'location' : undefined} className={navClass('hero')}>{en ? 'Home' : 'Início'}</a><a href="#collection" aria-current={activeSection === 'collection' ? 'location' : undefined} className={navClass('collection')}>{en ? 'Products' : 'Produtos'}⌄</a><a href="#all-products" aria-current={activeSection === 'all-products' ? 'location' : undefined} className={navClass('all-products')}>{en ? 'Collections' : 'Coleções'}</a><a href="#story" aria-current={activeSection === 'story' ? 'location' : undefined} className={navClass('story')}>{en ? 'About' : 'Sobre'}</a></nav>
        <div className="hidden items-center gap-2 md:flex"><Button variant="ghost" size="sm" className="rounded-full" onClick={() => setLang(en ? 'pt' : 'en')}>{en ? 'EN' : 'PT'}⌄</Button><Button variant="secondary" size="icon" className="rounded-full" aria-label={en ? 'Toggle theme' : 'Mudar tema'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun/> : <Moon/>}</Button><Button variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary/10" onClick={openCart}><ShoppingBag/><span className="sr-only">{en ? 'Bag' : 'Cesto'}</span><Badge className="ml-1 rounded-full tabular-nums">{cart.length}</Badge></Button></div>
        <div className="flex items-center gap-2 md:hidden"><Button variant="outline" size="icon" aria-label={en ? 'Open cart' : 'Abrir cesto'} onClick={() => setCartOpen(true)}><ShoppingBag/><span className="sr-only">{cart.length}</span></Button><Sheet><SheetTrigger render={<Button variant="outline" size="icon" aria-label={en ? 'Open navigation' : 'Abrir navegação'}/> }><Menu/></SheetTrigger><SheetContent side="right" className="w-[min(86vw,22rem)]"><SheetHeader><SheetTitle className="text-left">chigo<span className="text-primary">.</span></SheetTitle><SheetDescription>{en ? 'Creative Studio' : 'Peças criadas com intenção'}</SheetDescription></SheetHeader><nav className="mt-8 grid gap-2"><Button render={<a href="#collection"/>} variant="ghost" className="justify-start">{en ? 'Collection' : 'Coleção'}</Button><Button render={<a href="#story"/>} variant="ghost" className="justify-start">{en ? 'Our process' : 'O processo'}</Button><Button variant="ghost" className="justify-start" onClick={() => setLang(en ? 'pt' : 'en')}>{en ? 'Mudar para Português' : 'Switch to English'}</Button><Button variant="ghost" className="justify-start" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</Button></nav><SheetFooter><SheetClose render={<Button variant="outline"/>}>{en ? 'Close' : 'Fechar'}</SheetClose></SheetFooter></SheetContent></Sheet></div>
      </div>
    </header>

    <main id="top" className="relative">
      <section id="hero" className="relative isolate scroll-mt-20 overflow-hidden border-b border-white/10 bg-[#0b0b11]">
        <div className="absolute inset-0 -z-20"><ProductPhoto src="/hero-storefront-v2.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[58%_48%]"/></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0b0b11_0%,rgba(11,11,17,.96)_24%,rgba(11,11,17,.74)_42%,rgba(11,11,17,.12)_76%,rgba(11,11,17,.18)_100%)]"/>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(11,11,17,.7),transparent_25%,transparent_78%,rgba(11,11,17,.12))]"/>
        <div className="mx-auto flex min-h-[430px] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="relative z-10 flex max-w-[510px] flex-col items-start gap-6">
            <p className="text-xs font-semibold tracking-[.2em] text-violet-300 sm:text-sm">{en ? 'PERSONALIZED 3D PRINTING' : 'IMPRESSÃO 3D PERSONALIZADA'}</p>
            <div className="space-y-4"><h1 className="text-5xl font-semibold leading-[1.04] tracking-[-.055em] sm:text-6xl lg:text-[3.4rem]">{en ? <>Ideas in <span className="gradient-text">3D,</span><br/>made for you.</> : <>Ideias em <span className="gradient-text">3D,</span><br/>feitas à tua medida.</>}</h1><div className="h-1 w-3/4 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"/><p className="max-w-lg text-base leading-7 text-white/75 sm:text-lg">{en ? 'Thoughtful, tactile objects with detail in every layer — made in small batches, just because you love them.' : 'Peças únicas, tácteis e cheias de detalhe — para oferecer, decorar ou simplesmente porque gostas.'}</p></div>
            <div className="flex flex-wrap gap-3"><Button render={<a href="#collection"/>} size="lg" className="gradient-cta rounded-xl px-7 font-semibold shadow-lg shadow-violet-950/30"><ShoppingBag/>{en ? 'Shop now' : 'Ver produtos'}</Button><Button render={<a href="#story"/>} variant="outline" size="lg" className="rounded-xl border-white/30 bg-black/25 px-6 backdrop-blur"><ArrowRight className="size-4"/>{en ? 'How it works' : 'Como funciona'}</Button></div>
          </div>
          <div className="absolute bottom-5 left-[58%] z-0 hidden items-center gap-3 text-white/80 sm:flex"><span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] tracking-[.2em] backdrop-blur">CHIGO / 01</span><span className="text-xs">{en ? 'Made with care in Portugal' : 'Feito com cuidado em Portugal'}</span><span className="ml-6 flex gap-2"><i className="size-2 rounded-full bg-violet-400"/><i className="size-2 rounded-full bg-white/35"/><i className="size-2 rounded-full bg-white/35"/></span></div>
        </div>
      </section>

      <div className="border-b border-white/10 bg-[#101017]"><div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 text-sm sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8 lg:pr-[340px]">{[[<ShoppingBag key="i"/>,en?'In-house production':'Produção própria',en?'Quality 3D printing':'Impressão 3D de qualidade'],[<SlidersHorizontal key="i"/>,en?'Personalized':'Personalizável',en?'Each piece is unique':'Cada peça é única'],[<Gift key="i"/>,en?'Made for gifting':'Ideias para oferecer',en?'Dates, names and moments':'Datas, nomes e momentos'],[<Leaf key="i"/>,en?'Made responsibly':'Produção responsável',en?'Small batches, less waste':'Pequenas séries, menos desperdício']].map(([icon,title,desc])=><div key={String(title)} className="flex items-center gap-4"><span className="text-violet-400 [&_svg]:size-8">{icon}</span><div><p className="font-semibold">{title}</p><p className="mt-1 text-xs text-muted-foreground">{desc}</p></div></div>)}</div></div>

      <section id="collection" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:pr-[390px]">
        <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-primary">02 / {copy.collection}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{copy.featured}</h2><p className="mt-1 text-sm text-muted-foreground">{en ? 'Our most special pieces.' : 'Os nossos produtos mais especiais.'}</p></div><Button render={<a href="#all-products"/>} variant="ghost" className="hidden gap-1 text-primary sm:inline-flex">{en ? 'View all' : 'Ver todos'}<ArrowUpRight/></Button></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featuredItems.map((product,index)=><ProductCard key={product.id} product={product} index={index} lang={lang} onAdd={add}/>)}</div>
        <div id="all-products" className="scroll-mt-24">{rest.length>0&&<div className="pt-16"><div className="mb-8 flex items-end justify-between"><div><p className="text-sm font-medium text-primary">03 / {en ? 'OBJECTS FOR EVERY DAY' : 'OBJECTOS DO DIA A DIA'}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{copy.all}</h2></div><Badge variant="outline">{String(rest.length).padStart(2,'0')} {en ? 'ITEMS' : 'PEÇAS'}</Badge></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rest.map((product,index)=><ProductCard key={product.id} product={product} index={index+featuredItems.length} lang={lang} onAdd={add}/>)}</div></div>}</div>
      </section>

      {cartOpen&&<button type="button" aria-label={en ? 'Close order panel' : 'Fechar painel do pedido'} onClick={()=>setCartOpen(false)} className="fixed inset-0 z-[60] bg-black/15 lg:bg-black/10"/>}
      <aside aria-label={en ? 'Order basket' : 'O teu pedido'} style={{top: 'clamp(210px, calc(33vh - 80px), 260px)'}} className={`studio-glow fixed right-5 z-[70] hidden max-h-[67vh] w-[min(370px,calc(100vw-2.5rem))] flex-col overflow-y-auto rounded-[1.4rem] border border-violet-400/70 bg-card/[.97] p-5 shadow-2xl shadow-black/50 backdrop-blur-xl ${cartOpen ? '!inset-x-3 !bottom-3 !right-3 !top-auto !max-h-[88dvh] !w-auto !flex lg:!inset-x-auto lg:!bottom-auto lg:!right-5 lg:!top-[clamp(210px,calc(33vh-80px),260px)] lg:!max-h-[67vh] lg:!w-[min(370px,calc(100vw-2.5rem))]' : ''}`}>
        <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold tracking-[.2em] text-violet-300">CHIGO / STUDIO</p><h2 className="mt-1 text-xl font-semibold">{en ? 'Your order' : 'O teu pedido'} <span className="ml-1 text-sm font-normal text-muted-foreground">({cart.length})</span></h2></div><div className="grid size-9 place-items-center rounded-full text-muted-foreground"><ShoppingBag className="size-5 lg:hidden"/><button type="button" aria-label={en ? 'Close order panel' : 'Fechar pedido'} onClick={()=>setCartOpen(false)} className="grid size-9 place-items-center rounded-full transition hover:bg-white/10 hover:text-white lg:hidden"><X className="size-5"/></button></div></div>
        {cart.length === 0 ? <div className="my-5 rounded-xl border border-dashed border-white/15 bg-white/[.03] p-4 text-sm text-muted-foreground">{en ? 'Your order is waiting for a piece you love.' : 'O teu pedido está à espera daquela peça especial.'}<Button render={<a href="#collection"/>} variant="link" className="mt-2 h-auto p-0 text-primary">{en ? 'Explore pieces' : 'Descobrir peças'}<ArrowRight/></Button></div> : <div className="my-4 space-y-3">{Array.from(new Map(cart.map(product => [product.id, product])).values()).map(product => { const quantity = cart.filter(item => item.id === product.id).length; return <div key={product.id} className="flex items-center gap-3 border-b border-white/10 pb-3"><div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-muted"><ProductPhoto src={product.imageUrl} alt="" fill sizes="48px" className="object-cover"/></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{en ? product.nameEn : product.namePt}</p><p className="mt-1 text-xs text-muted-foreground">€ {product.price.toFixed(2)}</p></div><div className="flex h-8 items-center rounded-md border border-white/15"><button type="button" aria-label={en ? 'Remove one' : 'Remover uma unidade'} className="px-2 text-muted-foreground hover:text-white" onClick={() => setCart(current => { const index = current.findIndex(item => item.id === product.id); return index < 0 ? current : current.filter((_, i) => i !== index); })}><Minus className="size-3"/></button><span className="min-w-4 text-center text-xs">{quantity}</span><button type="button" aria-label={en ? 'Add one' : 'Adicionar uma unidade'} className="px-2 text-muted-foreground hover:text-white" onClick={() => setCart(current => [...current, product])}><Plus className="size-3"/></button></div><button type="button" aria-label={en ? 'Remove product' : 'Remover produto'} onClick={() => setCart(current => current.filter(item => item.id !== product.id))} className="text-muted-foreground hover:text-white"><X className="size-4"/></button></div>; })}</div>}
        <div className="flex items-center justify-between border-t border-white/15 py-3 text-sm"><span className="text-muted-foreground">{en ? 'Estimated total' : 'Total estimado'}</span><strong className="text-lg">€ {total.toFixed(2)}</strong></div>
        {sent ? <div className="rounded-xl bg-emerald-400/10 p-4 text-sm text-emerald-200"><Check className="mb-2 size-5"/>{en ? 'Request received. We will be in touch soon.' : 'Pedido recebido. Entraremos em contacto em breve.'}<Button variant="link" className="mt-2 h-auto p-0 text-emerald-200" onClick={() => { setCart([]); setSent(false); }}>{en ? 'Continue browsing' : 'Continuar a explorar'}<ArrowRight/></Button></div> : <div className="rounded-2xl bg-white/[.04] p-4"><h3 className="text-lg font-semibold">{en ? 'Place your order' : 'Faz o teu pedido'}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{en ? 'Leave your details and we’ll contact you to confirm everything.' : 'Deixa os teus dados e entramos em contacto para confirmar os detalhes.'}</p><form className="mt-3 space-y-3" onSubmit={event => { event.preventDefault(); void sendOrder(new FormData(event.currentTarget)); }}><Input name="name" autoComplete="name" placeholder={en ? 'Your name' : 'O teu nome'} required/><Input name="phone" type="tel" autoComplete="tel" placeholder="+351 912 345 678" required/><label className="flex items-start gap-2 text-[11px] leading-4 text-muted-foreground"><input type="checkbox" required className="mt-0.5 accent-violet-500"/>{en ? 'I accept the privacy policy.' : <>Li e aceito a <span className="font-medium text-foreground">Política de Privacidade.</span></>}</label>{orderError && <p role="alert" className="text-xs text-destructive">{orderError}</p>}<Button type="submit" disabled={!cart.length} className="gradient-cta h-11 w-full rounded-xl font-semibold"><ArrowRight/>{en ? 'Send order request' : 'Enviar pedido'}</Button></form></div>}
        <p className="pt-3 text-center text-[10px] text-muted-foreground">{en ? 'No online payment · Made with care in Portugal' : 'Sem pagamento online · Feito com cuidado em Portugal'}</p>
      </aside>

      <section id="story" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8"><Card className="overflow-hidden rounded-[2rem] border-0 bg-foreground text-background shadow-none"><CardContent className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[0.6fr_1.4fr] lg:p-16"><div className="text-8xl font-bold tracking-[-0.1em] text-background/10 sm:text-9xl">c<span className="text-primary">.</span></div><div className="max-w-2xl"><Badge variant="secondary" className="rounded-full">04 / {en ? 'MADE DIFFERENTLY' : 'FEITO DE FORMA DIFERENTE'}</Badge><h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{en ? <>A little more thought in <span className="text-primary">every layer.</span></> : <>Mais intenção em <span className="text-primary">cada camada.</span></>}</h2><p className="mt-5 max-w-xl leading-7 text-background/65">{en ? 'We turn digital ideas into useful, tactile objects. Each piece is printed on demand, with care for form, material and the little details.' : 'Transformamos ideias digitais em objectos úteis e tácteis. Cada peça é impressa por encomenda, com atenção à forma, ao material e aos pequenos detalhes.'}</p><Button render={<a href="#collection"/>} variant="secondary" className="mt-7 rounded-full">{en ? 'Find your piece' : 'Encontre a sua peça'}<ArrowRight/></Button></div></CardContent></Card></section>
    </main>

    <footer className="border-t"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><Link href="#top" className="text-xl font-bold tracking-tight">chigo<span className="text-primary">.</span><span className="ml-2 text-[10px] font-normal uppercase tracking-widest text-muted-foreground">Creative Studio</span></Link><span className="text-xs text-muted-foreground">© 2025 CHIGO. {en ? 'All rights reserved' : 'Todos os direitos reservados'}</span><div className="flex gap-4 text-xs text-muted-foreground"><a href="https://www.instagram.com/chigo.studio" target="_blank" rel="noreferrer" className="hover:text-foreground">Instagram ↗</a><Link href="/backoffice/login" className="hover:text-foreground">Backoffice</Link></div></div></footer>

  </>;
}

function ProductCard({product,index,lang,onAdd}:{product:Product;index:number;lang:'pt'|'en';onAdd:(product:Product)=>void}) {
  const en=lang==='en';
  const [favorite, setFavorite] = useState(false);
  const name = en ? product.nameEn : product.namePt;
  const price = new Intl.NumberFormat(en ? 'en-IE' : 'pt-PT', { style: 'currency', currency: 'EUR' }).format(product.price);
  return <Card className="group overflow-hidden rounded-2xl border-white/10 bg-card py-0 transition duration-300 hover:-translate-y-1 hover:border-violet-400/45 hover:shadow-xl hover:shadow-violet-950/20">
    <div className="relative">
      <Link href={`/produtos/${product.slug}`} aria-label={name} className="relative block aspect-[3/2] overflow-hidden bg-muted">
        <ProductPhoto src={product.imageUrl} alt={name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"/>
      </Link>
      {product.featured && <Badge className="gradient-cta absolute left-3 top-3 rounded-full px-3">{en ? 'Featured' : 'Destaque'}</Badge>}
      <button type="button" aria-label={favorite ? (en ? 'Remove from favourites' : 'Remover dos favoritos') : (en ? 'Add to favourites' : 'Adicionar aos favoritos')} aria-pressed={favorite} onClick={() => setFavorite(value => !value)} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-white/60 bg-black/35 text-white backdrop-blur transition hover:scale-105 hover:bg-black/60"><Heart className={favorite ? 'size-5 fill-fuchsia-400 text-fuchsia-400' : 'size-5'}/></button>
    </div>
    <div className="flex min-h-[94px] items-center justify-between gap-3 p-4">
      <div className="min-w-0"><Link href={`/produtos/${product.slug}`} className="line-clamp-2 text-sm font-semibold leading-5 hover:text-violet-300">{name}</Link><p className="mt-2 text-base font-semibold tabular-nums">{price}</p></div>
      <Button type="button" size="icon" aria-label={en ? `Add ${name} to bag` : `Adicionar ${name} ao cesto`} onClick={() => onAdd(product)} className="gradient-cta size-10 shrink-0 rounded-xl"><ShoppingCart className="size-5"/></Button>
    </div>
  </Card>;
}
