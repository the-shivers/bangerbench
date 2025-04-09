import { MODELS } from "./config";
import { generateWithAnthropic, generateWithOpenAI, generateWithGoogle } from "./providers";

export async function generateTweet(
  modelId: string, 
  system_prompt: string, 
  user_msg: string
): Promise<{ tweet: string; usage: any; raw?: any; }> {
  const model = MODELS.find(m => m.id === modelId);
  if (!model) throw new Error(`Model not found: ${modelId}`);
  if (model.provider === "anthropic") {
    return generateWithAnthropic(model, system_prompt, user_msg);
  } else if (model.provider === "openai") {
    return generateWithOpenAI(model, system_prompt, user_msg);
  } else if (model.provider === "google") {
    return generateWithGoogle(model, system_prompt, user_msg);
  }
  throw new Error(`Unknown provider: ${model.provider}`);
}

export async function generateAllTweets(
  system_prompt: string,
  user_msg: string
): Promise<any[]> {
  const results = [];
  for (const model of MODELS) {
    try {
      const { tweet, usage, raw } = await generateTweet(model.id, system_prompt, user_msg);
      results.push({
        provider: model.provider,
        model: model.id,
        displayName: model.displayName,
        tweet,
        usage,
        raw,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error(`Error with ${model.displayName}:`, err);
    }
  }
  return results;
}