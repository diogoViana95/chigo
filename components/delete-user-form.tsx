'use client';
import { useActionState, useState } from 'react';
import { deleteUserAction, type CreateUserState } from '@/app/backoffice/actions';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
const initialState: CreateUserState = {};
export function DeleteUserForm({ id, username }: { id: string; username: string }) {
  const [state, action, pending] = useActionState(deleteUserAction, initialState);
  const [open, setOpen] = useState(false);
  return <>
    <Button type="button" variant="destructive" size="sm" onClick={()=>setOpen(true)}>Apagar</Button>
    {state.error && <p role="alert" className="text-xs text-destructive">{state.error}</p>}
    {state.success && <p role="status" className="text-xs text-emerald-700">{state.success}</p>}
    <AlertDialog open={open} onOpenChange={setOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Apagar {username}?</AlertDialogTitle><AlertDialogDescription>Esta conta deixará de poder aceder ao backoffice.</AlertDialogDescription></AlertDialogHeader><form action={action}><input type="hidden" name="id" value={id}/><AlertDialogFooter><AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel><Button type="submit" variant="destructive" disabled={pending}>{pending?'A apagar…':'Apagar utilizador'}</Button></AlertDialogFooter></form></AlertDialogContent></AlertDialog>
  </>;
}
