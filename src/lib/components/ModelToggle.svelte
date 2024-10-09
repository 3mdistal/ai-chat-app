<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let models: string[] = ["geminiPro", "geminiFlash", "geminiFlash8b"];
  export let initialModel: string = "geminiPro";

  const dispatch = createEventDispatcher();

  let selectedModel = initialModel;

  function handleChange() {
    dispatch("modelChange", selectedModel);
  }
</script>

<div class="model-toggle">
  {#each models as model}
    <label>
      <input
        type="radio"
        name="model"
        value={model}
        bind:group={selectedModel}
        on:change={handleChange}
      />
      {model}
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
