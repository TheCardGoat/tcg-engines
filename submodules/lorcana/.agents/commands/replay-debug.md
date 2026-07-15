---
name: replay-debug
description: Download and summarize one Lorcana replay turn without modifying code or external state.
user_invokable: true
---

# Replay Debug

Require a replay/game id and positive 1-based turn. Extract them from
`$ARGUMENTS` or a supplied ticket; never guess missing values.

Follow [`replay-debugging`](../skills/replay-debugging/SKILL.md). Load
[`lorcana-find-card`](../skills/lorcana-find-card/SKILL.md) only when a card
path cannot be resolved and [`lorcana-rules`](../skills/lorcana-rules/SKILL.md)
only for a rules interaction.

```bash
bun packages/tools/replay-cli/src/cli.ts --replay-id <id> --turn <turn>
```

Report the replay header, involved cards, suspect step, relevant pre-turn state,
exact patch/log evidence, and a bounded hypothesis. Keep this command read-only.
When the user asks for a fix, hand the evidence to
[`triage-player-report`](triage-player-report.md).
