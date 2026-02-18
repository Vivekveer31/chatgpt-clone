import client from "./utils/openai.utils.js";
import tavilyClient from "./utils/tavily.utils.js";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";


async function webSearch({ query }) {
  console.log("calling websearch")
  const response = await tavilyClient.search(query);
  return response.results.map(r => r.content).join("\n\n");
}


const toolsMap = {
  webSearch
};

const rl = readline.createInterface({ input, output });


const messages = [
  {
    role: "system",
    content: `
You are a highly intelligent AI assistant.
- Be clear and structured.
- Use webSearch tool when real-time data is required.
- If user asks about current news, weather, date, prices → use tool.
`
  }
];

async function chatLoop() {
  while (true) {

    const userInput = await rl.question("\nYou: ");

    if (userInput.toLowerCase() === "exit") {
      console.log("Goodbye 👋");
      process.exit(0);
    }

    messages.push({
      role: "user",
      content: userInput
    });

  
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description: "Search latest real-time information",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query"
                }
              },
              required: ["query"]
            }
          }
        }
      ],
      tool_choice: "auto"
    });

    const message = response.choices[0].message;

   
    if (!message.tool_calls) {
      console.log("\nAssistant:", message.content);
      messages.push(message);
      continue;
    }

 
    messages.push(message);

    for (const toolCall of message.tool_calls) {

      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      const toolResult = await toolsMap[functionName](args);

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: toolResult
      });
    }

   
    const finalResponse = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages
    });

    const finalMessage = finalResponse.choices[0].message;

    console.log("\nAssistant:", finalMessage.content);

    messages.push(finalMessage);
  }
}

chatLoop();
