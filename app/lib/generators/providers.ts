import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { Model } from "./config";

// Create clients directly
const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_BANGERBENCH_API_KEY });
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_BANGERBENCH_API_KEY });
const googleClient = new OpenAI({
  apiKey: process.env.GEMINI_BANGERBENCH_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
const deepseekClient = new OpenAI({
  apiKey: process.env.DEEPSEEK_BANGERBENCH_API_KEY,
  baseURL: "https://api.deepseek.com"
});

export async function generateWithAnthropic(
  model: Model,
  system_prompt: string,
  user_msg: string
): Promise<{ tweet: string; usage: any; raw?: any;}> {
  const payload: any = {
    model: model.id,
    max_tokens: model.maxTokens,
    system: system_prompt,
    messages: [{ role: "user", content: user_msg }]
  };

  if (model.thinking && model.thinkingBudget) {
    payload.thinking = {
      type: "enabled",
      budget_tokens: model.thinkingBudget
    };
  }

  const response = await anthropicClient.messages.create(payload);

  const textBlock = response.content.find(c => c.type === "text");
  const tweet = textBlock?.text ?? "[no text block returned]";

  return {
    tweet,
    usage: response.usage
  };
}

export async function generateWithOpenAI(
  model: Model,
  system_prompt: string,
  user_msg: string
): Promise<{ tweet: string; usage: any; raw?: any }> {
  const tokenKey = model.outputTokenKey || "max_tokens";

  const payload: any = {
    model: model.id,
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: user_msg }
    ],
    [tokenKey]: model.maxTokens
  };

  if (model.reasoningEffort) {
    payload.reasoning_effort = model.reasoningEffort;
  }

  const response = await openaiClient.chat.completions.create(payload);

  return {
    tweet: response.choices?.[0]?.message?.content?.trim() || "",
    usage: response.usage,
    raw: response
  };
}

export async function generateWithGoogle(
  model: Model,
  system_prompt: string,
  user_msg: string
): Promise<{ tweet: string; usage: any; raw?: any }> {
  const tokenKey = model.outputTokenKey || "max_tokens";

  const payload: any = {
    model: model.id,
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: user_msg }
    ],
    [tokenKey]: model.maxTokens
  };

  const response = await googleClient.chat.completions.create(payload);

  return {
    tweet: response.choices?.[0]?.message?.content?.trim() || "",
    usage: response.usage,
    raw: response
  };
}

export async function generateWithDeepseek(
  model: Model,
  system_prompt: string,
  user_msg: string
): Promise<{ tweet: string; usage: any; raw?: any }> {
  const tokenKey = model.outputTokenKey || "max_tokens";

  const payload: any = {
    model: model.id,
    messages: [
      { role: "system", content: system_prompt },
      { role: "user", content: user_msg }
    ],
    [tokenKey]: model.maxTokens
  };

  const response = await deepseekClient.chat.completions.create(payload);

  return {
    tweet: response.choices?.[0]?.message?.content?.trim() || "",
    usage: response.usage,
    raw: response
  };
}


export const providers = {
  anthropic: generateWithAnthropic,
  openai: generateWithOpenAI,
  google: generateWithGoogle,
  deepseek: generateWithDeepseek
};