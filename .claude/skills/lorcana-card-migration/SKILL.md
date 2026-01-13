---
name: lorcana-card-migration
description: Interactive Lorcana card migration from legacy @lorcanito/lorcana-engine format to new @tcg/lorcana format. Use when implementing cards from packages/lorcana-cards. Parses abilities, asks for clarification on complex cases, generates new card files, and handles legacy file cleanup.
---

# Lorcana Card Migration

Interactive migration of Lorcana card definitions from legacy format to the new `@tcg/lorcana-types` format.

## When to Use

- User requests to migrate a specific card from legacy format
- User wants to implement cards from `packages/lorcana-cards`
- Batch migration of successfully-parsed cards is needed
- Interactive card development with parser validation

## Process

### Input

**Card Identifier**: Card ID (e.g., `007-heihei-boat-snack`) or filename

### Workflow

1. **Read Legacy Card**
   - Locate file in `src/legacy-cards/001/{type}/{file}.ts`
   - Extract properties: id, name, version, cost, abilities, etc.

2. **Parse Abilities**
   - Run parser V2 on each ability text
   - Determine parse success/failure

3. **Interactive Verification** ⚠️ CRITICAL
   - **ALWAYS compare** parsed output with legacy card abilities
   - Check for common parser gaps (see below)
   - For each ability: show parsed result, ask for confirmation
   - On failure: ask for clarification or suggest interpretation
   - Manual overrides can be added during migration

4. **Generate New Card**
   - Create file at `src/cards/001/{type}/{number}-{name}.ts`
   - Map legacy properties to new format
   - Include confirmed parsed abilities

5. **Update Index**
   - Add export to appropriate index file

6. **Cleanup Prompt**
   - Ask: "Delete legacy file? (yes/no)"
   - Only delete after explicit confirmation

## Property Mapping

| Legacy | New |
|--------|-----|
| `type: "character"` | `cardType: "character"` |
| `title` | `version` |
| - | `fullName` (concatenated) |
| `characteristics` | `classifications` |
| `colors` | `inkType` |
| `inkwell` | `inkable` |
| `number` | `cardNumber` |

## Ability Types

After parsing, abilities become one of:
- `keyword`: `{ type: "keyword", keyword, value? }`
- `triggered`: `{ type: "triggered", name?, trigger, effect, condition? }`
- `activated`: `{ type: "activated", cost?, effect }`
- `static`: `{ type: "static", name?, effect, condition? }`
- `action`: `{ type: "action", effect }`

## ⚠️ COMMON PARSER GAPS - Always Check

Based on migration experience, **ALWAYS verify** these patterns:

### 1. Missing Named Character Conditions
**Pattern**: `if you have a character named [Name] in play`
**Parser Failure**: Condition completely missing
**Manual Fix**:
```typescript
condition: {
  type: "has-named-character",
  name: "[Name]",
  controller: "you",
}
```
**Example**: 008-lefou-bumbler (Gaston condition)

### 2. Wrong Ability Type - Triggered vs Action
**Pattern**: `When you play this character, ...`
**Parser Failure**: Classified as `action` instead of `triggered`
**Manual Fix**:
```typescript
type: "triggered",
trigger: {
  event: "play",
  timing: "when",
  on: "SELF",
},
```
**Examples**: 021-stitch-carefree-surfer, 035-anna-heir-to-arendelle

### 3. Missing Trigger Metadata
**Pattern**: Any `When`/`Whenever` triggered ability
**Parser Failure**: Missing `trigger` field with `event`/`timing`/`on`
**Manual Fix**: Add trigger object as shown above

### 4. Missing Optional Wrapper
**Pattern**: `you may [effect]`
**Parser Failure**: `optional` wrapper dropped
**Manual Fix**:
```typescript
effect: {
  type: "optional",
  effect: { /* actual effect */ },
  chooser: "CONTROLLER",
}
```
**Example**: 021-stitch-carefree-surfer, 024-timon-grub-rustler

### 5. Conditions as Raw Strings
**Pattern**: `if you have 2 or more other characters in play`
**Parser Failure**: Condition stored as raw string `"you have 2 or more..."` instead of structured
**Manual Fix**:
```typescript
condition: {
  type: "zone-count",
  zone: "play",
  player: "you",
  cardType: "character",
  comparison: {
    operator: ">=",
    value: 3,
    excludeSelf: true,
  },
}
```
**Example**: 021-stitch-carefree-surfer

### 6. Text Truncation
**Pattern**: Long ability text
**Parser Failure**: Text cut off mid-sentence
**Manual Fix**: Copy full text from legacy card

### 7. Missing Keywords
**Pattern**: Cards with Rush, Evasive, etc.
**Parser Failure**: Keyword not included in abilities array
**Manual Fix**: Add keyword ability:
```typescript
{
  id: "[card-id]-1",
  type: "keyword",
  keyword: "[Keyword]",
  text: "[Keyword]",
}
```
**Example**: 011-maximus-relentless-pursuer (Rush)

### 8. Cost Reduction Without Condition
**Pattern**: `you pay 1 {I} less to play this [cardtype]`
**Parser Failure**: Missing `cardType` and `condition` in effect
**Manual Fix**:
```typescript
effect: {
  type: "cost-reduction",
  amount: 1,
  cardType: "character", // or "item"
}
```
**Example**: 008-lefou-bumbler

## Verification Checklist

For each migrated card, verify:
- [ ] Ability count matches legacy card
- [ ] Triggered abilities have `trigger` field
- [ ] "you may" effects are wrapped in `optional`
- [ ] Named character conditions are structured (not raw strings)
- [ ] Keywords are explicitly listed in abilities
- [ ] Text is complete (not truncated)
- [ ] Cost reductions have `cardType` specified

## Manual Overrides Location

When parser fails, add to `packages/lorcana-cards/src/parser/manual-overrides.ts`:

```typescript
export const MANUAL_ENTRIES = {
  "ABILITY TEXT HERE": {
    ability: { /* correct ability object */ },
    text: "ABILITY TEXT HERE",
  },
};
```

## Output Format

```
Card Migration Complete
========================
Card: [Name] - [Version]
Source: src/legacy-cards/001/...
Target: src/cards/001/...

Abilities Processed: X
- Parsed: Y
- Manual fixes: Z

Files Created:
- src/cards/001/characters/xxx-name.ts
- Updated: src/cards/001/characters/index.ts

Parser Gaps Found:
- [List any new gaps discovered]

Legacy File: [deleted/kept]
```

## Example Session

```
> migrate-card 002-ariel-spectacular-singer

Reading legacy card: src/legacy-cards/001/characters/002-ariel-spectacular-singer.ts
Found 2 abilities

[Ability 1/2]
Text: "Singer 5 (This character counts as cost 5 to sing songs.)"
✅ Parsed: KeywordAbility { keyword: "Singer", value: 5 }
Confirm? yes

[Ability 2/2]
Text: "MUSICAL DEBUT When you play this character, look at the top 4..."
⚠️ Parser Gap: Missing trigger metadata
Adding: trigger = { event: "play", timing: "when", on: "SELF" }
Confirm fix? yes

✓ Card migrated
New file: src/cards/001/characters/002-ariel-spectacular-singer.ts

Delete legacy file? (yes/no) yes
✓ Deleted: src/legacy-cards/001/characters/002-ariel-spectacular-singer.ts
```

## Completion Report

```
Card Migration: Complete
========================
Card: [Name] - [Version]
Files: X created, Y updated
Legacy: [deleted/kept]

Parser Gaps Discovered:
1. [Pattern 1] - N cards affected
2. [Pattern 2] - N cards affected

Next Steps:
- Run: bun test src/cards/001/{type}/{file}.test.ts
- Or use: /write-card-test {card-identifier}
```
