# Disney Lorcana Game Engine

This module implements the rules engine for the Disney Lorcana Trading Card Game. It provides the core game mechanics, state management, and rules enforcement for digital implementations of the game.
## Introduction
This document serves as a guide for engineers working on the digital implementation of the Disney Lorcana Trading Card Game (TCG). Its purpose is to provide a foundational understanding of the game's mechanics, flow, and terminology, especially for those unfamiliar with Lorcana or TCGs in general.

This project aims to create a robust engine that accurately simulates the gameplay of Disney Lorcana based on its official Comprehensive Rules.

## What is Disney Lorcana?
Disney Lorcana is a collectible trading card game where players take on the role of Illumineers, wielding magical ink to summon glimmers – Disney characters and items – to life. Players build decks of cards and compete to be the first to gather 20 Lore.

## Core Game Concepts for Engineers
Understanding these core concepts is crucial for implementing the game logic:

### Core Card Types

**Characters:** These are the Disney characters summoned by players. They have Strength (attack power) and Willpower (health). Characters can:
- Quest: To gain Lore.
- Challenge: To battle opposing Characters or Locations.
- Use Abilities.

**Actions:** Cards that provide a one-time effect and are then discarded.

**Songs:** A subtype of Action that can be played by paying its ink cost or by having a Character "sing" it (exerting a character of sufficient cost).

**Items:** Cards that enter play and provide ongoing effects or activated abilities.

**Locations:** Cards that represent iconic Disney places. They enter play, can be moved to by Characters (for a cost), may provide Lore each turn, and can be challenged by opposing characters. They have Willpower but no Strength.



This README should provide a foundational understanding for engineers joining the project. For detailed specifics, always consult the Comprehensive Rulebook.

## Reference Documentation

For detailed implementation guidance, please refer to:
- [Comprehensive Rules](RULES.md)
- [Game Flow Diagrams](FLOWCHARTS.md)
- [Glossary of Terms](GLOSSARY.md)

## Development Status

This engine is currently under development. It will eventually be extracted to a separate package.

### Objective
The primary goal is to be the first player to accumulate 20 or more Lore.

### Key Resources
Ink: The primary resource used to play cards and activate some abilities. Players generate ink by placing cards from their hand facedown into their Inkwell (typically one per turn). The cost of a card is indicated on it.

Lore (◇): The victory points. Players primarily gain lore by having their Character cards Quest.

### Card Types
The game features several types of cards:

Characters: These are the Disney characters summoned by players. They have Strength ( देख, attack power) and Willpower (शील्ड, health). Characters can:

Quest: To gain Lore.

Challenge: To battle opposing Characters or Locations.

Use Abilities.

Actions: Cards that provide a one-time effect and are then discarded.

Songs: A subtype of Action that can be played by paying its ink cost or by having a Character "sing" it (exerting a character of sufficient cost).

Items: Cards that enter play and provide ongoing effects or activated abilities.

Locations: Cards that represent iconic Disney places. They enter play, can be moved to by Characters (for a cost), may provide Lore each turn, and can be challenged by opposing characters. They have Willpower but no Strength.

### Game Zones
Each player manages several distinct zones:

Deck: The draw pile, containing at least 60 cards. It's a private zone (contents hidden).

Hand: Cards drawn from the deck, held by the player. A private zone.

Inkwell: Contains cards placed facedown to be used as ink. Each card in the inkwell typically represents 1 ink. A private zone (identities of cards are hidden, but count is public).

Play Area (In Play): Where Characters, Items, and Locations are placed when played. A public zone.

Discard Pile: Where banished cards, resolved actions, and discarded cards go. A public zone, faceup.

The Bag (Conceptual): Not a physical zone, but a conceptual holding area for triggered abilities waiting to resolve. This helps manage the order of effects when multiple things happen at once.

### Key Card States & Conditions
Ready: A card in its normal, upright position, able to perform actions.

Exerted: A card turned sideways. This usually happens when a card quests, challenges, or pays a cost. Exerted cards often cannot perform further actions requiring exertion until they are readied.

Dry vs. Drying: A Character typically cannot quest or challenge the turn it is played (it's "drying"). It becomes "dry" at the start of its controller's next turn. Some abilities (like Rush) bypass this.

Damage: Characters and Locations accumulate damage. If damage equals or exceeds Willpower, the card is banished (sent to the discard pile).

## Game Flow Summary

### Game Setup
   Deck Construction: Each player needs a deck of at least 60 cards, using cards from no more than two of the six Ink Types (Amber, Amethyst, Emerald, Ruby, Sapphire, Steel). No more than 4 copies of any card with the same full name (Name + Version).

Determine Starting Player: Randomly.

Shuffle & Cut: Players shuffle their decks and offer opponents a chance to cut.

Starting Lore: Both players start at 0 Lore.

Draw Opening Hand: Each player draws 7 cards.

Alter Hand (Mulligan): Starting with the first player, each player may choose any number of cards from their hand, place them on the bottom of their deck, and draw back up to 7 cards. The deck is then reshuffled if altered.

### Player Turn Structure
A player's turn consists of three phases:

Phase 1: Beginning Phase

1. Ready Step: Ready all your exerted cards (in play and in your inkwell). Certain "start of turn" effects may trigger or end.

2. Set Step:

Characters played on previous turns become "dry."

Gain Lore from any Locations you control that provide it.

"Start of turn" triggered abilities (and those from the Ready step) are added to the Bag and resolved.

3. Draw Step: Draw a card. (The starting player skips this step on their very first turn).

Phase 2: Main Phase
The active player can perform any of the following actions multiple times and in any order (unless specified):

Put a card into Inkwell (Once per turn): Choose a card with an inkwell symbol from your hand and place it facedown into your inkwell.

Play a Card: Pay a card's ink cost (or an alternative cost) to play it from your hand.

Characters, Items, Locations enter your Play Area.

Actions resolve their effects and then go to the discard pile.

Quest with a Character: Exert a "dry" Character to gain Lore equal to its Lore value.

Challenge with a Character: Exert a "dry" Character to attack an opponent's exerted Character or an opponent's Location. Damage is exchanged based on Strength values.

Move a Character to a Location: Pay the location's move cost to move one of your characters to one of your locations.

Use Activated Abilities: Pay the cost (often exerting the card or paying ink) to use an ability on a card you control. Characters usually need to be "dry" to use activated abilities requiring exertion.

Phase 3: End of Turn Phase

"At the end of turn" abilities trigger and are added to the Bag and resolved.

Effects with a duration of "this turn" end.

The turn passes to the next player.

(Refer to the "Turn Structure" flowchart in lorcana_rules_analysis_v1 for a visual representation.)

### Game State Check
Throughout the turn (after steps, actions, or ability resolutions), the game checks for certain conditions:

Win/Loss Conditions:

If a player has 20+ Lore, they win.

If a player attempts to draw from an empty deck, they lose.

Other Conditions:

If a Character or Location has damage ≥ its Willpower, it is banished.
This check repeats until no further actions are required.

### Winning and Losing
Win: Be the first player to reach 20 Lore.

Lose: Attempt to draw a card from an empty deck.

In multiplayer, the last player remaining wins.

## Key Terminology & Mechanics

This section highlights crucial terms. For a comprehensive list, refer to the [GLOSSARY.md](GLOSSARY.md) file.

**Ability:** Special rules on cards. Types include:

- **Triggered Abilities:** (e.g., "Whenever this character quests...") - Effects happen automatically when a specific condition is met. They go into "The Bag" to resolve.

- **Activated Abilities:** (e.g., "[Cost]: Effect") - Player must choose to use them and pay a cost.

- **Static Abilities:** Continuous effects active while the card is in play (e.g., "Your other characters get +1 Strength").

- **Keywords:** Common abilities with specific names (see below).

**The Bag:** A conceptual queue for resolving triggered abilities. If multiple abilities trigger at once, they are added to the Bag. The active player resolves all of their abilities in the Bag first, then the opponent(s).

**Challenge:**

- Attacking Character must be dry and ready.
- Target Character must be exerted (Locations can always be challenged).
- Both challenger and challenged character (if it's a character) deal damage equal to their Strength to each other simultaneously. Locations do not deal damage back.

**Keywords (Examples):**

- **Bodyguard:** Can enter play exerted. Opponents must challenge this character if able.
- **Challenger +N:** This character gets +N Strength while challenging.
- **Evasive:** Only characters with Evasive can challenge this character.
- **Reckless:** Can't quest and must challenge if able.
- **Resist +N:** Damage dealt to this card is reduced by N.
- **Rush:** This character can challenge the turn it's played (ignores "drying").
- **Shift:** An alternative way to play a character for a typically lower cost by placing it on top of another character you control with the same name (or other specified criteria). The new character retains damage and the exerted/ready state of the character underneath.
- **Singer N:** This character counts as cost N for the purpose of singing Songs.
- **Support:** When this character quests, you may add their Strength to another chosen character's Strength this turn.
- **Ward:** Opponents can't choose this card with effects (except to challenge).

**Playing a Card "For Free":** Ink cost is ignored, but other costs or conditions must still be met.

**Replacement Effects:** Effects that alter or replace an event as it happens (e.g., "Instead of drawing a card, do X").

## High-Level Project Structure Considerations

As you translate these rules into code, consider organizing the system into logical modules such as:

- **GameManager:** Oversees the overall game state, player turns, and win/loss conditions.

- **Player:** Represents a player, managing their hand, deck, inkwell, lore, etc.

- **Card:** (and its subtypes: CharacterCard, ActionCard, ItemCard, LocationCard): Represents individual cards and their properties (cost, abilities, stats).

- **ZoneManager:** Handles card movements between zones (Deck, Hand, Play, Inkwell, Discard).

- **TurnManager:** Manages the phases and steps of a player's turn.

- **AbilityHandler / EffectResolver:** Manages the resolution of card abilities and effects, including the Bag mechanism for triggered abilities.

- **GameStateChecker:** Implements the logic for game state checks (banishing characters, checking win/loss).

- **ActionValidator:** Ensures player actions are legal according to game rules (e.g., can this character quest? can this card be played?).

## How to Use This README

This document is intended as a starting point. For detailed rulings and specific interactions, the Official Disney Lorcana Comprehensive Rules document is the ultimate source of truth. The flowcharts and full glossary provided in the [FLOWCHARTS.md](FLOWCHARTS.md) and [GLOSSARY.md](GLOSSARY.md) files offer a more granular breakdown of game processes.

When implementing a rule or mechanic, first understand its description here, then refer to the Comprehensive Rules for precise details.

Good luck, Illumineer!
