# Conversion Engine Component

This component transforms JSON import data into properly typed TypeScript card definitions using enhanced types and comprehensive parsing.

## Purpose

- Convert external JSON card data to internal typed representations
- Parse and structure abilities from HTML effect text
- Handle special cases like tokens and promotional variants
- Validate conversions against enhanced type system

## Key Interfaces

- `ConversionEngine` - Main interface for card conversion functionality
- `FieldParser` - Base interface for parsing individual fields
- `AbilityTextParser` - Extracts structured abilities from HTML text
- `AbilityExtractor` - Coordinates ability parsing components
- `ConversionOrchestrator` - Manages the complete conversion process

## Specialized Parsers

- `BasicFieldParser` - Handles standard card properties (name, cost, level, etc.)
- `TraitParser` - Processes parenthetical trait notation
- `ZoneParser` - Handles space/earth zone combinations
- `LinkRequirementParser` - Extracts pilot names from bracket notation
- `TargetExtractor` - Parses ability targets and conditions
- `EffectExtractor` - Extracts game effects with proper typing

## Usage

```typescript
const conversionEngine = new ConversionEngine(config);
const result = await conversionEngine.convertCard(importData);
// Result contains typed card definition or conversion errors
```

## Features

- HTML entity decoding and text normalization
- Pattern matching for timing keywords (【Main】, 【Deploy】, etc.)
- Target extraction with condition parsing
- Effect value extraction and typing
- Comprehensive error handling and recovery
- Batch processing with progress reporting