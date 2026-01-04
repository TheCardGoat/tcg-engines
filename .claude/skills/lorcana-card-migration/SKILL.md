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

3. **Interactive Confirmation**
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
- `triggered`: `{ type: "triggered", name?, trigger, effect }`
- `activated`: `{ type: "activated", cost?, effect }`
- `static`: `{ type: "static", name?, effect }`
- `action`: `{ type: "action", effect }`

## Output Format

```
Card Migration Complete
========================
Card: [Name] - [Version]
Source: src/legacy-cards/001/...
Target: src/cards/001/...

Abilities Processed: X
- Parsed: Y
- Manual overrides: Z

Files Created:
- src/cards/001/characters/xxx-name.ts
- Updated: src/cards/001/characters/index.ts

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
✅ Parsed: TriggeredAbility { ... }
Confirm? yes

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

Next Steps:
- Run: bun test src/cards/001/{type}/{file}.test.ts
- Or use: /write-card-test {card-identifier}
```
