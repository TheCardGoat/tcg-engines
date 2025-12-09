# Card Text Normalization Improvements

## Summary of Changes

Successfully implemented two major improvements to the card text generation process:

1. **Ability Name Removal** - Strips ALL CAPS ability names from card text
2. **Activation Cost Removal** - Removes activation cost prefixes from abilities

## Impact

- **Original**: 1,552 unique text entries
- **After Ability Name Removal**: 1,433 unique text entries (-119 entries, 7.7% reduction)
- **After Activation Cost Removal**: 1,394 unique text entries (-39 additional, 2.7% reduction)
- **Total Reduction**: 158 entries removed (10.2% consolidation)

## Examples of Transformations

### Ability Names Removed

| Before | After |
|--------|-------|
| `"BLESSURE AU COMBAT This character enters play with {d} damage."` | `"This character enters play with {d} damage."` |
| `"I SUMMON THEE {E} − Draw a card."` | `"{E} − Draw a card."` |
| `"UNWIND Your other characters gain Resist +{d}"` | `"Your other characters gain Resist +{d}"` |
| `"WHY DO WE EVEN HAVE THAT LEVER? When you play..."` | `"When you play..."` |
| `"NOW IT'S A PARTY For each character..."` | `"For each character..."` |

### Activation Costs Removed

| Before | After |
|--------|-------|
| `"{E} − Draw a card."` | `"Draw a card."` |
| `"{E}, {d} {I} − Gain {d} lore."` | `"Gain {d} lore."` |
| `"{E}, Banish this item - Choose one:"` | `"Choose one:"` |
| `"{E} − Name a card, then reveal..."` | `"Name a card, then reveal..."` |
| `"{E}, {d} {I} – Look at the top card..."` | `"Look at the top card..."` |

### Combined Effect

| Original | Final |
|----------|-------|
| `"I SUMMON THEE {E} − Draw a card."` | `"Draw a card."` |
| `"KNOWLEDGE {E}, {d} {I} − Gain {d} lore."` | `"Gain {d} lore."` |
| `"SHAPESHIFT {E}, {d} {I} – Choose one:"` | `"Choose one:"` |

## Implementation Details

### 1. Ability Name Removal (`removeAbilityName()`)

Detects and removes two types of ability name prefixes:

**Static Abilities:**
```regex
/^[A-Z][A-Z\s!?',.-]+(?=(?:This|Your|When|While|Whenever|If|During|At|Each|For|Chosen|All|Only|Opposing|Damage|Characters|Banish|Return|Remove|Deal|Draw|Gain|Lose|Ready|Exert|Put|Play|Move|Reveal|Search|Look|Shuffle|Name)\b)/
```

**Activated Abilities:**
```regex
/^[A-Z][A-Z\s!?',.-]+(?=\{[EI]\})/
```

### 2. Activation Cost Removal (`removeActivationCost()`)

Removes activation cost patterns from the start of abilities:

```regex
/^(\{E\}\s*,?\s*(\{d\}\s*\{I\}\s*,?\s*)*(\{d\}\s*\{I\}\s*)?(Banish [^-−–]+)?)\s*[-−–]\s*/
```

Handles:
- Simple exert costs: `{E}`
- Exert with ink: `{E}, {d} {I}`
- Exert with banish: `{E}, Banish this item`
- Various dash types: `−`, `–`, `-`

### 3. Processing Pipeline

```typescript
function normalizeAbilityText(text: string): string {
  let normalized = text;
  
  // 1. Remove ability names first
  normalized = removeAbilityName(normalized);
  
  // 2. Remove activation costs second
  normalized = removeActivationCost(normalized);
  
  // 3. Continue with other normalization...
  // (remove formatting, normalize quotes, etc.)
  
  return normalized;
}
```

## Benefits

1. **Better Pattern Matching** - Focuses on actual game mechanics rather than flavor text
2. **Reduced Redundancy** - Similar abilities with different names/costs consolidate into single patterns
3. **Easier Analysis** - Pattern extraction becomes more meaningful
4. **Cleaner Data** - More consistent structure across all abilities

## Edge Cases Handled

### Ability Names
- ✅ Punctuation: `"IT'S UP TO YOU, LILO"`, `"DON'T GET ANY IDEAS"`
- ✅ Questions: `"WHY DO WE EVEN HAVE THAT LEVER?"`
- ✅ French names: `"BLESSURE AU COMBAT"`, `"SACREBLEU!"`
- ✅ Multi-word: `"SUPERNATURAL VENGEANCE"`, `"REMARKABLE POWER"`
- ✅ Trigger word "For": `"NOW IT'S A PARTY For each..."`

### Activation Costs
- ✅ Simple exert: `{E}`
- ✅ Exert + ink: `{E}, {d} {I}`
- ✅ Exert + banish: `{E}, Banish one of your items`
- ✅ Multiple dash types: `−` (U+2212), `–` (U+2013), `-` (U+002D)

## Verification

### Ability Names
```bash
# Check for remaining ALL CAPS patterns before common words
grep -E '^  "[A-Z][A-Z\s!,-]{8,}(This|Your|When|While|Whenever)' all-lorcana-texts.ts
# Result: No matches found ✓
```

### Activation Costs
```bash
# Check for remaining activation cost patterns
grep -E '^  "\{E\}' all-lorcana-texts.ts
# Result: No matches found ✓
```

## Configuration

Both features are automatically enabled in the generation pipeline. To disable them, comment out the respective function calls in `normalizeAbilityText()`.

## Future Enhancements

Possible improvements:
- [ ] Track mappings of removed ability names for debugging
- [ ] Add option to preserve ability names if needed for specific analysis
- [ ] Create reverse mapping from normalized text back to original
- [ ] Handle more complex compound abilities with multiple costs
- [ ] Support for other cost types (e.g., discard costs, damage costs)

## Related Files

- `generate.ts` - Main generation script with normalization functions
- `all-lorcana-texts.ts` - Generated output file
- `ABILITY_NAME_REMOVAL.md` - Detailed documentation on ability name removal
- `README.md` - Updated with new features

## Generated On

October 24, 2025

