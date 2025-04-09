import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { TwitterApi } from 'twitter-api-v2';
import Database from 'better-sqlite3';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize X client
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

// Initialize SQLite database
const db = new Database('bangerbench_dev.db');

// Create tweets table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tweets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tweet_id TEXT UNIQUE NOT NULL,
    llm_name TEXT,
    generated_text TEXT,
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export async function POST(request: Request) {
  try {
    // For now, use a simple hardcoded prompt
    const prompt = "Generate a short, cheerful tweet about AI.";

    // Generate tweet using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a social media expert. Generate engaging tweets under 280 characters."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 100,
    });

    const generatedTweet = completion.choices[0].message.content;

    if (!generatedTweet) {
      throw new Error('No tweet generated');
    }

    // Post to Twitter
    const tweet = await twitterClient.v2.tweet(generatedTweet);

    // Store in database
    const stmt = db.prepare(
      'INSERT INTO tweets (tweet_id, llm_name, generated_text) VALUES (?, ?, ?)'
    );
    stmt.run(tweet.data.id, 'gpt-4', generatedTweet);

    return NextResponse.json({
      success: true,
      tweet_id: tweet.data.id,
      generated_text: generatedTweet
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to post tweet' },
      { status: 500 }
    );
  }
}
