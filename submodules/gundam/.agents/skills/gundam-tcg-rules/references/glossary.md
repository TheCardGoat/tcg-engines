# Gundam Glossary

Load this file before rules-facing Gundam work. Use these terms in player-facing copy, tests, and implementation notes unless the codebase has an established narrower type name.

## Core Objects

- Unit: Card deployed to the battle area. Units can attack and have AP and HP.
- Pilot: Card paired beneath a Unit. Pilots add AP/HP and may grant effects.
- Command: One-shot effect card. Commands go to trash after resolution unless a Command with a Pilot effect is paired as a Pilot.
- Base: Card placed in the shield area base section. Bases absorb damage before Shields.
- Resource: Card placed from the resource deck into the resource area and rested to pay costs.

## Card Values

- AP: Attack Points. A Unit deals battle damage equal to its AP.
- HP: Hit Points. A Unit, Base, or Shield is destroyed when damage causes HP to reach zero or less.
- Lv.: Resource-level requirement. A player can play a card only when their resource count is at least that Lv.
- Cost: Number of active Resources rested to play a card or activate an effect.
- Color: Blue, green, red, white, or purple.
- Trait: A categorical tag referenced by card text. Pilot traits are not added to paired Units.
- Link Condition: Printed requirement on a Unit that can be satisfied by a paired Pilot.

## Locations

- Deck Area: Face-down main deck.
- Resource Deck Area: Face-down resource deck.
- Resource Area: Area for Resources. The default maximum is 15 Resources.
- Battle Area: Area for Units and paired Pilots. The default maximum is 6 Units.
- Shield Area: Area containing Shields and a Base section.
- Removal Area: Public area for removed cards.
- Hand: Private area. The default maximum is 10 cards.
- Trash: Public discard pile.

## State And Turn Terms

- Active Player: Player whose turn it is.
- Standby Player: Non-active player.
- Active: Upright state.
- Rested: Sideways state.
- Ready: Set a rested card active.
- Start Phase: Ready cards and resolve start timing.
- Draw Phase: Draw a card.
- Resource Phase: Place a Resource from resource deck.
- Main Phase: Deploy Units/Bases, pair Pilots, activate Commands, activate effects, and attack.
- End Phase: Resolve end timing and cleanup.

## Combat And Damage

- Attack Step: Active player declares an attack and chooses a legal target.
- Block Step: Standby player may activate <Blocker>.
- Action Step: Players may activate allowed action-step effects.
- Damage Step: Battle damage is dealt and managed.
- Battle End Step: End-of-battle timing.
- Shield: Face-down card in the shield section with 1 HP.
- Burst: Effect that may activate when a Shield is revealed after being destroyed.
- Battle damage: Damage dealt by attacking and battling Units.
- Effect damage: Damage from card effects.
- Damage Counter: Counter tracking damage.
- Destroy: Move a destroyed Unit, Pilot, Base, Shield, or resolved Command to trash as appropriate.

## Pair And Link Terms

- Pair: Place a Pilot card or Command card with a Pilot effect beneath a Unit.
- Link Unit: Unit paired with a Pilot satisfying its link condition.
- When Paired: Timing when a Pilot is paired with a Unit.
- During Pair: Continuous condition while a qualifying Pilot is paired.
- When Linked: Timing when a Pilot meeting the link condition is set.
- During Link: Continuous condition while a Pilot meeting the link condition is paired.

## Keywords

- <Support>: Keyword effect that buffs allied Units.
- <Breach>: Deals additional damage to the first card in the enemy shield area after destroying an enemy Unit with battle damage.
- <Repair>: Heals damage at end of turn.
- <Blocker>: Rest this active Unit during the Block Step to change the attack target to it.
- <First Strike>: Deals battle damage before the enemy during the Damage Step.
- <High-Maneuver>: While attacking, enemy Units cannot activate <Blocker>.
- <Suppression>: Deals damage to the first two Shields simultaneously when damaging enemy Shields.
- Development: Keyword effect typically nested in timing keywords.
- Burst: Optional no-cost shield effect when a Shield is destroyed and revealed.
