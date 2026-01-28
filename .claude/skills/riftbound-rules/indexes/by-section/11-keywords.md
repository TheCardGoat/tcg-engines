# Section 11: Keywords

**Rule References:** 712-729
**Full Document:** `references/41_60_Riftbound_Core_Rules_2025_06_02.md` and `references/61_65_Riftbound_Core_Rules_2025_06_02.md`

## Overview
This section covers all keyword abilities, their technical definitions, and how they interact.

---

## 712-715: Keyword Basics

### Definition (713)
A Keyword is a specific term that acts as shorthand for a specific game effect or ability.

### Properties
- Can be an ability
- Identified by colored highlight (color has no gameplay effect)
- Can be referenced by other Game Effects
- Can be granted or removed by effects

### Granting/Removing Keywords (713.3)
- **Granted:** Duration specified by effect (default: while on Board or in current zone)
- **Removed:** Duration specified by effect (default: while on Board or in current zone)

### Multiple Keywords (714-715)
- Cards can have any number of keywords
- Execute keyword effects in order (top to bottom of rules text)

---

## 717: Accelerate

**Type:** Unit ability (Optional Additional Cost)

### Effect
"As you play me, you may pay 1[C] as an additional cost. If you do, I enter ready."

### Rules
- [C] matches the unit's domain
- Cost paid during playing process, not on board
- No function while on board
- Multiple instances are redundant
- Influences entry state (doesn't trigger "ready" abilities)

---

## 718: Action

**Type:** Permissive keyword

### Effect
- **On Spells/Units:** "This can be played during showdowns on any player's turn."
- **On Abilities:** "This can be activated during showdowns on any player's turn."

### Rules
- Permission is inclusive (doesn't restrict other timings)
- Doesn't alter function of instructions
- Units with Action still have normal play restrictions (Base or controlled Battlefield)

---

## 719: Assault

**Type:** Passive Ability keyword (Units)

### Effect
"While I am an attacker, I have +X [S]."

### Format
"Assault [X]" (if X omitted, X = 1)

### Rules
- Active while Unit has Attacker designation in Combat
- Multiple instances **stack** (add values together)

**Example:**
> Petty Officer has Assault. Cleave gives it Assault 3.
> Result: Assault 4 this turn.

---

## 720: Deathknell

**Type:** Triggered Ability keyword (Permanents)

### Effect
"When I die, [Effect]."

### Format
"Deathknell — [Effect]"

### Rules
- Triggers when Permanent is Killed and sent to Trash
- Does NOT trigger if "killed" event is replaced (e.g., recalled instead)
- Multiple instances trigger separately

---

## 721: Deflect

**Type:** Passive Ability keyword (Permanents)

### Effect
"Spells and abilities an opponent controls that choose me cost [X] Power more as an additional cost."

### Format
"Deflect [X]" (if X omitted, X = 1)

### Rules
- Power can be of any Domain
- Imposes Mandatory Additional Cost
- Multiple instances **stack** (add values together)

---

## 722: Ganking

**Type:** Passive Ability keyword (Units)

### Effect
"I may move to a battlefield from another battlefield."

### Rules
- Adds permission to Standard Move (doesn't restrict other options)
- No activation cost
- Doesn't grant additional movement, just new destinations
- Multiple instances are redundant

---

## 723: Hidden

**Type:** Keyword (Spells, Units, Gear)

### Effect
"Rather than play this, you may pay [C] to hide this facedown at a battlefield you control that doesn't already have a facedown card. Beginning on the next player's turn, this gains [Reaction] and you may play this, ignoring its base cost. All choices must only be from valid targets at that battlefield."

### Rules
- [C] matches Domain Identity (not the card's domain)
- Hide is NOT a subset of Play
- Hiding doesn't open a Chain
- Playing from Hidden DOES open a Chain
- Targets must be at the associated Battlefield
- Can still be played normally for full cost
- Multiple instances are redundant

---

## 724: Legion

**Type:** Conditional keyword

### Effect
"If you have played another Main Deck card before this one this turn, apply [Text]."

### Format
"Legion - [Text]"

### Rules
- Condition: Another Main Deck card played this turn
- Can apply to static abilities, activated abilities, spell instructions, or zone abilities
- All Legion abilities on your cards are satisfied by playing one card

---

## 725: Reaction

**Type:** Permissive keyword

### Effect
Grants all Action permissions PLUS:
- **On Spells/Units:** "This can be played during Closed States on any player's turn."
- **On Abilities:** "This can be activated during Closed States on any player's turn."

### Rules
- Permission is inclusive (doesn't restrict other timings)
- Doesn't alter function of instructions
- Units with Reaction still have normal play restrictions

---

## 726: Shield

**Type:** Passive Ability keyword (Units)

### Effect
"While I am a defender, I have +X [S]."

### Format
"Shield [X]" (if X omitted, X = 1)

### Rules
- Active while Unit has Defender designation in Combat
- Multiple instances **stack** (add values together)

**Example:**
> Stalwart Poro has Shield. Block gives it Shield 3.
> Result: Shield 4 this turn.

---

## 727: Tank

**Type:** Passive Ability keyword (Units)

### Effect
"I must be assigned lethal damage before any other unit with the same controller that does not have [Tank] during combat resolution."

### Rules
- Alters damage assignment in Combat
- Must still assign lethal damage before moving to next unit
- If multiple Tanks, can assign to any of them (non-Tanks invalid until all Tanks have lethal)
- Multiple instances are redundant

---

## 728: Temporary

**Type:** Triggered Ability keyword (Permanents)

### Effect
"At the start of this permanent's controller's Beginning Phase, before scoring, kill this."

### Rules
- Triggers at controller's Beginning Phase
- Multiple instances are redundant

---

## 729: Vision

**Type:** Triggered Ability keyword (Permanents)

### Effect
"When this is played, look at the top card of your Main Deck. You may recycle it."

### Rules
- Triggers when permanent enters Board
- Multiple instances trigger separately
- Each instance: May choose to recycle or not independently
- If not recycled, each instance sees same card

---

## Keyword Summary Table

| Keyword | Type | Stacks? | Key Effect |
|---------|------|---------|------------|
| Accelerate | Optional Cost | No | Enter ready for 1[C] |
| Action | Permission | No | Play during Showdowns |
| Assault | Passive | Yes | +X Might while attacking |
| Deathknell | Triggered | Separate | Effect when killed |
| Deflect | Passive | Yes | Opponents pay +X Power to target |
| Ganking | Passive | No | Move Battlefield to Battlefield |
| Hidden | Permission | No | Hide facedown, play for free later |
| Legion | Conditional | N/A | Bonus if played another card |
| Reaction | Permission | No | Play during Closed States |
| Shield | Passive | Yes | +X Might while defending |
| Tank | Passive | No | Must be assigned damage first |
| Temporary | Triggered | No | Killed at Beginning Phase |
| Vision | Triggered | Separate | Look at top card, may recycle |

---

## Common Questions

**Q: Can I use Accelerate after the unit is on the board?**
A: No, it's only during the playing process (717.2.a)

**Q: Does Assault work when defending?**
A: No, only while attacking (719.1.d)

**Q: Can I play a Reaction spell on my opponent's turn?**
A: Yes, during any Closed State or Showdown (725.1.c)

**Q: What if I have two units with Tank?**
A: Assign lethal to either one first, then the other, then non-Tanks (727.1.c.2)

**Q: Does Hidden let me ignore Power costs?**
A: It ignores base cost, but additional costs still apply (723.1.b)

**Q: Do multiple Assault keywords stack?**
A: Yes, add the values together (719.2)

---

## Related Sections

- **Section 7: Abilities** - How abilities work generally
- **Section 9: Combat** - Assault, Shield, Tank in combat
- **Section 6: Chains & Showdowns** - Action, Reaction timing

---

*For detailed rules, read the full section in the Core Rules document*
