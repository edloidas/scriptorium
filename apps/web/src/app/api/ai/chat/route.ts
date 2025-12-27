import { openai } from '@ai-sdk/openai';
import { type ModelMessage, streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request): Promise<Response> {
  const { messages } = (await req.json()) as { messages: ModelMessage[] };

  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  // biome-ignore lint/suspicious/noExplicitAny: AI SDK version mismatch requires cast
  const model = openai('gpt-4o') as any;
  const result = streamText({
    model,
    system: 'You are a helpful assistant for creating game dialog. Help users craft engaging branching narratives.',
    messages,
  });
  /* eslint-enable @typescript-eslint/no-unsafe-assignment */

  return result.toTextStreamResponse();
}
