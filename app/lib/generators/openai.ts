import OpenAI from 'openai';
import { TweetGenerator } from '../types';
import { TWEET_GENERATION_CONFIG } from '../config';

abstract class OpenAIGenerator implements TweetGenerator {
  protected client: OpenAI;
  abstract readonly model: string;

  constructor() {
    const apiKey = process.env.OPENAI_BANGERBENCH_API_KEY;
    if (!apiKey) throw new Error('OPENAI_BANGERBENCH_API_KEY not found in environment');
    this.client = new OpenAI({ apiKey });
  }

  async generateTweet(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [{
        role: "system",
        content: TWEET_GENERATION_CONFIG.basePrompt + prompt
      }]
    });

    return response.choices[0]?.message?.content || '';
  }
}

// 4.5
export class GPT45PreviewGenerator extends OpenAIGenerator {
  readonly model = 'gpt-4.5-preview';
}

// 4o
export class GPT4oGenerator extends OpenAIGenerator {
  readonly model = 'gpt-4o';
}

// o3 mini
export class GPTo3MiniGenerator extends OpenAIGenerator {
  readonly model = 'o3-mini';
}

//o1
export class GPTo1Generator extends OpenAIGenerator {
  readonly model = 'o1';
}
