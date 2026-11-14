import { auth } from '@/auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

export const uploadRouter = {
  productImage: f({ image: { maxFileSize: '8MB', maxFileCount: 10 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.name) throw new UploadThingError('Tens de iniciar sessão no backoffice para carregar imagens.');
      return { username: session.user.name };
    })
    .onUploadComplete(({ file }) => ({ key: file.key, url: file.ufsUrl, name: file.name })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
