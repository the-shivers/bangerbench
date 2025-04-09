import Anthropic from "@anthropic-ai/sdk";
import { TweetGenerator } from '../types';
import { TWEET_GENERATION_CONFIG } from '../config';

abstract class AnthropicGenerator implements TweetGenerator {
  protected client: Anthropic;
  abstract readonly model: string;

  constructor() {
    const apiKey = process.env.ANTHROPIC_BANGERBENCH_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_BANGERBENCH_API_KEY not found in environment');
    this.client = new Anthropic({ apiKey });
  }

  async generateTweet(prompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      system: TWEET_GENERATION_CONFIG.basePrompt + prompt,
      messages: []
    });
    const content = response.content[0] as { type: 'text', text: string };
    return content.text;
  }
}

// Claude 3.7 Sonnet Thinking
export class Claude37SonnetThinkingGenerator extends AnthropicGenerator {
  readonly model = 'claude-3-7-sonnet-20250219';
}

// Claude 3.5 Sonnet
export class Claude35SonnetGenerator extends AnthropicGenerator {
  readonly model = 'claude-3-5-sonnet-20241022';
}

// Claude 3.5 Haiku
export class Claude35HaikuGenerator extends AnthropicGenerator {
  readonly model = 'claude-3-5-haiku-20241022';
}

// Claude 3 Opus
export class Claude3OpusGenerator extends AnthropicGenerator {
  readonly model = 'claude-3-opus-20240229';
}
