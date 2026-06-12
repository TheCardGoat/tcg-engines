---
name: cyberpunk-tcg-rules
description: Official Cyberpunk TCG gameplay rules, glossary, and rule-resolution guidance for this repository. Use whenever work touches gameplay logic, turn flow, combat, Gig theft, Street Cred, deckbuilding, RAM limits, card behavior, AI behavior, balance, rules text, UI copy, tests, or design docs and the output must stay aligned with the published gameplay guide.
---

# Cyberpunk TCG Rules

Treat the official gameplay guide at `https://cyberpunktcg.com/gameplay-guide` as the source of truth for the current alpha rules. Keep the glossary in this file in working context for every substantive task in this repository, then load only the matching reference files for the mechanic you are touching.

## Workflow

- Keep the glossary section below in context for the full task.
- Read [references/turn-structure.md](references/turn-structure.md) before changing setup, turn sequencing, attack sequencing, overtime, or end conditions.
- Read [references/combat-and-gigs.md](references/combat-and-gigs.md) before changing Gig handling, Street Cred, attack targets, stealing, blocking, or playmat areas.
- Read [references/cards-and-keywords.md](references/cards-and-keywords.md) before changing card types, attachment behavior, triggers, or shared keywords.
- Read [references/deckbuilding-and-ram.md](references/deckbuilding-and-ram.md) before changing deck validation, collection constraints, or deck-builder UX.
- Distinguish source-backed rules from inference. If the guide does not define a behavior, say that explicitly instead of importing assumptions from another TCG.
- Flag any intentional repo divergence from the published guide instead of silently reconciling it.
- Remember that the guide describes an alpha product and may change.

## Hard Constraints

- Let card text override base rules when they conflict.
- Win by starting your turn with at least 7 Gig Dice in your Gig area.
- Enter overtime after the last player's 7th turn. In overtime, win immediately when you hold the majority of Gig Dice.
- Lose immediately when your deck reaches 0 cards.
- At the start of each turn, resolve these steps in order: ready all spent cards, draw 1 card, then gain a Gig.
- Take exactly one die from the fixer area each turn. Leave the `d20` for last.
- Count each die as one Gig regardless of its face value. Use die values only when an effect cares about Street Cred.
- Add the top faces of the dice in your Gig area to calculate Street Cred.
- All Units enter the field with Lag, which lasts until the end of the turn. Units with Lag can't attack or activate self-spend effects.
- Prevent Units from attacking on the turn they enter the field unless an effect explicitly overrides that rule, such as `ADRENALINE` or `GO SOLO`.
- Allow attacks only against spent rival Units or the rival directly. Do not allow attacks against ready Units.
- Resolve each Unit's attack completely before declaring the next attack.
- Steal 1 Gig on a successful direct attack, plus 1 additional Gig for every full 10 power on the attacking Unit.
- Convert a redirected direct attack into a fight. Do not steal any Gigs if a `BLOCKER` or another effect redirects or stops that direct attack.
- Start Legends face-down in random order. Allow a Legend to pay 1 Eddie whether it is face-up or face-down.
- Allow calling a Legend for 1 Eddie once per turn in the main phase, and once per turn in a defensive step during the rival's attack.
- The player going first spends their 2 leftmost Legends and doesn't ready them on their first turn.

## Glossary

- `Spend / spent`: Turn a card sideways. A spent card cannot be spent again until it is readied. Eddies and Legends spend to pay costs. Units spend when they attack.
- `Ready`: Turn a card upright. Only ready Units can attack. Ready Units cannot be attacked.
- `Eddies`: Currency used to play cards. Pay a card's printed cost by spending that many Eddies.
- `Sell`: Once per turn, reveal a card with the Sell Tag (`€$`) from your hand and place it face-down in the Eddies area. A sold card pays only 1 Eddie per turn when spent, no matter how much it costs in your hand.
- `Gig`: One die in a Gig area. Count dice, not die values, for winning.
- `Street Cred`: Sum of the face values of the dice in your Gig area.
- `Fixer area`: Starting area for all Gig Dice. Choose one die from here each turn, roll it, then move it to your Gig area. The `d20` must be last.
- `Gig area`: Area that holds your claimed Gigs, including stolen ones. Check this area for the win condition and Street Cred.
- `Field`: Area for Units and combat.
- `Legend`: Crew leader card. Start face-down in a random order. Spend it for 1 Eddie while face-down or face-up. Gain its broader effects only when it is face-up unless the card says otherwise.
- `Call a Legend`: Spend 1 Eddie to flip one face-down Legend face-up without peeking first. Do this once per turn in your main phase or once per turn in a defensive step.
- `Unit`: Crew member that attacks rival Units or the rival. Prevent it from attacking on the turn it is played unless an effect overrides that restriction.
- `Lag`: Condition that all Units enter the field with. It lasts until the end of the turn. Units with Lag can't attack or activate self-spend effects.
- `Program`: One-shot effect. Resolve it, then discard it.
- `Gear`: Attachment for a friendly Unit or Legend. When the card moves to a different area, all equipped Gear goes with it.
- `Play trigger`: Effect that happens as soon as you pay the card's cost.
- `Attack trigger`: Effect that happens when the Unit attacks, before the fight or steal resolves.
- `Call trigger`: Effect that happens when you flip this Legend face-up through Call a Legend.
- `Defeated trigger`: Effect that happens when this Unit is defeated.
- `BLOCKER`: Keyword that lets a ready Unit spend to redirect a rival's attack to itself.
- `GO SOLO`: Keyword that lets you pay the card's cost to play it as a ready Unit that can attack this turn. If it leaves the field, remove it from the game.
- `ADRENALINE`: Keyword that lets a Unit attack the turn it's played.
- `QUICK`: Keyword that lets you also activate this effect (or play this Program) as a reaction when a rival Unit attacks.
- `RAM`: Deckbuilding limit set by your three Legends. Match each card color against the total RAM of your Legends in that color.

## Source

- Source page: `https://cyberpunktcg.com/gameplay-guide`
- Source status: alpha rules, explicitly subject to change
