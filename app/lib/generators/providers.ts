import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { Model } from "./config";

// Create clients directly
const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_BANGERBENCH_API_KEY });
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_BANGERBENCH_API_KEY });

export async function generateWithAnthropic(
  model: Model, 
  system_prompt: string, 
  user_msg: string
): Promise<string> {
  const response = await anthropicClient.messages.create({
    model: model.id,
    max_tokens: model.maxTokens,
    system: system_prompt,
    messages: [{ role: "user", content: user_msg }]
  });
  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  return '';
}

export async function generateWithOpenAI(
  model: Model, 
  system_prompt: string, 
  user_msg: string
): Promise<string> {
  const response = await openaiClient.chat.completions.create({
    model: model.id,
    max_tokens: model.maxTokens,
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: user_msg }
    ]
  });
  return response.choices[0].message.content || '';
}

export const providers = {
  anthropic: generateWithAnthropic,
  openai: generateWithOpenAI
};