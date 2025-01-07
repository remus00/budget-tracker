import { RootProviders } from '@/components/providers/root-providers';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'BudgetTracker',
    description: 'Made by Remus',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className={cn('antialiased', inter.className)}>
                    <Toaster richColors position="bottom-right" />
                    <RootProviders>{children}</RootProviders>
                </body>
            </html>
        </ClerkProvider>
    );
}
