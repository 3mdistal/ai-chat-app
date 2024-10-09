import { writable } from "svelte/store";
import type { LanguageModel } from "ai";

export const geminiPro = writable<LanguageModel>();
export const geminiFlash = writable<LanguageModel>();
export const geminiFlash8b = writable<LanguageModel>();

export const google_api_key = writable("");
