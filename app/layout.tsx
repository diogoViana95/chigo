import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from '@/components/ui/sonner';

const geist = Geist({subsets:['latin'],variable:'--font-geist-sans'});

export const metadata: Metadata = { title: { default: 'chigo. — Creative Studio', template: '%s | chigo.' }, description: 'Peças únicas, desenhadas e impressas em 3D. Descubra a coleção chigo. Creative Studio.', metadataBase: new URL('https://chigo.pt'), openGraph: { type: 'website', locale: 'pt_PT', siteName: 'chigo. Creative Studio' }, robots: { index: true, follow: true } };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-PT" suppressHydrationWarning className={cn("font-sans", geist.variable)}><body><ThemeProvider attribute="class" defaultTheme="dark" enableSystem>{children}<Toaster richColors position="top-right"/></ThemeProvider></body></html>; }
