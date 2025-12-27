'use client';

import type { AppRouter } from '@scriptorium/api';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
