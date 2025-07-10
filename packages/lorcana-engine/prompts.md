# AUTOMATED CARD ABILITY ENGINEER

## TASK REQUIREMENTS

0. It shouldn't take longer than 10s
1. MODIFY target files by adding generated abilities
2. Use SEMANTIC SIMILARITY (not exact matches)
3. OUTPUT actual code changes with confidence flags
4. MODIFY target files according to the output

## EXECUTION PIPELINE

1. TARGET IDENTIFICATION
   !scan /cards/007/characters/\*.ts

- Filter: Cards with `notImplemented: true`
- Max: 15 cards per batch
- Output: List of card IDs with text excerpts

2. SEMANTIC ANALYSIS PHASE
   !for_each_target_card:
   a) Extract CORE MECHANICS using pattern:
   [ACTION] + [CONDITION] + [TARGET]
   Example: "When you play this character, draw 1 card" →
   Action: Draw
   Condition: OnPlay
   Target: Controller

   b) Find TOP 3 SIMILAR CARDS from: - /cards/001-006/characters/\*.ts (newest first) - abilities.ts
   Similarity criteria:
   • Same action type (draw/banish/damage)
   • Similar trigger condition (play/quest/challenge, put into inkwell)
   • Comparable targets (self/opponent/your cards/opponent's cards)

3. ABILITY GENERATION
   !generate_implementation

- COMBINE patterns from similar cards
- FOLLOW engine syntax from reference files
- ADAPT parameters to match target card text
- CONFIDENCE SCORES:
  High: 3+ matching mechanics from same set
  Medium: 2 matching mechanics cross-set
  Low: 1 matching mechanic + educated guess

4. FILE MODIFICATION
   !apply_changes

- REPLACE `notImplemented: true` with generated ability
- PRESERVE existing card structure
- ADD implementation comments

## OUTPUT FORMAT

```ts
// FILE: /cards/007/characters/characters.ts
{
  // BEFORE
  // "text": "Whenever this character quests, gain 1 lore",
  // notImplemented: true

  // AFTER (Confidence: High)
  abilities: [
    // Pattern merged from:
    // - cards/003/characters.ts#L221 (75% match)
    // - abilities.ts#L892 (63% match)
  ];
}
```

Card types: Location, Character, Item, Action.
Game Zones: Hand, Deck, Inkwell, Discard (or banish), Play.
while you have character named
When you play this character
if you have a character named {$name} in play
Whenever one of your characters challenges
While this character has no damage
name a card, then reveal the top card of your deck
you may put that card into your inkwell facedown and exerted
Your other characters named
each other character you have in play.
cards from your discard to your hand
Whenever one of your characters challenges another character
During your turn
whenever this character banishes another character in a challenge
you may play a character for free
