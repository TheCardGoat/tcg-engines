# Section 11: Keyword Effects and Keywords - Summary

> **Navigation:** [Full Section](./full.md) | [Keyword Effects](./keyword-effects.md) | [Keywords](./keywords.md)

## Overview

Section 11 defines two distinct types of special game mechanics in the Gundam Card Game:

1. **Keyword Effects** - Displayed in angle brackets like `<Repair>` or `<Blocker>`
2. **Keywords** - Displayed in square brackets like `【Deploy】` or `【Burst】`

These mechanics provide shorthand notation for frequently used game effects and triggered abilities, making card text more concise and gameplay more consistent.

---

## Keyword Effects (Angle Brackets)

Keyword effects are special abilities that appear in angle brackets `<>` on cards. They represent ongoing or conditional effects that modify how Units interact in combat and gameplay.

### The 6 Keyword Effects

1. **`<Repair>`** - Recovers HP at the end of your turn
2. **`<Breach>`** - Deals damage to enemy shield area when destroying Units
3. **`<Support>`** - Grants AP bonus to another friendly Unit when rested
4. **`<Blocker>`** - Intercepts attacks by changing attack targets
5. **`<First Strike>`** - Deals battle damage before the enemy
6. **`<High-Maneuver>`** - Prevents enemy `<Blocker>` effects from activating

**See:** [keyword-effects.md](./keyword-effects.md) for complete rules on all angle-bracket keyword effects.

---

## Keywords (Square Brackets)

Keywords are special markers that appear in square brackets `【】` on cards. They define when and how card effects activate during gameplay.

### The 12 Keywords

#### Activated Effects
1. **`【Activate･Main】`** - Activated effect usable during main phase
2. **`【Activate･Action】`** - Activated effect usable during action steps

#### Command Timing
3. **`【Main】`** - Command card playable during main phase
4. **`【Action】`** - Command card playable during action steps

#### Triggered Effects
5. **`【Burst】`** - Triggers when Shield is destroyed and revealed
6. **`【Deploy】`** - Triggers when Unit/Base enters the battle area
7. **`【Attack】`** - Triggers when Unit declares an attack
8. **`【Destroyed】`** - Triggers when Unit/Base is destroyed

#### Pilot-Related
9. **`【When Paired】`** - Triggers when Pilot pairs with Unit
10. **`【During Pair】`** - Constant effect while Pilot is paired
11. **`【Pilot】`** - Indicates Pilot qualifications

#### Restrictions
12. **`【Once per Turn】`** - Limits effect to one activation per turn

**See:** [keywords.md](./keywords.md) for complete rules on all square-bracket keywords.

---

## Key Distinctions

### Keyword Effects vs Keywords

| Feature | Keyword Effects `<>` | Keywords `【】` |
|---------|---------------------|---------------|
| **Display** | Angle brackets | Square brackets |
| **Type** | Combat/gameplay abilities | Timing/trigger indicators |
| **Examples** | `<Repair>`, `<Blocker>` | `【Deploy】`, `【Burst】` |
| **Stacking** | Some stack by adding amounts | Each activates independently |
| **Duration** | Persistent on card | Defines when effect occurs |

### Stacking Rules

**Keyword Effects:**
- `<Repair>`, `<Breach>`, and `<Support>` **do stack** - amounts are added together
  - Example: `<Repair 1>` + `<Repair 2>` = `<Repair 3>`
- `<Blocker>`, `<First Strike>`, and `<High-Maneuver>` **do not stack** - duplicates have no effect

**Keywords:**
- `【Once per Turn】` limits individual card effects
- Multiple cards with same `【Once per Turn】` effect can each activate once

---

## Subsection Structure

Section 11 is organized into two major subsections:

### 11-1. Keyword Effects
Six subsections (11-1-1 through 11-1-6) covering each angle-bracket keyword effect:
- 11-1-1. `<Repair>`
- 11-1-2. `<Breach>`
- 11-1-3. `<Support>`
- 11-1-4. `<Blocker>`
- 11-1-5. `<First Strike>`
- 11-1-6. `<High-Maneuver>`

### 11-2. Keywords
Twelve subsections (11-2-1 through 11-2-12) covering each square-bracket keyword:
- 11-2-1. `【Activate･Main】`
- 11-2-2. `【Activate･Action】`
- 11-2-3. `【Main】`
- 11-2-4. `【Action】`
- 11-2-5. `【Burst】`
- 11-2-6. `【Deploy】`
- 11-2-7. `【Attack】`
- 11-2-8. `【Destroyed】`
- 11-2-9. `【When Paired】`
- 11-2-10. `【During Pair】`
- 11-2-11. `【Pilot】`
- 11-2-12. `【Once per Turn】`

---

## Quick Reference by Effect Type

### Combat Effects
- **Offensive:** `<Breach>`, `<First Strike>`, `<High-Maneuver>`, `【Attack】`
- **Defensive:** `<Repair>`, `<Blocker>`, `【Burst】`
- **Support:** `<Support>`, `【When Paired】`, `【During Pair】`

### Timing Effects
- **Main Phase Only:** `【Activate･Main】`, `【Main】`
- **Action Step Only:** `【Activate･Action】`, `【Action】`
- **Any Time:** Effect-specific (see individual keywords)

### Entry/Exit Effects
- **Enters Play:** `【Deploy】`, `【When Paired】`
- **Leaves Play:** `【Destroyed】`
- **While Present:** `【During Pair】`, `<Repair>`, `<Blocker>`

---

## Cross-References

### Related Sections
- **Section 7 (Attacking and Battles)** - Where combat keyword effects apply
  - 7-4. Block Step - `<Blocker>` activation
  - 7-6. Damage Step - `<First Strike>`, `<Breach>` resolution
- **Section 8 (Action Steps)** - Where `【Action】` and `【Activate･Action】` activate
- **Section 9 (Effect Activation)** - General effect rules
  - 9-1-6. Triggered Effects - How `【Deploy】`, `【Destroyed】`, etc. work
  - 9-1-7. Activated Effects - How `【Activate･Main】` and `【Activate･Action】` work

### Keyword Effect References
These keyword effects are referenced throughout the rules:
- `<Blocker>` referenced in 7-4-1, 11-1-6-1
- `<First Strike>` referenced in 7-6-2-3-2, 7-6-3-2-2
- `<Repair>` affects end step in 6-6-3
- `<Breach>` affects shield area damage

---

## Usage Notes

### For Players
- Keyword effects are persistent abilities - they remain active while the card is in play
- Keywords indicate timing or trigger conditions - they tell you when effects activate
- Check stacking rules when multiple effects of the same type apply
- `【Once per Turn】` applies per card, not per effect name

### For Rules Implementation
- Keyword effects create continuous or triggered abilities
- Keywords define activation windows and conditions
- Some keywords (like `【Burst】`) are optional - player chooses whether to activate
- `【Destroyed】` effects activate from the trash after the card moves there

---

## Complete Documentation

For comprehensive rules text with all numbered subsections, examples, and detailed interactions:

**→ [View Full Section 11 (full.md)](./full.md)**

For focused reference on specific types:
- **→ [Keyword Effects Reference (keyword-effects.md)](./keyword-effects.md)** - All 6 angle-bracket effects
- **→ [Keywords Reference (keywords.md)](./keywords.md)** - All 12 square-bracket keywords

---

*This summary provides navigable overview of Section 11. Refer to full.md for official rule text and complete examples.*
