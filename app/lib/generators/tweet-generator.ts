import { MODELS } from "./config";
import { providers } from "./providers";

export async function generateTweet(
  modelId: string, 
  system_prompt: string, 
  user_msg: string
): Promise<{ tweet: string; usage: any; raw?: any; }> {
  const model = MODELS.find(m => m.id === modelId);
  if (!model) throw new Error(`Model not found: ${modelId}`);
  return providers[model.provider](model, system_prompt, user_msg)
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