import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { changePasswordAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export default async function ChangePasswordPage() { const session = await auth(); if (!session?.user) redirect('/backoffice/login'); if (!(session.user as any).mustChangePassword) redirect('/backoffice'); return <main className="grid min-h-screen place-items-center bg-muted/40 px-4 py-10"><Card className="w-full max-w-md"><CardHeader><Link href="/" className="mb-3 w-fit text-xl font-semibold tracking-tight">chigo<span className="text-primary">.</span></Link><CardTitle className="text-2xl">Defina uma nova password</CardTitle><CardDescription>Por segurança, altere a password temporária para continuar.</CardDescription></CardHeader><CardContent><form action={changePasswordAction} className="grid gap-4"><div className="grid gap-2"><Label htmlFor="current-password">Password atual</Label><Input id="current-password" type="password" name="currentPassword" required autoComplete="current-password"/></div><div className="grid gap-2"><Label htmlFor="new-password">Nova password</Label><Input id="new-password" type="password" name="newPassword" minLength={10} required autoComplete="new-password"/></div><Button>Guardar password</Button></form></CardContent></Card></main>; }
