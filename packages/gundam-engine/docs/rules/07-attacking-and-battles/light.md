# 7. Attacking and Battles - Summary

This section covers the complete combat system in Gundam Card Game, from declaring attacks to resolving damage and battle conclusion.

## Battle Overview

**Attack Initiation:**
- During your main phase, you may attack with your active Units
- Valid targets: opposing player OR a rested enemy Unit
- Attacking Unit must be active and becomes rested when declaring attack

**Battle Flow - Five Steps:**
1. Attack Step - Declare attack and trigger effects
2. Block Step - Opponent may activate <Blocker>
3. Action Step - Players alternate using 【Action】 effects
4. Damage Step - Deal damage to target
5. Battle End Step - Clean up and return to main phase

---

## 7-3. Attack Step

**Declaring the Attack:**
- Select one active Unit in your battle area and rest it
- Declare attack target (opponent or rested enemy Unit)
- Target is locked in (though may be changed by effects like <Blocker>)

**Effect Triggers:**
- 【When Attacking】 effects on the attacking Unit trigger
- "When a unit attacks" effects on other cards trigger
- Multiple effects trigger simultaneously
- Active player resolves their effects first, then standby player
- New effects triggered during resolution take priority

**"During This Battle" Effects:**
- Effects worded "during this battle" activate now
- These effects last through the entire battle sequence

**Continuing:**
- After all effects resolve, proceed to block step
- **Exception**: If attacking Unit or target is destroyed/moved, skip to battle end step

**Target Condition Check:**
- For effects with target conditions ("when you attack a player", "when you attack a Unit")
- Conditions checked during attack step based on originally selected target
- Target changes by effects don't affect this condition check

→ [Detailed Attack Step Rules](./attack-step.md)

---

## 7-4. Block Step

**<Blocker> Activation:**
- Standby player may activate <Blocker> on one active Unit
- Activating <Blocker> changes attack target to the blocking Unit
- Blocking Unit must be active and becomes rested

**<Blocker> Restrictions:**
- Can only be activated once per attack
- Originally targeted Unit cannot activate its own <Blocker>
- Optional - standby player may choose not to block

**Continuing:**
- After resolving all effects, proceed to action step
- **Exception**: If attacking Unit or target is destroyed/moved, skip to battle end step

→ [Detailed Block Step Rules](./block-step.md)

---

## 7-5. Action Step

**Action Timing:**
- Players alternate activating 【Action】 Command cards and 【Activate・Action】 effects
- Standby player gets first opportunity
- Continue alternating until both players pass consecutively

**Available Actions:**
- Play 【Action】 Command card from hand
- Activate 【Activate・Action】 effect on card
- Pass (do nothing, let opponent act)

**Continuing:**
- After both players pass, proceed to damage step
- **Exception**: If attacking Unit or target is destroyed/moved, skip to battle end step

→ [Detailed Action Step Rules](./action-step.md)

---

## 7-6. Damage Step

**Confirm Target:**
- Check attacking Unit's current target
- Target may have changed due to <Blocker> or other effects

**Attack on a Player:**

*Shield Area Check:*
- If NO Base and NO Shields: Player receives battle damage equal to attacking Unit's AP → Immediate defeat
- If Base present: Base receives battle damage equal to attacking Unit's AP
- If Shields present (no Base): Top Shield receives damage equal to attacking Unit's AP

*Base Damage:*
- Track damage with counters
- Base destroyed if HP reaches zero
- <First Strike> deals damage before normal damage

*Shield Damage:*
- Shield is destroyed regardless of AP amount
- Reveal destroyed Shield card
- If revealed card has 【Burst】 effect, owner may activate it
- 【Burst】 activation is optional

**Attack on a Unit:**

*Battle Between Units:*
- Both Units deal damage to each other simultaneously
- Damage dealt equals each Unit's AP
- Track damage with counters on Units
- Unit destroyed if HP reaches zero

*<First Strike>:*
- Attacking Unit with <First Strike> deals damage first
- If target is destroyed by <First Strike>, attacking Unit receives no counter-damage
- Battle end step follows immediately after <First Strike> destruction

*Simultaneous Destruction:*
- If both Units destroyed, treated as simultaneous
- Both destruction effects trigger

**Continuing:**
- After all effects resolve, proceed to battle end step

→ [Detailed Damage Step Rules](./damage-step.md)

---

## 7-7. Battle End Step

**Effect Cleanup:**
- All effects worded "during this battle" lose effect immediately
- These effects no longer apply after battle ends

**Resolving Effects:**
- Any effects triggered during this step activate and resolve
- Follow normal trigger and resolution rules

**Return to Main Phase:**
- After all effects resolved, battle ends completely
- Active player returns to main phase
- May perform additional main phase actions (deploy Units, attack with other Units, etc.)

→ [Detailed Battle End Step Rules](./battle-end-step.md)

---

## Key Combat Mechanics

**<Blocker>:**
- Allows defensive Unit to intercept attacks
- Changes attack target from original to blocking Unit
- See [KEYWORDS-INDEX.md](../KEYWORDS-INDEX.md) for complete rules

**<First Strike>:**
- Deals battle damage before normal damage timing
- Can destroy target before receiving counter-damage
- See [KEYWORDS-INDEX.md](../KEYWORDS-INDEX.md) for complete rules

**<High-Maneuver>:**
- Prevents enemy <Blocker> activation
- Attack cannot be intercepted by blocking Units
- See [KEYWORDS-INDEX.md](../KEYWORDS-INDEX.md) for complete rules

**<Breach>:**
- Deals damage to shield area when destroying enemy Unit
- Only activates on your turn
- See [KEYWORDS-INDEX.md](../KEYWORDS-INDEX.md) for complete rules

**【When Attacking】 Effects:**
- Triggered effects that activate when Unit attacks
- Trigger during attack step
- See [Section 11 - Keywords](../11-keyword-effects-and-keywords/keywords.md) for complete rules

**【Action】 Effects:**
- Can be activated during action step of battle
- Provides opportunity to respond to attacks
- See [Section 11 - Keywords](../11-keyword-effects-and-keywords/keywords.md) for complete rules

---

## Battle Shortcuts and Special Cases

**Early Battle Termination:**
- If attacking Unit is destroyed/moved before damage step: Battle ends, skip to battle end step
- If target Unit is destroyed/moved before damage step: Battle ends, skip to battle end step
- Checked at end of attack step, block step, and action step

**Link Units:**
- Link Units (Units with matching Pilot) can attack immediately when deployed
- Normal Units have summoning sickness (cannot attack turn they enter battle area)
- See [Section 2 - Card Information](../02-card-information/full.md) for Link rules

**Attacking Rested Units:**
- Can only target rested (horizontal) enemy Units
- Cannot attack active (vertical) enemy Units
- Attack player instead if you want to attack with no enemy Unit target

**Shields vs Base Priority:**
- If Base present: Base receives damage first
- If no Base: Shields receive damage
- Cannot have both Base and Shields take damage from same attack

---

## Battle Resolution Examples

**Example 1: Simple Attack on Player**
1. Attack Step: Rest Unit, declare player as target, resolve 【When Attacking】 effects
2. Block Step: Opponent has no active Units or chooses not to block
3. Action Step: Both players pass
4. Damage Step: Check opponent's shield area, destroy top Shield or damage Base
5. Battle End Step: Clean up, return to main phase

**Example 2: Unit vs Unit Battle**
1. Attack Step: Rest Unit, declare rested enemy Unit as target
2. Block Step: Cannot block (target already a Unit)
3. Action Step: Both players pass
4. Damage Step: Both Units deal damage to each other, check for destruction
5. Battle End Step: Clean up, trigger any 【Destroyed】 effects

**Example 3: <Blocker> Intercept**
1. Attack Step: Rest Unit, declare player as target
2. Block Step: Opponent activates <Blocker> on active Unit, target changes to blocking Unit
3. Action Step: Both players pass
4. Damage Step: Battle between attacking Unit and blocking Unit
5. Battle End Step: Clean up, return to main phase

**Example 4: <First Strike> Destruction**
1. Attack Step: Rest Unit with <First Strike>, declare target
2. Block Step: No block
3. Action Step: Both players pass
4. Damage Step: <First Strike> Unit deals damage first, destroys target before counter-damage
5. Battle End Step: Clean up, only one Unit destroyed

---

## Complete Rules

For complete detailed rules including all edge cases, subsection numbering, and comprehensive examples, see:

**[Full Section 7 Rules](./full.md)**

Or navigate to specific battle steps:
- [Attack Step (7-3)](./attack-step.md)
- [Block Step (7-4)](./block-step.md)
- [Action Step (7-5)](./action-step.md)
- [Damage Step (7-6)](./damage-step.md)
- [Battle End Step (7-7)](./battle-end-step.md)
