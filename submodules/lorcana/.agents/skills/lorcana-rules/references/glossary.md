# Lorcana Glossary

Load this file before rules-facing Lorcana work. Use these terms in player-facing copy, tests, and implementation notes unless the codebase has an established narrower type name.

## Core Objects

- Character: Card type that can quest, challenge, sing, take damage, and be banished.
- Action: One-shot card type. Songs are a subtype of action.
- Item: Card type that stays in play and may have static, triggered, or activated abilities.
- Location: Card type in play with move cost and Willpower. Locations can be challenged and may provide lore.
- Song: Action that can be played by paying ink or by exerting one or more eligible characters to sing.

## Zones

- Deck: Private stack a player draws from.
- Hand: Private zone of cards available to play.
- Play: Public zone containing characters, items, and locations.
- Inkwell: Private zone of facedown ink cards used to pay ink costs.
- Discard: Public zone for discarded, banished, or resolved cards.
- Bag: Non-physical zone where triggered abilities wait before resolving.

## Turn And State Terms

- Active player: Player currently taking their turn.
- Ready: Upright state. Ready cards can usually be exerted to pay costs or take actions.
- Exert: Turn a card sideways to pay a cost or take an action.
- Exerted: Sideways state.
- Drying: A character played after the start of its player's current turn. Drying characters cannot quest, challenge, or pay exert costs unless an effect allows it.
- Dry: A character that has been in play since the start of its player's turn.
- Start-of-Turn Phase: Ready, Set, and Draw steps.
- Main Phase: Phase where turn actions happen.
- End-of-Turn Phase: End timing and turn cleanup.

## Actions And Resolution

- Turn action: Main Phase action such as inking, playing a card, questing, challenging, moving to a location, or using an activated ability.
- Ink: Resource represented by cards in the inkwell; also the act of putting a card into the inkwell.
- Quest: Exert a character to gain lore equal to its Lore value.
- Challenge: Exert a dry character to challenge an exerted opposing character or opposing location.
- Move: Move a character to a location by paying move cost.
- Game state check: Rules check performed after actions and effects to process wins, losses, banishment, and pending triggers.
- Triggered ability: Ability that adds an effect to the bag when its condition is met.
- Replacement effect: Effect that modifies or replaces an event.

## Values

- Lore: Resource players race to gain. Reaching 20 or more lore wins in normal play.
- Lore value: Amount of lore a character gains by questing or a location grants at the start of turn.
- Strength: Amount of damage a character deals in a challenge.
- Willpower: Amount of damage needed to banish a character or location.
- Damage: Counters on characters or locations that count against Willpower.
- Ink cost: Ink required to play a card or pay a cost.

## Keywords

- Bodyguard: Opposing challenges must choose a character with Bodyguard if able.
- Evasive: Can be challenged only by characters with Evasive.
- Reckless: Cannot quest and can restrict ending the turn while able to challenge.
- Resist +N: Reduces damage dealt by N.
- Rush: Can challenge as though dry.
- Shift: Alternate play method that puts a character on top of another character.
- Singer: Can sing songs of a stated cost or less.
- Sing Together: Multiple ready characters can exert together to sing.
- Support: Triggered ability that adds Strength to another chosen character this turn.
- Vanish: Banish this character when an opponent chooses it for an action, ability, or effect.
- Ward: Opponents cannot choose this character except to challenge.
