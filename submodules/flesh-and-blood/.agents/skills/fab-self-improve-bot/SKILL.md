---
name: fab-self-improve-bot
description: Improve Flesh and Blood hero-profile heuristics with situation tests, seed-stable self-play, and a coach that reads whole match transcripts. Hangs, other unplayable games, and snapshot persistence refusals are bugs that must be fixed even when a heuristic lesson is rejected. Use when changing bot weights, adding a profile lesson, comparing strategies, or running /fab-self-improve.
---

# FAB Self-Improve Bot

The player is `compileTurnLine` plus a seated profile. The coach is this
skill. Do not let an LLM pick moves. Do not hill-climb unnamed weight
vectors against win-rate.

Load `fab-rules` (glossary + SKILL.md) before changing a profile **or**
changing engine/legal/apply paths that the bots use.

## Contract

1. **Bots must play the game.** A match that hangs, stalls, throws, applies
   an illegal, lists an unpayable play as legal, concedes because no
   real line exists, or reaches a state that **cannot be persisted** is a
   playability bug. It is never an acceptable
   baseline, a “long game,” or something keep/reject can waive. Every
   distinct instance found this iteration must be fixed.
2. Situation tests are the hard gate for heuristic promotion.
3. Same `seed-base` + match count = same shuffles. Flipped winners are strategy.
4. Keep a **heuristic** change only when situation tests stay green,
   hangs/illegals do not rise, and a fresh seed batch is not worse.
   Rejecting that change does **not** close remaining hangs.
5. Tournament fixtures (`playable: false`) are not bench decks.

## Hero-binding (how to seat a strategy)

Every strategy declares a `scope`:

- `hero` — bound to one hero via a `heroMatch` predicate; only meaningful
  seated with that hero (e.g. `rhinar`, `valda`).
- `dispatcher` — `hero-profile`, routes by the seated hero to a `hero`
  strategy, else `value-extract`.
- `generic` — hero-agnostic goldfish (`value-extract`, `defend-only`,
  `never-defend`, `heuristic`).

The bench **enforces** this: `playFabMatch` throws if a `hero`-scope strategy
is seated on a non-matching hero. (It used to silently degrade to
value-extract — that was the bug.) So:

- To bench a specific hero, seat its matching deck:
  `--p1 <hero> --p1-deck <hero>-practice`, or
  `--p1 hero-profile --p1-deck <hero>-practice` (the dispatcher routes by the
  seated hero).
- A `hero` strategy on a mismatched deck is a **configuration error, not a
  result**. Fix the deck; do not suppress the error.

**Deck availability today:** all 13 hero strategies have a matching practice
deck that seats them — `rhinar`, `teklovossen`, `arakni`, `valda`, `aurora`,
`oscilio`, `zyggy`, `gravy`, `marlynn`, `puffin`, `pleiades`, `kayo`, `lyath`.
Each binds its own strategy on its `<hero>-practice` deck. The newer decks
seat the hero and fire the strategy's name-matched guide lines, but some
signature mechanics (Teklo Evo boost/banish, Valda Seismic Surge, Arakni mark,
Lightning Flow auras) are not modeled end-to-end yet, so those bonuses fire at
baseline priority — heuristic-tuning follow-ups, not playability gaps.

## Playability (mandatory, before or instead of a lesson)

These terminations are unplayable. Treat `max-actions` on this bench the
same way — the bot failed to finish a converting game:

- `max-actions`, `stall`, `illegal`, `engine-throw`, `snapshot-refusal`
- a `concede` that is not a real seated choice (empty legal, ghost tail)
- `legal` contains a play the seat cannot pay, or apply rejects the chosen
  command

**`snapshot-refusal` means self-play reached a state the engine cannot
persist.** The bench serializes after _every_ accepted command
(`playFabMatch` default; `snapshotValidation: false` only when timing is the
measurement), because a state that cannot be serialized cannot be restored
after a restart — in production that bricks the match. This is an engine
bug, never a heuristic problem: do not tune around it and never silence the
validator. Triage:

1. The transcript `error` names the failing invariant (e.g.
   `failed invariants: hasValidRuntimeGraphs`) plus a state summary; the
   `snapshotRefusal` field carries `issues` / `stateSummary` /
   `rejectedSnapshot` evidence, and the bench CLI writes it to
   `packages/engine/reports/snapshot-fuzz/`.
2. Bisect the dump:
   `node --experimental-transform-types --no-warnings scripts/diagnose-snapshot-dump.ts <dump.json>`
   (from `packages/engine`) — it nulls one runtime-graph component at a time
   and reports which refs are unanchored.
3. Decide which side drifted. The recurring pattern (2026-08-19 incident,
   seven fixes): the engine grows a state shape the validator never learns,
   or the LKI retention walk stops pinning a reference the validator still
   demands. Fix the owning side — do not loosen the check without a
   semantic reason written down.
4. Re-bench the same seeds; add a replay regression under
   `src/snapshot/snapshot-roundtrip-regression.test.ts` if the path is
   deterministic, or a fuzz seed dump otherwise.

Do **not**:

- leave hangs in place because a named-bonus lesson was rejected or tied
- call a 250-action value-block loop a healthy long game
- file-and-stop on an engine gap when the gap is why the bot cannot play

Do:

1. Read every frame of every unplayable transcript (both seats).
2. Group by **distinct root cause** (same cause across seeds is one bug).
3. Fix the owning path: legal-commands, apply, goldfish affordability,
   practice-card stats/effects, play-match actor selection, or the seated
   profile if it is the thing looping.
4. Add a test that drives the shipped path and would have failed before
   the fix. Re-bench the same seeds. Unplayable count must fall. If it
   does not, the fix is incomplete — keep going.
5. Only after the bench is playable (or a hard external blocker is
   written down with evidence) may you spend the iteration on a
   keep/reject heuristic lesson.

A heuristic lesson that does not reduce hangs is not a hang fix.

## Tooling

From `submodules/flesh-and-blood`:

```bash
vp test run src/automation
pnpm --dir packages/engine run bench -- bench \
  --p1 hero-profile --p2 value-extract \
  --p1-deck rhinar-practice --p2-deck bravo-practice \
  --matches 8 --seed-base improve-1 \
  --out packages/engine/reports/baseline.json \
  --transcripts packages/engine/reports/transcripts
pnpm --dir packages/engine run bench -- diff \
  --baseline packages/engine/reports/baseline.json \
  --candidate packages/engine/reports/candidate.json
```

Bench a **specific hero** (strategy must match the deck — see Hero-binding):

```bash
pnpm --dir packages/engine run bench -- bench \
  --p1 gravy --p2 value-extract \
  --p1-deck gravy-practice --p2-deck bravo-practice \
  --matches 8 --seed-base gravy-1 \
  --transcripts packages/engine/reports/transcripts
```

**Isolate strategy signal from deck noise.** A profile's win-rate on its own
deck mixes "are the hints good?" with "is the deck good?". Separate them by
running the profile **and** the `value-extract` reference on the _same_ deck
and _same_ `--seed-base`, then reading per-seed flips (Contract §3: identical
shuffles mean flipped winners are strategy). Both must use the hero's matching
deck (a `hero` strategy won't run on a foreign deck):

```bash
# reference: pure goldfish on the hero's deck
... bench --p1 value-extract --p1-deck gravy-practice --seed-base iso ...
# candidate: the profile on the same deck + same seeds
... bench --p1 gravy        --p1-deck gravy-practice --seed-base iso ...
... diff --baseline reports/iso-value-extract.json --candidate reports/iso-gravy.json
```

Flips toward the profile = its hints help; flips toward value-extract = the
hints hurt (a likely heuristic misfire — but cross-check the owning profile's
situation tests before promoting a change; an off-archetype flip may be an
intentional, test-enforced rule). Deck-less heroes cannot be isolated this way
until they have a deck.

Library: `packages/engine/src/automation/bench/` (`playFabMatch`, `runFabBench`, `diffFabBenchReports`).

**Persistence gate tooling** (from `packages/engine`):

```bash
# Full hero matrix with the snapshot gate on (140 matches, ~5.5 min, 5 shards)
for i in 0 1 2 3 4; do node --experimental-transform-types --no-warnings \
  scripts/botlab-sweep.ts --shard $i/5 > /dev/null 2>> reports/botlab-sweep/log-$i.txt & done; wait
python3 scripts/botlab-sweep-report.py

# Random-play deep exploration, serialize per command, evidence dumps on refusal
FAB_SNAPSHOT_FUZZ=1 vp test run src/snapshot/snapshot-fuzz.test.ts

# Dump triage (names the failing component + unanchored refs)
node --experimental-transform-types --no-warnings scripts/diagnose-snapshot-dump.ts \
  reports/snapshot-fuzz/<dump>.json
```

A clean sweep must show zero `snapshot-refusal` terminations before a
heuristic lesson is promoted.

## One-iteration loop

1. Run `vp test run src/automation`. Record unrelated failures; do not treat them as safe.
2. Bench baseline with `--transcripts`.
3. Read **entire** transcript files. Do not summarize before judging. Schema: `references/coach-schema.md`.
4. If any match is unplayable (including `snapshot-refusal` — engine bug,
   triage via the persistence-gate recipe above), take the Playability
   track. That work is in-scope for this command and is not optional.
5. If the bench is playable and a general heuristic mistake remains: pick
   **one**. If `better` was not in `legal`, that is an engine gap — fix
   playability if the gap blocks play; otherwise file it and do not apply
   a heuristic lesson for that frame. To tell a real misfire from deck
   noise, use the isolation bench (Tooling): profile vs `value-extract` on
   the same deck + seeds. Before promoting any change, confirm it does not
   contradict the owning profile's situation tests — an off-archetype bench
   flip is often an intentional, test-enforced rule, not a bug.
6. Heuristic lesson (at most one): add one situation `it()` under
   `packages/engine/src/automation/heuristic/` and change one named bonus
   or hint in the owning profile. Do not retune the world.
7. Re-run situation tests, then the same `seed-base` as candidate. Diff.
8. Fresh-seed batch. Tie or regression = do not promote the heuristic.
9. Append one playbook line under Automation / goldfish for each kept
   heuristic lesson **and** each playability fix.

Stop after the playability track is done and at most one heuristic
keep/reject, unless the user asked for another iteration. Do not stop
on a rejected lesson while hangs remain.

## Report

Seed base, match count, baseline/candidate terminations, **unplayable
count and each root-cause fix (or the blocker)** — with `snapshot-refusal`
count called out separately — flipped matches,
situation tests, coach mistake chosen, keep/reject.
