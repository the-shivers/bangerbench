import Database from 'better-sqlite3';
import { GeneratedTweet, TweetGenerator } from './types';
import { TWEET_GENERATION_CONFIG } from './config';

export class TweetService {
  private db: Database.Database;
  private generators: Map<string, TweetGenerator>;

  constructor(db: Database.Database) {
    this.db = db;
    this.generators = new Map();
  }

  registerGenerator(provider: string, model: string, generator: TweetGenerator) {
    this.generators.set(`${provider}:${model}`, generator);
  }

  async generateTweet(provider: string, model: string, prompt: string): Promise<GeneratedTweet> {
    const generator = this.generators.get(`${provider}:${model}`);
    if (!generator) {
      throw new Error(`No generator registered for ${provider}:${model}`);
    }

    const fullPrompt = `${TWEET_GENERATION_CONFIG.basePrompt}\n\n${prompt}`;
    const tweet = await generator.generateTweet(fullPrompt);
    const tweet_record: GeneratedTweet = {
      provider,
      model,
      prompt,
      tweet,
      created_at: new Date().toISOString(),
    };

    // Store in database
    const stmt = this.db.prepare(`
      INSERT INTO tweet_batches (provider, model, prompt, tweet, created_at, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const db_result = stmt.run(
      tweet_record.provider,
      tweet_record.model,
      tweet_record.prompt,
      tweet_record.tweet,
      tweet_record.created_at,
      JSON.stringify(tweet_record.metadata || {})
    );

    return {
      ...tweet_record,
      id: db_result.lastInsertRowid as number
    };
  }

  async generateAllTweets(prompt: string): Promise<GeneratedTweet[]> {
    const results: GeneratedTweet[] = [];
    
    for (const [key, generator] of this.generators.entries()) {
      const [provider, model] = key.split(':');
      const tweet = await this.generateTweet(provider, model, prompt);
      results.push(tweet);
    }

    return results;
  }

  getTweet(id: number): GeneratedTweet | null {
    const stmt = this.db.prepare('SELECT * FROM tweet_batches WHERE id = ?');
    const row = stmt.get(id) as (Omit<GeneratedTweet, 'metadata'> & { metadata: string | null }) | undefined;
    
    if (!row) return null;

    return {
      id: row.id,
      provider: row.provider,
      model: row.model,
      prompt: row.prompt,
      tweet: row.tweet,
      created_at: row.created_at,
      metadata: row.metadata ? JSON.parse(row.metadata as string) : undefined
    };
  }
}
