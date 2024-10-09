<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let selectedModel = "geminiPro";

  function handleChange() {
    dispatch("modelChange", selectedModel);
  }
</script>

<div class="model-toggle">
  <label>
    <input
      type="radio"
      name="model"
      value="geminiPro"
      bind:group={selectedModel}
      on:change={handleChange}
    />
    Gemini Pro
  </label>
  <label>
    <input
      type="radio"
      name="model"
      value="geminiFlash8b"
      bind:group={selectedModel}
      on:change={handleChange}
    />
    Gemini Flash 8B
  </label>
</div>

<style>
  .model-toggle {
    margin-bottom: 10px;
  }
  label {
    margin-right: 10px;
  }
</style>
