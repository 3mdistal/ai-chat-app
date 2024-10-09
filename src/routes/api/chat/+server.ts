import type { ModelName } from "$lib/types/ModelName";
import type { RequestHandler } from "@sveltejs/kit";
import {
  convertToCoreMessages,
  streamText,
  type LanguageModel,
  type Message,
} from "ai";

export const POST = (async ({ request }) => {
  const { messages, model } = (await request.json()) as {
    messages: Message[];
    model: LanguageModel;
  };

  const result = await streamText({
    model: model,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;
