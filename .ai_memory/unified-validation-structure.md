# Unified Validation Structure for Lorcana Implementation

## Purpose

This document unifies two separate planning approaches into a single, consistent execution structure:
1. **Local Plan** (tcg-engines): Card implementation workflow with learning-driven development
2. **External Plan** (lorcanito): Type system validation and greenfield API design

**Validation Strategy**: For each card, implement the proposed card type and engine API, collect learnings, improve the plan, and move to the next card.

---

## Document Structure Overview

### Local Project Documents (tcg-engines)

| Document | Location | Purpose |
|----------|----------|---------|
| **Implementation Plan** | `.ai_memory/lorcana-implementation-plan.md` | High-level overview, TODO list |
| **Detailed Plan** | `.ai_memory/lorcana-implementation-plan-detailed.md` | Phase breakdown, weekly cycle |
| **Strategy** | `.ai_memory/lorcana-implementation-strategy.md` | Vision, objectives |
| **Tactics** | `.ai_memory/lorcana-implementation-tactics.md` | Daily workflow, commands |

### External Plan Documents (lorcanito)

| Document | Location | Purpose |
|----------|----------|---------|
| **Plan A** | `/Users/wazar/projects/lorcanito/packages/lorcana-engine-greenfield-rewrite-plan/plan-a/plan-a.md` | Type-safe API design |
| **Plan B** | `/Users/wazar/projects/lorcanito/packages/lorcana-engine-greenfield-rewrite-plan/plan-b/plan-b.md` | API redesign focus |
| **Pattern Validations** | `plan-a/simulation-draft/patterns/*.md` | Per-pattern analysis |
| **Card Validations** | `plan-a/simulation-draft/cards/*.md` | Per-card analysis |
| **Validation TODO** | `plan-a/validation-todo.md` | Cards to validate |

---

## Unified Execution Model

### Phase 0: Setup (One-Time)

1. **Create Memory Bank Log**
   ```bash
   cp .ai_memory/TEMPLATE.md .ai_memory/lorcana-validation-implementation.md
   ```

2. **Map Cards to Validate**
   - Cross-reference: `lorcana-sets-2-3-todo.md` (local) + `plan-a/validation-todo.md` (external)
   - Create unified card list with validation priority

3. **Initialize Subagents**
   - `batch-card-processor` - Process cards in batch
   - `parser-improver` - Analyze and improve parser
   - `pattern-matcher` - Find similar cards
   - `learning-aggregator` - Compile insights

---

## Per-Card Validation Workflow

### Step 1: Select Card

**Priority Order**: Actions → Items → Locations → Characters (cross-set)

For each card:
```bash
# Example: TFC-21 Stitch
export CARD_ID="TFC-21"
export CARD_NAME="stitch"
export CARD_TYPE="character"
```

### Step 2: Locate Reference Files

| File | Local Path | External Path |
|------|------------|---------------|
| Card Definition | `packages/lorcana-cards/src/cards/001/` | `lorcanito/packages/lorcana-engine/src/cards/TFC/` |
| Validation Template | `.ai_memory/validation-template.md` | `plan-a/simulation-draft/cards/TFC-21-stitch.md` |
| Pattern Reference | `packages/lorcana-cards/src/parser/v2/` | `plan-a/simulation-draft/patterns/` |

### Step 3: Create Validation Document

```bash
# Create validation document from template
cp .ai_memory/validation-template.md .ai_memory/validations/${CARD_ID}-${CARD_NAME}.md
```

**Validation Document Structure**:

```markdown
# Validation: [Card Name]

## Metadata
- **Card**: [Card Name]
- **Type**: [character/action/item/location]
- **Set**: [TFC/RoF/ItI]
- **Card Number**: [XXX]
- **Complexity**: [Low/Medium/High]
- **Cost**: [N]
- **Colors**: [amber/amethyst/...]
- **Characteristics**: [hero/villain/...]

## Existing Implementation

Path: `packages/lorcana-cards/src/cards/[SET]/[TYPE]/[card].ts`

```typescript
// Current implementation
```

## Card Text

> **[ABILITY NAME]** [Full card text]

## Analysis Prompt

Analyze this card against the proposed greenfield rewrite Plan A.

**Questions to Answer:**
1. How is this card represented in the proposed type system?
2. What aspects work well?
3. What type system gaps were discovered?
4. What improvements to Plan A are suggested?
5. Are there new types/patterns needed?

## Findings

### Works Well
-

### Issues Found
-

### Suggested Improvements
-

### New Types/Patterns Required
-

## Implementation Notes

### Parser v2 Result
- Parse method: [keyword/grammar/regex/manual]
- Confidence: [0-100%]
- Issues: -

### Generated Code
```typescript
// Generated card definition
```

### Test Results
```typescript
// Test cases and results
```

## Recommendations for Plan A
-

## Recommendations for Plan B
-
```

### Step 4: Analyze Against Plan A

Use Plan A type system to validate representation:

**Plan A Key Types**:
```typescript
// Card Types
type Card = CharacterCard | ActionCard | ItemCard | LocationCard;

// Ability Types
type Ability = ResolutionAbility | ActivatedAbility | StaticAbility | TriggeredAbility;

// Effect Types (68 total)
type Effect = PlayerEffect | CardEffect | KeywordEffect | RestrictionEffect | ...;
```

**Analysis Checklist**:
- [ ] Card type is properly represented
- [ ] All abilities have correct type mapping
- [ ] Effects are type-safe
- [ ] Targets are correctly specified
- [ ] Conditions are captured
- [ ] Keywords are handled

### Step 5: Implement Card

```bash
# Use lorcana-card-migrator
/skill lorcana-card-migration --card=${CARD_ID}

# Or manual implementation
vi packages/lorcana-cards/src/cards/${SET}/${TYPE}/${CARD_NAME}.ts
```

### Step 6: Write Tests

```bash
# Use lorcana-test-writer
/skill lorcana-test-generation --card=${CARD_ID}

# Verify tests
bun test packages/lorcana-cards/src/cards/${SET}/${TYPE}/${CARD_NAME}.test.ts
```

### Step 7: Run Quality Gates

```bash
# 1. Type check
bun run check-types

# 2. Format check
bun run format --check

# 3. Lint
bun run lint

# 4. Tests
bun test packages/lorcana-cards/src/cards/${SET}
```

### Step 8: Capture Learnings

Update the validation document with:
- Parser success/failure
- Type system gaps found
- New patterns discovered
- Implementation challenges

**Learning Categories**:
1. **Parser Learnings**: What did the parser handle well/poorly?
2. **Type System Learnings**: What types are missing or incomplete?
3. **Pattern Learnings**: What new ability/effect combinations were found?
4. **API Learnings**: What engine operations were needed?

### Step 9: Aggregate and Improve Plans

```bash
# After each batch (10 cards)
/skill learning-aggregator --period=batch

# Weekly improvement cycle
/skill parser-improver --priority=high
```

**Plan Updates**:
- Update Plan A with new types/patterns discovered
- Update Plan B with API gaps found
- Update parser v2 grammar/rules
- Document edge cases

---

## Progress Tracking

### Card-Level Status

| Card ID | Card Name | Type | Validation | Implementation | Tests | Parser | Plan A | Plan B |
|---------|-----------|------|------------|----------------|-------|--------|--------|--------|
| TFC-21  | Stitch    | Character | - | - | - | - | - | - |

**Status Codes**:
- `✓` Complete
- `⚠` Partial (with notes)
- `✗` Failed
- `-` Not started

### Batch-Level Tracking

After each batch (10 cards):
- Parser coverage %
- Manual override count
- Type system gaps discovered
- New patterns added

### Weekly Metrics

| Week | Cards Done | Parser % | Overrides | Plan A Updates | Plan B Updates |
|------|------------|----------|-----------|----------------|----------------|
| 1    | 10         | 40%      | 6         | 3 new types    | 2 API gaps     |

---

## File Structure

```
tcg-engines/
├── .ai_memory/
│   ├── lorcana-implementation-plan.md          # Local high-level plan
│   ├── lorcana-implementation-plan-detailed.md # Local detailed plan
│   ├── lorcana-validation-implementation.md    # THIS doc + daily log
│   ├── lorcana-sets-2-3-todo.md               # Card checklist
│   └── validations/                            # NEW: Per-card validations
│       ├── TFC-21-stitch.md
│       ├── TFC-25-be-our-guest.md
│       └── ...
├── packages/
│   └── lorcana-cards/
│       └── src/
│           ├── cards/
│           │   ├── 001/                        # Set 1 (reference)
│           │   ├── 002/                        # Set 2 (target)
│           │   └── 003/                        # Set 3 (target)
│           └── parser/
│               └── v2/
│                   ├── effects/
│                   ├── grammar/
│                   └── manual-overrides.ts
└── .claude/
    └── agents/
        ├── batch-card-processor.md
        ├── parser-improver.md
        ├── pattern-matcher.md
        └── learning-aggregator.md
```

---

## Validation Template

Save as `.ai_memory/validation-template.md`:

```markdown
# Validation: [Card Name] - [Set]-[Number]

## Metadata
- **Card**: [Card Name]
- **Type**: [character/action/item/location]
- **Set**: [TFC/RoF/ItI]
- **Card Number**: [XXX]
- **Complexity**: [Low/Medium/High]
- **Cost**: [N]
- **Colors**: [colors]
- **Characteristics**: [list]

## Existing Implementation

Path: `packages/lorcana-engine/src/cards/[SET]/[TYPE]/[card].ts`

```typescript
[Paste current implementation]
```

## Card Text

> **[ABILITY NAME]** [Full card text]

## Analysis Prompt

Analyze this card against the proposed greenfield rewrite Plan A.

**Questions:**
1. How is this card represented in Plan A type system?
2. What aspects work well?
3. What type system gaps were discovered?
4. What improvements to Plan A are suggested?
5. Are there new types/patterns needed?

## Findings

### Works Well
-

### Issues Found
-

### Suggested Improvements
-

### New Types/Patterns Required
-

## Implementation Notes

### Parser v2 Result
- Method: [keyword/grammar/regex/manual]
- Confidence: [0-100%]
- Issues: [list]

### Generated Code
```typescript
[Generated card definition]
```

### Test Results
```typescript
[Test cases and results]
```

## Recommendations

### For Plan A
-

### For Plan B
-

### For Parser v2
-
```

---

## Quick Reference Commands

### Per-Card Commands
```bash
# Start validation for a card
export CARD="TFC-21"
export NAME="stitch"
cp .ai_memory/validation-template.md .ai_memory/validations/${CARD}-${NAME}.md

# Find similar cards
/skill pattern-matcher "When you play this character, draw cards"

# Implement card
/skill lorcana-card-migration --card=${CARD}

# Generate tests
/skill lorcana-test-generation --card=${CARD}

# Run quality gates
bun run ci-check

# Commit
git add . && git commit -m "feat(lorcana): validate and implement ${CARD}"
```

### Batch Commands
```bash
# Process batch of 10 cards
/skill batch-card-processor --set=002 --type=action --count=10

# Aggregate learnings
/skill learning-aggregator --period=batch

# Improve parser
/skill parser-improver --priority=high
```

### Weekly Commands
```bash
# Generate weekly report
/skill learning-aggregator --report

# Update plans
vi .ai_memory/lorcana-implementation-plan.md
vi .ai_memory/lorcana-implementation-plan-detailed.md

# Run Gauntlet review
bun run gauntlet --sample --percent=20
```

---

## Success Criteria

### Per-Card
- [ ] Validation document created
- [ ] Card implemented in @tcg/lorcana-types format
- [ ] Tests pass (happy path)
- [ ] CI checks pass
- [ ] Parser result documented
- [ ] Type system gaps noted
- [ ] Learnings captured

### Per-Batch (10 cards)
- [ ] All cards implemented
- [ ] All tests pass
- [ ] Parser coverage tracked
- [ ] Patterns aggregated
- [ ] Plans updated with learnings

### Per-Phase
- [ ] All card types in phase complete
- [ ] Parser improved based on learnings
- [ ] Plan A updated with new types
- [ ] Plan B updated with API gaps
- [ ] Final report generated

---

## References

### Local Project
- **Plan**: `.ai_memory/lorcana-implementation-plan.md`
- **Details**: `.ai_memory/lorcana-implementation-plan-detailed.md`
- **Cards**: `packages/lorcana-cards/src/cards/`
- **Parser**: `packages/lorcana-cards/src/parser/v2/`

### External Project
- **Plan A**: `/Users/wazar/projects/lorcanito/packages/lorcana-engine-greenfield-rewrite-plan/plan-a/plan-a.md`
- **Plan B**: `/Users/wazar/projects/lorcanito/packages/lorcana-engine-greenfield-rewrite-plan/plan-b/plan-b.md`
- **Pattern Validations**: `plan-a/simulation-draft/patterns/*.md`
- **Card Validations**: `plan-a/simulation-draft/cards/*.md`

### Agent Reference
- **batch-card-processor**: `.claude/agents/batch-card-processor.md`
- **parser-improver**: `.claude/agents/parser-improver.md`
- **pattern-matcher**: `.claude/agents/pattern-matcher.md`
- **learning-aggregator**: `.claude/agents/learning-aggregator.md`
