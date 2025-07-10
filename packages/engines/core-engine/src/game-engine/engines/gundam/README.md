# Gundam Card Game Engine

This module implements the rules engine for the Gundam Card Game. It provides the core game mechanics, state management, and rules enforcement for digital implementations of the game.

## Introduction

This document provides an engineering guide for the development of a digital implementation of the Gundam Card Game. The goal of this project is to create a software engine that accurately simulates the rules and gameplay of this two-player competitive trading card game. This README is intended for engineers who may not be familiar with the game's mechanics or terminology.

The game involves players building decks of cards representing Mobile Suits (Units), Pilots, strategic Commands, and defensive Bases. Players use Resources to deploy these cards, engage in battles, and ultimately try to defeat their opponent.

## Game Objective

The primary objective is to defeat the opposing player. A player is defeated, and the game ends, under the following conditions (Rule 1-2):

Shield Depletion & Damage: A player receives battle damage from an opponent's Unit while having no cards in their Shield Area.

Deck Out: A player has no cards remaining in their Deck to draw.

Concession: A player chooses to concede the game at any time.

## Core Game Concepts

Understanding these core concepts is crucial for implementing the game logic.

### Players

The game is designed for two players: an Active Player (whose turn it is) and a Standby Player.

### Card Types (Rule 2-3)

Cards are the fundamental components of the game. Each has specific roles:

Unit Cards: Represent Mobile Suits or other combat entities. They are played to the Battle Area to attack and defend. They have Attack Points (AP) and Hit Points (HP).

Pilot Cards: Represent characters that can be "paired" with Unit cards in the Battle Area. They typically provide AP/HP bonuses and additional effects to the Unit they are paired with.

Command Cards: One-time use cards played from the hand for various strategic effects. Some Command cards may have alternative uses, such as being played as Pilots or having "Burst" effects when a Shield is destroyed.

Base Cards: Deployed to the Base Section of the Shield Area. They often provide defensive capabilities or persistent effects. They have HP and sometimes AP.

Resource Cards: These form a separate Resource Deck. Players play one Resource card per turn into their Resource Area to generate the "energy" needed to play other cards.

### Key Game Zones (Rule 3)

Each player has their own set of game zones:

Deck Area: Contains the player's main deck (50 cards, face-down, private).

Resource Deck Area: Contains the player's resource deck (10 cards, face-down, private).

Hand: Cards drawn from the Deck (private, max 10 cards at end of turn).

Resource Area: Where played Resource cards are placed (face-up, public). Max 15 Resources.

Battle Area: Where Units and their paired Pilots are placed (face-up, public). Max 6 Units.

Shield Area: A defensive zone.

Shield Section: Contains 6 face-down cards from the Deck at the start of the game. These act as a form of life points. When a player is attacked, Shields are typically destroyed one by one.

Base Section: Where one Base card can be played (face-up, public).

Trash: A discard pile for destroyed cards, used Command cards, etc. (face-up, public).

Removal Area: A zone for cards that are "removed" from the game by specific effects (public).

### Basic Card Stats (Rule 2-6 to 2-9)

AP (Attack Points): A card's offensive strength.

HP (Hit Points): A card's defensive strength. If a card's HP reaches 0 (or less) due to damage, it is destroyed.

Lv. (Level): The minimum number of Resource cards a player must have in their Resource Area to play a card.

Cost: The number of active (untapped) Resource cards a player must "rest" (tap) to play a card.

## Game Flow Overview

The game progresses through a setup phase followed by a series of player turns. The flowcharts provided in the [FLOWCHARTS.md](FLOWCHARTS.md) file offer a detailed visual representation of these processes.

### Game Setup (Rule 5.2 & Flowchart: Game Setup)

Deck Presentation: Players present their 50-card main Deck and 10-card Resource Deck.

Shuffling & Placement: Decks are shuffled and placed in their respective areas.

Determine Player Order: Players determine who is Player One and Player Two.

Starting Hand: Each player draws 5 cards.

Mulligan: Players (Player One first, then Player Two) may choose to redraw their starting hand once.

Shield Placement: Each player places the top 6 cards of their Deck face-down into their Shield Section.

EX Base: Each player places an "EX Base" token (a predefined Base) into their Base Section.

EX Resource (Player Two): Player Two places an "EX Resource" token into their Resource Area.

Game Start: Player One begins their first turn.

### Turn Structure (Rule 6.1 & Flowchart: Turn Progression)

Each player's turn consists of five phases, executed in order:

Start Phase (Rule 6.2):

Active Step: The active player makes all their "rested" (tapped) cards in their Battle Area, Resource Area, and Base Section "active" (untapped).

Start Step: Any effects that trigger "at the start of the turn" activate.

Draw Phase (Rule 6.3):

The active player draws one card from their Deck. (If the deck is empty, they lose).

Resource Phase (Rule 6.4):

The active player places one Resource card from their Resource Deck into their Resource Area (face-up and active).

Main Phase (Rule 6.5 & Flowchart: Main Phase):

The active player can perform any of the following actions multiple times and in any order:

Play a Card from Hand: Deploy Units, Bases, pair Pilots, or activate Command cards (see Flowchart: Play Card from Hand). This usually involves paying the card's Cost by resting Resources and meeting its Level requirement.

Activate an [Activate Main] effect: Use special abilities on cards already in play.

Attack with a Unit: Initiate an attack against the opponent or one of their rested Units (see Section 4.3 below and Flowchart: Attack Sequence).

The player can declare the end of their Main Phase to proceed to the End Phase.

End Phase (Rule 6.6):

Action Step: Both players (starting with the standby player) get an opportunity to play [Action] Command cards or activate [Activate Action] effects (see Flowchart: Action Step).

End Step: Any effects that trigger "at the end of the turn" activate (e.g., <Repair>).

Hand Step: If the active player has more than 10 cards in hand, they discard down to 10.

Cleanup Step: Effects with a duration of "during this turn" end.

The turn then passes to the opponent.

### Attack Sequence (Rule 7 & Flowchart: Attack Sequence)

Attacking is a critical part of the Main Phase and involves several steps:

Declare Attack: The active player chooses one of their active Units, rests it, and declares an attack target (either the opposing player or one of the opponent's rested Units).

Attack Step: "[When Attacking]" effects trigger.

Block Step: The standby player may use a Unit with the <Blocker> keyword effect to intercept the attack, changing the attack target to their Blocker Unit.

Action Step (during attack): Similar to the End Phase Action Step, players can play [Action] cards or activate [Activate Action] effects.

Damage Step:

If attacking a Unit: The attacking Unit and the defending Unit simultaneously deal damage to each other equal to their AP. Units whose HP drops to 0 or less are destroyed. (The <First Strike> keyword effect alters this timing).

If attacking a Player:

If the opponent has a Base in their Shield Area, the attacking Unit deals damage to the Base.

If no Base but Shields exist, the attacking Unit deals damage to the topmost Shield card. The Shield is destroyed and revealed. If it has a [Burst] effect, the owner may activate it.

If no Base and no Shields, the attacking Unit deals damage directly to the player. This results in the player's defeat.

Battle End Step: "During this battle" effects end. Play returns to the Main Phase.

## Key Terminology Highlights

A comprehensive glossary is available in the [GLOSSARY.md](GLOSSARY.md) file. Some frequently encountered terms include:

Active/Rested: States of cards, indicating if they can perform actions (Active) or have already performed an action (Rested).

Destroy: A card is sent to the Trash, usually because its HP reached 0.

Deploy: To play a Unit or Base card to its respective area.

Pair: To attach a Pilot card to a Unit.

Link Unit: A Unit paired with a Pilot that meets its specific "Link Conditions," often allowing it to attack the turn it's deployed.

Keyword Effects: Special abilities denoted by keywords in angle brackets (e.g., <Blocker>, <First Strike>, <Repair>).

Keywords: Special terms, often in square brackets, indicating timing or type of effects (e.g., [Deploy], [When Attacking], [Activate Main], [Burst]).

## How to Use This README for Development

This README provides a high-level overview. For detailed logic and step-by-step processes:

- **Refer to the Comprehensive Rules PDF:** This is the source of truth for all game interactions.

- **Consult the Flowcharts:** The [FLOWCHARTS.md](FLOWCHARTS.md) file visually breaks down Game Setup, Turn Progression, Main Phase Actions, and the Attack Sequence. These are invaluable for understanding the state transitions and decision points in the game logic.

- **Use the Glossary:** The [GLOSSARY.md](GLOSSARY.md) file defines specific game terms.

## Potential Project Structure (Conceptual)

Consider structuring the codebase into modules such as:

- **GameManager:** Handles overall game state, turn progression, win/loss conditions.

- **Player:** Manages player-specific data (hand, deck, resources, shields, units in play).

- **Card:** Base class for cards, with derived classes for Unit, Pilot, Command, Base, Resource. Handles card attributes and effects.

- **EffectProcessor:** Manages the activation and resolution of card effects, including triggered, activated, and constant effects.

- **BattleManager:** Handles the logic for attack sequences.

- **ZoneManager:** Manages card movements between different game zones.

- **RulesEngine:** Enforces game rules and manages interactions (e.g., rules management for excess cards in zones).

## Further Information

- **Primary Source:** [RULES.md](RULES.md)
- **Visual Logic:** [FLOWCHARTS.md](FLOWCHARTS.md)
- **Terminology:** [GLOSSARY.md](GLOSSARY.md)

This project requires careful attention to the sequence of operations, effect interactions, and state management. The provided resources should serve as a strong foundation for building a robust Gundam Card Game engine.

## Development Status

This engine is currently under development. It will eventually be extracted to a separate package.
