import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './Home';
import { Game } from './Game';

const queryClient = new QueryClient();

export type Page = 'home' | 'map' | 'characters' | 'howtoplay';

const slideVariants = {
  enterFromRight: { x: '100%', opacity: 0 },
  enterFromLeft:  { x: '-100%', opacity: 0 },
  center:         { x: 0, opacity: 1 },
  exitToLeft:     { x: '-100%', opacity: 0 },
  exitToRight:    { x: '100%', opacity: 0 },
};

const pageOrder: Page[] = ['home', 'map', 'characters', 'howtoplay'];

function App() {
  const [page, setPage] = useState<Page>('home');
  const [direction, setDirection] = useState<1 | -1>(1);

  const navigate = (next: Page) => {
    const cur = pageOrder.indexOf(page);
    const nxt = pageOrder.indexOf(next);
    setDirection(nxt >= cur ? 1 : -1);
    setPage(next);
  };

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
                exit:    (d: number) => ({ x: d > 0 ? '-18%' : '18%', opacity: 0 }),
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

export default App;
