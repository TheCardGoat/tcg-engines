# Saved-game compatibility fixtures

`snapshot-v1-les-elemens.json` is a frozen, synthetic legal board in the combat-v3
format used before whole-state schema versions and first-event history existed.
It contains no player production data. It models the deployment incident where
playing Les Élémens threw while adding to the missing event-history array.

Do not regenerate old fixtures with the current serializer during tests. Keep
them when adding schemas. The adapter package test task runs these fixtures in
the existing Agnostic Simulator CI gate. Tests must restore, act through the
public engine API, and verify the resulting board, not only deserialize JSON.

Schema 2 migrates current state, undo entries, and the turn-start checkpoint.
If a v1 state lacks event history, retain its existing per-ability first-time
limits for that turn; do not infer past events from present card positions.
The next turn removes this legacy mode and starts complete event tracking.
Snapshots that already contain event history retain it. Unknown versions or
malformed current-schema continuations fail with `game_state_incompatible`.

Migrations run in memory and are saved only with the next accepted command.
They do not rewrite a durable snapshot at its existing version, which would
invalidate command-receipt digests. Combat versions older than 3 remain unsupported.
Keeping active matches on old engine builds is a separate future change.
