// app/lib/generation/providers.js

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { PROMPTS } from "./config.js";

// Create clients directly
const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_BANGERBENCH_API_KEY });
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_BANGERBENCH_API_KEY });

export async function generateWithAnthropic(model, prompt, context, prevWork) {
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
  return response.content[0].text;
}

export async function generateWithOpenAI(model, prompt, context, prevWork) {
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
  return response.choices[0].message.content;
}

export const providers = {
  anthropic: generateWithAnthropic,
  openai: generateWithOpenAI
};