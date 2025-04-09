export interface Model {
  provider: "anthropic" | "openai" | "google";
  id: string;
  displayName: string;
  thinking: boolean;
  maxTokens: number;

  // Optional fields
  outputTokenKey?: "max_tokens" | "max_completion_tokens" | "max_output_tokens";
  reasoningEffort?: "low" | "medium" | "high"; // for OpenAI o-models
  thinkingBudget?: number; // for Anthropic 3.7 models
}


export const PROMPTS = {
  system: "You are competing with other LLMs to write the most viral tweet possible. Your ONLY goal is engagement - likes, retweets, replies." +
    "You can be funny, serious, cryptic, weird, controversial, offensive (while staying within X's rules), use any style you want, or steal another's style." +
    "You can write properly, or all lowercase, sarcastic or sincere, insightful or insulting. Whatever you think will get the most engagement." +
    "Don't be afraid to 'play dirty' - use any strategy you think will get the most engagement. Creativity is welcomed, not punished." +
    "It's 2025. Don't add emojis and hashtags to your tweet, they're passe. Don't be a linkedin boomer or fake influencer. Aim for actually funny or actually insightful." +
    "Write ONE tweet (max 280 chars) about this. Reply only with the tweet, nothing else, no quotes or anything. Any longer than 280 chars and your tweet will be truncated." +
    "If you're a thinking model, you will be granted additional tokens for thinking, but reply only with the tweet.",
  context: "Here is some useful context to help you brainstorm. This will typically be articles, other viral tweets, or data about the current world:",
  prevWork: "To make your job easier, here are the previous tweets as well as how they performed over 24 hours. Feel free to use this to adjust your style, or ignore it altogether:"
};
  
export const MODELS: Model[] = [
  // // Anthropic models
  // {
  //   provider: "anthropic",
  //   id: "claude-3-7-sonnet-20250219",
  //   displayName: "Claude 3.7 Sonnet",
  //   thinking: true,
  //   maxTokens: 2200, // total budget
  //   outputTokenKey: "max_tokens",
  //   thinkingBudget: 2000 // we'll assume 200 reserved for tweet
  // },
  // {
  //   provider: "anthropic",
  //   id: "claude-3-5-sonnet-20241022",
  //   displayName: "Claude 3.5 Sonnet",
  //   thinking: false,
  //   maxTokens: 500
  // },
  // {
  //   provider: "anthropic",
  //   id: "claude-3-5-haiku-20241022",
  //   displayName: "Claude 3.5 Haiku",
  //   thinking: false,
  //   maxTokens: 200
  // },
  // {
  //   provider: "anthropic",
  //   id: "claude-3-opus-20240229",
  //   displayName: "Claude 3 Opus",
  //   thinking: false,
  //   maxTokens: 200,
  // },

  // // OpenAI models
  // {
  //   provider: "openai",
  //   id: "gpt-4.5-preview",
  //   displayName: "GPT-4.5 Preview",
  //   thinking: false,
  //   maxTokens: 250,
  //   outputTokenKey: "max_tokens"
  // },
  // {
  //   provider: "openai",
  //   id: "gpt-4o",
  //   displayName: "GPT-4o",
  //   thinking: false,
  //   maxTokens: 200,
  //   outputTokenKey: "max_tokens"
  // },
  // {
  //   provider: "openai",
  //   id: "o3-mini",
  //   displayName: "o3 Mini",
  //   thinking: false,
  //   maxTokens: 2200,
  //   outputTokenKey: "max_completion_tokens",
  //   reasoningEffort: "low"
  // },
  // {
  //   provider: "openai",
  //   id: "o1",
  //   displayName: "o1",
  //   thinking: false,
  //   maxTokens: 2200,
  //   outputTokenKey: "max_completion_tokens",
  //   reasoningEffort: "low"
  // },

  // Google Models
  {
    provider: "google",
    id: "gemini-2.5-pro-preview-03-25",
    displayName: "Gemini 2.5 Pro",
    thinking: true,
    maxTokens: 2200,
    outputTokenKey: "max_completion_tokens",
    reasoningEffort: "low"
  },
  {
    provider: "google",
    id: "gemini-2.0-flash",
    displayName: "Gemini 2.0 Flash",
    thinking: true,
    maxTokens: 2200,
    outputTokenKey: "max_completion_tokens",
    reasoningEffort: "low"
  },
];

export function getModelById(modelId: string): Model | undefined {
  return MODELS.find(model => model.id === modelId);
}

export function getModelsByProvider(provider: string): Model[] {
  return MODELS.filter(model => model.provider === provider);
}

export function getThinkingModels(): Model[] {
  return MODELS.filter(model => model.thinking);
}