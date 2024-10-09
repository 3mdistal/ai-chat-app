<script lang="ts">
  import { type Message } from "@ai-sdk/svelte";
  import ModelToggle from "$lib/components/ModelToggle.svelte";

  const availableModels = ["geminiPro", "geminiFlash", "geminiFlash8b"];
  let currentModel = "geminiPro";
  let currentMessages: Message[] = [];

  async function handleSubmit(event: Event) {
    event.preventDefault();

    const inputElement = event.target as HTMLFormElement;
    const formData = new FormData(inputElement);
    const userMessage = formData.get("message") as string;

    console.log("User message:", userMessage); // Log the user message

    if (!userMessage) {
      console.log("No message entered");
      return;
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userMessage,
    };

    currentMessages = [...currentMessages, newMessage];

    console.log("Sending request with messages:", currentMessages); // Log the messages being sent

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: currentMessages,
          model: currentModel,
        }),
      });

      console.log("Response status:", response.status); // Log the response status

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        console.log("Received chunk:", chunk);

        // Clean up the chunk
        let cleanedChunk = chunk
          .replace(/^0:/, "") // Remove leading "0:"
          .replace(/\\n/g, "\n") // Replace escaped newlines with actual newlines
          .replace(/(?<!\\)"/g, "") // remove all unescaped quotes
          .replace(/\\"/g, '"'); // Replace \" with " to preserve intentional quotes

        if (cleanedChunk) {
          // Check if the chunk is the finish reason
          if (cleanedChunk.startsWith("e:") || cleanedChunk.startsWith("d:")) {
            console.log("Finish reason:", cleanedChunk);
            break; // Exit the loop as we've reached the end of the content
          }

          aiMessage.content += cleanedChunk; // Add a space after each chunk
          // Update the UI with the accumulated content
          currentMessages = [
            ...currentMessages.filter((m) => m.id !== aiMessage.id),
            aiMessage,
          ];
        }
      }

      // Final cleanup of the message content
      aiMessage.content = aiMessage.content
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .trim();

      // Ensure the final message is added to currentMessages
      currentMessages = [
        ...currentMessages.filter((m) => m.id !== aiMessage.id),
        aiMessage,
      ];
    } catch (error) {
      console.error("Error in fetch:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }

    inputElement.reset();
  }

  function clearChat() {
    currentMessages = [];
  }

  function handleModelChange(event: CustomEvent<string>) {
    currentModel = event.detail;
    console.log("currentModel", currentModel);
  }
</script>

<main>
  <ModelToggle
    models={availableModels}
    initialModel={currentModel}
    on:modelChange={handleModelChange}
  />

  <div class="chat-container">
    {#each currentMessages as message}
      <div class="message {message.role}">
        <strong>{message.role}:</strong>
        <p>{message.content}</p>
      </div>
    {/each}
  </div>

  <div class="input-container">
    <form on:submit={handleSubmit}>
      <input
        name="message"
        type="text"
        placeholder="Type your message here..."
      />
      <button type="submit">Send</button>
    </form>
    <button on:click={clearChat}>Clear Chat</button>
  </div>
</main>

<style>
  .chat-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    height: 70vh;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .message {
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 5px;
  }

  .user {
    background-color: #e6f3ff;
    text-align: right;
  }

  .assistant {
    background-color: #f0f0f0;
  }

  .input-container {
    max-width: 800px;
    margin: 20px auto;
  }

  form {
    display: flex;
    gap: 10px;
  }

  input {
    flex-grow: 1;
    padding: 10px;
  }

  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
