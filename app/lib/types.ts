export interface GeneratedTweet {
  id?: number;
  provider: string;
  model: string;
  prompt: string;
  tweet: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface TweetGenerator {
  generateTweet(prompt: string): Promise<string>;
}
