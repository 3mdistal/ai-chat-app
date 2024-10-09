<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { ModelName } from "$lib/types/ModelName";

  const dispatch = createEventDispatcher();

  export let selectedModel: ModelName;
  export let availableModels: ModelName[];

  function handleChange() {
    dispatch("modelChange", selectedModel);
  }

  // Helper function to format model name for display
  function formatModelName(model: string): string {
    return model
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
</script>

<div class="model-toggle">
  {#each availableModels as model}
    <label>
      <input
        type="radio"
        name="model"
        value={model}
        bind:group={selectedModel}
        on:change={handleChange}
      />
      {formatModelName(model)}
    </label>
  {/each}
</div>

<style>
  .model-toggle {
    margin-bottom: 10px;
  }
  label {
    margin-right: 10px;
    display: inline-block;
  }
</style>
