# Effect, Targeting, and Text Parser Redesign Plan

> **Goal:** Redesign Effect modeling, Targeting DSL, and Text Parser logic to correctly represent conditions, restrictions, costs, structured actions, and complex targeting in Gundam card effects.

**Primary Files:**
- `packages/gundam-types/src/cards/card-types.ts` → Effect & Action schema
- `packages/gundam-types/src/targeting/gundam-target-dsl.ts` → Targeting DSL
- `packages/gundam-cards/tools/parser/text-parser.ts` → Text parsing & extraction

---

## 🚨 Problem Statement

The current system fails to correctly model:

- Usage restrictions (e.g., *Once per Turn*)
- Activation costs
- Conditional branching effects
- Structured targeting
- Reusable action primitives
- Keyword vs constant effect separation

As a result, many effects fall back to `CUSTOM`, losing semantic meaning and making engine execution impossible or unreliable.

### Example Failure

**Card Text:**
> `【Activate･Action】 【Once per Turn】Choose 1 Unit. It recovers 1 HP.`

**Current Parsed Effect:**
```ts
{
  type: "ACTIVATED",
  timing: "ACTION",
  action: {
    type: "HEAL",
    parameters: {
      target: { type: "self" },
      amount: 1
    }
  }
}
```

**Issues:**
- ❌ Missing "Once per Turn" restriction
- ❌ Target incorrectly set to `self`
- ❌ No representation of "Choose 1 Unit"

---

## 🎯 Design Goals

1. All rule-relevant information must be structurally represented (not left in `text`)
2. Targeting must be expressive and composable
3. Actions must be reusable primitives
4. Restrictions and costs must be first-class concepts
5. Keywords must not duplicate constant effects
6. Parser must extract structured meaning, not just keywords

---

## 🔴 Key Problems to Solve

### 1. Conditions, Restrictions, and Costs Are Not Modeled

**Missing Concepts:**
- Once per turn
- Phase limits
- State requirements (if you have no Units, etc.)
- Activation costs (energy, discard, rest, etc.)

**Example:**
> `【Activate･Main】【Once per Turn】②：Deploy 1 Gundam if...`

**Current Issues:**
- No place to store:
  - usage limits
  - activation cost
  - conditional branches

#### Required Schema Additions

Effect should include:

```ts
interface Effect {
  timing: Timing;
  type: "TRIGGERED" | "ACTIVATED" | "CONSTANT";
  restrictions?: Restriction[];
  costs?: Cost[];
  conditions?: Condition[];
  action: Action | ConditionalAction;
}
```

---

### 2. Keyword Effects Are Duplicated as Constant Effects

**Current Output:**
- `keywords: [Blocker]`
- AND an effect that repeats Blocker text

**Problem:**
- Keyword rules already define behavior
- Constant effect should only contain non-keyword rules

#### Required Behavior

Parser must:
- Extract `<Blocker>` into keyword list
- Remove keyword reminder text from effect body
- Only keep **non-keyword mechanical text** in effects

---

### 3. Action System Is Too Limited

Most effects fall back to:

```ts
{ type: "CUSTOM", text: "..." }
```

#### Required Action Primitives

Introduce structured actions such as:

```ts
type Action =
  | HealAction
  | RestAction
  | DeployAction
  | DrawAction
  | DestroyAction
  | AddToHandAction
  | ModifyStatsAction
  | CreateTokenAction
  | SequenceAction
  | ConditionalAction;
```

Example:

```ts
{
  type: "REST",
  target: TargetQuery
}
```

---

### 4. Targeting DSL Is Too Weak

Currently cannot express:

- enemy vs friendly
- attribute filters (eg. (HP, AP) ≤ 2)
- counts (choose up to N)
- zones

#### Required Target DSL

Target must support:

```ts
TargetQuery {
  controller: "SELF" | "OPPONENT" | "ANY";
  cardType?: "UNIT" | "PILOT" | "BASE";
  filters?: Filter[];
  count: { min: number; max: number };
  zone?: Zone;
}
```

**Example:**
> Choose 1 enemy Unit with 2 or less HP

```ts
{
  controller: "OPPONENT",
  cardType: "UNIT",
  filters: [{ field: "HP", op: "lte", value: 2 }],
  count: { min: 1, max: 1 }
}
```

---

## 🧠 Parser Redesign Strategy

### Parsing Must Be Multi-Stage

#### Stage 1 — Text Normalization
- Remove reminder text
- Normalize separators
- Standardize phrasing patterns

#### Stage 2 — Header Extraction
Extract:
- timing (`Activate･Main`)
- usage limits (`Once per Turn`)
- costs (`②:`)

#### Stage 3 — Target Detection
Detect patterns:
- "Choose X ..."
- "All Units"
- "This Unit"

Map into `TargetQuery`

#### Stage 4 — Action Mapping
Match verbs:
- recover → HEAL
- rest → REST
- deploy → DEPLOY
- add to hand → ADD_TO_HAND

Allow multi-step effects:

```ts
SequenceAction {
  steps: Action[]
}
```

#### Stage 5 — Conditional Branch Parsing

Example:

> if you have no Units... if you have only 1... otherwise...

Parse into:

```ts
ConditionalAction {
  branches: [{ condition, action }]
}
```

---

## 🛠 Architectural Changes Required

### card-types.ts

Add:

- Restriction models
- Cost models
- Conditional actions
- Sequenced actions
- Expanded Action union

---

### gundam-target-dsl.ts

Add:

- Attribute filters
- Zone filters
- Count constraints
- Controller scoping
- Target groups

---

### text-parser.ts

Refactor into pipeline:

```ts
normalizeText()
extractHeaders()
extractCosts()
parseTargets()
parseActions()
parseConditions()
assembleEffect()
```

Each stage must be unit-testable.

---

## 🤖 AI Agent Task Breakdown

### Phase 1 — Coverage Validation Script

Create:
`validate-parser-coverage.ts`

Steps:
1. Load all card JSON
2. Extract raw effect text
3. Run parser
4. Classify results:
   - structured
   - partially structured
   - custom fallback
5. Generate JSON + console summary

Goal: identify top failure patterns.

---

### Phase 2 — Schema Refactor Agent

Agent Tasks:
1. Propose new Effect / Action / Target schema
2. Apply changes to:
   - `card-types.ts`
   - `gundam-target-dsl.ts`
3. Update affected type consumers
4. Generate migration notes

---

### Phase 3 — Parser Refactor Agent

Agent Workflow:
1. Implement multi-stage pipeline
2. Add rule-based pattern extraction
3. Map verbs to actions
4. Add targeting grammar
5. Preserve fallback only when unavoidable

Deliverables:
- New parser modules per stage
- Unit tests per stage

---

### Phase 4 — Regression Test Generator Agent

Agent Tasks:
1. For each card:
   - assert no CUSTOM action
   - assert no missing targeting when required
2. Snapshot parsed output
3. Flag regressions

---

### Phase 5 — Manual Override Reduction

Goal:
- Reduce manual overrides to only:
  - templated rules
  - weird edge cases

Agent Tasks:
1. Identify which overrides are now obsolete
2. Remove them
3. Replace with parser rules

---

## 📚 Reference Rule Sources (Authoritative)

Use these files as **rules truth**:

| File | Purpose |
|--------|--------|
| `packages/gundam-engine/docs/rules/04-essential-terminology/full.md` | Official term definitions |
| `packages/gundam-engine/docs/rules/09-effect-activation-and-resolution/full.md` | Activation, costs, timing |
| `packages/gundam-engine/docs/rules/11-keyword-effects-and-keywords/keyword-effects.md` | Keyword mechanics |
| `packages/gundam-engine/docs/rules/11-keyword-effects-and-keywords/keywords.md` | Keyword definitions |

Parser and schema must reflect these rules explicitly.

---

## ✅ Success Criteria

Parser is considered acceptable when:

- ≥ 95% of effects contain structured actions
- ≥ 95% of effects contain structured targeting when applicable
- No keyword reminder text appears in effects
- Restrictions and costs are always extracted when present
- Conditional branching is represented structurally
- `CUSTOM` is only used for truly unique effects

---

## ⚠ Non-Goals

- Natural language understanding
- ML-based parsing
- Runtime rule resolution
- UI formatting

This is **deterministic rules-based parsing only**.
