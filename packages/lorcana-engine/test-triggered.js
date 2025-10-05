import { parseActionText } from './src/text-parser/parser.js';

const result = parseActionText('When this character is banished, return this card to your hand.');
console.log('Parsed result:', JSON.stringify(result, null, 2));
