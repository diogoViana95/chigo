import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { CreateUserForm } from '@/components/create-user-form';
import { DeleteUserForm } from '@/components/delete-user-form';
import { BackofficeProductManager } from '@/components/backoffice-product-manager';
import { CreateProductDialog } from '@/components/create-product-dialog';
import { parseProductImages } from '@/lib/product-media';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
export const dynamic = 'force-dynamic';

export default async function Backoffice() {
  const [session, products, orders, users] = await Promise.all([
    auth(),
    prisma.product.findMany({ orderBy: { updatedAt: 'desc' } }).catch(() => []),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 12 }).catch(() => []),
    prisma.user.findMany({ orderBy: { createdAt: 'asc' } }),
  ]);
  const visibleProducts = products.filter(product => product.published).length;
  const signOutAction = async () => { 'use server'; await signOut({ redirectTo: '/backoffice/login' }); };
  return <main className="min-h-screen bg-[radial-gradient(ellipse_at_90%_0%,rgba(123,59,190,.12),transparent_32%),#0b0b11]">
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0b11]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 tracking-tight"><svg viewBox="0 0 36 42" aria-hidden="true" className="h-8 w-7 shrink-0"><path d="M2 5h32M8 5v6h20V5M18 11v8l-12 6 12 6 12-6-12-6M6 31l12 6 12-6M6 36l12 5 12-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="text-violet-400"/></svg><span className="text-xl font-bold tracking-[-.06em]">chigo<span className="text-primary">.</span></span><Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] tracking-widest text-violet-200">BACKOFFICE</Badge></Link>
        <div className="flex items-center gap-3"><span className="hidden text-sm text-muted-foreground sm:inline">Olá, {session?.user?.name}</span><form action={signOutAction}><Button type="submit" variant="outline" size="sm">Terminar sessão</Button></form></div>
      </div>
    </header>
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div className="space-y-2"><p className="text-xs font-semibold tracking-[.22em] text-violet-300">PAINEL DE CONTROLO / {new Intl.DateTimeFormat('pt-PT',{month:'long',year:'numeric'}).format(new Date()).toUpperCase()}</p><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Visão geral<span className="text-primary">.</span></h1><p className="text-sm text-muted-foreground">Gira catálogo, pedidos e acessos da loja.</p></div><CreateProductDialog products={products.map(product => ({ id: product.id, namePt: product.namePt }))}/></div>
      <div className="grid gap-4 sm:grid-cols-3"><StatCard label="Produtos" value={products.length} detail={`${visibleProducts} visíveis na loja`}/><StatCard label="Encomendas" value={orders.length} detail="Pedidos mais recentes"/><StatCard label="Utilizadores" value={users.length} detail="Contas de backoffice"/></div>
      <section className="space-y-4"><div><h2 className="text-xl font-semibold tracking-tight">Produtos</h2><p className="text-sm text-muted-foreground">Edite os dados, visibilidade, destaque e galeria de imagens.</p></div>{products.length ? <div className="grid gap-3">{products.map(product => { const images = parseProductImages(product.imageUrls); if (product.imageUrl && !images.some(image => image.url === product.imageUrl)) images.unshift({ key: '', url: product.imageUrl }); return <BackofficeProductManager key={product.id} product={{ id: product.id, slug: product.slug, namePt: product.namePt, nameEn: product.nameEn, descriptionPt: product.descriptionPt, descriptionEn: product.descriptionEn, relatedProductIds: product.relatedProductIds, category: product.category, price: Number(product.price), featured: product.featured, published: product.published }} images={images} products={products.map(option => ({ id: option.id, namePt: option.namePt }))}/>; })}</div> : <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Ainda não existem produtos. Crie o primeiro para começar.</CardContent></Card>}</section>
      <section className="space-y-4"><div><h2 className="text-xl font-semibold tracking-tight">Encomendas recentes</h2><p className="text-sm text-muted-foreground">Pedidos de contacto enviados pela loja.</p></div><Card><CardContent className="p-0">{orders.length ? <Table><TableHeader><TableRow><TableHead>Referência</TableHead><TableHead>Contacto</TableHead><TableHead>Estado</TableHead><TableHead>Data</TableHead></TableRow></TableHeader><TableBody>{orders.map(order => <TableRow key={order.id}><TableCell className="font-medium">{order.reference}</TableCell><TableCell>{order.phone}</TableCell><TableCell><Badge variant="outline">{order.status}</Badge></TableCell><TableCell className="text-muted-foreground">{new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium' }).format(order.createdAt)}</TableCell></TableRow>)}</TableBody></Table> : <p className="p-8 text-center text-sm text-muted-foreground">As novas encomendas aparecerão aqui.</p>}</CardContent></Card></section>
      <section className="space-y-4"><div><h2 className="text-xl font-semibold tracking-tight">Utilizadores do backoffice</h2><p className="text-sm text-muted-foreground">As novas contas terão de definir uma password própria no primeiro acesso.</p></div><Card><CardHeader><CardTitle className="text-base">Contas ativas</CardTitle></CardHeader><CardContent className="divide-y p-0">{users.map(user => <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"><div><p className="font-medium">{user.username}</p><p className="text-xs text-muted-foreground">{user.mustChangePassword ? 'Alteração de password pendente' : 'Acesso ativo'}</p></div>{users.length > 1 && <DeleteUserForm id={user.id} username={user.username}/>}</div>)}</CardContent></Card><Card><CardHeader><CardTitle className="text-base">Adicionar utilizador</CardTitle><CardDescription>Crie um acesso para outra pessoa da equipa.</CardDescription></CardHeader><CardContent><CreateUserForm/></CardContent></Card></section>
    </div>
  </main>;
}
function StatCard({ label, value, detail }: { label: string; value: number; detail: string }) { return <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-[#171720] to-[#111119] shadow-lg shadow-black/10"><CardHeader className="pb-2"><CardDescription className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-cyan-300"/>{label}</CardDescription><CardTitle className="text-4xl tabular-nums">{value}</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">{detail}</p></CardContent></Card>; }
