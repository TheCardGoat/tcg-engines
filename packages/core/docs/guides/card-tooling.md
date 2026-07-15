# Card Tooling Guide

> Building card management tools with @tcg/core/tooling

## Overview

The `@tcg/core/tooling` module provides reusable infrastructure for building card management tools including parsers, generators, validators, and file utilities. This allows game engines to focus on game-specific logic while leveraging a battle-tested foundation for card tooling.

## Table of Contents

- [Quick Start](#quick-start)
- [Card Parser](#card-parser)
- [Card Generator](#card-generator)
- [Card Validator](#card-validator)
- [File Utilities](#file-utilities)
- [Naming Utilities](#naming-utilities)
- [Format Utilities](#format-utilities)
- [Complete Example](#complete-example)
- [Best Practices](#best-practices)

## Quick Start

```typescript
import {
  CardParser,
  CardGenerator,
  FileWriter,
  formatTypeScript,
  generateVariableName,
} from '@tcg/core/tooling';

// 1. Define your card type
type MyCard = {
  name: string;
  type: 'creature' | 'spell';
  cost: number;
  text: string;
};

// 2. Create a parser
class MyCardParser extends CardParser<string, MyCard> {
  protected doParse(text: string): ParserResult<MyCard> {
    // Parse logic here
    return { success: true, data: card, warnings: [] };
  }
}

// 3. Create a generator
class MyCardGenerator extends CardGenerator<MyCard> {
  protected generateContent(card: MyCard): string {
    return `export const ${generateVariableName(card.name)} = ${JSON.stringify(card, null, 2)};`;
  }

  protected generateFileName(card: MyCard): string {
    return `${card.name.toLowerCase()}.ts`;
  }
}

// 4. Use them together
const parser = new MyCardParser();
const generator = new MyCardGenerator();
const writer = new FileWriter('./cards');

const result = parser.parse('Fireball|spell|3|Deal 3 damage');
if (result.success) {
  const code = generator.generate(result.data);
  const formatted = await formatTypeScript(code);
  await writer.write(generator.generateFileName(result.data), formatted);
}
```

## Card Parser

The `CardParser` abstract class provides infrastructure for parsing card data from various formats.

### Basic Parser

```typescript
import { CardParser, type ParserResult } from '@tcg/core/tooling';

type CardData = {
  name: string;
  cost: number;
  type: string;
};

class SimpleCardParser extends CardParser<string, CardData> {
  protected doParse(text: string): ParserResult<CardData> {
    const parts = text.split('|');

    if (parts.length < 3) {
      return {
        success: false,
        errors: ['Invalid format: expected "name|cost|type"'],
      };
    }

    const [name, costStr, type] = parts;
    const cost = Number.parseInt(costStr, 10);

    if (Number.isNaN(cost)) {
      return {
        success: false,
        errors: ['Cost must be a number'],
      };
    }

    return {
      success: true,
      data: { name, cost, type },
      warnings: [],
    };
  }
}
```

### Using the Parser

```typescript
const parser = new SimpleCardParser();

// Parse single card
const result = parser.parse('Fireball|3|spell');
if (result.success) {
  console.log('Parsed:', result.data);
  console.log('Warnings:', result.warnings);
} else {
  console.error('Errors:', result.errors);
}

// Parse batch
const inputs = [
  'Fireball|3|spell',
  'Giant|5|creature',
  'Invalid',
];
const results = parser.parseBatch(inputs);

// Get only successful results
const cards = parser.parseSuccessful(inputs);
console.log(`Parsed ${cards.length} cards successfully`);
```

### Parser with Validation

```typescript
class ValidatingCardParser extends CardParser<string, CardData> {
  protected doParse(text: string): ParserResult<CardData> {
    const parts = text.split('|');

    if (parts.length < 3) {
      return {
        success: false,
        errors: ['Invalid format'],
      };
    }

    const [name, costStr, type] = parts;
    const cost = Number.parseInt(costStr, 10);

    // Validation
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!name || name.trim() === '') {
      errors.push('Name cannot be empty');
    }

    if (Number.isNaN(cost)) {
      errors.push('Cost must be a number');
    } else if (cost < 0) {
      errors.push('Cost cannot be negative');
    } else if (cost > 10) {
      warnings.push(`High cost: ${cost} (usually max is 10)`);
    }

    if (!['creature', 'spell', 'artifact'].includes(type)) {
      errors.push(`Invalid type: ${type}`);
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      data: { name, cost, type },
      warnings,
    };
  }
}
```

### Complex Parser (JSON/HTML)

```typescript
class JsonCardParser extends CardParser<object, CardData> {
  protected doParse(input: object): ParserResult<CardData> {
    if (!this.isValidCardObject(input)) {
      return {
        success: false,
        errors: ['Invalid card object structure'],
      };
    }

    const { name, cost, type, abilities } = input;

    // Transform and validate
    const card: CardData = {
      name: String(name),
      cost: Number(cost),
      type: String(type),
    };

    return {
      success: true,
      data: card,
      warnings: [],
    };
  }

  private isValidCardObject(obj: unknown): obj is {
    name: string;
    cost: number;
    type: string;
  } {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'name' in obj &&
      'cost' in obj &&
      'type' in obj
    );
  }
}
```

## Card Generator

The `CardGenerator` abstract class generates TypeScript code from card definitions.

### Basic Generator

```typescript
import { CardGenerator } from '@tcg/core/tooling';
import { generateVariableName, toPascalCase } from '@tcg/core/tooling';

class SimpleCardGenerator extends CardGenerator<CardData> {
  protected generateContent(card: CardData): string {
    const varName = generateVariableName(card.name);

    return `
import type { Card } from './types';

export const ${varName}: Card = {
  name: '${card.name}',
  cost: ${card.cost},
  type: '${card.type}',
};
`.trim();
  }

  protected generateFileName(card: CardData): string {
    const kebab = card.name.toLowerCase().replace(/\s+/g, '-');
    return `${kebab}.ts`;
  }
}
```

### Using the Generator

```typescript
const generator = new SimpleCardGenerator();

const card = {
  name: 'Lightning Bolt',
  cost: 1,
  type: 'spell',
};

// Generate single file
const code = generator.generate(card);
console.log(code);
// Output:
// import type { Card } from './types';
//
// export const LIGHTNING_BOLT: Card = {
//   name: 'Lightning Bolt',
//   cost: 1,
//   type: 'spell',
// };

// Get file name
const fileName = generator.generateFileName(card);
// Output: 'lightning-bolt.ts'

// Generate batch
const cards = [card1, card2, card3];
const files = generator.generateBatch(cards);
for (const file of files) {
  console.log(`${file.fileName}: ${file.content.length} bytes`);
}
```

### Advanced Generator with Templates

```typescript
class TemplatedCardGenerator extends CardGenerator<CardData> {
  private generateImports(card: CardData): string {
    return `
import type { ${toPascalCase(card.type)}Card } from './types';
import { createCardId } from '@tcg/core';
    `.trim();
  }

  private generateCardObject(card: CardData): string {
    const varName = generateVariableName(card.name);
    const type = toPascalCase(card.type);

    return `
export const ${varName}: ${type}Card = {
  id: createCardId('${card.name.toLowerCase().replace(/\s+/g, '-')}'),
  name: '${card.name}',
  cost: ${card.cost},
  type: '${card.type}',
  ${this.generateTypeSpecificFields(card)}
};
    `.trim();
  }

  private generateTypeSpecificFields(card: CardData): string {
    switch (card.type) {
      case 'creature':
        return `
  power: ${card.power || 0},
  toughness: ${card.toughness || 0},
        `.trim();
      case 'spell':
        return `
  instant: ${card.instant || false},
        `.trim();
      default:
        return '';
    }
  }

  protected generateContent(card: CardData): string {
    return `
${this.generateImports(card)}

${this.generateCardObject(card)}
    `.trim();
  }

  protected generateFileName(card: CardData): string {
    return `${card.name.toLowerCase().replace(/\s+/g, '-')}.ts`;
  }
}
```

## Card Validator

The `CardValidator` abstract class validates card definitions.

```typescript
import { CardValidator, type ValidationResult } from '@tcg/core/tooling';

class MyCardValidator extends CardValidator<CardData> {
  protected doValidate(card: CardData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required fields
    if (!card.name || card.name.trim() === '') {
      errors.push('Card name is required');
    }

    if (card.cost < 0) {
      errors.push('Cost cannot be negative');
    }

    if (card.cost > 10) {
      warnings.push('Very high cost - is this intentional?');
    }

    // Type-specific validation
    if (card.type === 'creature') {
      if (card.power === undefined) {
        errors.push('Creature must have power');
      }
      if (card.toughness === undefined) {
        errors.push('Creature must have toughness');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// Usage
const validator = new MyCardValidator();
const result = validator.validate(card);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings);
}

// Batch validation
const cards = [card1, card2, card3];
const results = validator.validateBatch(cards);
const validCards = validator.validateSuccessful(cards);
```

## File Utilities

### FileWriter

Handles writing generated files with formatting:

```typescript
import { FileWriter, formatTypeScript } from '@tcg/core/tooling';

const writer = new FileWriter('./output/cards');

// Write single file
await writer.write('fireball.ts', generatedCode);

// Write with formatting
await writer.writeFormatted('fireball.ts', generatedCode);

// Write batch
const files = generator.generateBatch(cards);
for (const file of files) {
  await writer.writeFormatted(file.fileName, file.content);
}
```

### File System Utilities

```typescript
import {
  ensureDirectory,
  createDirectory,
  pathExists,
} from '@tcg/core/tooling';

// Ensure directory exists (creates if needed)
await ensureDirectory('./output/cards');

// Create directory
await createDirectory('./output/sets/base-set');

// Check if path exists
if (await pathExists('./cards/fireball.ts')) {
  console.log('File exists');
}
```

## Naming Utilities

Convert between naming conventions:

```typescript
import {
  generateVariableName,
  toKebabCase,
  toPascalCase,
  toCamelCase,
  toSnakeCase,
} from '@tcg/core/tooling';

const name = 'Lightning Bolt';

// Variable names
generateVariableName(name);  // 'LIGHTNING_BOLT'

// Kebab case (file names)
toKebabCase(name);            // 'lightning-bolt'

// Pascal case (types)
toPascalCase(name);           // 'LightningBolt'

// Camel case (properties)
toCamelCase(name);            // 'lightningBolt'

// Snake case
toSnakeCase(name);            // 'lightning_bolt'

// Examples in context
const varName = generateVariableName(card.name);
const fileName = `${toKebabCase(card.name)}.ts`;
const typeName = `${toPascalCase(card.type)}Card`;
```

## Format Utilities

Format generated code with Biome:

```typescript
import { formatTypeScript, formatJSON } from '@tcg/core/tooling';

// Format TypeScript
const code = `const x={name:'test',cost:5};`;
const formatted = await formatTypeScript(code);
// Result:
// const x = {
//   name: 'test',
//   cost: 5,
// };

// Format JSON
const json = '{"name":"test","cost":5}';
const formatted = await formatJSON(json);
// Result:
// {
//   "name": "test",
//   "cost": 5
// }
```

## Complete Example

Here's a complete card tooling pipeline:

```typescript
import {
  CardParser,
  CardGenerator,
  CardValidator,
  FileWriter,
  ensureDirectory,
  formatTypeScript,
  generateVariableName,
  toKebabCase,
  type ParserResult,
  type ValidationResult,
} from '@tcg/core/tooling';

// 1. Define card type
type GameCard = {
  name: string;
  type: 'creature' | 'spell';
  cost: number;
  text: string;
  power?: number;
  toughness?: number;
};

// 2. Create parser
class GameCardParser extends CardParser<string, GameCard> {
  protected doParse(text: string): ParserResult<GameCard> {
    const lines = text.split('\n');
    const [name, type, costStr, cardText] = lines;

    if (!name || !type || !costStr) {
      return {
        success: false,
        errors: ['Missing required fields'],
      };
    }

    const cost = Number.parseInt(costStr, 10);
    if (Number.isNaN(cost)) {
      return {
        success: false,
        errors: ['Invalid cost'],
      };
    }

    const card: GameCard = {
      name,
      type: type as 'creature' | 'spell',
      cost,
      text: cardText || '',
    };

    // Parse creature stats
    if (type === 'creature') {
      const statsMatch = cardText.match(/(\d+)\/(\d+)/);
      if (statsMatch) {
        card.power = Number.parseInt(statsMatch[1], 10);
        card.toughness = Number.parseInt(statsMatch[2], 10);
      }
    }

    return {
      success: true,
      data: card,
      warnings: [],
    };
  }
}

// 3. Create validator
class GameCardValidator extends CardValidator<GameCard> {
  protected doValidate(card: GameCard): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (card.cost < 0 || card.cost > 10) {
      errors.push('Cost must be between 0 and 10');
    }

    if (card.type === 'creature') {
      if (card.power === undefined || card.toughness === undefined) {
        errors.push('Creature must have power/toughness');
      }
    }

    if (card.text.length > 200) {
      warnings.push('Very long card text');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// 4. Create generator
class GameCardGenerator extends CardGenerator<GameCard> {
  protected generateContent(card: GameCard): string {
    const varName = generateVariableName(card.name);

    let content = `
import type { ${card.type === 'creature' ? 'CreatureCard' : 'SpellCard'} } from './types';
import { createCardId } from '@tcg/core';

export const ${varName}: ${card.type === 'creature' ? 'CreatureCard' : 'SpellCard'} = {
  id: createCardId('${toKebabCase(card.name)}'),
  name: '${card.name}',
  type: '${card.type}',
  cost: ${card.cost},
  text: '${card.text}',
    `;

    if (card.type === 'creature') {
      content += `
  power: ${card.power},
  toughness: ${card.toughness},
      `;
    }

    content += '\n};\n';

    return content;
  }

  protected generateFileName(card: GameCard): string {
    return `${toKebabCase(card.name)}.ts`;
  }
}

// 5. Build the pipeline
async function processCards(inputTexts: string[], outputDir: string) {
  const parser = new GameCardParser();
  const validator = new GameCardValidator();
  const generator = new GameCardGenerator();
  const writer = new FileWriter(outputDir);

  // Ensure output directory exists
  await ensureDirectory(outputDir);

  let successCount = 0;
  let errorCount = 0;

  for (const text of inputTexts) {
    // Parse
    const parseResult = parser.parse(text);
    if (!parseResult.success) {
      console.error('Parse errors:', parseResult.errors);
      errorCount++;
      continue;
    }

    const card = parseResult.data;

    // Validate
    const validationResult = validator.validate(card);
    if (!validationResult.valid) {
      console.error(`Validation errors for ${card.name}:`, validationResult.errors);
      errorCount++;
      continue;
    }

    if (validationResult.warnings.length > 0) {
      console.warn(`Warnings for ${card.name}:`, validationResult.warnings);
    }

    // Generate
    const code = generator.generate(card);
    const formatted = await formatTypeScript(code);

    // Write
    const fileName = generator.generateFileName(card);
    await writer.write(fileName, formatted);

    console.log(`Generated ${fileName}`);
    successCount++;
  }

  console.log(`\nProcessed ${inputTexts.length} cards:`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);
}

// 6. Use the pipeline
const cardTexts = [
  `Lightning Bolt
spell
1
Deal 3 damage to any target`,

  `Giant Spider
creature
3
Reach. 2/4`,
];

await processCards(cardTexts, './output/cards');
```

## Best Practices

### 1. Validate Before Generating

```typescript
const parseResult = parser.parse(input);
if (!parseResult.success) {
  return; // Don't proceed
}

const validationResult = validator.validate(parseResult.data);
if (!validationResult.valid) {
  return; // Don't generate invalid cards
}

// Now safe to generate
const code = generator.generate(parseResult.data);
```

### 2. Use Consistent Naming

```typescript
// Use naming utilities for consistency
const fileName = `${toKebabCase(card.name)}.ts`;
const varName = generateVariableName(card.name);
const typeName = `${toPascalCase(card.type)}Card`;
```

### 3. Format All Generated Code

```typescript
// Always format before writing
const code = generator.generate(card);
const formatted = await formatTypeScript(code);
await writer.write(fileName, formatted);
```

### 4. Handle Errors Gracefully

```typescript
try {
  const result = parser.parse(input);
  if (!result.success) {
    logErrors(result.errors);
    continue; // Skip this card
  }
  // Process...
} catch (error) {
  logError('Unexpected error:', error);
  continue;
}
```

### 5. Provide Clear Error Messages

```typescript
protected doParse(text: string): ParserResult<GameCard> {
  if (!text || text.trim() === '') {
    return {
      success: false,
      errors: ['Input is empty'],
    };
  }

  const lines = text.split('\n');
  if (lines.length < 4) {
    return {
      success: false,
      errors: [
        'Invalid format. Expected:',
        'Line 1: Card name',
        'Line 2: Card type',
        'Line 3: Cost',
        'Line 4: Card text',
      ],
    };
  }

  // Continue parsing...
}
```

### 6. Support Batch Operations

```typescript
// Use batch methods for efficiency
const results = parser.parseBatch(inputs);
const validCards = validator.validateSuccessful(
  results.filter(r => r.success).map(r => r.data)
);
const files = generator.generateBatch(validCards);

// Write all files
for (const file of files) {
  await writer.writeFormatted(file.fileName, file.content);
}
```

## Related Documentation

- [Validation Guide](./validation.md) - Type guards and validators
- [Examples: Card Parser Extension](../examples/card-parser-extension.ts) - Complete parser example
- [API Reference](../../README.md#card-tooling) - Full API documentation

## Migration from Custom Tooling

```typescript
// OLD (custom implementation)
function parseCard(text: string): Card {
  const parts = text.split('|');
  return {
    name: parts[0],
    cost: Number(parts[1]),
    type: parts[2],
  };
}

function generateCard(card: Card): string {
  return `export const ${card.name.toUpperCase()} = ${JSON.stringify(card)};`;
}

// NEW (@tcg/core/tooling)
import { CardParser, CardGenerator, type ParserResult } from '@tcg/core/tooling';

class MyParser extends CardParser<string, Card> {
  protected doParse(text: string): ParserResult<Card> {
    // Error handling built-in
    // Validation support
    // Batch operations included
  }
}

class MyGenerator extends CardGenerator<Card> {
  // Consistent API
  // File name generation
  // Batch support
}
```

**Benefits of @tcg/core/tooling:**
- Built-in error handling
- Consistent API across games
- Batch operation support
- Validation infrastructure
- File utilities included
- Naming convention helpers
- Code formatting built-in
