---
name: triage-player-report
description: Triage and fix a Lorcana player report using replay evidence, rules validation, a failing repro test, and focused verification.
user_invokable: true
---

# Triage Player Report

Treat `$ARGUMENTS` as the report source. Reading a Linear or support ticket does
not authorize posting comments or changing external state.

Use these skills as needed:

- [`replay-debugging`](../skills/replay-debugging/SKILL.md)
- [`lorcana-find-card`](../skills/lorcana-find-card/SKILL.md)
- [`lorcana-rules`](../skills/lorcana-rules/SKILL.md)
- [`lorcana-test-generation`](../skills/lorcana-test-generation/SKILL.md)
- [`lorcana-cards`](../skills/lorcana-cards/SKILL.md)

## Workflow

1. Record reported versus expected behavior, cards, state, replay id, and turn.
2. Pull replay evidence when available. Identify the suspect move, logs,
   patches, touched cards, and relevant initial state.
3. Resolve every named or implicated card. Passive cards can matter without
   appearing in the touched-card list.
4. Derive rules constraints for timing, costs, legality, zones, and choices.
5. Write the smallest observable repro and confirm it fails for the expected
   reason.
6. Fix the owning card or shared engine primitive only after the repro is red.
7. Re-run the targeted test and close neighbors, then the Lorcana workspace
   gate when the change warrants it.

Missing replay data is an evidence limit, not permission to invent events.
Do not post ticket updates, push, or change external state unless requested.
