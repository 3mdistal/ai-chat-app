<script lang="ts">
  import { useChat } from "@ai-sdk/svelte";
  import type { Message, LanguageModel } from "ai";
  import ModelToggle from "$lib/components/ModelToggle.svelte";
  import { writable, type Writable } from "svelte/store";
  import type { ModelName } from "$lib/types/ModelName";
  import { fade } from "svelte/transition";
  import Settings from "$lib/components/Settings.svelte";
  import AIInit from "$lib/components/AIInit.svelte";
  import { geminiFlash, geminiPro, geminiFlash8b } from "$lib/stores/ai";
  import { onMount } from "svelte";

  let currentMessages: Message[] = [];
  let inputElement: HTMLInputElement;
  let currentInput: string;

  let availableModels: Writable<LanguageModel[]> = writable([]);
  let currentModel: Writable<LanguageModel> = writable();

  onMount(() => {
    currentModel.set($geminiFlash8b);
    availableModels.set([$geminiFlash, $geminiPro, $geminiFlash8b]);
  });

  $: ({ input, handleSubmit, messages, setMessages } = useChat({
    initialMessages: currentMessages,
    initialInput: currentInput,
    body: { model: $currentModel },
    onFinish: (message, { usage, finishReason }) => {
      console.log("Token usage: ", usage);
      console.log("Finish reason: ", finishReason);
      console.log("Message: ", message.content);
    },
  }));

  function clearChat() {
    currentMessages = [];
    currentInput = $input;
    setMessages(currentMessages);
  }

  function handleModelChange(event: CustomEvent<string>) {
    currentMessages = [...$messages];
    const selectedModel = event.detail as ModelName;
    currentInput = $input;

    const selectedModelObject = $availableModels.find(
      (model) => model.modelId === selectedModel
    );
    if (selectedModelObject) {
      currentModel.set(selectedModelObject);
    } else {
      console.error(`Model ${selectedModel} not found in available models`);
      return;
    }

    currentModel.set(selectedModelObject);
  }
</script>

<main class="container">
  <AIInit />
  <Settings />
  <ModelToggle
    selectedModel={$currentModel}
    availableModels={$availableModels}
    on:modelChange={handleModelChange}
  />

  <div class="chat-container">
    <ul class="message-list">
      {#each $messages as message}
        <li class="message {message.role}" transition:fade>
          <strong>{message.role}:</strong>
          {@html message.content
            .replace(/\n/g, "<br>")
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
            .replace(/\_(.*?)\_/g, "<i>$1</i>")}
        </li>
      {/each}
    </ul>
  </div>

  <div class="input-container">
    <form on:submit={handleSubmit}>
      <input
        bind:value={$input}
        bind:this={inputElement}
        placeholder="Type your message..."
      />
      <button type="submit">Send</button>
    </form>
    <button on:click={clearChat} class="clear-button">Clear Chat</button>
  </div>
</main>

<style>
  :global(body) {
    height: 100vh;
    overflow: hidden;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
    color: #333;
    background-color: #fff;
  }

  .chat-container {
    flex-grow: 1;
    overflow-y: auto;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
  }

  .message-list {
    list-style-type: none;
    padding: 0;
  }

  .message {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
    max-width: 80%;
  }

  .user {
    background-color: #e3f2fd;
    align-self: flex-end;
    margin-left: auto;
  }

  .assistant {
    background-color: #f0f4c3;
  }

  .input-container {
    display: flex;
    gap: 10px;
    padding-bottom: 10px;
  }

  input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    background-color: #fff;
    color: #333;
  }

  button {
    padding: 10px 15px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #45a049;
  }

  .clear-button {
    background-color: #f44336;
  }

  .clear-button:hover {
    background-color: #d32f2f;
  }

  @media (prefers-color-scheme: dark) {
    :global(body) {
      background-color: #1a1a1a;
    }

    .container {
      color: #e0e0e0;
      background-color: #1a1a1a;
    }

    .chat-container {
      background-color: #2a2a2a;
      border-color: #444;
    }

    .user {
      background-color: #1e3a5f;
    }

    .assistant {
      background-color: #3a3a1e;
    }

    input {
      background-color: #333;
      color: #e0e0e0;
      border-color: #555;
    }

    button {
      background-color: #388e3c;
    }

    button:hover {
      background-color: #2e7d32;
    }

    .clear-button {
      background-color: #d32f2f;
    }

    .clear-button:hover {
      background-color: #c62828;
    }
  }
</style>
