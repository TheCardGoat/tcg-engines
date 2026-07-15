# SWU Glossary And Keywords

Keep this file in context for SWU card, engine, parser, simulator, and rules
copy work. Use citations as lookup anchors; open the topic reference or full
rules file for exact text.

## Rule Posture

- Card text beats base rules when directly conflicting. Cite `1.3.1`.
- Resolve as much of an ability as possible. Cite `1.3.2`.
- Restrictions override permissions. Cite `1.3.3`.
- The active player is the player currently taking an action in the action
  phase. Cite `1.4`.

## Core Objects

- `Base`: A deck has one base. If a player's base is defeated, that player loses.
  See `3.2`, `5.6`.
- `Leader`: Starts in the base zone and may deploy as a leader unit. See `3.4`.
- `Unit`: In-play card in the ground or space arena that can attack. See `3.5`.
- `Event`: One-shot card resolved while played, then discarded. See `3.3`.
- `Upgrade`: In-play attachment attached to a unit. See `3.6`.
- `Token`: Game object created by abilities; token upgrades and token units have
  special zone limits. See `3.7`.
- `Resource`: A facedown card in a player's resource zone used to pay costs; it
  is a game object, not a card type. See `1.7`, `4.5`.

## Zones And State

- `Base zone`: Contains a player's base and undeployed leader. See `4.2`.
- `Ground arena`: In-play zone for ground units. See `4.3`.
- `Space arena`: In-play zone for space units. See `4.4`.
- `Resource zone`: Contains exhausted/ready resources. See `4.5`.
- `Deck`, `hand`, `discard pile`, `play area`, and `set aside`: use official
  zone rules before changing visibility or movement. See `4.6`-`4.11`.
- `Ready / exhausted`: Ready cards are upright; exhausted cards are sideways.
  Non-leader units and resources enter play exhausted. See `1.5.4`.
- `Initiative`: Determines the first active player and can change when a player
  takes the initiative action. See `5.4`, `5.5`.

## Abilities And Effects

- `Action ability`: Uses bold `Action`; pay its bracketed cost to use it. See
  `7.2`, `6.4`.
- `Constant ability`: Continuously affects the game while active. See `7.3`.
- `Event ability`: Resolves while an event is played. See `7.4`.
- `Triggered ability`: Uses timing words such as `When`, `On Attack`, or `When
Defeated`; resolve through trigger timing rules. See `7.6`.
- `Replacement/prevention`: Effects that replace or prevent events need explicit
  timing and affected-event modeling. See `8.21` and the matching effect text.
- `Delayed effect`: An effect created now that resolves later must retain source,
  controller, duration, and trigger condition. See `7.7` and related card text.
- `If you do`: The following effect only resolves if the preceding instruction
  was performed as required. See `8.10`.

## Counters, Damage, And Tokens

- `Damage`: Units and bases can have damage. A unit/base is defeated when damage
  on it is greater than or equal to remaining HP. See `1.9`, `1.11`, `5.6`.
- `Experience token`: Token upgrade that gives attached unit +1/+1. See `7.5.2`.
- `Shield token`: Token upgrade defeated instead of the unit taking damage. See
  `7.5.3`.
- `Power` and `HP`: Printed attributes modified by effects/upgrades. See `1.10`,
  `1.11`, `8.16`.

## Major Keywords

- `Ambush`: After playing the unit, its controller may ready it and attack an
  enemy unit. See `7.5.5`.
- `Grit`: Unit gets +1/+0 for each damage on it. See `7.5.6`.
- `Overwhelm`: While attacking, excess combat damage goes to the defending
  player's base. See `7.5.7`.
- `Raid N`: Unit gets +N/+0 while attacking. See `7.5.8`.
- `Restore N`: When this unit attacks, heal N damage from its controller's base.
  See `7.5.9`.
- `Saboteur`: While attacking, ignores Sentinel and defeats Shield tokens before
  combat damage. See `7.5.10`.
- `Sentinel`: Enemy units in the same arena must attack Sentinel units before
  non-Sentinel units or bases. See `7.5.11`.
- `Shielded`: When played, give this unit a Shield token. See `7.5.12`.
- `Bounty`: Opponent collects it when the unit is defeated or captured. See
  `7.5.13`.
- `Smuggle`: Alternative play permission/cost from resources. See `7.5.14`.
- `Exploit`: Exhaust friendly units to reduce play cost. See `7.5.15`.
- `Piloting`: Upgrade-style permission for pilot cards and attached unit
  modifiers. See `7.5.16`.
