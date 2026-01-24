---
name: regenerate-cards
description: Batch regeneration of card abilities after parser updates. Re-parses card text and updates abilities without implementing new patterns.
user_invokable: true
---

# Regenerate Cards Command

## Usage

```
/regenerate-cards [set|card-id]
```

## Arguments

| Argument | Description | Examples |
|----------|-------------|----------|
| `set` | Three-digit set number | `010`, `011` |
| `card-id` | Full card identifier | `010-043`, `011-003-pudge` |
| (none) | Regenerate all sets | - |

## Examples

```bash
# Regenerate all cards in a set
/regenerate-cards 010

# Regenerate specific card
/regenerate-cards 010-043

# Regenerate all cards (use with caution)
/regenerate-cards --all
```

## Purpose

Use this command after parser patterns have been updated to apply changes to card files. This command:

1. Re-runs the parser on card text
2. Compares new abilities with existing
3. Updates card files with new abilities
4. Verifies changes are valid

**Note:** This command does NOT implement new patterns. Use `/improve-parser` for pattern development.

## Workflow

### 1. Load Cards

```
Loading cards from Set 010...
Found 204 card files
```

### 2. Parse and Compare

```
Parsing card text...

Card 010-043 Iago - Stompin' Mad:
  Before: 0 abilities
  After:  1 ability
  Status: UPDATED

Card 010-044 Jasmine - Desert Princess:
  Before: 2 abilities
  After:  2 abilities
  Status: UNCHANGED

Card 010-045 Aladdin - Street Rat:
  Before: 1 ability
  After:  1 ability (modified)
  Status: UPDATED
```

### 3. Update Files

```
Updating card files...

Updated:
  - 010-043-iago-stompin-mad.ts
  - 010-045-aladdin-street-rat.ts

Skipped (manual override):
  - 010-088-mulan-imperial-soldier.ts

Unchanged: 201 cards
```

### 4. Verify

```
Verifying changes...

Type check: PASS
Card tests: PASS

Regeneration complete.
```

## Output

### Success

```
=== Card Regeneration Complete ===

Set: 010
Total cards: 204
Updated: 15
Unchanged: 187
Skipped: 2

Updated cards:
  - 010-043 Iago - Stompin' Mad
  - 010-045 Aladdin - Street Rat
  - 010-067 Rapunzel - Curious Adventurer
  [...]

Skipped (manual override):
  - 010-088 Mulan - Imperial Soldier
  - 010-112 Belle - Diplomatic

Next steps:
  1. Review changes: git diff
  2. Run tests: bun test cards/010
  3. Commit when ready
```

### Dry Run

```
=== Card Regeneration Preview (Dry Run) ===

Set: 010
Would update: 15 cards
Would skip: 2 cards (manual override)

Preview of changes:

010-043 Iago - Stompin' Mad:
  - abilities: []
  + abilities: [
  +   {
  +     type: "triggered",
  +     trigger: { type: "play-this-character" },
  +     effects: [{ type: "opponent-choice-discard" }],
  +     optional: true
  +   }
  + ]

[...]

Run without --dry-run to apply changes.
```

## Flags

| Flag | Description |
|------|-------------|
| `--dry-run` | Preview changes without writing files |
| `--verbose` | Show detailed comparison output |
| `--force` | Override manual override flags (use with caution) |
| `--all` | Regenerate all sets (requires confirmation) |

## Behavior Notes

### Manual Overrides

Cards with `manualOverride: true` are skipped by default:

```typescript
export const complexCard: CharacterCard = {
  // ...
  manualOverride: true, // Will be skipped during regeneration
  abilities: [
    // Manually implemented abilities
  ]
};
```

Use `--force` to override this behavior (not recommended).

### Incremental Updates

The command only updates abilities that changed:

```
Card 010-045:
  Ability 1: UNCHANGED
  Ability 2: MODIFIED (trigger updated)
  Ability 3: ADDED (new pattern now matches)
```

### Preserving Manual Additions

If a card has both parsed and manually added abilities, both are preserved:

```typescript
abilities: [
  // Parsed ability
  { type: "triggered", ... },
  // Manual ability (marked with isManual: true)
  { type: "activated", ..., isManual: true }
]
```

## Related Commands

- `/improve-parser [set]` - Full workflow including pattern development

## Related Agents

- `card-regenerator` - Core regeneration logic

## Related Skills

- `parser-regenerate-card` - Single card regeneration
- `parser-compare-abilities` - Ability comparison
- `parser-verify` - Verification

## Troubleshooting

### No Changes Detected

```
Regeneration complete: 0 cards updated
```

Possible causes:
- Parser patterns haven't changed
- Cards already up to date
- Parse failures (check verbose output)

### Type Check Failures

```
Type check: FAIL
Error: Property 'newEffect' does not exist on type 'Effect'
```

Check:
- New effect types are exported from `lorcana-types`
- Type unions are updated

### Test Failures After Regeneration

```
Card tests: FAIL
  - 010-043: Expected 1 ability, got 2
```

Check:
- Pattern may be too general (matching extra text)
- Existing tests may need updating

### Manual Override Blocking Updates

```
Skipped: 010-088 (manual override)
```

If update is needed:
1. Review the card's complex abilities
2. Consider removing `manualOverride` if parser now handles it
3. Or use `--force` flag (with caution)

## Examples

### Regenerate After Pattern Fix

```bash
# 1. Pattern was fixed in patterns/effects.ts
# 2. Regenerate affected set
/regenerate-cards 010

# 3. Review changes
git diff packages/lorcana-cards/src/cards/010/

# 4. Run tests
bun test cards/010

# 5. Commit
git add packages/lorcana-cards/src/cards/010/
git commit -m "chore(cards): regenerate Set 010 after pattern fix"
```

### Preview Before Large Regeneration

```bash
# Preview what would change
/regenerate-cards 010 --dry-run

# If satisfied, run actual regeneration
/regenerate-cards 010
```

### Regenerate Specific Card

```bash
# After implementing new pattern
/regenerate-cards 010-043

# Check result
cat packages/lorcana-cards/src/cards/010/characters/043-iago-stompin-mad.ts
```
