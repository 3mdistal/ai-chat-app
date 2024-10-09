import { geminiPro, geminiFlash, geminiFlash8b } from "$lib/ai-init";
import type { RequestHandler } from "@sveltejs/kit";
import { convertToCoreMessages, streamText } from "ai";

export const POST = (async ({ request }) => {
  const { messages, model } = await request.json();

  const selectedModel = model === "geminiFlash8b" ? geminiFlash8b : geminiPro;

  const result = await streamText({
    model: selectedModel,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;
