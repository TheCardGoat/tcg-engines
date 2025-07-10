# Grand Archive TCG: Rules Engine

This module implements the rules engine for the Grand Archive Trading Card Game. It provides the core game mechanics, state management, and rules enforcement for digital implementations of the game.
## Introduction

This document serves as a guide for engineers who have no prior context about the game, its mechanics, or its terminology. Our goal is to create a robust, type-safe, and testable digital rules engine that can accurately manage the game state and resolve all card interactions according to the comprehensive rules.

## How The Game Works: A Programmer's TL;DR
At its core, Grand Archive is a two-player game where each player's goal is to defeat the opponent's Champion. This is achieved by playing cards to attack the Champion and reduce its Life to zero.

### The Core Components

#### Decks
Each player has two decks:

- **Main Deck (60 cards):** Contains your primary cards (Allies, Actions, Items, etc.). You draw from this deck.
- **Material Deck (12 cards):** A "sideboard" of powerful cards, including your Champion and Regalia (special items/weapons). You don't draw from this; you play cards from it using a special resource.
#### The Champion
This is your avatar in the game. It's always on the field.

- It has a **Level (LV)**, which increases during the game. Higher levels unlock more powerful card effects.
- It has **Life**. When its life reaches zero (by taking damage), you lose.
- It has a **Lineage**. When you level up your Champion, you place the new Champion card on top of the old one. The stack of cards is the Champion's lineage, and it inherits abilities from the cards beneath. Think of it as an object with decorators.
#### Resources
There are two primary resource types, which correspond to the two decks:

- **Reserve Cost:** To play cards from your hand (drawn from the Main Deck), you pay a Reserve Cost. You do this by taking other cards from your hand and placing them face-down into a zone called Memory.
- **Memory Cost:** To play powerful cards from your Material Deck, you pay a Memory Cost. You do this by banishing (permanently removing) a number of cards at random from your Memory zone.
### The Game Loop: Turn Structure
A turn consists of several distinct phases. The game is a state machine that progresses through these phases:

1. **Wake Up Phase:** Your "rested" (tapped/used) cards become "awake" (ready).
2. **Materialize Phase:** You get one chance to play a card from your Material Deck by paying its Memory Cost.
3. **Recollection Phase:** This is key. All the cards you put into your Memory zone to pay Reserve Costs are returned to your hand. This is how you refuel your hand.
4. **Draw Phase:** You draw one card from your Main Deck.
5. **Main Phase:** This is where most action happens. You can play cards from your hand (paying Reserve Costs), activate abilities, and declare an attack to initiate combat.
6. **End Phase:** Cleanup step. Temporary effects wear off.
### The "Stack": How Actions Resolve
Like many TCGs, Grand Archive uses an Effects Stack to manage actions:

- When a player plays a card or activates an ability, it doesn't happen instantly. It goes onto the stack.
- The stack resolves in Last-In, First-Out (LIFO) order.
- Before an item on the stack resolves, both players get Opportunity to respond by playing "Fast" cards or activating abilities, which also go onto the stack.
- The game only moves forward when the stack is empty and both players pass their Opportunity to act.
## Architectural Guide for Implementation

Modeling this game requires thinking in terms of game state, entities, and events.

### The Game State
This is the root object of our engine. It should be a snapshot of the entire game at any given moment and contain:

A list of Players.
The current Phase and Turn Number.
The EffectsStack.
Shared Zones like the Field.
An ideal implementation would treat the GameState as immutable. An action doesn't modify the state; it takes the current state and produces a new state. (GameState, Action) => GameState.

### Core Models & Entities
These will likely be your primary classes or data structures:

- **Card:** Represents the static, printed data of a card (e.g., from a JSON database). It has a name, cost, type, text, etc. It does not change.

- **Object:** An instance of a card on the Field. This is a dynamic entity. It has a reference to its source Card data but also tracks its own state:
  - Damage counters
  - Other counters (Buff, Debuff, etc.)
  - Whether it's Awake or Rested
  - Continuous effects currently applied to it

- **Player:** Manages a player's Life (via their Champion), Hand, Graveyard, MainDeck, MaterialDeck, and Memory zones.

- **Zone:** A container for cards or objects (e.g., Hand, Field, Graveyard). Each zone has specific rules about visibility (public/private) and ordering.

- **Action / Event:** These drive the game.
  - A player performs an Action (e.g., ActivateCardAction)
  - The engine validates the action and translates it into one or more Events (e.g., CardWasPlacedOnStack, ResourcesWerePaid)
  - The engine's reducers process these events to generate the new GameState
  - Triggers (like "On Enter" or "On Death") are simply listeners for these specific events. When they hear an event they care about, they create a new Action to place their ability on the stack
### Key Terminology for Engineers

| Term | Engineering Analogy / TL;DR |
|------|----------------------------|
| Object | An instance of a Card on the Field. Think of this as the primary game entity. Base class for Champion, Ally. |
| Unit | An Object that can attack. Specifically, a Champion or an Ally. |
| Zone | A container for cards (Hand, Graveyard, Deck, Memory, Banishment, EffectsStack). Each is a list with unique properties. |
| Activate | The action of playing a card from your hand (paying Reserve Cost). The card is placed on the Effects Stack. |
| Materialize | The action of playing a card from your Material Deck (paying Memory Cost). The card is placed on the Effects Stack. |
| Resolve | An Action or Trigger on the Effects Stack has its effect applied to the GameState. |
| Awake / Rested | A boolean state on an Object. isRested: false / true. Resting is the cost for many actions, like attacking. |
| Opportunity | The "turn" a player has to Activate a fast ability or card, usually in response to another action. It's the mechanism that controls flow. |
| Fizzle | When an Action on the stack has its targets become invalid before it can Resolve. It's removed from the stack with no effect. |
| State-Based Effects | Game cleanup rules that are checked automatically whenever a player gets Opportunity. (e.g., "Does a unit have 0 life? If so, it dies.") |

## Development Roadmap
This is a suggested order of implementation to build the engine from the ground up:

### Phase 1: Core Models & State

- [ ] Define the data structures for Card, Player, Zone, and GameState.
- [ ] Implement deck creation and the initial game setup (placing Champions, shuffling, etc.).

### Phase 2: The Turn Engine

- [ ] Build the state machine to advance through the turn phases (Wake Up -> Materialize -> etc.).
- [ ] Implement the turn-based actions for each phase (drawing a card, waking up units, recollection).

### Phase 3: Card Play & The Stack

- [ ] Implement the logic for Activate and Materialize actions.
- [ ] Model the EffectsStack (LIFO).
- [ ] Implement resource payment (Reserve and Memory costs).
- [ ] Build the Opportunity system to manage player responses.

### Phase 4: Combat

- [ ] Implement the Attack action.
- [ ] Model the sub-phases of combat (Retaliation, Damage, End of Combat).
- [ ] Implement damage calculation and application to Objects.

### Phase 5: Abilities & Effects

- [ ] Implement the event/trigger system (On Enter, On Hit, On Death).
- [ ] Model continuous effects, keyword abilities (Taunt, Stealth), and counters.

## Reference Documentation

For detailed implementation guidance, please refer to:
- [Comprehensive Rules](RULES.md)
- [Game Flow Diagrams](FLOWCHARTS.md)
- [Glossary of Terms](GLOSSARY.md)

## Development Status

This engine is currently under development. It will eventually be extracted to a separate package.
