# Prompt: Investigate and Fix Missing Manual Override Cards

## Quick Start

```bash
# 1. List all missing entries
bun run packages/lorcana-cards/scripts/list-missing-manual-override-cards.ts

# 2. Investigate a specific entry
bun run packages/lorcana-cards/scripts/investigate-specific-entry.ts "ABILITY NAME"

# 3. After fixing, verify improvements
bun run packages/lorcana-cards/scripts/check-manual-override-coverage.ts
```

## Context

We have 98 manual override entries in `MANUAL_ENTRIES`, but only 17 are currently matching cards in the dataset. This means 81 manual override entries don't have matching cards.

The matching logic has been fixed to:
- Convert numbers to `{d}` placeholders
- Strip parentheses (reminder text)
- Check both full text and individual ability lines

## Investigation Task

For each of the 81 unmatched manual override entries, determine:

1. **Does a corresponding card exist in the dataset?**
   - Search for cards with similar ability names or text
   - Check if the card exists but with different formatting

2. **If the card exists, why doesn't it match?**
   - Text formatting differences (punctuation, word order)
   - Reminder text differences
   - Multiple abilities combined differently
   - Number placement differences

3. **What needs to be fixed?**
   - Update matching logic to handle the formatting difference
   - Update the manual override key to match actual card text
   - Add the missing card to the dataset (if it's actually missing)

## Investigation Steps

### Step 1: Run Analysis Scripts

```bash
# List all missing entries
bun run packages/lorcana-cards/scripts/list-missing-manual-override-cards.ts

# Analyze potential matches with formatting differences
bun run packages/lorcana-cards/scripts/analyze-unmatched-overrides.ts

# Check current coverage
bun run packages/lorcana-cards/scripts/check-manual-override-coverage.ts

# Investigate a specific entry (use ability name or key words)
bun run packages/lorcana-cards/scripts/investigate-specific-entry.ts "NOW IT'S A PARTY"
bun run packages/lorcana-cards/scripts/investigate-specific-entry.ts "STICK WITH ME"
```

### Step 2: For Each Missing Entry

For each unmatched manual override key:

1. **Extract key information:**
   - Ability name(s) (if present - ALL CAPS text)
   - First few words of the ability text
   - Number of `{d}` placeholders

2. **Search for similar cards:**
   ```typescript
   // Search pattern: Look for cards containing the ability name or first few words
   const searchTerms = [
     abilityName,           // e.g., "NOW IT'S A PARTY"
     firstFewWords,         // e.g., "For each character you have"
     keyWords               // Extract important keywords
   ];
   ```

3. **Compare texts:**
   - Load the card's `rulesText`
   - Normalize both texts (strip parens, normalize whitespace, convert numbers to `{d}`)
   - Compare character by character to find differences

4. **Identify the mismatch:**
   - Is it punctuation? (periods, commas, dashes)
   - Is it word order? ("then" vs comma, "and" vs period)
   - Is it additional text? (extra words, different phrasing)
   - Is it number placement? (numbers in different positions)

### Step 3: Fix Strategy

Based on the mismatch type:

#### Type A: Punctuation Differences
**Example**: Manual override has "—" but card has "-" or "−"

**Fix**: Normalize punctuation before matching
```typescript
function normalizePunctuation(text: string): string {
  return text
    .replace(/[—–−]/g, "-")  // Normalize dashes
    .replace(/[""]/g, '"')    // Normalize quotes
    .replace(/['']/g, "'");   // Normalize apostrophes
}
```

#### Type B: Word Order Differences
**Example**: Manual override has "then" but card has comma or period

**Fix**: Normalize sequencing words
```typescript
function normalizeSequencing(text: string): string {
  return text
    .replace(/\s*,\s*then\s+/g, " then ")  // "X, then Y" → "X then Y"
    .replace(/\s+then\s+/g, " then ")       // Normalize spacing
    .replace(/\s*\.\s+/g, ". ");            // Normalize periods
}
```

#### Type C: Text Formatting Differences
**Example**: Manual override has "Choose one:" but card has "Choose one"

**Fix**: Normalize common phrases
```typescript
function normalizePhrases(text: string): string {
  return text
    .replace(/Choose one:\s*/gi, "Choose one: ")
    .replace(/\s+/g, " ")                    // Normalize whitespace
    .trim();
}
```

#### Type D: Card Actually Missing
**Example**: No card found with similar text

**Fix**: 
- Verify the card should exist (check set/expansion)
- If card exists but not in dataset, add it
- If card doesn't exist, remove or mark the manual override entry

### Step 4: Implementation

For each fix type, update the matching logic:

1. **Add normalization functions** to `parser-validator.ts`:
   ```typescript
   function normalizeForMatching(text: string): string {
     // Strip parentheses
     let normalized = stripAllParentheses(text);
     // Normalize punctuation
     normalized = normalizePunctuation(normalized);
     // Normalize sequencing
     normalized = normalizeSequencing(normalized);
     // Normalize phrases
     normalized = normalizePhrases(normalized);
     // Normalize whitespace
     normalized = normalizeText(normalized);
     // Convert numbers to {d}
     return normalizeToPattern(normalized);
   }
   ```

2. **Update `hasManualOverride`** to use the new normalization:
   ```typescript
   export function hasManualOverride(card: CanonicalCard): boolean {
     if (!card.rulesText) return false;
     
     // Use comprehensive normalization
     let fullText = card.rulesText.replace(/\n/g, " ");
     const patternFullText = normalizeForMatching(fullText);
     if (tooComplexText(patternFullText)) {
       return true;
     }
     
     // Check individual lines
     const abilityLines = card.rulesText.split("\n").filter((l) => l.trim());
     for (const line of abilityLines) {
       const patternLine = normalizeForMatching(line.trim());
       if (tooComplexText(patternLine)) {
         return true;
       }
     }
     
     return false;
   }
   ```

3. **Update `isParseableCard`** similarly

4. **Update `file-generator.ts`** to use the same normalization

### Step 5: Testing

After implementing fixes:

1. **Run diagnostic scripts** to verify improvements:
   ```bash
   bun run packages/lorcana-cards/scripts/diagnose-manual-overrides.ts
   bun run packages/lorcana-cards/scripts/check-manual-override-coverage.ts
   ```

2. **Verify specific cards** that should now match:
   ```typescript
   // Test specific cards that were identified as potential matches
   const testCards = [
     "Tramp - Street-Smart Dog",      // NOW IT'S A PARTY
     "Scar - Finally King",          // STICK WITH ME
     "Mystical Rose",                // DISPEL THE ENTANGLEMENT
     // ... etc
   ];
   ```

3. **Run card generation** to ensure no regressions:
   ```bash
   bun run packages/lorcana-cards/scripts/generate-cards.ts
   ```

## Investigation Template

For each missing entry, document:

```markdown
### Entry: [Ability Name or Description]

**Manual Override Key:**
```
[Full key text]
```

**Search Strategy:**
- Search terms: [list terms]
- Expected card: [card name if known]

**Investigation Results:**
- [ ] Card found in dataset: Yes/No
- [ ] Card name: [if found]
- [ ] Similarity: [percentage if found]

**Differences Found:**
1. [Difference type]: [Specific difference]
2. [Difference type]: [Specific difference]

**Fix Required:**
- [ ] Update normalization logic
- [ ] Update manual override key
- [ ] Add missing card
- [ ] Remove invalid entry

**Fix Implementation:**
[Code changes or notes]
```

## Priority Order

Investigate in this order:

1. **High Priority**: Named abilities with clear card names
   - "NOW IT'S A PARTY" → "Tramp - Street-Smart Dog" (found, but key missing `{d}` for "pay 1 {I}")
   - "STICK WITH ME" → likely "Scar - Finally King"
   - "DISPEL THE ENTANGLEMENT" → likely "Mystical Rose"

### Known Issues Found

**"NOW IT'S A PARTY" / "Tramp - Street-Smart Dog"**
- Card text: "pay 1 {I} less"
- Manual override key: "pay {I} less" (missing `{d}` placeholder)
- **Fix**: Update manual override key to include `{d}`: "pay {d} {I} less"

2. **Medium Priority**: Named abilities without clear matches
   - "BUSINESS EXPERTISE"
   - "FIND WHAT'S HIDDEN"
   - "THE CAULDRON CALLS"

3. **Low Priority**: Generic unnamed abilities
   - "Return chosen character..."
   - "Deal {d} damage..."
   - These may appear on multiple cards with variations

## Tools to Use

1. **Investigate specific entry** (Recommended first step):
   ```bash
   bun run packages/lorcana-cards/scripts/investigate-specific-entry.ts "ABILITY NAME"
   ```
   This script will:
   - Find the manual override key
   - Search for similar cards in the dataset
   - Show normalized text comparisons
   - Identify character-by-character differences
   - Check individual ability lines

2. **Search cards by text:**
   ```typescript
   // In analyze-unmatched-overrides.ts or similar
   const cards = loadCanonicalCards();
   const searchTerm = "NOW IT'S A PARTY";
   const matches = Object.values(cards).filter(card => 
     card.rulesText?.includes(searchTerm)
   );
   ```

2. **Compare normalized texts:**
   ```typescript
   const cardText = "NOW IT'S A PARTY For each character...";
   const keyText = "NOW IT'S A PARTY For each character...";
   
   const cardPattern = normalizeForMatching(cardText);
   const keyPattern = normalizeForMatching(keyText);
   
   console.log("Match?", cardPattern === keyPattern);
   console.log("Card:", cardPattern);
   console.log("Key: ", keyPattern);
   ```

3. **Find character differences:**
   ```typescript
   function findDifferences(str1: string, str2: string): void {
     const len = Math.max(str1.length, str2.length);
     for (let i = 0; i < len; i++) {
       if (str1[i] !== str2[i]) {
         console.log(`Diff at ${i}: "${str1[i]}" vs "${str2[i]}"`);
         console.log(`Context: "${str1.substring(i-10, i+10)}" vs "${str2.substring(i-10, i+10)}"`);
         break;
       }
     }
   }
   ```

## Success Criteria

The investigation is complete when:

1. ✅ All cards that exist in the dataset are matched
2. ✅ All formatting differences are handled by normalization
3. ✅ Manual override keys are updated to match actual card text (if needed)
4. ✅ Invalid entries (no corresponding cards) are identified and documented
5. ✅ Match rate increases from 17% to maximum possible (likely 30-50% based on dataset coverage)

## Expected Outcomes

After completing this investigation:

- **Best case**: 30-50 cards matched (if most cards exist but have formatting differences)
- **Realistic case**: 25-35 cards matched (some cards missing, some formatting issues)
- **Worst case**: 17-20 cards matched (most cards actually missing from dataset)

The goal is to identify and fix all cases where cards exist but don't match due to formatting differences.

