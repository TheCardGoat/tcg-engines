# Choombattler reference adapter omissions — 2026-10-07

Adapter version 2 exposes information that version 1 dropped. The Choombattler
worker, its Expert message handler, the native reducer, and our Expert chooser
are unchanged. The worker remains an external fixture; no third-party source is
vendored.

## Changes

- Native modifiers, static and aura effects, inherited Gear power and keywords,
  attack restrictions, Lag permissions, and cost effects are projected.
- Pending combat includes the attacker, target, Rival, reaction/fight step,
  native steal count, and Blocker redirects. Power uses the native attacker and
  opponent context. Go Solo uses its native cost function.
- Card and player effects include fight shields, steal protection, discounts,
  delayed effects, and Cyberpsychosis defeat risk.
- Native attack and Gig-steal events update immutable adapter history in live
  games and search forks. Call flags identify own and rival turns. Empty Fixer
  flags record turn starts. Fixer dice use their correct view zone; the native
  view type now includes that zone without a cast.
- Public views use native visibility. Hidden source names and IDs stay hidden;
  oracle views include full state. Adapter history participates in search hashes.
- Version and source guards reject stale replays. Version 1 reports retain their
  recorded evidence and must not be combined with this run.

## Validation

26 focused Bot Lab tests passed. Source lint/type checks and the native view type
check passed. Tests exercise native actions and snapshot projection, effect expiry,
real attack/steal events, isolated forks, Blocker redirects, conditional power,
Go Solo discounts, visibility, delayed effects, and turn flags. The original
unmodified worker message handler matched the instrumented handler at 12 positions.

The same 12 reference games use the same top-three decks, seeds, blocks, and swapped
seats as the prior gauntlet. All 12 ended in native rules wins. Our adapted Expert
won **2/12**, compared with **2/12** before the repair. Choombattler won
**10/12**. 3 final native states changed. Legs 0 and 9 repeated exactly
across winner, termination, action count, turn count, and final-state hash.

| Deck | Our wins before | Our wins after |
| --- | --- | --- |
| authored-rry-llorona-steel-dragon | 2/4 | 2/4 |
| authored-rry-detonate-gear-curve | 0/4 | 0/4 |
| authored-ryb-low-cost-tempo | 0/4 | 0/4 |

This small sample does not show a strategy-strength improvement. It establishes
that the omitted state is now exposed and the repaired adapter runs complete,
repeatable matches.

## Evidence and limits

- [Machine-readable run, source hashes, and rules constraints](adapter-omissions-2026-10-07.json)
- [Historical full gauntlet](gauntlet-2026-10-07.md)
- Raw repaired matches: `/tmp/choombattler-adapter-v2-2026-10-07-final`.
- Worker SHA-256: `c834449c4463db4aa01e4ceaaa3de59afd460db90f0379a723b78a995369fa40`.
- Catalog SHA-256: `0e130e4d982f7c42bbe571ec82cc33b3e841cd8aea211d37e1c59122c9c9caf3`.
- Adapter revision: `fnv1a32:13c0e6d4`; catalog join: `fnv1a32:0ca3b018`.

Native actions still appear as opaque choices to our unchanged chooser. Generic
native delayed effects keep their native keys when the shared view has no verified
semantic equivalent. The adapter starts from native setup and keeps event history;
a raw midgame snapshot cannot restore past attack or steal flags. The native reducer
keeps its own rules, including overtime behavior. Production promotion stays disabled.

The rules handoff in the JSON records constraints from 8.6.2.1, 9.3.2.3, 9.5,
9.9.1, 10.22.3, 10.23.1, and 11.11.2. See the local official-rules mirror at
`../../.agents/skills/cyberpunk-tcg-rules/references/comprehensive-rules.md`.
