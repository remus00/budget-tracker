import { RootProviders } from '@/components/providers/root-providers';
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
            <html
                lang="en"
                className="dark"
                style={{ colorScheme: 'dark' }}
                suppressHydrationWarning
            >
                <body className={cn('antialiased', inter.className)}>
                    <RootProviders>{children}</RootProviders>
                </body>
            </html>
        </ClerkProvider>
    );
}
