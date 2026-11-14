import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
export const metadata: Metadata = { title: { default: 'chigo. — Creative Studio', template: '%s | chigo.' }, description: 'Peças únicas, desenhadas e impressas em 3D. Descubra a coleção chigo. Creative Studio.', metadataBase: new URL('https://chigo.pt'), openGraph: { type: 'website', locale: 'pt_PT', siteName: 'chigo. Creative Studio' }, robots: { index: true, follow: true } };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-PT" suppressHydrationWarning><body><ThemeProvider attribute="class" defaultTheme="light" enableSystem><div className="announcement"><span>PEÇAS CRIADAS COM INTENÇÃO</span><span>FEITO EM PORTUGAL · IMPRESSÃO 3D</span></div>{children}</ThemeProvider></body></html>; }
