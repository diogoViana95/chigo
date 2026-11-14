'use client';

import { ProductPhoto } from '@/components/product-image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { ImagePlus, Loader2, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { UploadDropzone } from '@/lib/uploadthing-client';
import type { ProductImage } from '@/lib/product-media';
import { EditProductDialog } from '@/components/edit-product-dialog';
import { deleteOrphanedProductImagesAction, deleteProductAction, saveProductImagesAction, setProductPublishedAction, toggleFeaturedAction } from '@/app/backoffice/actions';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

export function BackofficeProductManager({ product, images, products }: { product: { id: string; slug: string; namePt: string; nameEn: string; descriptionPt: string; descriptionEn: string; relatedProductIds: string; category: string; price: number; featured: boolean; published: boolean }; images: ProductImage[]; products: { id: string; namePt: string }[] }) {
  const router = useRouter();
  const [gallery, setGallery] = useState(images);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, startTransition] = useTransition();

  async function save(next: ProductImage[]) {
    const result = await saveProductImagesAction(product.id, next);
    if (result.error) { toast.error(result.error); return result; }
    setGallery(next);
    toast.success(result.warning || result.success || 'Galeria guardada.');
    router.refresh();
    return result;
  }

  async function removeProduct() {
    startTransition(async () => {
      const result = await deleteProductAction(product.id);
      if (result.error) { toast.error(result.error); return; }
      toast.success(result.success || 'Produto apagado.');
      setDeleteOpen(false);
      router.refresh();
    });
  }

  return <>
    <Card className="overflow-hidden rounded-2xl">
      <CardHeader className="flex flex-col gap-4 space-y-0 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-4"><div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">{gallery[0]&&<ProductPhoto src={gallery[0].url} alt="" fill sizes="64px" className="object-cover"/>}</div><div className="min-w-0 space-y-1"><div className="flex flex-wrap items-center gap-2"><CardTitle className="text-base">{product.namePt}</CardTitle><Badge variant="outline">{product.category}</Badge>{product.featured&&<Badge variant="secondary"><Star className="size-3 fill-current"/>Destaque</Badge>}</div><p className="text-sm font-medium tabular-nums">€ {product.price.toFixed(2)}</p></div></div>
        <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto xl:justify-end"><div className="flex items-center gap-2 rounded-lg border px-3 py-2"><Switch checked={product.published} onCheckedChange={value=>startTransition(async()=>{await setProductPublishedAction(product.id,value);router.refresh();})} aria-label="Visível na loja"/><span className="text-sm">{product.published?'Visível':'Oculto'}</span></div><EditProductDialog product={product} products={products}/><form action={toggleFeaturedAction}><input type="hidden" name="id" value={product.id}/><Button variant="outline" size="sm" type="submit">{product.featured?'Remover destaque':'Destacar'}</Button></form><Button variant="outline" size="sm" onClick={()=>setGalleryOpen(true)}><ImagePlus/>Imagens <Badge variant="secondary" className="ml-1">{gallery.length}</Badge></Button><Button variant="ghost" size="icon" aria-label={`Apagar ${product.namePt}`} onClick={()=>setDeleteOpen(true)}><Trash2 className="text-destructive"/></Button></div>
      </CardHeader>
    </Card>

    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}><DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto"><DialogHeader><DialogTitle>Imagens do produto</DialogTitle><DialogDescription>{product.namePt} · até 30 imagens por produto. A primeira imagem é a principal.</DialogDescription></DialogHeader><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{gallery.map((image,index)=><div key={`${image.key}-${image.url}`} className="relative overflow-hidden rounded-xl border bg-muted"><div className="relative aspect-square"><ProductPhoto src={image.url} alt={image.name||`${product.namePt} ${index+1}`} fill sizes="(max-width: 640px) 50vw, 220px" className="object-cover"/></div><div className="flex items-center justify-between gap-2 p-2"><span className="truncate text-xs text-muted-foreground">{index===0?'Principal':`Imagem ${index+1}`}</span><div className="flex gap-1"><Button type="button" variant="ghost" size="icon-sm" aria-label="Tornar principal" disabled={index===0||busy} onClick={()=>void save([gallery[index],...gallery.slice(0,index),...gallery.slice(index+1)])}><Star className={index===0?'size-4 fill-primary text-primary':'size-4'}/></Button><Button type="button" variant="ghost" size="icon-sm" aria-label="Remover imagem" disabled={busy} onClick={()=>void save(gallery.filter((_,i)=>i!==index))}><Trash2 className="size-4 text-destructive"/></Button></div></div></div>)}</div>
      {gallery.length===0&&<div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Ainda não há imagens carregadas.</div>}
      <UploadDropzone endpoint="productImage" disabled={gallery.length>=30} config={{mode:'auto'}} onBeforeUploadBegin={files=>files.slice(0,30-gallery.length)} onClientUploadComplete={files=>{const added:ProductImage[]=files.map(file=>({key:file.key,url:file.serverData?.url||file.url,name:file.name}));void save([...gallery,...added]).then(result=>{if(result?.error)void deleteOrphanedProductImagesAction(added.map(image=>image.key));});}} onUploadError={error=>{toast.error(`Falha no upload: ${error.message}`);}} appearance={{container:'flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 p-6 text-center',label:'text-sm font-medium text-foreground',allowedContent:'text-xs text-muted-foreground',button:'h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90',uploadIcon:'size-6 text-primary'}}/>
      </DialogContent></Dialog>

    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Apagar {product.namePt}?</AlertDialogTitle><AlertDialogDescription>O produto sai da loja e as imagens carregadas no UploadThing serão eliminadas.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel><Button variant="destructive" onClick={removeProduct} disabled={busy}>{busy&&<Loader2 className="animate-spin"/>}Apagar produto</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </>;
}
