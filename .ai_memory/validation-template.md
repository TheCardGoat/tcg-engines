# Validation: [Card Name] - [Set]-[Number]

## Metadata
- **Card**: [Card Name]
- **Type**: [character/action/item/location]
- **Set**: [TFC/RoF/ItI/SSK/URR/006/007/008/009/010/011]
- **Card Number**: [XXX]
- **Complexity**: [Low/Medium/High]
- **Cost**: [N]
- **Colors**: [amber/amethyst/emerald/ruby/sapphire/steel]
- **Characteristics**: [storyborn/dreamborn/floodborn/inkborn/hero/villain/princess/sorcerer/...]
- **Strength**: [N] (characters only)
- **Willpower**: [N] (characters/locations)
- **Lore**: [N] (characters/locations)
- **Move Cost**: [N] (locations only)

## Existing Implementation

**Path**: `packages/lorcana-engine/src/cards/[SET]/[TYPE]/[card].ts`

```typescript
// Paste existing lorcanito implementation here
import { CardName } from "@lorcanito/lorcana-engine/cards/[SET]";
```

## Card Text

> **[ABILITY NAME]** [Full card text from official source]

**Abilities Count**: [N]
**Effect Types**: [list effect types found]
**Keywords**: [list keywords]

## Analysis Prompt

Analyze this card against the proposed greenfield rewrite Plan A.

**Type System Analysis:**
- How should this card be represented in Plan A's type system?
- What `Card` subtype applies?
- What `Ability` types are present?
- What `Effect` types are needed?
- Are there any gaps in Plan A's type system?

**Questions to Answer:**
1. What aspects of Plan A work well for this card?
2. What type system gaps or missing features were discovered?
3. What concrete improvements to Plan A would you suggest?
4. Are there new types or patterns needed to properly represent this card?
5. Does the proposed TestEngine API support testing this card?

## Findings

### Works Well
[Bullet points describing what aspects of Plan A work for this card]

### Issues Found
[Bullet points describing type system gaps, missing features, or representation issues]

### Suggested Improvements to Plan A
[Specific improvements to card types, ability types, effect types, or helper functions]

### New Types/Patterns Required
[Any new types, patterns, or helper functions that need to be added to Plan A]

## Implementation Notes

### Parser v2 Result
- **Parse Method**: [keyword/grammar/regex/manual]
- **Confidence**: [0-100%]
- **Issues**: [List any parsing problems or ambiguities]
- **Manual Override Required**: [Yes/No]

### Generated Code (Proposed)

```typescript
import { Targets, Effects, Conditions } from "@tcg/lorcana-types/domain/helpers";

export const [cardVariableName]: [CardType] = {
  type: "[card-type]",
  id: "[card-id]" as CardDefinitionId,
  name: "[Card Name]",
  title: "[Title]" as string | undefined,
  cost: [N] as InkCost,
  colors: ["[color]"] as CardColors,
  characteristics: [["[characteristic]", ...]] as const,
  text: "[Card text]",
  strength: [N] as CombatStat | undefined,
  willpower: [N] as CombatStat | undefined,
  lore: [N] as LoreValue | undefined,
  moveCost: [N] as InkCost | undefined,
  abilities: [
    // Abilities using helper functions
  ]
};
```

### Test Cases

```typescript
import { describe, it, expect } from "vitest";
import { TestEngine } from "@tcg/lorcana-engine/test";
import { [cardVariableName] } from "./[card-file]";

describe("[Card Name]", () => {
  it("should [ability description]", async () => {
    const engine = new TestEngine({
      hand: [[cardVariableName]],
      inkwell: [N],
    });

    await engine.playCard([cardVariableName]);

    // Assertions
  });
});
```

### Test Results
- [ ] Test passes
- [ ] Type check passes
- [ ] Format check passes
- [ ] Lint passes

## Recommendations

### For Plan A (Type System)
- [Specific type system improvements needed]

### For Plan B (Engine API)
- [Specific engine API improvements needed]

### For Parser v2
- [Parser improvements or new patterns needed]

## Learning Capture

### Pattern Categories
- [ ] **Trigger Pattern**: [e.g., "When you play this character"]
- [ ] **Cost Pattern**: [e.g., "Exert this character"]
- [ ] **Effect Pattern**: [e.g., "Draw 2 cards"]
- [ ] **Condition Pattern**: [e.g., "If you have 2 or more other characters"]
- [ ] **Duration Pattern**: [e.g., "This turn", "While in play"]
- [ ] **Targeting Pattern**: [e.g., "Chosen character", "Each opponent"]

### Frequency
- Is this pattern common? [Yes/No]
- Similar cards: [list similar card IDs]
- Recommended parser priority: [High/Medium/Low]

### Open Questions
[Any questions or ambiguities that need resolution]

---

## Status Checklist

- [ ] Validation document created
- [ ] Existing implementation located
- [ ] Card text verified
- [ ] Plan A type system analysis complete
- [ ] Findings documented
- [ ] Proposed implementation written
- [ ] Tests written
- [ ] Tests pass
- [ ] Learnings captured
- [ ] Recommendations for Plan A documented
- [ ] Recommendations for Plan B documented
- [ ] Parser feedback provided
