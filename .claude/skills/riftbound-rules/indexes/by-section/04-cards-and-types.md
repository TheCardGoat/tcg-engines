# Section 4: Cards & Types

**Rule References:** 124-183
**Full Document:** `references/01_20_Riftbound_Core_Rules_2025_06_02.md`

## Overview
This section covers all card types, their properties, and how control works for different game objects.

---

## 130-131: Card Basics

### Cost (130)
Main Deck cards have a Cost in the upper left corner:
- **Energy Cost** (130.2) - The numeral
- **Power Cost** (130.3) - The domain symbols (may not be present on all cards)

### Name (131)
- Each card has a unique name
- Different language versions of the same card share the name
- Cards with different names are different cards (even if same character)

---

## 132: Categories

### Main Deck Cards (132.4)
Begin in Main Deck or Champion Zone:

#### Permanents (132.4.a)
- Remain on board after being played
- Types: **Unit** and **Gear**

#### Spells (132.4.b)
- Do not remain on board after being played
- Resolve and go to trash

### Rune Deck Cards (132.5)
- Begin in Rune Deck
- **Runes** - Channeled (not played), remain on board but are NOT permanents

### Non-Deck Cards (132.6)
- **Battlefields** - Start on board, not played or channeled
- **Legends** - Start in Legend Zone, cannot leave during play

---

## 133: Domains

Six domains, each with color and symbol:

| Domain | Color | Symbol |
|--------|-------|--------|
| Fury | Red | Circular with three projecting points |
| Calm | Green | Leaf |
| Mind | Blue | Sun and moon |
| Body | Orange | Blocky diamond |
| Chaos | Purple | Hexagonal with swirls |
| Order | Yellow | Angular winged |

---

## 137-141: Units

### Properties (138-139)
- **Game Object** while on Board
- **Card Type** relevant in all zones
- Have **Tags** (champion, region, faction, species)
- Have **Might** (combat statistic)
- Can have **damage marked** on them
- Enter Board **exhausted** (unless modified)

### Might Rules (139.2)
- If damage ≥ Might, Unit is Killed
- Might below 0 is treated as 0

### Damage (139.3)
- Tracked temporarily with markers
- Cleared at:
  - End of each player's turn
  - End of any Combat (after resolving winner)

### Standard Move (140)
- Inherent ability of all Units
- **Cost:** Exhaust the Unit
- **Timing:** Action Phase, Open State, not during Showdown
- **Destinations:**
  - Base → Battlefield
  - Battlefield → Base
  - Battlefield → Battlefield (only with Ganking)
- Multiple Units can move simultaneously to same destination

### Activated Abilities (141)
- Format: Cost → Effect
- Timing: Action Phase, Open State, not during Showdown
- Behaves like a spell without a card once activated

---

## 142-145: Gear

### Properties (143-144)
- **Game Object** while on Board
- **Card Type** relevant in all zones
- Enter play **Ready**
- Can only be played to player's **Base**
- If at a Battlefield, immediately Recalled to Base

### Activated Abilities (145)
- Same timing rules as Unit abilities
- Format: Cost → Effect

---

## 146-152: Spells

### Properties (147-151)
- **Card Type**
- Played during Open State outside Showdowns (on controller's turn)
- Creates game effect, then goes to Trash
- Rules text executed top to bottom
- Nothing can intercede while spell is Resolving

### Spell Keywords (152)
Intrinsic properties affecting timing:

| Keyword | Effect |
|---------|--------|
| **Action** | Can also be played during Showdowns |
| **Reaction** | Grants Action + can be played during Closed States |

---

## 153-161: Runes

### Properties (154-156)
- **Card Type** (not Main Deck card)
- Kept in Rune Deck (exactly 12)
- **Channeled** (not played)
- Remain on board but are NOT Permanents
- Produce **Energy** and **Power**

### Basic Runes (157)
Six Basic Runes (one per domain), each with:
- `[T]: Add [1]` (tap for 1 Energy)
- `Recycle this: Add [C]` (recycle for 1 Power of that domain)

### Rune Pools (158-161)
- Conceptual collection of available Energy and Power
- Must add to pool before spending
- **Empties at:**
  - End of each player's Draw Phase
  - End of each player's turn

---

## 162-169: Battlefields & Legends

### Battlefields (163)
- Game Objects, owned by a player
- Not shuffled into decks, not played
- Cannot be Killed or Moved
- ARE Locations (can be origins/destinations)
- Can have Passive and Triggered Abilities
- NOT Permanents

### Legends (167)
- Game Objects, owned by a player
- Not shuffled into decks, not played
- Cannot be Killed or Moved
- Can have Passive, Triggered, and Activated Abilities
- NOT Permanents
- Determine Domain Identity

---

## 170-178: Tokens

### Properties (171-177)
- Created by spells/abilities during play
- Controller = controller of creating effect
- Owner = player who controlled creating effect
- NOT cards (but follow card type rules)
- Have no costs or domains
- Can only exist on board (cease to exist in Non-Board Zones)

### Common Tokens (178)
- **1[S] Recruit** - Domainless unit, 1 Might, Recruit tag
- **3[S] Sprite with Temporary** - Domainless unit, 3 Might, Fae tag, Temporary keyword

---

## 179-183: Control

### Battlefield Control (181)
- Binary state: Controlled or Uncontrolled
- Controlled by specific player or no one
- **Contested** - Temporary status when opposing Unit arrives
- Established by presence of Units
- Changes immediately after Combat if different player's Units remain

### Other Game Objects (182)
- Controller established when card is Played
- For Spells: Controller chooses targets, modes, pays costs
- For Permanents/Runes: Controller assigned when entering Board

---

## Common Questions

**Q: What's the difference between Permanents and Runes?**
A: Permanents are Main Deck cards (Units, Gear). Runes are from the Rune Deck and are channeled, not played.

**Q: Can Gear be at a Battlefield?**
A: No, if Gear is at a Battlefield it's immediately Recalled to Base (144.3)

**Q: Do tokens go to the trash when killed?**
A: No, tokens cease to exist when they would enter any Non-Board Zone (177.1)

**Q: When does damage clear from Units?**
A: At end of each player's turn and at end of Combat (139.3.b)

**Q: Can I control an opponent's Battlefield?**
A: Yes, through Combat - if your Units remain and theirs don't, you gain control (181.4.c)

---

## Related Sections

- **Section 3: Zones & Spaces** - Where cards exist
- **Section 7: Abilities** - How abilities work
- **Section 9: Combat** - How control changes

---

*For detailed rules, read the full section in the Core Rules document*
