<script lang="ts">
  import { createGoogleGenerativeAI } from "@ai-sdk/google";
  import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";
  import { geminiPro, geminiFlash, geminiFlash8b } from "$lib/stores/ai";
  import type { LanguageModel } from "ai";

  let google: ReturnType<typeof createGoogleGenerativeAI>;

  onMount(async () => {
    const apiKey = (await invoke("load_api_key")) as string;
    google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    geminiFlash8b.set(google("gemini-1.5-flash-8b"));
    geminiPro.set(google("gemini-1.5-pro-002"));
    geminiFlash.set(google("gemini-1.5-flash-002"));
  });
</script>
