# Parser Coverage Improvement Plan - Phase 2

## Current State

**Coverage: 20.49% (318/1552 texts)**
**Performance: 30.64ms for all 1552 texts (excellent)**

### Successfully Parsing:
- Keywords: 18 (Rush, Ward, Shift variants, etc.)
- Triggered: 117 (basic "When you play this item, draw a card")
- Activated: 11 (basic "{E} - effect")
- Static: 131 (some basic patterns)
- Action: 41 (simple standalone effects)

### Top Failure Categories (from test output):
1. **"Effect type 'optional' is not a valid static effect"** (74 cases) - Triggered with "you may"
2. **"Could not parse trigger from text"** (57 cases) - Missing trigger patterns
3. **"Effect type 'draw' is not a valid static effect"** (12 cases) - Activated misclassified
4. **"Effect type 'ready' is not a valid static effect"** (11 cases) - Static ability issues
5. **"Could not parse effect: 'gain {d} lore.'"** (10 cases) - {d} placeholder in effects

---

## Phase 2: Systematic Coverage Improvement

### Guiding Principles
1. **Simple patterns first** - Maximum impact with minimum complexity
2. **Fix classification before patterns** - Many failures are misclassification
3. **{d} placeholder everywhere** - Critical fix affecting many patterns
4. **No complex abilities yet** - Leave "for each", "choose one", multi-effect for Phase 3

---

## Task Groups

### Task Group 2.1: Fix {d} Placeholder Handling (HIGH PRIORITY)
**Impact: ~50+ texts | Complexity: LOW**

Currently the parser handles `{d}` in keywords but NOT in effect patterns.

**Files to modify:**
- `parser/patterns/effects.ts`

**Changes:**
1. Update GAIN_LORE_PATTERN: `/[Gg]ain (\d+|\{d\}) lore/`
2. Update LOSE_LORE_PATTERN to handle `{d}`
3. Update DEAL_DAMAGE_PATTERN to handle `{d}`
4. Update REMOVE_DAMAGE_PATTERN to handle `{d}`
5. Update PUT_DAMAGE_PATTERN to handle `{d}`
6. Update DRAW_AMOUNT_PATTERN to handle `{d}`
7. Update STAT_MODIFIER_PATTERN: `/gets? ([+-]?\d+|\{d\}|\+\{d\}|-\{d\}) \{([SWL])\}/`

**Effect parser changes:**
- In `parseAtomicEffect()`, when parsing amounts, convert `{d}` to a placeholder value (e.g., -1 or "variable")

**Tests:**
- "Gain {d} lore." → success
- "Deal {d} damage to chosen character." → success
- "Draw {d} cards." → success
- "Chosen character gets +{d} {S} this turn." → success

---

### Task Group 2.2: Fix Ability Classification (HIGH PRIORITY)
**Impact: ~100+ texts | Complexity: MEDIUM**

Many abilities are being misclassified as "static" when they should be "triggered" or "activated".

**Files to modify:**
- `parser/classifier.ts`

**Issue 1: Triggered abilities with effects returning as static**
```
"IT WORKS! Whenever you play an item, you may draw a card."
→ Being classified as static because of "effect type 'optional' is not a valid static effect"
```

**Fix: Improve classification priority order:**
1. Check for triggered indicators FIRST (When, Whenever, At the start/end of)
2. Check for activated indicators ({E}, cost patterns)
3. Check for keywords (exact matches)
4. Only then fall back to static

**Issue 2: Named abilities confusing classifier**
```
"FRESH INK When you play this item, draw a card."
→ Name extraction should happen BEFORE classification
```

**Files to modify:**
- `parser/preprocessor.ts` - Extract name first
- `parser/classifier.ts` - Classify on text AFTER name removed

---

### Task Group 2.3: Expand Trigger Patterns (HIGH PRIORITY)
**Impact: ~57+ texts | Complexity: MEDIUM**

**Files to modify:**
- `parser/patterns/triggers.ts`
- `parser/parsers/triggered-parser.ts`

**Missing trigger patterns (from error analysis):**

| Pattern | Example |
|---------|---------|
| "Whenever you play a card" | "YOUR REWARD AWAITS Whenever you play a card, draw a card." |
| "Whenever an opponent plays X" | "FINE PRINT Whenever an opponent plays a song, you may draw a card." |
| "Whenever you play a [Type] character" | "SHAMELESS PROMOTER Whenever you play a Hero character, gain {d} lore." |
| "Whenever this character is challenged" | "TEA PARTY Whenever this character is challenged, you may draw a card." |
| "Whenever you play an action" | "WAYFINDING Whenever you play an action, gain {d} lore." |
| "Whenever you play an item" | "IT WORKS! Whenever you play an item, you may draw a card." |
| "Whenever you play a song" | "FAN FAVORITE Whenever you play a song, gain {d} lore." |
| "When this character is banished" | "FLY, MY PET! When this character is banished, you may draw a card." |
| "Whenever this character quests" | "DARK KNOWLEDGE Whenever this character quests, you may draw a card." |

**Add trigger event types:**
- `play-card` (any card)
- `play-character-type` (with characterType filter)
- `play-action`
- `play-item`
- `play-song`
- `opponent-plays-card`
- `opponent-plays-song`
- `this-challenged`

---

### Task Group 2.4: Fix Optional Effects in Triggered Abilities (MEDIUM PRIORITY)
**Impact: ~74 texts | Complexity: MEDIUM**

**Problem:** "you may" effects in triggered abilities fail with "Effect type 'optional' is not a valid static effect"

**Root cause:** The triggered parser is treating "you may draw a card" as an invalid effect type.

**Files to modify:**
- `parser/parsers/triggered-parser.ts`
- `parser/parsers/effect-parser.ts`

**Fix:**
1. In triggered parser, pass effect text to effect parser
2. Effect parser already handles "you may" → returns OptionalEffect
3. OptionalEffect should be valid for triggered abilities

**Test cases:**
- "Whenever you play an item, you may draw a card." → TriggeredAbility with OptionalEffect
- "When this character is banished, you may draw a card." → TriggeredAbility with OptionalEffect

---

### Task Group 2.5: Simple Standalone Action Effects (MEDIUM PRIORITY)
**Impact: ~100+ texts | Complexity: LOW**

Many action cards have standalone effect text that should parse as "action" type abilities.

**Already parsing:**
- "Draw {d} cards."
- "Gain {d} lore."
- "Deal {d} damage to chosen character."
- "Banish chosen character."

**Need to add:**
| Pattern | Example |
|---------|---------|
| Chosen player draws | "Chosen player draws {d} cards." |
| Each player draws | "Each player draws a card." |
| Each opponent loses lore | "Each opponent loses {d} lore." |
| Banish all X | "Banish all items.", "Banish all characters." |
| Ready chosen X | "Ready chosen item.", "Ready chosen character." |
| Return X to hand | "Return chosen character to their player's hand." |
| Return from discard | "Return an item card from your discard to your hand." |
| Chosen character gains | "Chosen character gains Rush this turn." |
| Chosen character gets | "Chosen character gets +{d} {S} this turn." |
| Remove damage | "Remove up to {d} damage from chosen character." |
| Put damage | "Put {d} damage counter on chosen character." |

**Files to modify:**
- `parser/patterns/effects.ts` - Add/update patterns
- `parser/parsers/effect-parser.ts` - Handle new patterns
- `parser/parsers/action-parser.ts` - Improve standalone effect parsing

---

### Task Group 2.6: Simple Static Ability Patterns (MEDIUM PRIORITY)
**Impact: ~50+ texts | Complexity: MEDIUM**

**Already parsing some, but missing:**

| Pattern | Example |
|---------|---------|
| "can't be challenged" | "HIDDEN AWAY This character can't be challenged." |
| "can't challenge" | "WAR WOUND This character cannot challenge." |
| "enters play exerted" | "ASLEEP This item enters play exerted." |
| "Your X gain Y" | "GOOD ADVICE Your other characters gain Support." |
| "Your X get +{d} {S}" | "Your characters get +{d} {S} this turn." |
| "Characters gain X while here" | "ISOLATED Characters gain Resist +{d} while here." |
| "can challenge ready characters" | "BLADES This character can challenge ready characters." |

**Files to modify:**
- `parser/patterns/effects.ts`
- `parser/parsers/static-parser.ts`

---

### Task Group 2.7: Named Ability Extraction Improvement (LOW PRIORITY)
**Impact: ~150+ texts | Complexity: LOW**

Named abilities follow pattern: `NAME Effect`
where NAME is ALL CAPS (may include spaces, apostrophes, punctuation).

**Current pattern may not handle:**
- Names with numbers: "{d},{d} MEDICAL PROCEDURES"
- Names with special chars: "SHAPESHIFT", "BUGLE CALL"

**Files to modify:**
- `parser/preprocessor.ts`

**Improved pattern:**
```typescript
// Match ALL CAPS name at start, allowing numbers, spaces, punctuation
const NAMED_ABILITY_PATTERN = /^([A-Z][A-Z0-9\s',!?.-]+?)\s+(?=When|Whenever|This|Your|\{E\}|At the|During|While)/;
```

---

### Task Group 2.8: Activated Ability Improvements (LOW PRIORITY)
**Impact: ~30+ texts | Complexity: MEDIUM**

**Currently parsing:**
- Basic "{E} - effect"

**Need to improve:**
- Cost with ink: "{E}, {d} {I} - effect"
- Multiple costs: "{E}, {d} {I}, Banish this item - effect"
- Named activated: "NAME {E} - effect"

**Files to modify:**
- `parser/patterns/costs.ts`
- `parser/parsers/activated-parser.ts`

---

## Implementation Order

```
Phase 2.1: {d} Placeholder (1-2 hours)
    │
    └──→ Phase 2.2: Classification Fix (2-3 hours)
              │
              ├──→ Phase 2.3: Trigger Patterns (2-3 hours)
              │
              └──→ Phase 2.4: Optional Effects (1-2 hours)
                        │
                        └──→ Phase 2.5: Action Effects (2 hours)
                                  │
                                  └──→ Phase 2.6: Static Patterns (2 hours)
                                            │
                                            └──→ Phase 2.7: Named Extraction (1 hour)
                                                      │
                                                      └──→ Phase 2.8: Activated (2 hours)
```

---

## Expected Coverage After Phase 2

| Category | Current | Expected |
|----------|---------|----------|
| Keywords | 18 | 18 (no change) |
| Triggered | 117 | ~350 |
| Activated | 11 | ~60 |
| Static | 131 | ~180 |
| Action | 41 | ~150 |
| **Total** | **318 (20%)** | **~750 (48%)** |

---

## Phase 3 (Future): Complex Patterns

Leave for later:
- "Choose one:" effects
- "for each" scaling effects
- Multi-sentence composite effects
- Conditional "if X, Y" effects
- Replacement abilities ("If X would Y, Z instead")

---

## Success Metrics

1. **Coverage target: 45%+** (from 20%)
2. **Zero regressions** - All currently passing tests must still pass
3. **Performance maintained** - Under 50ms for all 1552 texts
4. **Type safety** - No TypeScript errors
