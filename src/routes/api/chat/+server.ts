import { geminiPro, geminiFlash8b } from "$lib/ai-init";
import type { RequestHandler } from "@sveltejs/kit";
import { convertToCoreMessages, streamText } from "ai";

export const POST = (async ({ request }) => {
  const { messages } = await request.json();

  const result = await streamText({
    model: geminiPro,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;
