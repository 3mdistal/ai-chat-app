import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GOOGLE_API_KEY } from "$env/static/private";

const google = createGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY,
});

export const geminiPro = google("gemini-1.5-pro-002");
export const geminiFlash8b = google("gemini-1.5-flash-8b");
