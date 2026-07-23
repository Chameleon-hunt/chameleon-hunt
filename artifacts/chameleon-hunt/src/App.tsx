import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './lib/i18n';
import { AuthProvider, useAuth } from './lib/auth';
import { Home } from './Home';
import { Game } from './Game';
import { AuthPage } from './components/AuthPage';
import { UsernameModal } from './components/UsernameModal';

const queryClient = new QueryClient();

export type Page = 'home' | 'map' | 'characters' | 'howtoplay';

const pageOrder: Page[] = ['home', 'map', 'characters', 'howtoplay'];

// ── Loading screen ──────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-6"
      style={{ background: '#08081a', fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Animated logo letters */}
      <div style={{ display: 'flex', gap: 4, fontSize: '2.4rem', fontFamily: "'Righteous', sans-serif", fontWeight: 900 }}>
        {(["H","U","N","T"] as const).map((l, i) => (
          <motion.span
            key={l}
            style={{ color: ["#FF2D55","#39FF14","#0080FF","#FFE600"][i] }}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 0.8, delay: i * 0.12, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF6B00' }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Inner app (wrapped by auth) ─────────────────────────────────────────────
function AppInner() {
  const { user, profile, loading, needsUsername } = useAuth();
  const [page, setPage] = useState<Page>('home');
  const [direction, setDirection] = useState<1 | -1>(1);

  const navigate = (next: Page) => {
    const cur = pageOrder.indexOf(page);
    const nxt = pageOrder.indexOf(next);
    setDirection(nxt >= cur ? 1 : -1);
    setPage(next);
  };

  // 1. Auth resolving
  if (loading) return <LoadingScreen />;

  // 2. Not logged in → show auth page
  if (!user) return <AuthPage />;

  // 3. Logged in but no username yet → username picker
  if (needsUsername) return <UsernameModal />;

  // 4. Fully authenticated → normal app
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative overflow-hidden min-h-[100dvh]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={{
                initial: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
                animate: { x: 0, opacity: 1 },
                exit:    (d: number) => ({ x: d > 0 ? '-15%' : '15%', opacity: 0, scale: 0.97 }),
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 w-full min-h-[100dvh]"
              style={{ overflowY: 'auto' }}
            >
              {page === 'home' && <Home onNavigate={navigate} />}
              {page !== 'home' && <Game activePage={page} onNavigate={navigate} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
