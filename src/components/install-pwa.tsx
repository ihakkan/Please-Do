'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { playSound } from '@/lib/sounds';

export function InstallPWA() {
  const [prompt, setPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };

    const checkInstallationStatus = () => {
      // For modern browsers
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // For Safari on iOS
      const isSafariStandalone = (window.navigator as any).standalone;
      
      if (isStandalone || isSafariStandalone) {
        setIsAppInstalled(true);
      }
    };
    
    checkInstallationStatus();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      playSound('complete');
      setIsAppInstalled(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
       window.removeEventListener('appinstalled', () => {
        setIsAppInstalled(true);
      });
    };
  }, []);

  const handleInstallClick = async () => {
    if (prompt) {
      playSound('click');
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        setPrompt(null);
      }
    }
  };

  if (isAppInstalled || !prompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 sm:bottom-4 animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
      <Button onClick={handleInstallClick} size="lg" className="shadow-lg shadow-primary/30">
        <Download className="mr-2 h-5 w-5" />
        Install App
      </Button>
    </div>
  );
}
