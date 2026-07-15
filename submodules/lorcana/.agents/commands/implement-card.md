---
name: implement-card
description: Implement or repair one Lorcana card through the canonical lookup, rules, test, and card skills.
user_invokable: true
---

# Implement Lorcana Card

Require an exact card name, slug, set/number, or file path in `$ARGUMENTS`.
Load the Lorcana glossary and rules skill, then follow
[`lorcana-cards`](../skills/lorcana-cards/SKILL.md). It owns lookup, similar-card
evidence, test generation, engine gaps, implementation, and focused checks.

Legacy implementations are optional evidence. Printed text, current rules,
current engine contracts, and a failing behavior test take precedence.
