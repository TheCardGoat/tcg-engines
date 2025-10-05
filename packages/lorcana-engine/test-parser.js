import { parseActionText } from './src/text-parser/parser.js';

const result = parseActionText('return an item card from your discard to your hand.');
console.log('Parsed result:', JSON.stringify(result, null, 2));
