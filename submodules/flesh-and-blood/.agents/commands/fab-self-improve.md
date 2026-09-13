---
name: fab-self-improve
description: Run one Flesh and Blood hero-profile self-improve iteration — fix unplayable hangs first, then situation tests, seed-stable bench, whole-log coach, at most one heuristic lesson. Args in $ARGUMENTS — [p1-strategy] [p2-strategy] [matches] [seed-base].
user_invokable: true
---

# FAB heuristic self-improve

Drive one iteration of the loop in
[`fab-self-improve-bot`](../skills/fab-self-improve-bot/SKILL.md).
Do not duplicate that skill here.

**Arguments** (`$ARGUMENTS`): `[p1] [p2] [matches] [seed-base]`

- `p1` — strategy id (default `hero-profile`). `hero-profile` routes by the
  seated hero; a hero-specific id (e.g. `gravy`) is bound to that hero and
  **requires** the matching deck — add `--p1-deck <hero>-practice` to the bench
  command (see Hero-binding).
- `p2` — strategy id (default `value-extract`)
- `matches` — bench size (default `8`)
- `seed-base` — stable shuffle prefix (default `improve`)

All shell commands run from `submodules/flesh-and-blood`.

## Hero-binding

Strategies are scoped: `hero` (bound to one hero), `dispatcher`
(`hero-profile`), or `generic` (`value-extract`, …). The bench **throws** if a
`hero` strategy is seated on a non-matching hero — so pair any hero `p1` with
`--p1-deck <hero>-practice`. All 13 hero strategies now have a matching
practice deck (`rhinar`, `teklovossen`, `arakni`, `valda`, `aurora`, `oscilio`,
`zyggy`, `gravy`, `marlynn`, `puffin`, `pleiades`, `kayo`, `lyath`) and bind
correctly on it; a missing `<hero>-practice` would throw, and that error is
correct, not a bug. To judge whether a divergence is a real misfire vs deck
noise, use the skill's same-seed isolation bench (profile vs `value-extract`
on the same deck).

## 1. Load the skill

Read `../skills/fab-self-improve-bot/SKILL.md` and
`../skills/fab-self-improve-bot/references/coach-schema.md`.
Load `fab-rules` before a profile change **or** a playability fix that
touches rules-facing engine paths.

## 2. Playability first

A hung or otherwise unplayable game is never acceptable, whether or not a
heuristic lesson is later kept or rejected.

After the baseline bench, if any match ends `max-actions`, `stall`,
`illegal`, `engine-throw`, a ghost concede, or chose a command that apply
rejects / could not pay: read every frame of those transcripts, fix every
distinct root cause on the owning path, prove it with a test, and re-bench
until those failures fall. Do not stop because a weight change tied or
was rejected. Do not call a cap-hit loop a finished game.

## 3. Heuristic lesson (only if playable, at most one)

Follow the skill's keep/reject loop. Write transcripts. Read every frame
of remaining hung/illegal matches (there should be none) and one completed
match. Implement at most one named-bonus lesson.

## 4. Summary

Report unplayable count before/after and each root-cause fix (or blocker),
then keep/reject with seeds, terminations, flipped matches, the new
situation test path, and the single profile edit. Do not commit unless asked.
