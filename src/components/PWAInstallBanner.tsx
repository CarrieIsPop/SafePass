import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone, Share, ArrowUpSquare, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallBanner() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other' | null>(null);

  useEffect(() => {
    // 1. Detect platform and stand-alone status
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    
    // Check if app is already running as standalone (installed)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return; // Already installed, do not show banner
    }

    if (isIOS) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('other');
    }

    // 2. Check dismissal state
    const isDismissed = localStorage.getItem('safepass_pwa_dismissed');
    if (isDismissed) {
      // If dismissed earlier, check how long ago. Let's make it 24 hours dismissal.
      const dismissTime = parseInt(isDismissed, 10);
      const currentTime = Date.now();
      if (currentTime - dismissTime < 24 * 60 * 60 * 1000) {
        return; // Skip displaying if dismissed in the last 24h
      }
    }

    // 3. Listen for Chromium standard install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. For iOS or older mobile support where prompt event doesn't fire, 
    // we show the custom banner automatically on mobile devices after a small delay
    if (isIOS && !isStandalone) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 4000); // 4 seconds delay so they can absorb the main UI first
      return () => clearTimeout(timer);
    }

    // For Android if standard prompt didn't fire but we want to let them know
    // we can conditionally show the banner as well if there's no native prompt yet
    if (isAndroid && !isStandalone) {
      const timer = setTimeout(() => {
        // Only show if prompt didn't fire, just in case to ensure we still offer the install option
        setIsVisible(true);
      }, 6000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      // Trigger native chromium installation flow
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsVisible(false);
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
    } else {
      // Fallback or Android manual install guidance if prompt is unavailable
      alert('Para instalar esta aplicación, abra el menú de su navegador (tres puntos) y seleccione "Instalar aplicación" o "Agregar a pantalla de inicio".');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Persist rejection to local storage for 24 hours to ensure high UX index
    localStorage.setItem('safepass_pwa_dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="pointer-events-auto w-full max-w-[370px] bg-slate-900/95 backdrop-blur-xl border border-emerald-500/25 rounded-3xl p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-white relative overflow-hidden flex flex-col gap-3.5 ring-2 ring-emerald-500/10"
        >
          {/* Subtle glowing corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[30px] -z-10" />

          {/* Close button */}
          <button 
            onClick={handleDismiss}
            className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white transition-colors p-1 bg-slate-950/40 rounded-full border border-slate-800"
            aria-label="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/15 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 pr-5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 fill-emerald-400" /> SafePass Mobile
                </span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">¿Instalar en tu dispositivo?</h4>
              <p className="text-[11px] text-slate-350 mt-1 leading-normal font-medium">
                Accede instantáneamente desde tu pantalla de inicio con <strong>cero latencia y 100% de funciones offline</strong>.
              </p>
            </div>
          </div>

          {/* Conditional layout depending on Mobile Platform (iOS has custom instructions) */}
          {platform === 'ios' ? (
            <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/80 space-y-2 text-slate-300">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wide">
                Instrucciones para iPhone / iPad:
              </span>
              <ul className="space-y-1.5 text-[11px] leading-relaxed">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-400">1</span>
                  <span>Pulsa el botón de <strong>Compartir</strong> <Share className="w-3.5 h-3.5 inline mx-0.5 text-emerald-400" /> en tu Safari inferior.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-400">2</span>
                  <span>Selecciona la opción <strong className="text-white">"Añadir a pantalla de inicio"</strong> <ArrowUpSquare className="w-3.5 h-3.5 inline mx-0.5 text-emerald-400" />.</span>
                </li>
              </ul>
              <div className="pt-1 text-[9px] text-slate-500 italic text-center">
                ¡Y listo! Se configurará como una App nativa de iOS.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mt-0.5">
              <button
                onClick={handleDismiss}
                className="py-2.5 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all text-center"
              >
                Ahora no
              </button>
              <button
                onClick={handleInstallClick}
                className="py-2.5 px-3 bg-white text-slate-950 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/5 select-none"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar App</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
