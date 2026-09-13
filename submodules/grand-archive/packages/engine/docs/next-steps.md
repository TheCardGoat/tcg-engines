# Grand Archive Engine Next Steps

The rules engine and current catalog are executable. The next phase should turn that foundation
into a production simulator while increasing confidence that generated card semantics remain
correct as the official rules and catalog evolve.

Work is ordered by dependency and risk. A later phase should not create its own rules logic to
work around an unfinished earlier phase.

## Phase 0 — Make Generation Reproducible

**Goal:** the official inputs and compiler produce the committed catalog without manual repair.

The current catalog is executable, but a full regeneration has previously exposed drift between
the generic ability compiler and hand-corrected generated definitions. This is the highest-risk
maintenance gap because future catalog refreshes can overwrite known-good semantics.

Deliverables:

- Establish one authoritative pipeline from official Index snapshot to normalized catalog to card
  definitions.
- Make `pnpm generate` produce a clean Git diff from a clean checkout.
- Move exceptional card semantics into typed compiler rules or explicit maintained overrides with
  provenance; never patch generated output without an owning source.
- Add a generation manifest containing the official snapshot identity, compiler version, card
  count, ability count, and output fingerprint.
- Keep the zero-`unparsed` and whole-catalog match-program admission gates.

Definition of done:

- Two consecutive clean regenerations are byte-for-byte identical.
- No generated file changes after `pnpm run ci-check`.
- A card compiler gap fails closed with the card and paragraph identified.

## Phase 1 — Build the Simulator Adapter

**Goal:** expose the engine through the game-agnostic simulator contracts without moving Grand
Archive rules into shared packages.

Deliverables:

- Add the Grand Archive adapter in the agnostic-simulator workspace.
- Map engine player, object, zone, command, decision, log, and wait-state types to shared simulator
  contracts.
- Render controls exclusively from `listGrandArchiveLegalCommands` and the viewer projection.
- Implement setup for Standard first, then Draft and Pantheon.
- Preserve object incarnation and state version in every client command.
- Add deterministic visual fixtures for pregame action, materialization choice, Opportunity,
  decision, resolving, and game-over wait states.

Definition of done:

- Two players can complete a real Standard match in the browser without debug-state mutation.
- Hidden cards cannot be recovered from client payloads or logs.
- Rejected and stale commands leave the displayed match unchanged.
- Simulator behavior tests drive real controls and assert both HTML and engine outcomes.

## Phase 2 — Add the Server and Replay Boundary

**Goal:** make matches reconnectable, auditable, and safe under concurrent commands.

Deliverables:

- Integrate the runtime with the game-server adapter using expected state versions.
- Persist validated snapshots and the accepted command/event stream.
- Define idempotency behavior for retried client commands.
- Restore suspended decisions, replacement continuations, combat, and Effects Stack resolution after
  process restart.
- Create a Grand Archive replay format and focused replay inspection command.
- Project viewer-specific state and logs server-side; never send authoritative state to clients.

Definition of done:

- A match can stop at every decision family, serialize, restart in another process, and continue.
- Duplicate or stale submissions cannot pay a cost or resolve an effect twice.
- A replay reproduces the same final snapshot fingerprint and public logs.

## Phase 3 — Strengthen Rules and Catalog Drift Detection

**Goal:** official changes cannot inherit an obsolete `implemented` status silently.

The current audit discovers new headings, but changed prose under an existing heading retains the
same audit key. Add content-aware provenance.

Deliverables:

- Record a normalized content hash for every audited rule unit.
- Mark a unit pending when its official text hash changes.
- Record the rules mirror revision or synchronization timestamp in generated audit metadata.
- Diff added, removed, renamed, and changed rules in CI output.
- Tie card-catalog snapshots to their official source version and generation manifest.

Definition of done:

- Editing the body of an existing mirrored rule causes the completion gate to fail.
- Refreshing the rules mirror produces a bounded review list.
- Removed or renamed rule units require an explicit migration rather than disappearing unnoticed.

## Phase 4 — Expand Card-Level Behavioral Confidence

**Goal:** move from complete structural executability toward systematic semantic confidence.

Deliverables:

- Generate a coverage manifest mapping every executable ability to shared primitive coverage,
  keyword coverage, a card-specific regression, or an explicitly reviewed static/no-op
  representation.
- Prioritize cards with nested choices, replacement effects, copied activations, private
  information, variable costs, multiplayer selection, and last-known information.
- Require every card bug to add a production-runtime regression through `GrandArchiveTestEngine`.
- Add cross-card interaction suites for mechanics that compose at different layers.
- Track behavior coverage independently from parser and match-program admission.

Definition of done:

- Every catalog ability has a visible behavioral-evidence classification.
- No test implements a parallel rule shortcut.
- Shared engine defects are repaired at the owning rule boundary and proven by a real catalog card.

## Phase 5 — Continuous Fuzzing and Performance Budgets

**Goal:** discover long-tail state, persistence, and convergence failures before release.

Deliverables:

- Run deterministic real-catalog match fuzzing on a scheduled CI job.
- Run snapshot round-trip validation after every accepted fuzz command.
- Retain bounded seed, command, state-version, and refusal evidence for reproduction.
- Add focused generators for replacement ordering, simultaneous multiplayer choices, target
  invalidation, copy/LKI behavior, and phase transitions.
- Establish measured budgets for legal-command enumeration, command execution, snapshot size, and
  full automated matches.

Definition of done:

- Every fuzz failure is replayable from a seed and committed command transcript.
- Performance gates compare against versioned baselines rather than arbitrary machine timings.
- Transaction, stabilization, and stack limits produce diagnosable failures rather than hangs.

## Phase 6 — Improve Player-Facing Logs and AI Evaluation

**Goal:** make engine decisions understandable to players and measurable for automated strategies.

Deliverables:

- Complete localized messages for costs, replacements, triggers, target invalidation, fizzling, and
  state-based outcomes.
- Add dual-viewer log audits for every event carrying private information.
- Build champion-profile benchmark decks and deterministic strategy evaluations.
- Measure legality failures, match termination quality, decision depth, and strategy regressions.
- Keep bots as consumers of legal commands; never let a strategy bypass engine legality.

Definition of done:

- A player can understand why an action failed or an effect changed from the projected log.
- Strategy comparisons are reproducible from deck lists, seeds, and engine fingerprints.
- AI harness changes cannot reveal hidden information or mutate authoritative state directly.

## Recommended Immediate Milestone

Start with one vertical slice combining Phases 0 and 1:

1. Make regeneration stable for the cards used in a minimal Standard fixture.
2. Implement the simulator adapter for initialization, viewer state, wait state, legal commands,
   command submission, and logs.
3. Play one deterministic browser match through pregame, materialization, activation, combat,
   decisions, and game end.
4. Persist and restore the match once during that flow.

This milestone exercises the real integration boundaries early without weakening the engine or
waiting for every production service to be built first.
