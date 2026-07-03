---
name: swu-rules
description: Official Star Wars Unlimited comprehensive rules, glossary, keyword, and implementation guidance for this repository. Use whenever work touches SWU gameplay logic, card behavior, keywords, turn flow, combat, targeting, deckbuilding, parser/import work, rules text, UI copy, tests, or design docs and the output must stay aligned with the published Comprehensive Rules.
---

# SWU Rules

Use the official Star Wars: Unlimited Comprehensive Rules v2.0, dated June 21,
2024, as the rules source of truth.

## Workflow

- Read `references/glossary.md` first for project lingo and common citations.
- Start at `indexes/master-index.md` to choose the smallest relevant rule file.
- Load `references/comprehensive-rules.md` only when the topic file is too
  shallow or an exact rule quote/citation is needed.
- Cite official section numbers such as `1.3.2`, `6.3`, or `7.5.5` in rules
  answers and implementation handoffs.
- Distinguish confirmed official rules from repo inference or engine design
  decisions.
- Let printed card text override base rules when directly conflicting.
- Treat restrictions as stronger than permissions.
- Resolve as much of an ability as possible when part of it cannot resolve.

## Reference Map

- `references/glossary.md` - always-read SWU terms, zones, counters, keywords,
  and project wording.
- `indexes/master-index.md` - topic router with official section numbers.
- `references/game-concepts.md` - players, cards, ownership, resources, cost,
  damage, counters, actions, and information.
- `references/card-anatomy-and-types.md` - card attributes and base/event/
  leader/unit/upgrade/token rules.
- `references/zones.md` - base zone, arenas, resource zone, deck, hand, discard,
  in-play, play area, and set-aside objects.
- `references/game-structure.md` - setup, rounds, action phase, regroup phase,
  and losing the game.
- `references/action-timing.md` - playing cards, attacks, and action abilities.
- `references/abilities-and-effects.md` - action, constant, event, keyword,
  triggered abilities, and effect resolution.
- `references/additional-rules.md` - aspect penalty, if-you-do, modifiers,
  prevent, search, take control, unique, capture, and other special terms.
- `references/formats.md` - constructed and limited deckbuilding.
- `references/multiplayer.md` - multiplayer and Twin Suns rules.
- `references/comprehensive-rules.md` - full extracted official rules text.

## Output Modes

For player/rules answers, return a concise ruling, citations, and caveats.

For implementation handoffs, return:

```json
{
  "citations": ["7.5.5"],
  "behaviorConstraints": ["constraint statement"],
  "testImplications": ["what must be asserted"],
  "ambiguities": ["open interpretation risk"]
}
```

## Source

- Official PDF: `https://cdn.starwarsunlimited.com//SWH_Comp_Rules_2_0_abd621bde5.pdf`
- Version/date: `6/21/24 - V 2.0`
