import 'dotenv/config';
import { PROMPTS } from '../app/lib/generators/config';
import { generateAllTweets } from '../app/lib/generators/tweet-generator';

async function main() {
  const topic = "gamergate";

  const context = `
A gamergate (/ˈɡæmərˌɡeɪt/ GAMM-ər-gayt) is a mated worker ant that can reproduce sexually, i.e., lay fertilized eggs that will develop as females. In the vast majority of ant species, workers are sterile and gamergates are restricted to taxa where the workers have a functional sperm reservoir ('spermatheca'). In some species, gamergates reproduce in addition to winged queens (usually upon the death of the original foundress), while in other species the queen caste has been completely replaced by gamergates. In gamergate species, all workers in a colony have similar reproductive potentials, but as a result of physical interactions, a dominance hierarchy is formed and only one or a few top-ranking workers can mate (usually with foreign males) and produce eggs. Subsequently, however, aggression is no longer needed as gamergates secrete chemical signals that inform the other workers of their reproductive status in the colony.

Depending on the species, there can be one gamergate per colony (monogyny) or several gamergates (polygyny). Most gamergate species have colonies with a few hundred or fewer workers.


  `;

  const prevWork = `
sorry can't help you here, you gotta come up with shit on your own
  `;

  const userMsg = [
    `Write a viral tweet about ${topic}`,
    `${PROMPTS.context}\n${context.trim()}`,
    `${PROMPTS.prevWork}\n${prevWork.trim()}`
  ].join('\n\n');

  console.log('\n--- Testing All Models ---\nGenerating tweets from all models...\n');

  const results = await generateAllTweets(PROMPTS.system, userMsg);

  for (const { displayName, provider, tweet, usage, raw } of results) {
    console.log('-----------------------------------');
    console.log(`${displayName} (${provider}):`);
    console.log(tweet);
    console.log(`Character count: ${tweet.length}`);
  
    if (usage) {
      console.log(`Input tokens: ${usage.input_tokens ?? usage.prompt_tokens}`);
      console.log(`Output tokens: ${usage.output_tokens ?? usage.completion_tokens}`);
      console.log(`Total tokens: ${usage.total_tokens}`);
    }
  
    // console.dir(raw ?? '[no raw response returned]', { depth: null });
  
    console.log('-----------------------------------\n');
  }

  console.log('--- Summary ---');
  results.forEach(r => {
    console.log(`${r.displayName}: ${r.tweet.length} chars`);
  });
}

main().catch(err => {
  console.error('Error generating tweets:', err);
  process.exit(1);
});
