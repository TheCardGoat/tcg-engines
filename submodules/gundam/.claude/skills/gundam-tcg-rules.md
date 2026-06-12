---
name: gundam-tcg-rules
description: Official Gundam Card Game TCG rules, glossary, and rule-resolution guidance for this repository. Use whenever work touches gameplay logic, turn flow, combat, shields, damage, deckbuilding, resource management, card behavior, effect resolution, keyword effects, linking/pairing, AI behavior, balance, rules text, UI copy, tests, or design docs and the output must stay aligned with the published comprehensive rules.
---

# Gundam TCG Rules

Treat the comprehensive rules document at `.claude/skills/gundam-rules.md` (Ver. 1.5.0) as the source of truth for the current rules. Keep the glossary in this file in working context for every substantive task in this repository, then load only the matching reference files for the mechanic you are touching.

## Workflow

- Keep the glossary section below in context for the full task.
- Read [references/turn-structure.md](../../references/turn-structure.md) before changing setup, turn sequencing, phase order, draw/resource phases, or end-of-turn conditions.
- Read [references/combat-and-battles.md](../../references/combat-and-battles.md) before changing attack declarations, battle steps, blocking, damage calculation, shields, Breach, First Strike, Suppression, or direct attacks.
- Read [references/cards-and-keywords.md](../../references/cards-and-keywords.md) before changing card types, keyword effects, timing keywords, pilot pairing, linking, attachment behavior, or card properties.
- Read [references/deckbuilding-and-zones.md](../../references/deckbuilding-and-zones.md) before changing deck validation, resource management, zone limits, hand limits, or zone transitions.
- Read [references/effects-and-resolution.md](../../references/effects-and-resolution.md) before changing effect types, activation costs, resolution order, action steps, rules management, or conditional branches.
- Read [references/multiplayer.md](../../references/multiplayer.md) before changing Battle Royale, Team Battle, or multi-opponent targeting.
- Cross-reference structured types in `packages/types/src/card.ts` and `packages/types/src/effects.ts` when implementing or modifying engine logic.
- Distinguish source-backed rules from inference. If the comprehensive rules do not define a behavior, say that explicitly instead of importing assumptions from another TCG.
- Flag any intentional repo divergence from the published rules instead of silently reconciling it.
- Remember that the rules document describes Ver. 1.5.0 and may change in future releases.

## Hard Constraints

- Let card text override base rules when they conflict (Rule 1-3).
- Defeat a player who takes battle damage with no shields remaining (Rule 1-2-2-1).
- Defeat a player whose deck reaches 0 cards (Rule 1-2-2-2).
- Process defeat during rules management (Rule 1-2-3).
- Allow a player to concede at any time for an immediate loss. No card effect can force concession (Rules 1-2-4, 1-2-5).
- Proceed through turns in strict phase order: Start → Draw → Resource → Main → End.
- Prevent Units from attacking on the turn they enter the field unless they enter via a link or an effect explicitly overrides that rule.
- Allow attacks only against the opponent player or the opponent's rested Units. Do not allow attacks against active (ready) Units.
- Resolve each attack fully through all five battle steps (Attack → Block → Action → Damage → End) before declaring the next attack.
- Deal damage equal to the attacking Unit's AP. A Unit whose accumulated damage ≥ HP is destroyed and sent to the trash.
- When a shield is removed by damage, flip it face-up. If it has 【Burst】, the defending player may activate it.
- `<Blocker>` redirects the attack to the blocking Unit — if the original target was the player, no shield damage occurs.
- `<First Strike>` deals damage before the opponent; if the opponent is destroyed, it deals no damage back.
- `<High-Maneuver>` prevents the attack from being blocked.
- `<Breach N>` deals N additional shield damage after destroying an enemy Unit.
- `<Suppression N>` hits N shields instead of 1 on a direct attack.
- Enforce deck construction: 50-card main deck, 10-card resource deck, max 4 copies of any card number.
- Enforce zone limits: max 6 Units in battle area, max 15 resources, max 10 cards in hand.
- Resolve effects in written order. Perform actions as much as possible; skip impossible actions.
- Active player resolves first in simultaneous choices.
- Tokens are removed from the game when they leave a valid zone.
- Pilots move with their linked Unit when the Unit changes zones.

## Glossary

- `Active`: Card is upright. Only active Units can declare attacks. Active resources can be rested to pay costs.
- `Rested`: Card is turned sideways. A rested card cannot be rested again until readied. Units rest when they attack; resources rest when spent.
- `Ready`: Return a rested card to active (upright) position. Happens at Start Phase for all cards.
- `AP (Attack Points)`: Offensive power of a Unit. Damage dealt equals AP.
- `HP (Hit Points)`: Defensive value of a Unit. Accumulated damage ≥ HP → destroyed.
- `Level (Lv.)`: Resource-level requirement. A card can only be played when the player's resource count ≥ the card's level.
- `Cost`: Number of resources to rest to play a card.
- `Color`: Blue, Green, Red, White, or Purple. Resources and tokens have no color.
- `Trait`: Categorical tag (e.g., faction, mobile suit class). Cards may have multiple traits.
- `Unit`: Card deployed to the battle area. The only card type that can attack. Has AP and HP.
- `Pilot`: Card paired under a Unit. Adds AP/HP bonuses and effects. Moves with its Unit.
- `Command`: One-shot effect card. Sent to trash after resolution. May have 【Pilot】 or 【Burst】.
- `Base`: Placed in the shield area. Absorbs damage before shields. Has HP.
- `Resource`: Placed in the resource area from the resource deck. Rested to pay costs. No color.
- `Pair`: Place a Pilot under a Unit. The Pilot's bonuses apply immediately.
- `Link`: When a Unit's link condition is met by the paired Pilot, the Unit becomes linked, gaining additional effects and the ability to attack on the turn it enters play.
- `Link Condition`: Printed requirements on a Unit specifying which Pilot(s) can form a link.
- `Shield`: Face-down card in the shield area. Absorbs 1 point of battle damage. Flipped face-up when removed; 【Burst】 may activate.
- `Battle Area`: Zone for Units and combat. Max 6 Units.
- `Shield Area`: Zone for shields (face-down) and Bases.
- `Resource Area`: Zone for deployed resources. Max 15.
- `Trash`: Public discard pile for destroyed Units, resolved Commands, discarded cards.
- `Removal Area`: Public zone for removed cards. Generally not recoverable.
- `Hand`: Private zone. Max 10 cards; discard excess at End Phase.
- `Deck`: Face-down draw pile. 0 cards = defeat.
- `Resource Deck`: Separate pile for Resource cards.
- `Destroy`: A Unit whose accumulated damage ≥ HP is destroyed and sent to the trash.
- `Discard`: Send a card from hand to trash.
- `Remove`: Send a card to the removal area.
- `Token`: Card created by effects. Removed from game when leaving a valid zone.
- `Damage Counter`: Tracks accumulated damage on a Unit.
- `EX Base`: Special Base placed during setup.
- `EX Resource`: Bonus resource given to Player Two during setup.
- `【Burst】`: Timing keyword — activates when a shield is flipped face-up by battle damage.
- `【Deploy】`: Timing keyword — activates when a card enters the battle area.
- `【Attack】`: Timing keyword — activates when a Unit declares an attack.
- `【Destroyed】`: Timing keyword — activates when a card is destroyed and sent to trash.
- `<Blocker>`: Keyword effect — rest this active Unit to redirect an opponent's attack to itself.
- `<Repair>`: Keyword effect — heal damage at end of turn.
- `<Breach N>`: Keyword effect — deal N additional shield damage after destroying an enemy Unit.
- `<Support>`: Keyword effect — buff allied Units.
- `<First Strike>`: Keyword effect — deal damage before the opponent in battle.
- `<High-Maneuver>`: Keyword effect — cannot be blocked.
- `<Suppression N>`: Keyword effect — hit N shields instead of 1 on a direct attack.

## Source

- Source document: `.claude/skills/gundam-rules.md`
- Rules version: Ver. 1.5.0 (Updated January 30, 2025)
- Source status: published comprehensive rules, subject to future version updates
