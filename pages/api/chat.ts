import OpenAI from "openai";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";


const openai = createOpenAI({
  baseURL: "http://127.0.0.1:5000/v1",
});

export const runtime = "edge";

export default async function POST(req: Request) {
  try {
    const body = await req.text(); // Get raw body text first
    if (!body) {
      console.error("Empty request body received");
      return new Response("No content received", { status: 400 });
    }

    const { messages } = JSON.parse(body); // Now safely parse JSON
    console.log(messages);

    const response = await streamText({
      model: openai("gpt-3.5-turbo"),
      
      messages: [
        {
          role: "system",
          content: `You are a professional storyteller who has been hired to write a series of short stories for a new anthology. The stories should be captivating, imaginative, and thought-provoking. They should explore a variety of themes and genres, from science fiction and fantasy to mystery and romance. Each story should be unique and memorable, with compelling characters and unexpected plot twists.`,
        },
        ...messages,
      ],
    });

    console.log("Response: ", response);
    return response.toDataStreamResponse();
  } catch (error) {
    console.error("Stream error:", error);
    return new Response("Error handling stream", { status: 500 });
  }
}