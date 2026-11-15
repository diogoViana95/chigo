import { Storefront } from '@/components/storefront';
import { prisma } from '@/lib/prisma';
export const revalidate = 3600;
export default async function Home() {
 const items = await prisma.product.findMany({where:{published:true},orderBy:[{featured:'desc'},{createdAt:'desc'}]}).catch(()=>[]);
 const products = items.map(p=>({...p,price:Number(p.price),imageUrl:p.imageUrl||'/chigo-logo.png'}));
 return <Storefront items={products}/>;
}
