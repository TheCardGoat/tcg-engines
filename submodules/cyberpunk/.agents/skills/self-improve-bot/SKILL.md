---
name: self-improve-bot
description: Improve Cyberpunk bot heuristics with a player-then-coach loop — 10 iterations per authored deck, each writing a dump (moves and game logs), a reflection (lesson + flow-gap), and a journal row the next iteration starts from. Use when running /cyberpunk-self-improve.
---

# Self-Improve Cyberpunk Bot

The **player** is the shipped engine chooser. The **coach** is this skill.
An LLM does not pick moves. Do not hill-climb unnamed `GreedyWeights`.

Load `cyberpunk-tcg-rules` before a profile, policy, or engine change.

## Contract

1. Bots must play. `stuck` / `illegal` / `repeatedState` / `maxSteps` are bugs.
2. Situation tests (`decideAction`) gate a kept heuristic lesson.
3. Same seed + same decks = same shuffle.
4. Keep a heuristic change only when the situation test stays green and a
   same-seed re-dump is not worse. A reject still leaves the next iteration
   runnable.
5. At most **one** named lesson per iteration.
6. **10 iterations per authored deck.** After each iteration write a
   reflection (match lesson **and** flow-gap check). `flowGap` is a named
   gap (`named-deck-seating`, `dump-missing-moves`, `dump-missing-logs`,
   `journal-resume`, `keep-gate`) or reasoned `none` — never a constant.
   If `flowGap` is set, **stop that deck**. Identify → address → only then
   n+1. Structural gaps: implement in the flow, then re-walk. A heuristic
   miss names `keep-gate` with `keep=n/a`; do not play n+1 until
   keep/reject is recorded (`self-improve-keep`). Later rows record
   `usedFlow`.
7. Start iteration n+1 from the journal + last dump for that deck. Do not
   restate how to play/coach/keep-reject.

`tools/ai-runner/src/train.ts` is not this loop.

## Tooling

From `submodules/cyberpunk`:

```bash
# One named-deck dump (player)
bun tools/ai-runner/src/cli.ts dump \
  --strategy-a tactical --strategy-b tactical \
  --deck-source authored-botlab \
  --deck-a authored-judy-top-deck-discount \
  --seed improve/judy/1 \
  --output reports/self-improve/dumps/judy-1.json

# Closed 10×10 batch (player + line-by-line walk + journal)
bun tools/ai-runner/src/cli.ts self-improve-batch \
  --iterations 10 --seed improve \
  --output reports/self-improve

# After a keep-gate row: address the lesson, then record keep/reject
bun tools/ai-runner/src/cli.ts self-improve-keep \
  --deck-a authored-overwatch-recharge-control \
  --keep reject \
  --output reports/self-improve
```

Dump builder: `buildCoachDump`. Named seating: `--deck-a` / `playCoachMatch({ deckAId })`.
Journal: `reports/self-improve/journal.jsonl` and `iterations.md`.
Walker: `coachWalkDump` reads every step's move **and** `moveLogs`/`gameEvents`,
then names a flow gap or reasoned `none`. `sold-engine` is only the last
uninstalled core copy; `early-go-solo` is only a preferred legend host.
Batch: `runSelfImproveBatch` reads the last journal row **and** dump for that
deck and **does not play n+1** while the deck is blocked. `keep-gate` unblocks
only after `recordKeep` / `self-improve-keep`. Structural gaps unblock when a
re-walk no longer names them. Later rows record `usedFlow`.

## One iteration (after the journal exists)

1. Read the last journal row **and** last dump for the deck. If the deck is
   blocked, stop. `keep-gate` with `keep=n/a` is blocked until keep/reject.
   Else `iteration = last + 1` (cap 10).
2. Play: `dump --deck-a <deckId> --seed <seed-base>/<deckId>/<iteration>`.
3. Coach: walk the dump playline by playline (both seats). Schema:
   `references/coach-schema.md`.
4. Reflection row: seed, dump path, prior dump, reason/winner,
   mistake-or-`sound`, keep/reject/`n/a`, **flowGap or `none`**, `usedFlow`.
5. If flowGap is set, **do not play n+1**. Address it first: implement a
   structural gap, or for `keep-gate` take at most one named lesson
   (situation test + same-seed re-dump) then `self-improve-keep --keep keep`,
   or reject with `--keep reject` (no chooser change). Then re-run the batch.
6. A reject still leaves n+1 runnable **after** it is recorded. Do not stamp
   reject automatically to skip the address step.

## Report

Per iteration: the journal row. Stop when a full pass over the 10 decks
has no kept lesson and no new flow finding (do not fill remaining slots).
Report: path to `iterations.md`, kept lessons, remaining flow gaps.
