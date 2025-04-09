// app/lib/generators/providers.ts

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { PROMPTS } from "./config";
import { Model } from "./config";

// Create clients directly
const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_BANGERBENCH_API_KEY });
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_BANGERBENCH_API_KEY });

export async function generateWithAnthropic(
  model: Model, 
  prompt: string, 
  context?: string, 
  prevWork?: string
): Promise<string> {
  const userPrompt = [
    prompt,
    context ? `${PROMPTS.context}\n${context}` : '',
    prevWork ? `${PROMPTS.prevWork}\n${prevWork}` : ''
  ].filter(Boolean).join('\n\n');
  
  const response = await anthropicClient.messages.create({
    model: model.id,
    max_tokens: model.maxTokens,
    system: PROMPTS.base,
    messages: [{ role: "user", content: userPrompt }]
  });
  
  // Handle text content type
  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  return '';
}

export async function generateWithOpenAI(
  model: Model, 
  prompt: string, 
  context?: string, 
  prevWork?: string
): Promise<string> {
  const systemPrompt = [
    PROMPTS.base,
    context ? `${PROMPTS.context}\n${context}` : '',
    prevWork ? `${PROMPTS.prevWork}\n${prevWork}` : ''
  ].filter(Boolean).join('\n\n');
  
  const response = await openaiClient.chat.completions.create({
    model: model.id,
    max_tokens: model.maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ]
  });
  
  return response.choices[0].message.content || '';
}

export const providers = {
  anthropic: generateWithAnthropic,
  openai: generateWithOpenAI
};