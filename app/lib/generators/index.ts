import { TweetGenerator } from '../types';
import fs from 'fs';
import path from 'path';

interface GeneratorInfo {
  provider: string;
  model: string;
  generator: TweetGenerator;
}

export async function getAllGenerators(): Promise<GeneratorInfo[]> {
  const generators: GeneratorInfo[] = [];
  const currentDir = __dirname;

  // Get all .ts files in the current directory
  const files = fs.readdirSync(currentDir)
    .filter(file => file.endsWith('.ts') && file !== 'index.ts');

  for (const file of files) {
    const provider = path.basename(file, '.ts');
    try {
      // Dynamic import the module
      const module = await import(`./${provider}`);
      
      for (const [className, ClassConstructor] of Object.entries(module)) {
        // Check if it's a class and implements TweetGenerator
        if (
          typeof ClassConstructor === 'function' &&
          ClassConstructor.prototype instanceof Object &&
          'generateTweet' in ClassConstructor.prototype
        ) {
          try {
            const instance = new (ClassConstructor as new () => TweetGenerator)();
            const model = (instance as any).model;
            if (model) {
              generators.push({
                provider,
                model,
                generator: instance
              });
            }
          } catch (e) {
            console.warn(`Failed to instantiate ${className} from ${provider}: ${e}`);
          }
        }
      }
    } catch (e) {
      console.warn(`Failed to load module ${provider}: ${e}`);
    }
  }

  return generators;
}
