import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
export const { handlers, auth, signIn, signOut } = NextAuth({
 session: { strategy: 'jwt' }, pages: { signIn: '/backoffice/login' },
 providers: [Credentials({ credentials: { username: {}, password: {} }, async authorize(credentials) {
  const user = await prisma.user.findUnique({ where: { username: String(credentials.username) } });
  if (!user || !(await compare(String(credentials.password), user.passwordHash))) return null;
  return { id: user.id, name: user.username, mustChangePassword: user.mustChangePassword };
 }})],
 callbacks: { async jwt({ token, user }) { if (user) { token.sub = user.id; token.mustChangePassword = (user as any).mustChangePassword; } else if (token.sub) { const current = await prisma.user.findUnique({ where: { id: token.sub }, select: { mustChangePassword: true } }); token.mustChangePassword = current?.mustChangePassword ?? false; } return token; }, async session({ session, token }) { (session.user as any).mustChangePassword = token.mustChangePassword; return session; } }
});
