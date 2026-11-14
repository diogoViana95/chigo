'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { createProductAction } from '@/app/backoffice/actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type RelatedProduct = { id: string; namePt: string };
export function CreateProductDialog({ products }: { products: RelatedProduct[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    startTransition(async () => {
      try {
        await createProductAction(new FormData(form));
        toast.success('Produto criado.');
        form.reset();
        setOpen(false);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Não foi possível criar o produto.');
      }
    });
  }
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger render={<Button><Plus/>Adicionar produto</Button>} />
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
      <DialogHeader><DialogTitle>Novo produto</DialogTitle><DialogDescription>Preencha os dados da peça. As imagens podem ser adicionadas depois, na gestão do produto.</DialogDescription></DialogHeader>
      <form onSubmit={submit} className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2"><Label htmlFor="product-name-pt">Nome em português</Label><Input id="product-name-pt" name="namePt" required maxLength={120}/></div>
          <div className="grid gap-2"><Label htmlFor="product-name-en">Name in English</Label><Input id="product-name-en" name="nameEn" required maxLength={120}/></div>
          <div className="grid gap-2"><Label htmlFor="product-slug">Slug</Label><Input id="product-slug" name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="nome-do-produto"/></div>
          <div className="grid gap-2"><Label htmlFor="product-category">Categoria</Label><Input id="product-category" name="category" required maxLength={80}/></div>
          <div className="grid gap-2 sm:col-span-2"><Label htmlFor="product-price">Preço (€)</Label><Input id="product-price" name="price" type="number" min="0.01" step="0.01" required className="sm:max-w-48"/></div>
          <div className="grid gap-2"><Label htmlFor="product-desc-pt">Descrição em português</Label><Textarea id="product-desc-pt" name="descriptionPt" rows={4} required/></div>
          <div className="grid gap-2"><Label htmlFor="product-desc-en">Description in English</Label><Textarea id="product-desc-en" name="descriptionEn" rows={4} required/></div>
        </div>
        {products.length > 0 && <fieldset className="grid gap-3 rounded-xl border p-4"><legend className="px-1 text-sm font-medium">Produtos relacionados</legend><div className="grid gap-3 sm:grid-cols-2">{products.map(product => <label key={product.id} className="flex items-center gap-2 text-sm"><Checkbox name="relatedProductIds" value={product.id}/>{product.namePt}</label>)}</div></fieldset>}
        <div className="flex flex-wrap gap-5"><label className="flex items-center gap-2 text-sm"><Checkbox name="featured"/>Destacar na página inicial</label><label className="flex items-center gap-2 text-sm"><Checkbox name="published" defaultChecked/>Visível na loja</label></div>
        <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={()=>setOpen(false)} disabled={pending}>Cancelar</Button><Button type="submit" disabled={pending}>{pending?'A guardar…':'Criar produto'}</Button></div>
      </form>
    </DialogContent>
  </Dialog>;
}
