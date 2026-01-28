# Section 3: Zones & Spaces

**Rule References:** 105-109
**Full Document:** `references/01_20_Riftbound_Core_Rules_2025_06_02.md`

## Overview
This section covers all game zones, their properties, and how cards move between them.

---

## 106: The Board

The Board is the play area divided into several zones where Game Objects exist during play.

### 106.2: The Base
- **Count:** One per player
- **Purpose:** Space to play Units and Gear
- **Properties:**
  - Is a Location
  - Houses player's Runes on the Board
  - Other players cannot have Game Objects they control in another player's Base

### 106.3: The Battlefield Zone
- **Count:** Multiple battlefields (typically one per player, varies by mode)
- **Purpose:** Contested locations for combat and scoring
- **Properties:**
  - Each Battlefield is individually a Location
  - Any number of Units can be present at a Battlefield

### 106.4: Facedown Zones
- **Association:** Each Battlefield has one Facedown Zone
- **Capacity:** Maximum one card per Facedown Zone
- **Rules:**
  - Only controller of the Battlefield can place cards there
  - If controller loses Battlefield control, facedown card is removed during next Cleanup
  - Facedown Zones are NOT Locations

### 106.5: The Legend Zone
- **Purpose:** Space for each player's Champion Legend
- **Properties:**
  - NOT a Location
  - Champion Legend is a Game Object here
  - Legend cannot be removed, moved, or displaced from this zone

---

## 107: Non-Board Zones

### 107.1: The Trash
- **Purpose:** Where cards go when killed, discarded, or spent
- **Properties:**
  - One per player
  - Cards are unordered (can be reorganized)
  - Public Information
  - Cards always go to owner's trash (never opponent's)

### 107.2: The Champion Zone
- **Purpose:** Holds Chosen Champion at game start
- **Properties:**
  - Champion can be played from here normally
  - Cannot return to this zone by normal means after leaving

### 107.3: The Main Deck Zone
- **Purpose:** Holds the Main Deck
- **Properties:**
  - Card order is Secret Information
  - Cannot be looked through unless instructed by card effect

### 107.4: The Rune Deck Zone
- **Purpose:** Holds the Rune Deck
- **Properties:**
  - Rune order is Secret Information
  - Cannot be looked through unless instructed by card effect

### 107.5: Banishment
- **Purpose:** Cards removed from play in a difficult-to-recover way
- **Properties:**
  - One per player
  - Cards are unordered
  - Public Information
  - Cards always go to owner's banishment
  - Effects can reference cards they banished
  - References to banished cards don't count as Choosing or Attachment

### 107.6: The Hand
- **Purpose:** Cards available to play
- **Properties:**
  - Where drawn cards go
  - Card contents: Private Information
  - Card count: Public Information
  - Can be targeted by spells/effects when specified

---

## 108: Public Information on the Board

All Game Objects in the collective Play Areas are Public Information:
- Any player may view face-up card information
- State of all Game Objects is public (buffed, exhausted, etc.)

---

## 109: Zone Transitions

When a Game Object changes zones to or from a Non-Board Zone:
- All Temporary Modifications cease to be tracked
- Examples of cleared modifications:
  - Damage is cleared
  - Buffers are removed
  - Temporarily granted Keywords are removed

---

## Zone Summary Table

| Zone | Location? | Privacy | Board/Non-Board |
|------|-----------|---------|-----------------|
| Base | Yes | Public | Board |
| Battlefield | Yes | Public | Board |
| Facedown Zone | No | Private | Board |
| Legend Zone | No | Public | Board |
| Trash | N/A | Public | Non-Board |
| Champion Zone | N/A | Public | Non-Board |
| Main Deck Zone | N/A | Secret | Non-Board |
| Rune Deck Zone | N/A | Secret | Non-Board |
| Banishment | N/A | Public | Non-Board |
| Hand | N/A | Private | Non-Board |
| The Chain | N/A | Public | Non-Board |

---

## Common Questions

**Q: Can I have Units at my opponent's Base?**
A: No, other players cannot have Game Objects they control in another player's Base (106.2.d)

**Q: What happens to damage when a Unit returns to hand?**
A: Damage is cleared when changing to/from Non-Board Zones (109)

**Q: Can I look at my opponent's trash?**
A: Yes, trash is Public Information (107.1.f)

**Q: How many cards can be hidden at a Battlefield?**
A: One card maximum per Facedown Zone (106.4.b)

**Q: What happens to a hidden card if I lose control of the Battlefield?**
A: It's removed during the next Cleanup (106.4.d)

**Q: Is the Legend Zone a Location?**
A: No, it's not a Location (106.5.b)

---

## Related Sections

- **Section 2: Game Concepts** - Setup and deck construction
- **Section 4: Cards & Types** - What can exist in each zone
- **Section 8: Game Actions** - Moving between zones

---

*For detailed rules, read the full section in the Core Rules document*
