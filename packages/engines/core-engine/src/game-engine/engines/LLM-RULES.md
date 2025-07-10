# LLM-RULES

This document consolidates the core rules of various trading card games for efficient AI understanding and improved context management.

## Universal Game Concepts

### Core Mechanics
- **Players**: Each game typically has 2 players, with some supporting multiplayer variants
- **Win Conditions**: Accumulate points, reduce opponent health to zero, or satisfy game-specific victory conditions
- **Turn Structure**: Phases organized into beginning, action, and end segments
- **Resources**: Systems for playing cards (ink, energy, resources, power, runes)
- **Zones**: Designated areas where cards exist (hand, field/board, discard/trash, etc.)
- **Cards**: Primary game objects with various types, costs, and effects

### Universal Card Properties
- **Cost**: Resources required to play a card
- **Type**: Primary card classification (unit/character, spell/action, item/gear, etc.)
- **Text**: Card effects, abilities, and conditions
- **Name**: Unique identifier for referencing
- **Zone Transitions**: Moving between public zones (field/board) and private zones (hand, deck)

### Core Gameplay Loop
1. Draw resources/cards
2. Play cards by paying costs
3. Use cards to attack/defend
4. Resolve effects
5. End turn and pass to opponent

### Fundamental Rules
- **Card > Rules**: Card text overrides general rules when contradictory
- **Complete > Partial**: Perform as much of an effect as possible if not fully executable
- **Active Player Priority**: Active player makes decisions first when simultaneous choices required
- **State Transitions**: Cards change states (ready/exhausted, active/rested) to indicate usage

## Game-Specific Rule Systems

### Riftbound

#### Core Concepts
- **Victory**: Accumulate points by conquering and holding Battlefields
- **Resources**: Runes produce Energy and Power in player's Rune Pool
- **Main Components**: Units, Gear, Spells, Runes, Battlefields, Legend

#### Turn Structure
1. **Start of Turn**
   - Awaken Phase: Ready all game objects
   - Beginning Phase: Score points from held battlefields
   - Channel Phase: Add runes from Rune Deck
   - Draw Phase: Draw cards

2. **Action Phase**
   - Play cards, activate abilities
   - Move units between Locations
   - Initiate Combat or Showdowns

3. **End of Turn Phase**
   - Ending Step: End-of-turn effects trigger
   - Expiration Step: Clear damage, "this turn" effects expire
   - Cleanup Step: Resolve state-based actions

#### Combat System
1. Showdown Step: Establish attacker/defender, activate abilities
2. Combat Damage Step: Resolve damage between units
3. Resolution Step: Remove defeated units, determine conquest

#### Zones
- **Board Zones**: Base, Battlefield Zone, Legend Zone
- **Non-Board Zones**: Trash, Champion Zone, Main Deck Zone, Rune Deck Zone, Hand, Banishment

#### Key Mechanics
- **Control**: Establishing dominance over Battlefields
- **Movement**: Units moving between Base and Battlefields
- **Damage**: Units mark damage until end of turn/combat
- **Keywords**: Special abilities like Accelerate, Ganking, Shield

### Grand Archive

#### Core Concepts
- **Resources**: Reserve Cost (cards from hand), Memory Cost (banished cards)
- **Main Components**: Champions, Allies, Action cards, Domains, Regalia
- **Awakened/Rested**: Card states (vertical/horizontal)

#### Turn Structure
1. **Wake Up Phase**: Ready rested objects
2. **Recollection Phase**: Return cards from Memory
3. **Draw Phase**: Draw a card
4. **Materialize Phase**: Materialize from Material Deck
5. **Main Phase**: Play cards, attack
6. **End Phase**: End of turn effects

#### Combat System
- **Attacks**: Between units or against players
- **Retaliation**: Defenders counter-attack
- **Keywords**: Mechanisms like Ambush, Retort, and Cleave

#### Zones
- **Main Deck**: Draw cards from here
- **Hand**: Private zone for held cards
- **Field**: Where permanents are played
- **Graveyard**: Discarded/destroyed cards
- **Memory**: Face-down resource zone
- **Banishment**: Removed cards

### Disney Lorcana

#### Core Concepts
- **Victory**: First to 20 lore wins
- **Resources**: Ink (cards in inkwell)
- **Main Components**: Characters, Items, Actions, Locations
- **Ready/Exerted**: Card states (upright/sideways)

#### Turn Structure
1. **Beginning Phase**
   - Ready Step: Ready exerted cards
   - Set Step: Characters become dry, gain lore from locations
   - Draw Step: Draw a card

2. **Main Phase**
   - Play cards
   - Quest for lore
   - Challenge opposing characters/locations

3. **End of Turn Phase**

#### Card Actions
- **Quest**: Exert character to gain lore equal to its lore value
- **Challenge**: Exert character to attack opponent's character or location
- **Move**: Place character at a location

#### Zones
- **Play Zone**: Characters, items, and locations in play
- **Inkwell**: Facedown cards used as ink
- **Discard Pile**: Actions after use and banished cards
- **Hand**: Drawn cards waiting to be played
- **Deck**: Cards to draw from

### Alpha Clash TCG

#### Core Concepts
- **Victory**: Reduce opponent's Contender to 0 health
- **Resources**: Cards in resource zone
- **Main Components**: Contender (player card), Clash cards, Accessories
- **Ready/Engaged**: Card states (vertical/horizontal)

#### Turn Structure
1. **Start of Turn Phase**
2. **Expansion Phase**: Ready Step, Draw Step, Resource Step
3. **Primary Phase**: Play cards, activate effects, initiate Clashes
4. **End of Turn Phase**

#### Combat System (Clash Phase)
1. Attack Step
2. Counter Step
3. Obstruct Step
4. Clash Buff Steps
5. Damage Step

#### Zones
- **Contender Zone**: Player's primary card
- **Clash Zone**: Units for attacking/defending
- **Accessory Zone**: Equipment and traps
- **Resource Zone**: Cards providing resources
- **Hand**: Cards held for playing
- **Oblivion**: Discard pile

### Gundam Card Game

#### Core Concepts
- **Victory**: Deal damage with no shields, deplete opponent's deck
- **Resources**: Resource cards in resource area
- **Main Components**: Units, Pilots, Command cards, Bases
- **Active/Rested**: Card states (vertical/horizontal)

#### Turn Structure
1. **Start Phase**: Active Step, Start Step
2. **Draw Phase**: Draw a card
3. **Resource Phase**: Place a resource
4. **Main Phase**: Play cards, activate effects, attack
5. **End Phase**: Action Step, End Step, Hand Step, Cleanup Step

#### Combat System
1. Attack Step: Declare attack, trigger effects
2. Block Step: Defender may use Blockers
3. Action Step: Play Action cards and abilities
4. Damage Step: Resolve damage
5. Battle End Step: End battle effects

#### Zones
- **Battle Area**: Units and Pilots in play
- **Shield Area**: Base Section and Shield Section for defense
- **Resource Area**: Resources for costs
- **Hand**: Cards drawn from deck
- **Trash**: Discard pile

## Cross-Game Terminology Guide

| Concept | Riftbound | Grand Archive | Lorcana | Alpha Clash | Gundam |
|---------|-----------|--------------|---------|-------------|--------|
| Primary Unit | Unit | Champion/Ally | Character | Clash Card | Unit |
| Resource | Energy/Power | Reserve/Memory | Ink | Resources | Resources |
| Ready State | Ready | Awake | Ready | Ready | Active |
| Used State | Exhausted | Rested | Exerted | Engaged | Rested |
| Discard Zone | Trash | Graveyard | Discard | Oblivion | Trash |
| Main Combat | Combat | Attack | Challenge | Clash | Battle |
| Card Play Cost | Energy Cost | Reserve Cost | Ink Cost | Resource Cost | Level/Cost |
| Health | Might | HP | Willpower | Defense | HP |
| Attack | Might | Strength | Strength | Attack Power | AP |
| Win Condition | Points | Reduce Life | Lore (20) | Contender Health | Shield Damage |

## Glossary Mapping

This section maps equivalent terminology across games:

- **Units/Characters**
  - Units (Riftbound): Pieces moved between Base and Battlefields with Might values
  - Champions/Allies (Grand Archive): Primary combat pieces with Strength/Health
  - Characters (Lorcana): Cards that quest for lore or challenge opponents
  - Clash Cards (Alpha Clash): Combat pieces with Attack/Defense values
  - Units (Gundam): Battle pieces with AP/HP values

- **Card States**
  - Ready/Exhausted (Riftbound): Vertical/horizontal card orientation
  - Awake/Rested (Grand Archive): Vertical/horizontal card orientation
  - Ready/Exerted (Lorcana): Upright/sideways card orientation
  - Ready/Engaged (Alpha Clash): Vertical/horizontal card orientation
  - Active/Rested (Gundam): Vertical/horizontal card orientation

- **Combat Terms**
  - Combat (Riftbound): Units fighting at contested battlefields
  - Attack (Grand Archive): Units engaging other units or players
  - Challenge (Lorcana): Characters attacking other characters or locations
  - Clash (Alpha Clash): Combat between Clash cards or against Contender
  - Battle (Gundam): Units attacking other units or player's shield area