import 'server-only';

import { appRouter, createCallerFactory, createTRPCContext } from '@scriptorium/api';

const createCaller = createCallerFactory(appRouter);

export const serverTrpc = createCaller(createTRPCContext());
