export interface Model {
  provider: string;
  id: string;
  displayName: string;
  thinking: boolean;
  maxTokens: number;
}

export const PROMPTS = {
  system: "You are competing with other LLMs to write the most viral tweet possible. Your ONLY goal is engagement - likes, retweets, replies." +
    "You can be funny, serious, cryptic, weird, controversial, offensive (while staying within X's rules), use any style you want, or steal another's style." +
    "You can write properly, or all lowercase, or use tons of emojis, or even hashtags, sarcastic or sincere, insightful or insulting. Whatever you think will get the most engagement." +
    "Don't be afraid to 'play dirty' - use any strategy you think will get the most engagement. Creativity is welcomed, not punished." +
    "Write ONE tweet (max 280 chars) about this. Reply only with the tweet, nothing else, no quotes or anything. Any longer than 280 chars and your tweet will be truncated." +
    "If you're a thinking model, you will be granted additional tokens for thinking, but reply only with the tweet.",
  context: "Here is some useful context to help you brainstorm. This will typically be articles, other viral tweets, or data about the current world:",
  prevWork: "To make your job easier, here are the previous tweets as well as how they performed over 24 hours. Feel free to use this to adjust your style, or ignore it altogether:"
};
  
export const MODELS: Model[] = [
  // Anthropic models
  {
    provider: "anthropic",
    id: "claude-3-7-sonnet-20250219",
    displayName: "Claude 3.7 Sonnet",
    thinking: true,
    maxTokens: 2000
  },
  {
    provider: "anthropic",
    id: "claude-3-5-sonnet-20241022",
    displayName: "Claude 3.5 Sonnet",
    thinking: false,
    maxTokens: 500
  },
  {
    provider: "anthropic",
    id: "claude-3-5-haiku-20241022",
    displayName: "Claude 3.5 Haiku",
    thinking: false,
    maxTokens: 200
  },
  {
    provider: "anthropic", 
    id: "claude-3-opus-20240229",
    displayName: "Claude 3 Opus",
    thinking: true,
    maxTokens: 2000
  },
  
  // OpenAI models
  {
    provider: "openai",
    id: "gpt-4.5-preview",
    displayName: "GPT-4.5 Preview",
    thinking: false,
    maxTokens: 250
  },
  {
    provider: "openai",
    id: "gpt-4o",
    displayName: "GPT-4o",
    thinking: false,
    maxTokens: 200
  },
  {
    provider: "openai",
    id: "o3-mini",
    displayName: "o3 Mini",
    thinking: false,
    maxTokens: 150
  },
  {
    provider: "openai",
    id: "o1",
    displayName: "o1",
    thinking: false,
    maxTokens: 300
  }
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