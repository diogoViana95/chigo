'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';
import { updateProductAction } from '@/app/backoffice/actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ProductOption = { id: string; namePt: string };
type EditableProduct = { id: string; slug: string; namePt: string; nameEn: string; descriptionPt: string; descriptionEn: string; category: string; price: number; featured: boolean; published: boolean; relatedProductIds: string };
function parseRelatedIds(value: string) { try { const parsed: unknown = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []; } catch { return []; } }

export function EditProductDialog({ product, products }: { product: EditableProduct; products: ProductOption[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const related = new Set(parseRelatedIds(product.relatedProductIds));
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    startTransition(async () => {
      try {
        const data = new FormData(form);
        data.set('id', product.id);
        await updateProductAction(data);
        toast.success('Produto atualizado.');
        setOpen(false);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Não foi possível atualizar o produto.');
      }
    });
  }

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger render={<Button type="button" variant="outline" size="sm"><Pencil/>Editar</Button>} />
    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
      <DialogHeader><DialogTitle>Editar produto</DialogTitle><DialogDescription>Altere os dados apresentados na loja. A galeria é gerida separadamente.</DialogDescription></DialogHeader>
      <form onSubmit={submit} className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2"><Label htmlFor={`edit-name-pt-${product.id}`}>Nome em português</Label><Input id={`edit-name-pt-${product.id}`} name="namePt" defaultValue={product.namePt} required maxLength={120}/></div>
          <div className="grid gap-2"><Label htmlFor={`edit-name-en-${product.id}`}>Name in English</Label><Input id={`edit-name-en-${product.id}`} name="nameEn" defaultValue={product.nameEn} required maxLength={120}/></div>
          <div className="grid gap-2"><Label htmlFor={`edit-slug-${product.id}`}>Slug</Label><Input id={`edit-slug-${product.id}`} name="slug" defaultValue={product.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*"/></div>
          <div className="grid gap-2"><Label htmlFor={`edit-category-${product.id}`}>Categoria</Label><Input id={`edit-category-${product.id}`} name="category" defaultValue={product.category} required maxLength={80}/></div>
          <div className="grid gap-2 sm:col-span-2"><Label htmlFor={`edit-price-${product.id}`}>Preço (€)</Label><Input id={`edit-price-${product.id}`} name="price" type="number" min="0.01" step="0.01" defaultValue={product.price.toFixed(2)} required className="sm:max-w-48"/></div>
          <div className="grid gap-2"><Label htmlFor={`edit-description-pt-${product.id}`}>Descrição em português</Label><Textarea id={`edit-description-pt-${product.id}`} name="descriptionPt" rows={5} defaultValue={product.descriptionPt} required/></div>
          <div className="grid gap-2"><Label htmlFor={`edit-description-en-${product.id}`}>Description in English</Label><Textarea id={`edit-description-en-${product.id}`} name="descriptionEn" rows={5} defaultValue={product.descriptionEn} required/></div>
        </div>
        <fieldset className="grid gap-3 rounded-xl border p-4"><legend className="px-1 text-sm font-medium">Produtos relacionados</legend>{products.filter(option => option.id !== product.id).length ? <div className="grid gap-3 sm:grid-cols-2">{products.filter(option => option.id !== product.id).map(option => <label key={option.id} className="flex items-center gap-2 text-sm"><Checkbox name="relatedProductIds" value={option.id} defaultChecked={related.has(option.id)}/>{option.namePt}</label>)}</div> : <p className="text-sm text-muted-foreground">Não existem outros produtos.</p>}</fieldset>
        <div className="flex flex-wrap gap-5"><label className="flex items-center gap-2 text-sm"><Checkbox name="featured" defaultChecked={product.featured}/>Destaque na página inicial</label><label className="flex items-center gap-2 text-sm"><Checkbox name="published" defaultChecked={product.published}/>Visível na loja</label></div>
        <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={()=>setOpen(false)} disabled={pending}>Cancelar</Button><Button type="submit" disabled={pending}>{pending?'A guardar…':'Guardar alterações'}</Button></div>
      </form>
    </DialogContent>
  </Dialog>;
}
