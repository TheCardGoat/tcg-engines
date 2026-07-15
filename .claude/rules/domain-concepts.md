# TCG Domain Concepts

## Core Terminology

### Players
- **Owner** - The player who brought a card to the game (never changes)
- **Controller** - The player currently controlling a card (can change via effects)
- **Active Player** - The player whose turn it is
- **Opponent** - The other player(s) in the game

### Cards

#### Card Definition
Static data defining a card type:
- `id`: Unique identifier
- `name`: Card name
- `cost`: Resource cost to play
- `text`: Rules text
- `abilities`: List of abilities

#### Card Instance
A specific card in play with runtime state:
- `id`: Unique instance identifier
- `definitionId`: References the card definition
- `owner`: Player who owns this card
- `controller`: Player controlling this card
- `zone`: Current location
- `tapped/exerted`: Whether the card is tapped
- `flipped`: Face-up or face-down
- Custom game state (damage, counters, etc.)

### Zones

Common zones across TCGs:
- **Deck** - Face-down pile of undrawn cards
- **Hand** - Cards held by a player (hidden from opponent)
- **Play Area** - Cards in play/on the battlefield
- **Discard/Graveyard** - Used/destroyed cards
- **Exile/Banished** - Removed from game cards

Game-specific zones:
- **Inkwell** (Lorcana) - Resource zone for paying costs

### Game States

#### Card States
| State | Description |
|-------|-------------|
| `tapped`/`exerted` | Card has been used this turn |
| `flipped` | Face-down (true) or face-up (false) |
| `revealed` | Temporarily visible to all players |
| `phased` | Phased out (not in play but exists) |

#### Turn States
- Current phase
- Active player
- Priority holder
- Stack/pending effects

## Common Mechanics

### Resource Systems
- **Mana** (Magic) - Lands produce mana
- **Ink** (Lorcana) - Cards placed in inkwell
- **Energy** (Pokemon) - Attached to characters

### Core Actions
| Action | Description |
|--------|-------------|
| Draw | Move card from deck to hand |
| Discard | Move card from hand to discard |
| Play | Move card from hand to play area |
| Banish | Move card to banished/exile zone |
| Tap/Exert | Mark card as used |
| Ready/Untap | Reset tapped state |

### Combat Terminology
- **Attack/Challenge** - Initiate combat
- **Defend/Block** - Respond to attack
- **Damage** - Reduce willpower/health
- **Strength/Power** - Damage dealt
- **Willpower/Toughness** - Damage threshold

## Branded Types

The framework uses branded types for type safety:

```typescript
// Identity types
type CardId = string & { readonly brand: unique symbol };
type PlayerId = string & { readonly brand: unique symbol };
type ZoneId = string & { readonly brand: unique symbol };

// Usage
const cardId: CardId = createCardId("card-001");
const playerId: PlayerId = createPlayerId("player-1");
```

Benefits:
- Prevents mixing IDs (can't pass PlayerId where CardId expected)
- IDE autocomplete shows correct type
- Runtime values are still strings

## Ability Types

### Keyword Abilities
Simple, named abilities with standard rules:
- Evasive, Rush, Ward, Bodyguard, etc.

### Triggered Abilities
Activate when a condition is met:
- "When you play this character..."
- "Whenever this character quests..."
- "At the start of your turn..."

### Activated Abilities
Player chooses to activate (usually with cost):
- "⟳ — Draw a card"
- "Banish this card: Deal 3 damage"

### Static/Continuous Abilities
Always in effect while card is in play:
- "While you have another character, this gets +2 strength"
- "Characters you control have Evasive"

## Game Flow

### Typical Turn Structure
1. **Ready Phase** - Untap/ready cards
2. **Draw Phase** - Draw card(s)
3. **Main Phase** - Play cards, activate abilities
4. **Combat Phase** - Attack and block
5. **End Phase** - Cleanup, discard to hand size

### Priority System
- Active player has priority
- Effects resolve in order (stack or queue)
- Responses can be made before resolution
