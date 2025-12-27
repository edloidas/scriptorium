import { aiRouter } from './routers/ai';
import { dialogRouter } from './routers/dialog';
import { router } from './trpc';

export const appRouter = router({
  dialog: dialogRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
