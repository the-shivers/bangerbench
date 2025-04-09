import { MODELS } from "./config.js";
import { generateWithAnthropic, generateWithOpenAI } from "./providers.js";

export async function generateTweet(modelId, prompt, context, prevWork) {
 const model = MODELS.find(m => m.id === modelId);
 if (!model) throw new Error(`Model not found: ${modelId}`);
 if (model.provider === "anthropic") {
   return generateWithAnthropic(model, prompt, context, prevWork);
 } else if (model.provider === "openai") {
   return generateWithOpenAI(model, prompt, context, prevWork);
 }
 throw new Error(`Unknown provider: ${model.provider}`);
}

export async function generateAllTweets(prompt, context, prevWork) {
 const results = [];
 for (const model of MODELS) {
   try {
     let tweet;
     if (model.provider === "anthropic") {
       tweet = await generateWithAnthropic(model, prompt, context, prevWork);
     } else if (model.provider === "openai") {
       tweet = await generateWithOpenAI(model, prompt, context, prevWork);
     }
     results.push({
       provider: model.provider,
       model: model.id,
       displayName: model.displayName,
       tweet,
       timestamp: new Date().toISOString()
     });
   } catch (err) {
     console.error(`Error with ${model.displayName}:`, err);
   }
 }
 return results;
}