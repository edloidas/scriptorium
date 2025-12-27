import { Button } from '@scriptorium/ui';
import type { ReactNode } from 'react';

export default function HomePage(): ReactNode {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-8 p-8'>
      <h1 className='font-bold text-4xl'>Scriptorium</h1>
      <p className='text-gray-600 text-lg'>Visual editor for crafting branching game dialogs</p>
      <div className='flex gap-4'>
        <Button variant='primary'>Get Started</Button>
        <Button variant='secondary'>Learn More</Button>
      </div>
    </main>
  );
}
