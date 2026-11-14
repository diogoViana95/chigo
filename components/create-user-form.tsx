'use client';
import { useActionState } from 'react';
import { createUserAction, type CreateUserState } from '@/app/backoffice/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
const initialState: CreateUserState = {};
export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUserAction, initialState);
  return <form action={action} className="grid gap-4 sm:grid-cols-2">
    <div className="grid gap-2"><Label htmlFor="new-username">Username</Label><Input id="new-username" name="username" autoComplete="off" required maxLength={80}/></div>
    <div className="grid gap-2"><Label htmlFor="new-password">Password inicial</Label><Input id="new-password" name="password" type="password" minLength={10} autoComplete="new-password" required/><p className="text-xs text-muted-foreground">Mínimo de 10 caracteres; será alterada no primeiro acesso.</p></div>
    {state.error && <p className="text-sm text-destructive sm:col-span-2" role="alert">{state.error}</p>}
    {state.success && <p className="text-sm text-emerald-700 sm:col-span-2" role="status">{state.success}</p>}
    <div className="sm:col-span-2"><Button type="submit" disabled={pending}>{pending ? 'A criar…' : 'Criar utilizador'}</Button></div>
  </form>;
}
