'use client';
import { useActionState } from 'react';
import { loginAction, type LoginState } from '@/app/backoffice/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialState: LoginState = {};
export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return <form action={action} className="grid gap-4" aria-describedby={state.error ? 'login-error' : undefined}>
    <div className="grid gap-2"><Label htmlFor="username">Username</Label><Input id="username" name="username" required autoComplete="username"/></div>
    <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" required type="password" autoComplete="current-password"/></div>
    {state.error && <p id="login-error" role="alert" aria-live="polite" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>}
    <Button type="submit" className="w-full" disabled={pending}>{pending ? 'A validar…' : 'Entrar'}</Button>
  </form>;
}
