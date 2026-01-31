'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
        null
    );

    useEffect(() => {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }

        setIsIOS(
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        );

        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    if (isStandalone) {
        return null;
    }

    // Don't show anything if no install prompt available (and not iOS)
    if (!deferredPrompt && !isIOS) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 z-50 rounded-lg border bg-background p-4 shadow-lg">
            <h3 className="mb-2 font-semibold">Installa App</h3>
            {deferredPrompt && (
                <Button onClick={handleInstallClick}>Aggiungi alla Home</Button>
            )}
            {isIOS && (
                <p className="text-sm text-muted-foreground">
                    Per installare su iOS, tocca il pulsante condividi
                    <span role="img" aria-label="share icon">
                        {' '}
                        ⎋{' '}
                    </span>
                    e poi "Aggiungi alla schermata Home"
                    <span role="img" aria-label="plus icon">
                        {' '}
                        ➕{' '}
                    </span>
                </p>
            )}
        </div>
    );
}

export default InstallPrompt;
