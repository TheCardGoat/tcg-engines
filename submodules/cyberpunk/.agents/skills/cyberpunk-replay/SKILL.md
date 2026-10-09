---
name: cyberpunk-replay
description: >
  Read a player replay archive for Cyberpunk, Flesh and Blood, or Gundam
  (.replay.zip or replay.json) and explain the public game log. Use for a
  Cyberpunk, Flesh and Blood, or Gundam replay, game log, match export,
  "why didn't this trigger", or /cyberpunk-replay. For a Cyberpunk rules
  ruling after the log is known, load cyberpunk-tcg-rules.
---

# Cyberpunk Replay

Read the attached or downloaded player replay before deciding that an ability
failed. The reader accepts `cyberpunk`, `flesh-and-blood`, and `gundam`
archives. Any other game is rejected, and the error names that game slug.
The export is a public projection. Zone changes are JSON patches on the same
step. Player-visible lines are `logs[].data.public` messages, viewer narrative
`logs[].data.entries[].message` (after `composePlayerNarrativeForViewer`), or
canonical `logs[].data.entries[].publicMessage`. Keys outside the Cyberpunk
sentence templates are still printed, with the key and its values.

The internal server artifact (`tools/replay-cli --replay-id`) is a different
envelope. It needs `MATCH_MANAGEMENT_API_KEY` and a string `initialState`.
Do not point that CLI at a player `.replay.zip`.

## Read the match

From `submodules/cyberpunk`:

```bash
bun .agents/skills/cyberpunk-replay/scripts/read_replay.ts <replay.zip>
bun .agents/skills/cyberpunk-replay/scripts/read_replay.ts <replay.zip> --card "Card Name"
```

Read the whole `--- LOG ---` section. A card question still starts from the
full log, then the `--card` slice. Record seat, display name, and player id
from the header before interpreting "opponent" or "their".

Log lines are `T<turn> step<index> <actor> <moveId> | <sentence>`. Turn numbers
are the persisted `acceptedMove.turnNumber`. Step indexes are the position in
`replay.steps`.

## Decide whether a trigger ran

Search the log for that card's name on `Auto-resolved` or `Resolved`. That
sentence is the queue entry. Its absence means the ability was not queued.

These lines name the card in the sentence, and that card is the one they
describe:

- `had no valid targets` / `noValidTargets` — that card's effect had no legal
  target.
- `did not draw` / `noAction` / `skipped` — that card's own follow-up.

Do not assign one of those lines to a different card that was merely in play.

`Rolled <die>` is gaining a Gig. It is not an adjustment. A steal line keeps
the stolen face and changes controller. A later adjustment of that die uses
the controller after the steal.

## Gig adjustments

Cyberpunk fills `--- GIG ADJUSTMENTS ---` from `resolveAdjustGig` lines and
`gigArea` patches. Flesh and Blood and Gundam archives have no Gig patches,
so that section is `(none)` and contains no controller rows. Use the table,
not the actor alone. Each row is who clicked, the direction, the die id, the
face change, and who controlled that die after the step's patches.

`Friendly` and `Rival` on a triggered ability are from that ability's
controller. An adjustment qualifies only when both the actor and the die
controller match the printed sentence. Load `cyberpunk-tcg-rules` before
treating a near match as a bug.

If the printed condition matches a row and the log has no `Auto-resolved` or
`Resolved` line for that card, the engine dropped a qualifying trigger. Build
a fixture from that row (actor, source card, die controller, previous face,
new face, trash contents if the effect needs a card) and fix it with a
behavior test. If the row does not match the printed condition, report the
row and the condition. Do not call that silence a bug.

Public steal patches sometimes `add` the die on the new controller and
`replace` an `instanceId` on the old slot instead of a remove that names the
die. The script replays those patches. If `controller` lists two players or
`unknown`, say the projection is ambiguous and quote the patches instead of
guessing.

## What this skill does not do

It does not re-execute the engine, open the spectator, or download a replay.
Rules citations stay in `cyberpunk-tcg-rules`. Card implementations stay in
the card's source and engine test.
