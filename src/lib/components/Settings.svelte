<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";

  const apiKey = writable("");

  let apiKeyLoaded = false;

  async function saveApiKey() {
    try {
      await invoke("save_api_key", { key: $apiKey });
      alert("API key saved successfully!");
    } catch (error) {
      console.error("Failed to save API key:", error);
      alert("Failed to save API key. Please try again.");
    }
  }

  async function loadApiKey() {
    try {
      const savedKey = await invoke("load_api_key");
      apiKey.set(savedKey as string);
      apiKeyLoaded = true;
      console.log("API key loaded:", savedKey);
    } catch (error) {
      console.error("Failed to load API key:", error);
    }
  }

  onMount(() => {
    loadApiKey();
  });
</script>

{#if !apiKeyLoaded}
  <div>
    <h2>Google API Settings</h2>
    <input
      type="password"
      bind:value={$apiKey}
      placeholder="Enter your Google API key"
    />
    <button on:click={saveApiKey}>Save API Key</button>
  </div>
{/if}
