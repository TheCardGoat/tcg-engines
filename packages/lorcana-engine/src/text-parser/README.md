# Action Text Parser

The Action Text Parser is a comprehensive system for automatically generating Lorcana action card abilities from their text descriptions. It analyzes card text and produces the corresponding ability structures that match the existing card implementations in the Lorcana engine.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Pattern System](#pattern-system)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Overview

The parser transforms natural language card text into structured ability objects that the game engine can execute. It handles:

- **Basic Effects**: Draw cards, deal damage, banish characters, modify attributes
- **Complex Targeting**: Chosen characters, opponents, zone-based targeting
- **Timing and Duration**: Turn-based effects, triggered abilities, conditional effects
- **Modal Effects**: "Choose one" style abilities with multiple options
- **Triggered Abilities**: End-of-turn effects, floating triggered abilities

### Architecture

The parser consists of several key components:

1. **Text Preprocessor**: Normalizes input text and handles game symbols
2. **Pattern Matcher**: Uses regex patterns to identify effect types
3. **Effect Factory**: Creates specific effect objects from matched patterns
4. **Ability Builder**: Assembles effects into complete ability structures
5. **Performance Layer**: Provides caching and optimization

## Quick Start

### Basic Usage

```typescript
import { generateActionAbilitiesFromText } from '@lorcanito/lorcana-engine/text-parser';

// Simple card text
const abilities = generateActionAbilitiesFromText("Draw a card");
console.log(abilities);
// Output: [{ type: "resolution", effects: [{ type: "draw", amount: 1, ... }] }]

// Complex card text
const complexAbilities = generateActionAbilitiesFromText(
  "Choose one: Draw 2 cards, or deal 3 damage to chosen character"
);
```

### With Configuration

```typescript
import { generateActionAbilitiesFromText, parseActionText } from '@lorcanito/lorcana-engine/text-parser';

// Enable debug mode for detailed logging
const abilities = generateActionAbilitiesFromText("Draw a card", { 
  debug: true,
  strictMode: false 
});

// Get detailed parsing results
const result = parseActionText("Deal 2 damage to chosen character", {
  debug: true,
  strictMode: true
});

console.log(result.abilities);
console.log(result.warnings);
console.log(result.errors);
```

## API Reference

### Main Functions

#### `generateActionAbilitiesFromText(text: string, config?: ParserConfig): ResolutionAbility[]`

The primary function for parsing card text into abilities.

**Parameters:**
- `text` (string): The card text to parse
- `config` (ParserConfig, optional): Configuration options

**Returns:** Array of `ResolutionAbility` objects

**Example:**
```typescript
const abilities = generateActionAbilitiesFromText("Banish chosen character. Draw a card.");
// Returns array with banish and draw abilities
```

#### `parseActionText(text: string, config?: ParserConfig): ParseResult`

Provides detailed parsing results including warnings and errors.

**Parameters:**
- `text` (string): The card text to parse
- `config` (ParserConfig, optional): Configuration options

**Returns:** `ParseResult` object with abilities, warnings, errors, and clauses

**Example:**
```typescript
const result = parseActionText("Deal X damage to chosen character");
console.log(result.warnings); // May contain warnings about dynamic amounts
```

### Configuration Options

#### `ParserConfig`

```typescript
interface ParserConfig {
  debug?: boolean;        // Enable debug logging (default: false)
  strictMode?: boolean;   // Fail on any parsing errors (default: false)
}
```

#### `NormalizationConfig`

```typescript
interface NormalizationConfig {
  preserveSpacing?: boolean;      // Keep original spacing (default: false)
  normalizeCase?: boolean;        // Normalize text case (default: true)
  handleGameSymbols?: boolean;    // Process game symbols like {S} (default: true)
}
```

### Utility Functions

#### Text Normalization

```typescript
import { normalizeText, normalizeSpacing, handleGameSymbols } from '@lorcanito/lorcana-engine/text-parser';

// Comprehensive normalization
const normalized = normalizeText("Draw  a card. Deal 2{S} damage!");
// Output: "Draw a card. Deal 2 {S} damage."

// Individual normalization steps
const spaced = normalizeSpacing("Draw    a   card");
const symbols = handleGameSymbols("Deal 2{S} damage");
```

#### Text Analysis

```typescript
import { analyzeTextStructure, identifyModalPatterns } from '@lorcanito/lorcana-engine/text-parser';

// Analyze text structure
const analysis = analyzeTextStructure("Choose one: Draw a card, or deal 2 damage");
console.log(analysis.modalInfo.isModal); // true
console.log(analysis.modalInfo.options); // ["Draw a card", "deal 2 damage"]

// Check for modal patterns
const modal = identifyModalPatterns("Choose one: Draw a card or banish chosen character");
console.log(modal.isModal); // true
console.log(modal.modalType); // "Choose one"
```

#### Validation

```typescript
import { validateResolutionAbility, validateParsedEffect } from '@lorcanito/lorcana-engine/text-parser';

// Validate generated abilities
const ability = generateActionAbilitiesFromText("Draw a card")[0];
const validation = validateResolutionAbility(ability);
console.log(validation.isValid); // true
console.log(validation.errors);  // []
```

### Performance Utilities

```typescript
import { 
  CacheManager, 
  PerformanceMonitor,
  optimizedExtractEffectsFromText 
} from '@lorcanito/lorcana-engine/text-parser/performance-optimizations';

// Cache management
CacheManager.clearAllCaches();
CacheManager.warmUpCaches(["Draw a card", "Deal 2 damage"]);
const stats = CacheManager.getCacheStats();

// Performance monitoring
const endTimer = PerformanceMonitor.startTimer('parsing-operation');
generateActionAbilitiesFromText("Complex card text here");
const duration = endTimer();

// Get performance statistics
const perfStats = PerformanceMonitor.getAllStats();
```

## Configuration

### Debug Mode

Enable debug mode to get detailed logging of the parsing process:

```typescript
const result = parseActionText("Draw a card", { debug: true });
// Console output:
// [Text Parser] Parsing text: "Draw a card"
// [Text Parser] Normalized text: "Draw a card."
// [Text Parser] Text structure: { sentences: [...], clauses: [...] }
// [Text Parser] Parsed 1 clauses
// [Text Parser] Generated 1 abilities
// [Text Parser] Parsing completed in 2.34ms
```

### Strict Mode

In strict mode, the parser will fail completely if any errors occur:

```typescript
// Non-strict mode (default) - continues with partial results
const result1 = parseActionText("Unknown effect text", { strictMode: false });
console.log(result1.abilities); // May be empty but no exception thrown

// Strict mode - fails on errors
const result2 = parseActionText("Unknown effect text", { strictMode: true });
console.log(result2.errors); // Contains error messages
```

### Text Normalization

Customize how text is normalized before parsing:

```typescript
import { normalizeText } from '@lorcanito/lorcana-engine/text-parser';

// Custom normalization
const customNormalized = normalizeText("Draw  a CARD{s}", {
  preserveSpacing: true,      // Keep original spacing
  normalizeCase: false,       // Don't change case
  handleGameSymbols: true     // Still process {s} -> {S}
});
```

## Pattern System

The parser uses a pattern-based system to recognize different types of effects in card text.

### Built-in Patterns

#### Draw Effects
- `"Draw a card"` → `drawACard` effect
- `"Draw 2 cards"` → `drawXCards(2)` effect
- `"Draw X cards"` → `drawXCards(X)` effect with dynamic amount

#### Damage Effects
- `"Deal 2 damage to chosen character"` → damage effect with amount 2
- `"Deal X damage to each opponent"` → damage effect with dynamic amount

#### Banish Effects
- `"Banish chosen character"` → banish effect with character target
- `"Banish chosen character of yours"` → banish effect with ownership filter

#### Attribute Effects
- `"Chosen character gets +2 {S}"` → strength modifier effect
- `"Gains +1 {W} this turn"` → temporary willpower modifier

### Adding Custom Patterns

You can extend the parser with custom patterns:

```typescript
import { addPattern } from '@lorcanito/lorcana-engine/text-parser/patterns';

// Add a custom effect pattern
addPattern('heal', {
  pattern: /heal (\d+) damage from (.+)/i,
  type: 'heal',
  extractor: (match) => ({
    type: 'heal',
    amount: parseInt(match[1], 10),
    parameters: {
      targetText: match[2].trim()
    }
  })
});
```

### Pattern Priority

Patterns are matched in order of specificity. More specific patterns should be added first:

```typescript
// More specific pattern (matches first)
addPattern('draw', {
  pattern: /draw a card from your deck/i,
  // ...
});

// Less specific pattern (matches if above doesn't)
addPattern('draw', {
  pattern: /draw a card/i,
  // ...
});
```

## Performance

The parser includes several performance optimizations:

### Caching

- **Regex Cache**: Compiled regex patterns are cached to avoid recompilation
- **Pattern Match Cache**: Results of pattern matching are cached
- **Effect Extraction Cache**: Complete effect extraction results are cached

### Optimization Features

- **Pre-compiled Patterns**: Patterns are compiled once at startup
- **Memoization**: Repeated parsing of identical text uses cached results
- **Efficient String Processing**: Optimized algorithms for text manipulation
- **Memory Management**: Caches have size limits to prevent memory leaks

### Performance Monitoring

```typescript
import { PerformanceMonitor } from '@lorcanito/lorcana-engine/text-parser/performance-optimizations';

// Monitor parsing performance
const endTimer = PerformanceMonitor.startTimer('card-parsing');
for (const cardText of cardTexts) {
  generateActionAbilitiesFromText(cardText);
}
const totalTime = endTimer();

// Get detailed statistics
const stats = PerformanceMonitor.getStats('card-parsing');
console.log(`Average parsing time: ${stats.average.toFixed(2)}ms`);
console.log(`Total cards parsed: ${stats.count}`);
```

### Cache Management

```typescript
import { CacheManager } from '@lorcanito/lorcana-engine/text-parser/performance-optimizations';

// Warm up caches with common card texts
const commonTexts = [
  "Draw a card",
  "Deal 2 damage to chosen character",
  "Banish chosen character"
];
CacheManager.warmUpCaches(commonTexts);

// Check cache usage
const stats = CacheManager.getCacheStats();
console.log(`Pattern cache size: ${stats.patternMatchCache}`);
console.log(`Effect cache size: ${stats.effectExtractionCache}`);

// Clear caches if needed
CacheManager.clearAllCaches();
```

## Troubleshooting

### Common Issues

#### 1. No Abilities Generated

**Problem**: Parser returns empty array for valid card text.

**Solutions:**
- Enable debug mode to see parsing steps
- Check if text matches any known patterns
- Verify text normalization isn't removing important parts

```typescript
const result = parseActionText("Your card text", { debug: true });
console.log(result.warnings); // Check for warnings
console.log(result.errors);   // Check for errors
```

#### 2. Incorrect Target Recognition

**Problem**: Effects target wrong game objects.

**Solutions:**
- Check target text patterns in debug output
- Verify target mapping in `target-mapper.ts`
- Add custom target patterns if needed

```typescript
import { parseTargetFromText } from '@lorcanito/lorcana-engine/text-parser/target-mapper';

const target = parseTargetFromText("chosen character of yours");
console.log(target); // Inspect target mapping
```

#### 3. Performance Issues

**Problem**: Parsing is slow for complex cards.

**Solutions:**
- Use optimized functions from performance-optimizations
- Warm up caches with common patterns
- Monitor performance with PerformanceMonitor

```typescript
import { optimizedExtractEffectsFromText } from '@lorcanito/lorcana-engine/text-parser/performance-optimizations';

// Use optimized version for better performance
const effects = optimizedExtractEffectsFromText(cardText);
```

#### 4. Memory Usage

**Problem**: High memory usage with many cards.

**Solutions:**
- Clear caches periodically
- Check cache size limits
- Use batch processing for large datasets

```typescript
import { CacheManager } from '@lorcanito/lorcana-engine/text-parser/performance-optimizations';

// Process cards in batches
for (let i = 0; i < cards.length; i += 100) {
  const batch = cards.slice(i, i + 100);
  processBatch(batch);
  
  // Clear caches between batches
  if (i % 500 === 0) {
    CacheManager.clearAllCaches();
  }
}
```

### Debug Output

Enable debug mode to get detailed information about the parsing process:

```typescript
const result = parseActionText("Complex card text", { debug: true });
```

Debug output includes:
- Original and normalized text
- Text structure analysis
- Pattern matching results
- Effect generation steps
- Ability building process
- Performance timing
- Validation results

### Error Messages

Common error messages and their meanings:

- `"Empty or invalid text provided"`: Input text is null, undefined, or empty
- `"No abilities could be generated"`: Text doesn't match any known patterns
- `"Parsing failed: [error]"`: Exception occurred during parsing
- `"Effect X is missing required property Y"`: Generated effect is invalid
- `"Unknown pattern in text: [text]"`: Text contains unrecognized patterns

## Contributing

### Adding New Effect Types

1. **Define the Pattern**: Add regex pattern to `EFFECT_PATTERNS` in `patterns.ts`
2. **Create Extractor**: Implement function to convert regex match to `ParsedEffect`
3. **Add Tests**: Create test cases for the new pattern
4. **Update Documentation**: Add examples to this README

Example:
```typescript
// In patterns.ts
EFFECT_PATTERNS.newEffect = [{
  pattern: /your new effect pattern/i,
  type: 'newEffect',
  extractor: (match) => ({
    type: 'newEffect',
    parameters: {
      // Extract parameters from match
    }
  })
}];
```

### Adding New Target Types

1. **Define Pattern**: Add to `TARGET_PATTERNS` in `patterns.ts`
2. **Map to Target**: Update `target-mapper.ts` to handle new pattern
3. **Test**: Add test cases for target recognition

### Performance Improvements

1. **Profile**: Use `PerformanceMonitor` to identify bottlenecks
2. **Optimize**: Improve slow functions or add caching
3. **Test**: Verify improvements with performance tests
4. **Document**: Update performance section in README

### Testing

Run the test suite to verify changes:

```bash
# Run all parser tests
bun test packages/lorcana-engine/src/text-parser/__tests__/ --run

# Run specific test file
bun test packages/lorcana-engine/src/text-parser/__tests__/parser.test.ts --run

# Run performance tests
bun test packages/lorcana-engine/src/text-parser/__tests__/performance.test.ts --run
```

### Code Style

Follow the existing code style:
- Use TypeScript with strict type checking
- Add JSDoc comments for public functions
- Include error handling and validation
- Write comprehensive tests for new features
- Use meaningful variable and function names

## Examples

### Basic Card Parsing

```typescript
// Simple draw effect
const drawCard = generateActionAbilitiesFromText("Draw a card");
console.log(drawCard[0].effects[0].type); // "draw"

// Damage effect
const damage = generateActionAbilitiesFromText("Deal 3 damage to chosen character");
console.log(damage[0].effects[0].amount); // 3

// Attribute modifier
const buff = generateActionAbilitiesFromText("Chosen character gets +2 {S} this turn");
console.log(buff[0].effects[0].parameters.attribute); // "strength"
```

### Complex Card Parsing

```typescript
// Modal effect
const modal = generateActionAbilitiesFromText(
  "Choose one: Draw 2 cards, or deal 4 damage to chosen character"
);
console.log(modal[0].type); // "modal" or similar

// Sequential effects
const sequence = generateActionAbilitiesFromText(
  "Draw a card. Deal 2 damage to chosen character. Banish them."
);
console.log(sequence.length); // Multiple abilities

// Conditional effect
const conditional = generateActionAbilitiesFromText(
  "If you have 3 or more cards in hand, then draw a card"
);
console.log(conditional[0].dependentEffects); // true
```

### Triggered Abilities

```typescript
// End of turn effect
const endOfTurn = generateActionAbilitiesFromText(
  "At the end of your turn, banish chosen character"
);
console.log(endOfTurn[0].type); // "triggered" or similar

// Floating triggered ability
const floating = generateActionAbilitiesFromText(
  "Whenever a character is banished this turn, draw a card"
);
console.log(floating[0].duration); // "turn"
```

### Error Handling

```typescript
// Handle parsing errors gracefully
function safeParseCard(cardText: string) {
  try {
    const result = parseActionText(cardText, { strictMode: false });
    
    if (result.errors.length > 0) {
      console.warn(`Parsing errors for "${cardText}":`, result.errors);
    }
    
    if (result.warnings.length > 0) {
      console.info(`Parsing warnings for "${cardText}":`, result.warnings);
    }
    
    return result.abilities;
  } catch (error) {
    console.error(`Failed to parse card text: "${cardText}"`, error);
    return [];
  }
}
```

### Batch Processing

```typescript
// Process multiple cards efficiently
function parseCardBatch(cardTexts: string[]) {
  // Warm up caches
  CacheManager.warmUpCaches(cardTexts.slice(0, 10));
  
  const results = [];
  const startTime = performance.now();
  
  for (const text of cardTexts) {
    const abilities = generateActionAbilitiesFromText(text);
    results.push({ text, abilities });
  }
  
  const duration = performance.now() - startTime;
  console.log(`Parsed ${cardTexts.length} cards in ${duration.toFixed(2)}ms`);
  console.log(`Average: ${(duration / cardTexts.length).toFixed(2)}ms per card`);
  
  return results;
}
```

This documentation provides comprehensive coverage of the Action Text Parser system, from basic usage to advanced features and troubleshooting. It should help developers understand and effectively use the parser in their applications.