import 'dotenv/config';
import Database from 'better-sqlite3';
import { TweetService } from '../app/lib/tweet-service';
import { initializeDatabase } from '../app/lib/db';
import { getAllGenerators } from '../app/lib/generators';

async function main() {
  // Initialize database
  const db = new Database('bangerbench_dev.db');
  initializeDatabase(db);
  
  // Create tweet service
  const tweetService = new TweetService(db);
  
  // Register all discovered generators
  const generators = await getAllGenerators();
  for (const { provider, model, generator } of generators) {
    console.log(`Registering ${provider} ${model}`);
    tweetService.registerGenerator(provider, model, generator);
  }

  // Test prompt
  const prompt = "Write a tweet about why AI is both exciting and scary";
  
  try {
    // Generate tweets from all models
    console.log('Generating tweets from all models...');
    const tweets = await tweetService.generateAllTweets(prompt);
    
    // Display results
    console.log('\nResults:');
    tweets.forEach(tweet => {
      console.log(`\n${tweet.provider} (${tweet.model}):`);
      console.log(tweet.tweet);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
