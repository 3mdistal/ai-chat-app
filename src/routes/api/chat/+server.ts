import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { RequestHandler } from "@sveltejs/kit";
import {
  convertToCoreMessages,
  streamText,
  type LanguageModel,
  type Message,
} from "ai";
import type { ModelName } from "$lib/types/ModelName";

export const POST = (async ({ request }) => {
  const { messages, model, apiKey } = (await request.json()) as {
    messages: Message[];
    model: ModelName;
    apiKey: string;
  };

  const google = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  const geminiPro = google("gemini-1.5-pro-002");
  const geminiFlash = google("gemini-1.5-flash-002");
  const geminiFlash8b = google("gemini-1.5-flash-8b");

  const modelMap: Record<ModelName, LanguageModel> = {
    geminiPro,
    geminiFlash,
    geminiFlash8b,
  };

  type ModelKey = keyof typeof modelMap;

  const selectedModel =
    model in modelMap ? modelMap[model as ModelKey] : geminiFlash8b;

  const result = await streamText({
    model: selectedModel,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;
