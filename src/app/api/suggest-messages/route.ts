import { google } from "@ai-sdk/google";
import { streamText } from "ai";
// import { GoogleGenAI } from "@google/genai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const prompt =
  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

// use this code if the below implementation doesn't works
// export async function POST(req: Request) {

//   const ai = new GoogleGenAI({
//     apiKey: process.env.GENERATIVE_AI_API_KEY,
//   });

//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: prompt,
//   });
//   console.log(response.text);
//   return response.text;
// }

export async function POST() {
  try {
    const result = streamText({
      model: google("models/gemini-1.5-flash"),
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Streaming error:", error);
    return new Response("Error generating content", { status: 500 });
  }
}
