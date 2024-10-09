<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { LanguageModel } from "ai";
  import { geminiFlash, geminiPro, geminiFlash8b } from "$lib/stores/ai";

  const dispatch = createEventDispatcher();

  export let selectedModel: LanguageModel;
  export let availableModels: LanguageModel[] = [
    $geminiFlash,
    $geminiPro,
    $geminiFlash8b,
  ];

  function handleChange() {
    dispatch("modelChange", selectedModel.modelId);
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
    <label class="model-option">
      <input
        type="radio"
        name="model"
        value={model}
        bind:group={selectedModel}
        on:change={handleChange}
      />
      <span class="model-name">{formatModelName(model.modelId)}</span>
    </label>
  {/each}
</div>

<style>
  .model-toggle {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }

  .model-option {
    display: inline-block;
    position: relative;
    padding: 10px 15px;
    background-color: #f0f0f0;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .model-option:hover {
    background-color: #e0e0e0;
  }

  input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  input[type="radio"]:checked + .model-name {
    font-weight: bold;
    color: #4caf50;
  }

  .model-name {
    font-size: 14px;
  }

  @media (prefers-color-scheme: dark) {
    .model-option {
      background-color: #333;
      color: #e0e0e0;
    }

    .model-option:hover {
      background-color: #444;
    }

    input[type="radio"]:checked + .model-name {
      color: #81c784;
    }
  }
</style>
