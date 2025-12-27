import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { TRPCProvider } from '@/providers/trpc-provider';

import './globals.css';

export const metadata: Metadata = {
  title: 'Scriptorium',
  description: 'Visual editor for crafting branching game dialogs',
};

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <html lang='en'>
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
