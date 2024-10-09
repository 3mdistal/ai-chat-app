import { geminiPro, geminiFlash, geminiFlash8b } from "$lib/ai-init";
import type { RequestHandler } from "@sveltejs/kit";
import {
  convertToCoreMessages,
  streamText,
  type LanguageModel,
  type Message,
} from "ai";
import type { ModelName } from "$lib/types/ModelName";

const modelMap: Record<ModelName, LanguageModel> = {
  geminiPro,
  geminiFlash,
  geminiFlash8b,
};

type ModelKey = keyof typeof modelMap;

export const POST = (async ({ request }) => {
  const { messages, model } = (await request.json()) as {
    messages: Message[];
    model: ModelName;
  };

  const selectedModel =
    model in modelMap ? modelMap[model as ModelKey] : geminiFlash8b;

  const result = await streamText({
    model: selectedModel,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;
