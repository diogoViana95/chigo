import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from '@/components/ui/sonner';

const geist = Geist({subsets:['latin'],variable:'--font-geist-sans'});

export const metadata: Metadata = { title: { default: 'chigo. — Creative Studio', template: '%s | chigo.' }, description: 'Peças únicas, desenhadas e impressas em 3D. Descubra a coleção chigo. Creative Studio.', metadataBase: new URL('https://chigo.pt'), openGraph: { type: 'website', locale: 'pt_PT', siteName: 'chigo. Creative Studio' }, robots: { index: true, follow: true } };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-PT" suppressHydrationWarning className={cn("font-sans", geist.variable)}><body><ThemeProvider attribute="class" defaultTheme="light" enableSystem><div className="flex h-8 items-center justify-between bg-foreground px-4 text-[10px] font-medium uppercase tracking-[0.16em] text-background sm:px-8 lg:px-12"><span>Peças criadas com intenção</span><span className="hidden sm:inline">Feito em Portugal · Impressão 3D</span></div>{children}<Toaster richColors position="top-right"/></ThemeProvider></body></html>; }
