# FAB transfer playback

FAB has one gameplay animation primitive: `entityTransfer`. Compare the previous
and next viewer presentation, then move each physical card whose displayed zone
changed. Do not translate committed game events into choreography. Rules-stack
entries are references to a physical source, not additional moving cards.

`transfers.ts` owns the browser mapping, with one 440ms duration and a bounded
45ms stagger. The final displayed board owns the destination, including combat
chain retention and cards that resolve within one update. Flips, effects, value
floats, phase holds, and other protocol step types are disabled for FAB. Their
state and history still update. Draw and general movement use the shared audio
cues; other sounds remain available for audition in the playground.

Cards leaving the stack or combat chain in the same update start together. A
short brightness acknowledgment connects the resolving source and departing
chain card without adding a separate lift or changing target eligibility styles.
The destination board reflows for 200ms after the 440ms transfer.

Hidden-zone counts can conceal simultaneous movement, such as returning pitch
and drawing in one update. The adapter's `state-transfers.ts` compares physical
locations before and after the command and supplies viewer-safe location hints.
These hints contain no event interpretation or timing. Public board identities
win; anonymous slots may match only their corresponding zones. Never disclose a
hidden physical identity or pair unrelated public cards by their shared zone.

The shared transfer layer captures source and destination geometry, renders one
moving card, suppresses duplicate board visuals, and restores the settled board.
FAB changes public/private faces during the transfer so a card returning to a
hidden hand is concealed before landing. Reduced motion replaces spatial travel
with a 140ms source/destination crossfade; synchronization still settles directly.
Missing geometry must not strand controls or hidden cards.

## Playground

Open `/animation-fixtures` and select Flesh and Blood. The protocol inventory
lists one enabled transfer type and ten disabled types. The card transfer
checklist links real engine fixtures for draw, pitch, play, arsenal, pitch return,
chain cleanup, discard, banish, and charge to soul. The sequence rows exercise
multiple movements. UI motion outside gameplay transfers is inventoried
separately. “Ready” means a fixture is available, not that browser QA passed.

For each movement, inspect the source, in-flight card, and final destination at
desktop and mobile widths. Verify one landing, viewer-safe imagery, preserved
image aspect ratio, no leftover duplicate, and usable controls after settlement.
Exercise rapid updates and reduced motion. A local fixture does not prove the
live gateway path; server projection and live page wiring need separate checks.

## Evidence status

Snapshot transfer, real-engine transfer, inventory, and playground component
checks passed together (30 tests, 2026-09-10). The subsequent transfer and projection rerun passed 77 tests, including soul
presentation and stricter hidden matching. The
in-app browser renders the updated FAB inventory and its nine transfer links.
Full desktop/mobile movement validation remains in progress. The app TypeScript
check currently fails on existing auth, fixture, and other-game type errors;
its output is not a passing gate.

Charge browser pass (2026-09-10): the Boltyn fixture initially failed because its
history accessed private event receipts. The fixture driver now collects public
command receipts directly; 65 focused harness/player-log tests pass. Playing
Engulfing Light with Charge Bolt of Courage showed both transfers and settled
with two cards left in hand and the Charged/Added to soul signal. The first
in-flight capture exposed a duplicate pending attack at the generic stack
anchor. Binding stack movement to the displayed entity fixed that duplicate in
the second in-flight capture; all 23 transfer mapper tests pass afterward.
Other transfer cases, mobile/reduced-motion checks, and the broad gate remain
outstanding. This is partial browser evidence, not a completed validation matrix.
