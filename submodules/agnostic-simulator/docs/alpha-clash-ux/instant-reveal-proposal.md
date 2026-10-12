# Instant public reveal: engine-to-presentation proposal

Status: scoped proposal, not implemented or accepted visual coverage. Reviewed 2026-10-10 against the current engine and adapter. No shared gameplay protocol change is part of this audit.

## Confirmed failure and ownership

`optional-wrath` starts before a real Wrath ability. Native Use selects Fangyin from hand, reveals it, returns it to the deck bottom, and applies damage. The opponent cannot select this private hand card. After acceptance, all viewers must see the deck card as hidden. The current final projection correctly does so, but contains no accepted reveal snapshot. The adapter returns `animations: []` and `animationPlan: null`. A diff of the final boards cannot reconstruct the briefly public face.

Source boundaries, relative to `submodules/`:

| Owner | Current source | Consequence |
| --- | --- | --- |
| Alpha Clash engine | `alpha-clash/packages/engine/src/effects.ts`, `revealCard` | Captures versioned references into effect context; suspended choices retain them. Instant completion discards the context. |
| Alpha Clash engine | `alpha-clash/packages/engine/src/types.ts`, `CommandResult` | Returns success/error/state and optional payment quote; no structured presentation facts. |
| Alpha Clash engine | `alpha-clash/packages/engine/src/commands.ts`, `applyCommand` | Compound deck ordering executes several internal commands and returns the final state. Any event collector must aggregate the entire successful transaction. |
| Alpha Clash adapter | `agnostic-simulator/packages/alpha-clash/alpha-clash-server-adapter/src/alpha-clash-server-engine.ts`, `dispatch` and `drainEmptyResponseWindows` | One user command may cause several native automatic passes. Facts must include all accepted subcommands in order. |
| Simulator | `agnostic-simulator/apps/multi-game-simulator/src/games/alpha-clash/optional-effect-fixtures.test.ts` | Native Wrath result and all-view hidden-deck assertions supply the regression case. |

This is missing engine output, not a label or CSS error. Do not parse `effect.reveal` prose, expose all modal candidates, or keep a revealed definition on a current hidden card to simulate the event.

## Rule and privacy constraints

The canonical v8.0 rulebook, rule703.8a, ties reveal duration to the relevant effect, cost or trigger. Rule703.8b leaves the card in its zone during reveal. Rule703.8c invalidates reveal access on deck reorder; rule703.8d restricts a look to the specified player. The publisher's [How to Play page](https://alphaclashtcg.com/how-to-play) still links the comprehensive rulebook on the review date. The local canonical extraction is `alpha-clash/.agents/skills/alpha-clash-rules/references/comprehensive-rulebook-v8.0.txt`.

A historical reveal snapshot is an account of information already made public. It does not grant continuing inspection rights to the current hidden object. Private look/search must never enter the public event stream. Receiving clients must not get private hand order, unrevealed definitions, payment proposals, or speculative targets.

## Proposed native output

Add a typed, command-scoped presentation-fact list to the successful native result. The following shape defines requirements, not a committed API:

```ts
type PublicRevealFact = {
  kind: "public-reveal";
  ordinal: number;
  source: { instanceId: string; objectVersion: number };
  revealed: {
    instanceId: string;
    objectVersion: number;
    revealVersion: number;
    definitionId: string;
    ownerSeat: "player-one" | "player-two";
    zoneAtReveal: string;
  };
  audience: "public";
};
```

Use existing engine seat/zone aliases in implementation. Capture the immutable face and version at the native reveal instruction, before later movement. The source reference identifies causality; its face is rendered only if authorized independently. Do not include hand/deck indexes. A subsequent destination event may name a public destination, but cannot continue a trackable hidden-card identity through an unknown reorder. Wrath's declared deck-bottom route can be shown as an accepted action; the deck returns to an opaque pile afterward.

The collector belongs to the command transaction. It must not be a mutable module global, permanent card flag, append-only MatchState array, or log adapter. Internal recursive commands share the transaction collector. Payment quotes and legality probes use an isolated collector and discard it. Failed commands return no facts and leave the accepted event history unchanged. Compound validation commits the list only when every subcommand succeeds.

## Adapter delivery and lifecycle

1. Preserve the initial accepted command facts, then append facts from each drained native pass. Stamp the combined ordered list with the adapter's accepted `stateVersion`; `moveLog.length` is not an event version.
2. A presentation identity is `(match, stateVersion, ordinal)`. Clients consume each once. A repeated server update must not replay sound or reveal.
3. Project facts per viewer before transport. Public reveals are identical for both players and spectators. A future private-look fact needs a distinct recipient policy and must not share this public type by accident.
4. Keep presentation snapshots separate from current board cards and selectable entities. The snapshot is never an input candidate and cannot change legal state.
5. A live reconnect loads the current authorized board without replaying old reveals. Explicit replay may render facts for its selected accepted transition. Undo restores authorized state, clears queued forward presentation, and does not re-grant prior live visibility.
6. Reuse an existing compatible presentation transport only after its viewer filtering, replay, persistence and payload limits are audited. If none supports ephemeral versioned faces, propose a minimal shared presentation extension separately. Do not silently change the gameplay protocol to fit this case.

## Proposed visual, motion and sound acceptance

For native Wrath, keep the paid/engaged source visible. On accepted reveal, show one face near the affected hand, linked to the source. Use the existing shared reveal token; the face is a historical snapshot, not an enlarged current deck card. Then turn it face down and route it toward the deck-bottom anchor. Finish on the authoritative hidden pile and accepted damage result. A short reveal label is available accessibly; color and sound are not the sole cues.

Recommended timeline for implementation review: reveal turn180ms ease-out; readable face hold600ms; conceal120ms; destination route240ms ease-in-out. Queue by accepted event order, merge simultaneous impacts, and allow unrelated input throughout. Interruption snaps to current authoritative state and removes obsolete snapshot nodes. Reduced motion uses a static face announcement and destination crossfade, with no flight or camera movement. Hold time is a UX recommendation, not a rules timer or engine lock.

One soft reveal cue at face-up completion; one low-priority movement cue at destination. Damage impact outranks movement. Suppress duplicate cues by event identity, cap simultaneous movement voices, and obey shared master mute. Exact loudness and overlap acceptance need recorded app output, not an asset-name assertion.

## Acceptance matrix

| Case | Required proof |
| --- | --- |
| Wrath Use, one Dragon | Real board controls produce one historical face for all viewers; final deck face remains hidden; exact selected card reaches bottom; native damage remains correct. |
| Wrath Decline/no Dragon | No reveal fact, no reveal sound, no leaked card face; paid source state follows native result. |
| Two identical Dragons | One selected instance/version; no duplicate reveal; unselected copy unchanged. No private order sent. |
| Invalid/stale selection | Rejected command emits no facts, preserves state and draft recovery. |
| Archaic Shield public reveal | Snapshot and ongoing native reveal scope agree; Done/Send end scope correctly. No duplicate announcement on rerender. |
| Foretell/private search | Public event list contains no looked-at faces for opponent or spectator. |
| Nested/compound/drained effects | Stable order and unique ordinals across subcommands; no loss or duplication at automatic pass boundaries. |
| Shuffle/reorder after reveal | Historical snapshot remains bounded to its event; current deck cannot be inspected or tracked through the reorder. |
| Undo/reconnect/replay | No stale live replay; explicit replay repeats the selected accepted transition once; future queues cancel on undo. |
| Normal/mute/reduced | Same native result, digital mute, readable reduced cue, recorded audiovisual synchronization. |
| Three viewports/both seats | 1920×1080,1366×768,844×390; inspection/source/confirm remain accessible; no hidden intermediate texture. |

Native unit tests may use internal synthetic effects for collector rollback and nested mechanics, but those do not count as visual fixtures. Reuse `optional-wrath`, its named variants, and `destination-reveal`; do not create parallel fixture catalogs. Link accepted future evidence to `ac-reveal` and the Wrath optional-effect case. Current recordings remain failure specimens for instant reveal presentation.
