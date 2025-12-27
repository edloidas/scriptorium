import { appRouter, createTRPCContext } from '@scriptorium/api';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request): Promise<Response> =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
