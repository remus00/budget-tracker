'use client';
import { ThemeProvider } from 'next-themes';
import { PropsWithChildren } from 'react';

export const RootProviders = ({ children }: PropsWithChildren) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    );
};
