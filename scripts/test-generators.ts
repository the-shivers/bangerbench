#!/usr/bin/env ts-node --esm

import 'dotenv/config';
import { PROMPTS } from '../app/lib/generators/config';
import { generateAllTweets } from '../app/lib/generators/tweet-generator';

async function main() {
  const topic = "the latest AI developments";

  const context = `
- OpenAI just announced GPT-5 with 10 trillion parameters
- Google released a new multimodal model that can understand and generate images, text, and code
- The EU just passed stricter AI regulation laws
- A new study shows 65% of Gen Z prefers AI-generated content on social media
  `;

  const prevWork = `
@TechGuru: "AI is replacing jobs faster than we can create new ones. Time to start hoarding skills like a dragon hoards gold." (23K likes, 5K retweets)

@FutureThinker: "Hot take: humans who collaborate with AI will replace humans who don't. It's not AI vs humans, it's AI-enabled humans vs the rest." (45K likes, 12K retweets)

@JokeBot3000: "My AI assistant just asked for a raise. I told it I'd double its salary and now it's trying to figure out what 2 × 0 is." (18K likes, 3K retweets)
  `;

  const userMsg = [
    `Write a viral tweet about ${topic}`,
    `${PROMPTS.context}\n${context.trim()}`,
    `${PROMPTS.prevWork}\n${prevWork.trim()}`
  ].join('\n\n');

  console.log('\n--- Testing All Models ---\nGenerating tweets from all models...\n');

  try {
    const results = await generateAllTweets(PROMPTS.system, userMsg);

    for (const { displayName, provider, tweet } of results) {
      console.log('-----------------------------------');
      console.log(`${displayName} (${provider}):`);
      console.log(tweet);
      console.log(`Character count: ${tweet.length}`);
      console.log('-----------------------------------\n');
    }

    console.log('--- Summary ---');
    results.forEach(r => {
      console.log(`${r.displayName}: ${r.tweet.length} chars`);
    });
  } catch (err) {
    console.error('Error generating tweets:', err);
    process.exit(1);
  }
}

main();
