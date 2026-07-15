# Lorcana Card Text Pattern Analysis

This directory contains tools for generating and analyzing Lorcana card text patterns from the game's card database.

## Overview

The system consists of three main components:

1. **`generate.ts`** - Extracts all unique card texts from the Lorcana engine
2. **`extract-patterns.ts`** - Analyzes card texts and extracts common patterns
3. **`index.ts`** - Orchestrates both scripts with a unified CLI

## Installation

```bash
cd .claude/skills/lorcana-rules/references/all-cards-text
bun install
```

## Usage

### Quick Start - Run Everything

```bash
bun run index.ts
# or simply
bun run index.ts all
```

This will:
1. Generate the card texts file
2. Extract all patterns
3. Generate a markdown report
4. Export patterns as JSON
5. Export patterns as TypeScript
6. Display summary statistics

### Individual Commands

#### Generate Card Texts Only

```bash
bun run index.ts generate
```

Extracts all unique card texts from the engine and saves to `all-lorcana-texts.ts`.

#### Extract Patterns Only

```bash
bun run index.ts extract
```

Analyzes existing card texts and displays pattern statistics in the console.

#### Generate Report

```bash
bun run index.ts report
```

Creates a comprehensive markdown report with:
- Pattern frequency analysis
- Category breakdown
- Top patterns by category
- Examples for each pattern

Output: `output/pattern-analysis-report.md`

#### Export as JSON

```bash
bun run index.ts export-json
```

Exports all patterns as structured JSON for programmatic use.

Output: `output/patterns.json`

#### Export as TypeScript

```bash
bun run index.ts export-ts
```

Generates TypeScript constants for use in code.

Output: `output/patterns.generated.ts`

## Pattern Categories

The system categorizes patterns into 28 different types:

### Core Mechanics
- **keyword** - Basic keywords (Rush, Ward, Evasive, etc.)
- **timing-trigger** - When/Whenever effects
- **activated-ability** - Abilities with costs ({E}, {I})

### Card Manipulation
- **card-advantage** - Drawing cards
- **discard** - Discarding cards
- **banish** - Removing cards from play
- **bounce** - Returning cards to hand

### State Modification
- **damage** - Dealing/removing damage
- **stat-modification** - Changing Strength/Lore/Willpower
- **lore** - Lore gain/loss
- **exert** - Exerting cards
- **ready** - Readying cards

### Combat & Control
- **challenge** - Challenge restrictions/modifications
- **quest-restriction** - Quest restrictions
- **resist** - Resist modifications
- **replacement-effect** - Replacement effects

### Zone Interaction
- **inkwell** - Inkwell manipulation
- **deck-manipulation** - Looking at/searching deck
- **reveal** - Revealing cards

### Special Mechanics
- **shift** - Shift abilities
- **boost** - Boost mechanic
- **song** - Song-related effects
- **location** - Location movement/effects

### Conditional & Complex
- **conditional** - If/While conditions
- **named-synergy** - Named character synergies
- **cost-reduction** - Cost reduction effects
- **modal** - "Choose one" effects
- **compound** - Multiple effects in one ability

## Output Files

All generated files are saved to the `output/` directory:

### `pattern-analysis-report.md`
Human-readable markdown report with:
- Summary statistics
- Category breakdown with percentages
- Top 50 most frequent patterns
- Patterns organized by category
- Examples for each pattern

### `patterns.json`
Machine-readable JSON with complete pattern data:
```json
{
  "totalTexts": 1552,
  "totalPatterns": 1450,
  "categoryCounts": { ... },
  "patterns": [
    {
      "template": "When you play this character, ...",
      "frequency": 287,
      "examples": [...],
      "category": "timing-trigger"
    }
  ],
  "topPatterns": [...]
}
```

### `patterns.generated.ts`
TypeScript constants for programmatic use:
```typescript
export const TIMING_TRIGGER_PATTERNS: CardTextPattern[] = [
  {
    template: "When you play this character, ...",
    frequency: 287,
    examples: [...],
    category: "timing-trigger"
  },
  // ...
];
```

## Understanding Pattern Templates

Pattern templates use `{d}` as a placeholder for numbers:

- **Original:** "Deal 3 damage to chosen character"
- **Pattern:** "Deal {d} damage to chosen character"

This allows grouping similar effects with different values.

## Example Output

```
🎮 Lorcana Card Text Pattern Analyzer
=====================================

📝 Generating card texts...
✅ Card texts generated successfully

🔍 Extracting patterns from card texts...
✅ Pattern extraction complete
   - Total unique texts: 1552
   - Total unique patterns: 1450
   - Categories: 28

📊 Generating pattern analysis report...
✅ Report saved to: output/pattern-analysis-report.md

💾 Exporting patterns as JSON...
✅ JSON saved to: output/patterns.json

📦 Exporting patterns as TypeScript...
✅ TypeScript saved to: output/patterns.generated.ts

📊 Category Summary:

  timing-trigger            342 (23.6%)
  stat-modification         298 (20.6%)
  card-advantage            187 (12.9%)
  damage                    156 (10.8%)
  ...

📈 Top 15 Most Frequent Patterns:

1. [timing-trigger] When you play this character, ...
   Frequency: 287x
   Example: "When you play this character, draw a card."

2. [timing-trigger] Whenever this character quests, ...
   Frequency: 143x
   Example: "Whenever this character quests, gain 1 lore."

...
```

## Integration with Lorcana Engine

These patterns can be used to:

1. **Validate card implementations** - Check if card text matches known patterns
2. **Generate test cases** - Create tests based on pattern categories
3. **Build parsers** - Auto-generate card implementations from text
4. **Document conventions** - Understand game design patterns

## Development

### Running Individual Scripts

```bash
# Generate card texts
bun run generate.ts

# Extract patterns (requires all-lorcana-texts.ts to exist)
bun run extract-patterns.ts
```

### Testing

```bash
# Run with example data
bun run extract-patterns.ts
```

## Files

- **`generate.ts`** - Card text extraction from engine
- **`extract-patterns.ts`** - Pattern analysis and categorization
- **`index.ts`** - Unified orchestrator CLI
- **`all-lorcana-texts.ts`** - Generated card texts (auto-generated)
- **`output/`** - Generated reports and exports
- **`README.md`** - This file

## Notes

- The `all-lorcana-texts.ts` file is auto-generated and should not be edited manually
- Pattern categorization uses heuristics and may not be 100% accurate
- Some complex abilities may be categorized as "compound" or "other"
- The system focuses on unique text patterns, not individual cards

## Future Enhancements

Potential improvements:
- [ ] Pattern-based card text parser
- [ ] Automatic ability implementation generator
- [ ] Pattern similarity matching
- [ ] Template-based card text validation
- [ ] Integration with card testing framework

