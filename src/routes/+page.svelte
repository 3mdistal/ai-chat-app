<script lang="ts">
  import { useChat } from "@ai-sdk/svelte";
  import ModelToggle from "$lib/components/ModelToggle.svelte";
  import { writable } from "svelte/store";

  let currentModel = writable("geminiPro");

  $: ({ input, handleSubmit, messages, setMessages } = useChat({
    initialMessages: [],
    body: { model: $currentModel },
  }));

  function clearChat() {
    setMessages([]);
  }

  function handleModelChange(event: CustomEvent<string>) {
    const selectedModel = event.detail;
    currentModel.set(selectedModel);
  }
</script>

<main>
  <ModelToggle on:modelChange={handleModelChange} />

  <div class="chat-container">
    <ul class="message-list">
      {#each $messages as message}
        <li>{message.role}: {message.content}</li>
      {/each}
    </ul>
  </div>

  <div class="input-container">
    <form on:submit={handleSubmit}>
      <input bind:value={$input} />
      <button type="submit">Send</button>
    </form>
    <button on:click={clearChat}>Clear Chat</button>
  </div>
</main>

<style>
  .chat-container {
    height: 300px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }

  .message-list {
    list-style-type: none;
    padding: 0;
  }

  .input-container {
    display: flex;
    gap: 10px;
  }

  input {
    flex-grow: 1;
    padding: 5px;
  }

  button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
