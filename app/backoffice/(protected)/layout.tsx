import { auth } from '@/auth';
import { redirect } from 'next/navigation';
export default async function ProtectedBackoffice({children}:{children:React.ReactNode}) { const session=await auth(); if(!session?.user) redirect('/backoffice/login'); if((session.user as any).mustChangePassword) redirect('/backoffice/change-password'); return children; }
