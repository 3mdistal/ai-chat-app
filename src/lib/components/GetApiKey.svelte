<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";
  import { google_api_key } from "$lib/stores/ai";

  onMount(async () => {
    const apiKey = (await invoke("load_api_key")) as string;
    google_api_key.set(apiKey);
  });
</script>
