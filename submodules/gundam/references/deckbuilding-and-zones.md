# Deckbuilding & Zones

Reference for deck construction rules, game zones, and resource management.  
Source: Gundam Card Game Comprehensive Rules Ver. 1.5.0

---

## Deck Construction (Section 6-1)

- **Main Deck**: Exactly **50 cards**.
- **Resource Deck**: Exactly **10 cards** (Resource-type cards only).
- **Max 4 copies** of any single card number across both decks combined.
- Cards are identified by **card number**, not by name (cards may share names but have different numbers).

---

## Game Zones (Section 4)

### Deck (4-2)

- Face-down, private.
- Draw from the top.
- Reaching 0 cards = **defeat**.

### Resource Deck (4-3)

- Separate face-down pile for Resource cards.
- Same visibility rules as the main deck.

### Resource Area (4-4)

- Holds deployed resources.
- **Maximum 15 resources**.
- Resources are rested to pay costs, then readied at the start of each turn.

### Battle Area (4-5)

- Holds deployed Units.
- **Maximum 6 Units** per player.
- If the limit is exceeded, the player must send excess Units to the trash (rules management).

### Shield Area (4-6)

- Holds **shields** (face-down cards) and **Bases**.
- Start with 6 shields.
- Shields absorb battle damage. Flipped shields with 【Burst】 may activate.
- Bases sit in the shield area and take damage before shields.

### Removal Area (4-7)

- **Public** zone.
- Cards sent here by "remove" effects.
- Cards in the removal area are generally not recoverable.

### Hand (4-8)

- Private zone.
- **Maximum 10 cards**. Discard excess during the End Phase.

### Trash (4-9)

- **Public** discard pile.
- Destroyed Units, resolved Commands, and discarded cards go here.

---

## Resource Management

- During the **Resource Phase**, the active player may place 1 card from the resource deck into the resource area.
- Resources enter play **active** (upright).
- To pay a card's cost, rest resources equal to the printed cost.
- The player's **resource level** = the number of resources in their resource area. Cards with a level requirement can only be played when the player's resource level meets or exceeds it.
- Player Two receives an **EX Resource** during setup to offset going second.

---

## Tokens (Section 5)

- Created by card effects (e.g., `deployToken`).
- Tokens are **removed from the game** when they leave a valid zone (e.g., if sent to hand or trash).
- Tokens have no card number and do not count toward deck limits.
