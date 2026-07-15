# Specification: Lorcana Ability Text Parser

## Goal

Create a deterministic, rule-based parser that converts raw Lorcana card ability text strings into type-safe `Ability` objects that conform to the Lorcana Engine's ability type definitions. The parser will facilitate ongoing card data generation as new cards are released quarterly.

## User Stories

- As a card data maintainer, I want to parse raw ability text into structured `Ability` objects so that I can efficiently generate card definitions for the engine
- As a developer, I want the parser to produce type-safe output so that TypeScript catches any mismatches at compile time
- As a data processor, I want lenient error handling so that bulk processing can continue despite individual parsing failures
- As a contributor, I want clear pattern documentation so that I can extend the parser for new ability patterns

## Core Requirements

### Functional Requirements

- Parse all 1552 unique ability texts from `allCardsText` array
- Support both placeholder format (`{d}` for numbers) and resolved format (`3`)
- Produce output conforming to the `Ability` type union from `ability-types.ts`
- Include `name` field for named abilities (ALL CAPS text before effect)
- Include `text` field containing original card text
- Return structured parsing results with success/failure indicators

### Non-Functional Requirements

- Deterministic output: same input always produces same output
- No LLM or AI-based parsing (rule-based only)
- Type-safe: output must satisfy TypeScript's `Ability` type
- Performance: parse all 1552 texts in under 5 seconds
- Extensible: new patterns can be added without restructuring

## Input/Output Specification

### Input Format

```typescript
// Single ability text string
type ParserInput = string;

// Example inputs (placeholder format):
"Rush"
"Challenger +{d}"
"Shift {d}"
"{E} - Draw a card."
"DARK KNOWLEDGE Whenever this character quests, you may draw a card."

// Example inputs (resolved format):
"Challenger +3"
"Shift 5"
"{E}, 2 {I} - Deal 3 damage to chosen character."
```

### Output Format

```typescript
interface ParseResult {
  success: boolean;
  ability?: AbilityWithText;
  warnings?: string[];
  error?: string;
  unparsedSegments?: string[];
}

interface AbilityWithText {
  ability: Ability;
  text: string;
  name?: string;
}

// Batch processing result
interface BatchParseResult {
  total: number;
  successful: number;
  failed: number;
  results: ParseResult[];
}
```

### Output Examples

**Simple Keyword:**
```typescript
// Input: "Rush"
{
  success: true,
  ability: {
    ability: { type: "keyword", keyword: "Rush" },
    text: "Rush"
  }
}
```

**Parameterized Keyword:**
```typescript
// Input: "Challenger +3"
{
  success: true,
  ability: {
    ability: { type: "keyword", keyword: "Challenger", value: 3 },
    text: "Challenger +3"
  }
}
```

**Triggered Ability:**
```typescript
// Input: "When you play this character, draw 2 cards."
{
  success: true,
  ability: {
    ability: {
      type: "triggered",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: { type: "draw", amount: 2, target: "CONTROLLER" }
    },
    text: "When you play this character, draw 2 cards."
  }
}
```

**Named Ability:**
```typescript
// Input: "DARK KNOWLEDGE Whenever this character quests, you may draw a card."
{
  success: true,
  ability: {
    ability: {
      type: "triggered",
      name: "DARK KNOWLEDGE",
      trigger: { event: "quest", timing: "whenever", on: "SELF" },
      effect: { type: "optional", effect: { type: "draw", amount: 1, target: "CONTROLLER" } }
    },
    text: "Whenever this character quests, you may draw a card.",
    name: "DARK KNOWLEDGE"
  }
}
```

## Parser Architecture

### High-Level Design

```
Input Text
    |
    v
[Preprocessor] -> Normalize text, extract named ability prefix
    |
    v
[Classifier] -> Determine ability type (keyword, triggered, activated, static)
    |
    v
[Type-Specific Parser] -> Route to specialized parser
    |
    +---> [KeywordParser] -> Simple, parameterized, value-based, Shift
    +---> [TriggeredParser] -> Extract trigger, condition, effect
    +---> [ActivatedParser] -> Extract cost, condition, effect
    +---> [StaticParser] -> Extract condition, effect
    +---> [ReplacementParser] -> Extract replaces clause, effect
    |
    v
[Effect Parser] -> Recursively parse effect clauses
    |
    v
[Validator] -> Ensure output conforms to Ability type
    |
    v
Output: ParseResult
```

### Pattern Matching Strategy

Use a **priority-ordered pattern registry** where patterns are matched from most specific to most general:

1. **Exact matches** for simple keywords
2. **Regex patterns** for parameterized abilities
3. **Prefix detection** for ability type classification
4. **Recursive descent** for complex effect parsing

## Pattern Categories

### Category 1: Keyword Abilities

| Pattern | Type | Example |
|---------|------|---------|
| `^(Rush\|Ward\|Evasive\|Bodyguard\|Support\|Reckless\|Vanish\|Alert)$` | SimpleKeyword | "Rush" |
| `^Challenger \+(\d+\|\{d\})$` | ParameterizedKeyword | "Challenger +3" |
| `^Resist \+(\d+\|\{d\})$` | ParameterizedKeyword | "Resist +2" |
| `^Singer (\d+\|\{d\})$` | ValueKeyword | "Singer 5" |
| `^Sing Together (\d+\|\{d\})$` | ValueKeyword | "Sing Together 4" |
| `^Boost (\d+\|\{d\})( \{I\})?$` | ValueKeyword | "Boost 3" |
| `^(Shift\|Puppy Shift\|Universal Shift) (\d+\|\{d\})( \{I\})?$` | ShiftKeyword | "Shift 5" |

### Category 2: Triggered Abilities

Detected by trigger word prefixes:

| Trigger Word | Timing | Example Pattern |
|--------------|--------|-----------------|
| `When` | when | "When you play this character, ..." |
| `Whenever` | whenever | "Whenever this character quests, ..." |
| `At the start of` | at | "At the start of your turn, ..." |
| `At the end of` | at | "At the end of your turn, ..." |
| `The first time` | whenever + restriction | "The first time each turn ..." |

**Trigger Event Detection:**

| Text Pattern | Event | Subject |
|--------------|-------|---------|
| "you play this character" | play | SELF |
| "this character quests" | quest | SELF |
| "this character challenges" | challenge | SELF |
| "this character is challenged" | challenged | SELF |
| "this character is banished" | banish | SELF |
| "you play a character" | play | YOUR_CHARACTERS |
| "you play a song" | play | { cardType: "song" } |

### Category 3: Activated Abilities

Detected by cost separator patterns: `{E} -`, `{E},`, `Banish this item -`

**Cost Patterns:**

| Pattern | Cost Component |
|---------|----------------|
| `\{E\}` | { exert: true } |
| `(\d+) \{I\}` | { ink: N } |
| `Banish this (item\|character)` | { banishSelf: true } |
| `Choose and discard (\d+\|a) cards?` | { discardCards: N, discardChosen: true } |

### Category 4: Static Abilities

Detected by continuous effect indicators:

| Indicator | Example |
|-----------|---------|
| "Your characters gain ..." | "Your characters gain Ward" |
| "While ..." | "While this character has no damage, he gets +2 {S}" |
| "Characters get ..." | "Characters get +1 {L} while here" |
| No trigger word, present tense | "This character can't be challenged" |

### Category 5: Effects (Shared Sub-Parser)

| Effect Pattern | Effect Type |
|----------------|-------------|
| `[Dd]raw (\d+\|a) cards?` | DrawEffect |
| `[Gg]ain (\d+) lore` | GainLoreEffect |
| `[Dd]eal (\d+) damage to chosen character` | DealDamageEffect |
| `[Ee]xert chosen (character\|opposing character)` | ExertEffect |
| `[Rr]eady chosen character` | ReadyEffect |
| `[Bb]anish chosen (character\|item\|location)` | BanishEffect |
| `[Rr]eturn chosen character to their player's hand` | ReturnToHandEffect |
| `[Rr]emove up to (\d+) damage from chosen character` | RemoveDamageEffect |
| `[Cc]hosen character gains (Rush\|Ward\|...) this turn` | GainKeywordEffect |
| `[Cc]hosen character gets ([+-]\d+) \{S\} this turn` | ModifyStatEffect |

### Category 6: Targets

| Text Pattern | Target |
|--------------|--------|
| "this character" / "this card" | SELF |
| "chosen character" | CHOSEN_CHARACTER |
| "chosen opposing character" | CHOSEN_OPPOSING_CHARACTER |
| "chosen character of yours" | CHOSEN_CHARACTER_OF_YOURS |
| "each opposing character" | ALL_OPPOSING_CHARACTERS |
| "your characters" | YOUR_CHARACTERS |
| "all characters" | ALL_CHARACTERS |

### Category 7: Conditions

| Text Pattern | Condition Type |
|--------------|----------------|
| "if you have a character named X" | has-named-character |
| "if you have no cards in your hand" | resource-count (cards-in-hand = 0) |
| "while this character has no damage" | no-damage |
| "while this character has damage" | has-any-damage |
| "you may" | player-choice |

## Error Handling Strategy

### Lenient Mode (Default)

- **Partial Parsing**: Extract what can be understood, mark remainder as unparsed
- **Warnings**: Log non-fatal issues without failing
- **Fallback**: Return raw text ability with `unparsedSegments` for manual review

```typescript
// Example: Partially parsed result
{
  success: true,  // Still success if core ability is parsed
  ability: { ... },
  warnings: ["Could not parse condition: 'if the moon is full'"],
  unparsedSegments: ["if the moon is full"]
}
```

### Error Categories

| Category | Handling | Example |
|----------|----------|---------|
| Unknown keyword | Warning + continue | "Mythic" (not a real keyword) |
| Malformed syntax | Error + skip | "{E} - - Draw" (double separator) |
| Unknown effect | Warning + raw segment | "Shuffle chosen opponent's emotions" |
| Missing required field | Error | Triggered ability without trigger |

## Testing Approach

### Test Categories

1. **Keyword Parsing** (~15 tests)
   - Simple keywords (8 variations)
   - Parameterized keywords with values
   - Shift variants (standard, Puppy, Universal)

2. **Triggered Ability Parsing** (~20 tests)
   - Each trigger timing (when/whenever/at)
   - Common trigger events (play, quest, challenge, banish)
   - Named abilities with ALL CAPS prefix
   - Conditional triggers

3. **Activated Ability Parsing** (~15 tests)
   - Exert-only costs
   - Ink costs
   - Combined costs
   - Banish costs

4. **Static Ability Parsing** (~10 tests)
   - Character grants
   - Stat modifications
   - Restriction effects

5. **Effect Parsing** (~25 tests)
   - Each effect type at least once
   - Composite effects (sequence, choice)
   - Optional effects ("you may")

6. **Integration Tests** (~10 tests)
   - Batch processing of sample texts
   - Error recovery
   - Coverage statistics

### Coverage Goal

- Parse 80%+ of the 1552 unique texts successfully on initial release
- Track unparsed patterns for iterative improvement

## Reusable Components

### Existing Code to Leverage

- **Type Definitions**: All types from `packages/lorcana-engine/src/cards/abilities/types/`
- **Builder Functions**: `keyword()`, `challenger()`, `resist()`, `shift()`, `singer()`, `triggered()`, `activated()`, `staticAbility()`
- **Type Guards**: `isKeywordAbility()`, `isTriggeredAbility()`, etc.
- **Common Triggers**: `COMMON_TRIGGERS` object for standard trigger patterns

### New Components Required

| Component | Reason |
|-----------|--------|
| `TextPreprocessor` | Normalize input, extract names - no existing equivalent |
| `AbilityClassifier` | Determine ability type from text - parsing-specific logic |
| `PatternRegistry` | Organize regex patterns - new parsing infrastructure |
| `EffectParser` | Recursive effect parsing - complex text-to-structure logic |
| `TargetParser` | Extract targets from text - parsing-specific logic |
| `ConditionParser` | Extract conditions from text - parsing-specific logic |

## Technical Approach

### Module Structure

```
packages/lorcana-engine/src/parser/
  index.ts              # Public API
  types.ts              # ParseResult, BatchParseResult types
  parser.ts             # Main parser entry point
  preprocessor.ts       # Text normalization
  classifier.ts         # Ability type classification
  patterns/
    index.ts            # Pattern registry
    keywords.ts         # Keyword patterns
    triggers.ts         # Trigger patterns
    costs.ts            # Cost patterns
    effects.ts          # Effect patterns
    targets.ts          # Target patterns
    conditions.ts       # Condition patterns
  parsers/
    keyword-parser.ts   # Keyword ability parsing
    triggered-parser.ts # Triggered ability parsing
    activated-parser.ts # Activated ability parsing
    static-parser.ts    # Static ability parsing
    effect-parser.ts    # Shared effect parsing
  __tests__/
    parser.test.ts      # Integration tests
    keywords.test.ts    # Keyword parsing tests
    triggered.test.ts   # Triggered parsing tests
    ...
```

### Public API

```typescript
// Main entry point
function parseAbilityText(text: string): ParseResult;

// Batch processing
function parseAbilityTexts(texts: string[]): BatchParseResult;

// With options
interface ParserOptions {
  strict?: boolean;      // Fail on any warning (default: false)
  resolveNumbers?: boolean; // Convert {d} to 0 placeholder (default: false)
}
function parseAbilityText(text: string, options?: ParserOptions): ParseResult;
```

### Symbol Placeholders

The parser must handle these symbolic placeholders:

| Symbol | Meaning | Regex Pattern |
|--------|---------|---------------|
| `{d}` | Numeric value | `\{d\}` or `\d+` |
| `{E}` | Exert symbol | `\{E\}` |
| `{I}` | Ink symbol | `\{I\}` |
| `{S}` | Strength stat | `\{S\}` |
| `{L}` | Lore stat | `\{L\}` |
| `{W}` | Willpower stat | `\{W\}` |

## Out of Scope

- Full card definitions (name, cost, stats, ink color)
- Reverse parsing (Ability object to text)
- Card-specific name handling (card names in ability text)
- Visual formatting or rich text
- Game rule validation (e.g., can Rush be on an item?)
- Localization / non-English text
- Historical card text versions

## Success Criteria

- Parse 80%+ of 1552 unique ability texts successfully
- Zero TypeScript compilation errors in output
- All tests pass with 90%+ code coverage on parser modules
- Batch processing completes in under 5 seconds
- Clear documentation of unsupported patterns
- Warnings for partially parsed abilities enable iterative improvement
