import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export const aiRouter = router({
  // Placeholder for AI-related procedures
  // Actual AI streaming is handled via Next.js API routes with AI SDK
  generateSuggestion: publicProcedure
    .input(
      z.object({
        context: z.string(),
        prompt: z.string(),
      }),
    )
    .mutation(({ input }) => {
      // This is a placeholder - actual AI generation uses AI SDK streaming
      // via the /api/ai/chat route in the web app
      return {
        suggestion: `AI suggestion for: ${input.prompt}`,
        context: input.context,
      };
    }),
});
