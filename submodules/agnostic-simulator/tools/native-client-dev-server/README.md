# Native practice boundary — development only

One loopback Bun process hosts **one clockless Standard Grand Archive game**, using the
existing server adapter and TypeScript engine. This is the socket boundary used by the
Grand Archive Godot practice client. There is no production durability, multi-node ownership, account auth,
HTTP deck editor, deployed gateway change or service deployment. The default CLI runs the existing champion-profile TypeScript strategy for p2. Use
`bun run src/main.ts --two-player` for two authenticated manual seats; socket fixtures
retain that manual mode. Automated-opponent hosts reject p2 client authentication.

## Start / stop

From `submodules/agnostic-simulator`:

```sh
vp install --frozen-lockfile
vp run @tcg/native-client-dev-server#dev
```

Or from this tool directory, `vp run dev`. It listens on
`ws://127.0.0.1:5194/native` and prints separate fresh `p1` / `p2` credentials to the local
terminal. Keep those local. The first credential can create a match; in `--two-player` mode the second can join
that match. A credential resumes its same seat after disconnect, until process exit.
Session IDs alone do not authenticate. `Ctrl-C` stops the host, drains queued work and
closes sockets. Tests use ephemeral ports and always stop their host in `finally`.

The CLI never accepts a seed, actor, deck contents or network binding from the client.
`startNativeHost` has in-process-only test seed and reduced-budget options; `main.ts`
uses generated seeds and normal budgets. The terminal is the credential distribution
channel; there is no unauthenticated HTTP listing. Browser Origin requests are rejected.

## Native sequence

1. Connect using JSON text WebSocket frames. Send `hello` with the terminal credential.
2. Read `welcome`: seat, session identity, supported inputs and allowed fixture IDs.
3. `p1` sends `join_game` with `fixtureIds: ["lorraine-pnp-1-4", "rai-pnp-1-4"]`
   (either existing ID is allowed in either position). The host resolves its own lists,
   validates both through the adapter and creates a clockless Standard game.
4. Read `state_sync` with `gameId` and `matchId`; `p2` joins using that `gameId`.
5. Render the offered pregame Continue/Pass actions. For every action copy its own
   `requestId` and `id` into the nested protocol-2 submission, supply required `values`,
   and copy the snapshot version and a fresh correlation ID into both envelopes.
6. `action_result.accepted` is sent **after** successful execution. Then each joined
   viewer receives a complete `state_update` with that viewer's incremented sequence.
7. Ping every 15 seconds; pong echoes the nonce. Idle sockets close after 60 seconds.
8. On disconnect or uncertain outcome, reconnect with the **same credential**, join the
   same game (optionally reporting `lastSequence`), apply the full sync, and resubmit the
   **exact same command/correlation ID**. The host returns the original result. Never
   retry an unknown outcome under a new correlation ID.

Protocol field definitions and generated JSON Schema:
[`../../packages/protocol/README.native.md`](../../packages/protocol/README.native.md).

## Supported slice and display

Supported inputs: `entity-selection`, `option-selection`, `boolean`, `number`, and
zero-input actions. Entity ordering, partition and allocation inputs and the automation
submission kind return `unsupported_interaction`; clients must disable actions containing
unsupported required input kinds. Raw engine commands, arbitrary decks/seeds/actor IDs,
spectators, timed games, extra games and protocol versions other than v1 are unsupported.
Other rules interactions using the supported shapes still go through engine legality.

The adapter DTO contains its authorized players/zones/counts, turn, opportunity/pregame
holder and compact public stack entries (`id`, `kind`, optional display `presentation`).
Interaction protocol 2 supplies the prompts. Display cards carry only name/rules text;
object-to-definition/printing/image bindings are restricted to authorized objects.
`display.catalog` preserves the pinned catalog revision. Do not retain an old binding as
current authority when it disappears. Preserve card image aspect ratios in Godot.

Optional animation reuses `AnimationPlanV2`: ordered `entityTransfer` for authorized
movement, `entityStateChange` for authorized reveals, and `effect` with `Resolved` for
confirmed resolution of a previously visible stack item. These come from committed
structured events, never log parsing. Confirmed hand draws carry `audioCue: "card.draw"` and public deck/hand endpoints.
Hidden draws use event-scoped anonymous visual IDs and hidden destination faces; they
never include a private instance/definition/printing binding. Other hidden movements,
including payments, supply snapshot counts without private entity bindings. Newly visible objects have destination-only
transfers. Uncovered events and reconnects use snapshot reconciliation. Animation never
advances game rules; event IDs are for visual deduplication only.

## Bounds and errors

- 32 KiB input frames; 1 MiB output frames and buffered output. Oversized/slow sockets
  close. Bun may report transport code 1006 for oversized input, or 1009.
- At most 8 connected sockets, 32 queued commands in the process/game, 8 queued per socket,
  and 64 received frames per socket per second. A queue/rate rejection executes nothing.
- At most 4,096 stored correlation outcomes across both sessions. Results are never
  evicted during the session. At capacity, new commands fail; existing retries still work.
- Keys bind session + game + correlation. Changed content returns `correlation_conflict`.
  Both accepted and rejected engine results are retained. Engine journal correlations are
  prefixed with the fixed seat to avoid cross-seat collisions.
- `unauthorized`, `already_authenticated`, `forbidden`, `unknown_fixture`, `unknown_game`,
  `game_already_exists`, `not_joined`, `malformed_json`, `invalid_frame`,
  `unsupported_or_malformed_message`, `unsupported_interaction`, `queue_full`,
  `rate_limited`, `session_capacity`, `correlation_conflict`, `internal_error` are boundary
  errors. Engine rejection codes include `stale_interaction` and
  `invalid_interaction_submission`.

No credentials, seeds, engine snapshots or authoritative replay journals are returned over
the socket. Process loss loses the game and all credentials/outcomes; restart is a new
session. Do not use this host as a production service.

## Deterministic fixture / Godot client

The single client-owned recording at `godot-sim/tests/fixtures/standard.json` contains chronological `in`/`out` messages for **each separate
viewer**, with stable placeholder game/match/session IDs. `hello` credentials are omitted.
The fixture header's test seed/payment identity is test metadata, not a server payload:
never transmit it or give p1 the p2 transcript in a running client.

Godot can replay one viewer's `in` entries to build menu/deck selection, board, action
input and animation. Apply complete snapshots by increasing `sequence`; skip animations
on `state_sync`. The uncertain-response segment intentionally ends p1's first connection
after sending a pass; reconnect retrieves a snapshot and the original result. A separate
socket test drops the activation response and proves that retries cannot pay/play twice.

Fixture: `native-standard-1`, Lorraine vs Rai. Starting hands come from real Spirit of
Wind/Fire On Enter resolution. First player activates **Crusader of Aesa**
(`2Q60hBYO3i`, `object-13`), selecting three offered reserve sources. It goes through the
Effects Stack and opportunity passes, entering the field **rested**. Final p1 counts:
hand 3, memory 3, field 2, main deck 53; p2: hand 7, memory 0, field 1, main deck 53;
Effects Stack empty. Payment IDs and both authorized streams are in the fixture.

Rules mirror: **Starting the Game — Standard Games 5–7, Turn One 1–2**, and
**Card Activation — General Rules 1.1–1.9**. Executable definition:
`grand-archive/packages/cards/src/cards/DEMO22/allies/crusader-of-aesa.ts`
(reserve 3; enters rested). No seven-card hand override, field insertion, skipped pregame
or legality/cost bypass is used. Journal replay is verified in-process, never exposed to
native viewers.

## Verification / regeneration

From this directory:

```sh
bun test
vp exec tsc --noEmit
# Intentionally regenerate the reviewed transcript only after checking changed behavior:
NATIVE_FIXTURE_OUTPUT=/path/to/godot-sim/tests/fixtures/standard.json bun test src/host.test.ts
```

Normal server tests do not require a Godot checkout or recorded fixture. For an explicit
cross-repository comparison, run `NATIVE_FIXTURE_COMPARE=/path/to/godot-sim/tests/fixtures/standard.json bun test src/host.test.ts`.
Output and comparison paths are mutually exclusive. The generator stays here and the recording
is stored only in Godot; never restore a second checked-in copy here. Tests always assert private-object exclusion across snapshots/interactions/display/animations,
real costs and rested entry, unchanged state on rejection, exact retry results, lost
activation recovery, increasing sequences, malformed traffic, connection/queue/frame/
output/result bounds and exact final replay fingerprint equality.

See `VERIFICATION.md` for the commands and observed results for this implementation.

## Desktop launcher

`GODOT_PROJECT_PATH=/path/to/godot-sim GODOT_BIN=/path/to/Godot bun run src/desktop.ts` starts the local host and Godot together.
Use `GA_CLIENT_BINARY=/path/to/exported/executable` for the macOS release. Add `--qa` for
the deterministic live-rendered acceptance flow and server replay verification. See
[the separate Godot client](https://github.com/TheCardGoat/godot-sim).
