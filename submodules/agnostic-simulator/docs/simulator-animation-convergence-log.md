# Simulator Animation Convergence Log

This document records implementation learnings and decisions for
`simulator-animation-convergence-plan.md`.

## 2026-06-03

### Scope

- Owner: `submodules/agnostic-simulator`.
- First implementation slice: Phase 3 shared event contracts and viewer-safe
  visibility resolution in `packages/simulator-ui`.
- First rejecting checks:
  - `vp run test` in `packages/simulator-ui`
  - `vp run typecheck` in `packages/simulator-ui`
  - `vp run lint` in `packages/simulator-ui`

### Learnings

- The fixture already exercises overlapping draw transfers through
  `ZoneTransferAnimator` and user-edited fixture/spec changes are present in
  the working tree. This implementation avoids rewriting those changes.
- The fixture is currently only a primitive lab. There is no real-board lab or
  mode toggle, and the real Cyberpunk board still mounts its own
  `ScriptPlayer`.
- Fixture Playwright coverage already checks desktop no-scroll, owner/opponent
  draw visibility, secret/private/public fixtures, opening-hand draw, and public
  zone movement. It does not yet prove spectator-style visibility,
  reduced-motion mode, empty-zone stability after all cards leave, or
  neighboring-card rect stability.
- `ZoneTransferAnimator` owned both the transfer step shape and hidden-card
  redaction. The plan calls for those contracts to be reusable before the real
  Cyberpunk board mounts the shared layer.
- `SimulatorZone.visibility` currently includes `owner` in addition to the
  plan's `public`, `private`, and `secret` values. The shared resolver treats
  `owner` like `private`: only the owning viewer sees the face.
- Real Cyberpunk board zones are rendered by `GameBoard` and related zone
  components (`DeckZone`, `TrashZone`, `FieldZone`, `LegendsZone`,
  `EddiesZone`, `FixerZone`, `HandZone`, and `MobileHandZone`). Current
  animation lookup uses `data-testid`, `data-side`, `data-zone`, and
  `data-card-id`; shared `data-sim-*` anchors are not present yet.
- The current Cyberpunk `ScriptPlayer` snapshots `[data-card-id]` and
  `[data-die-id]`, suppresses superseded steps, and dispatches to WAAPI recipes
  by `step.kind`.
- The package-level simulator-ui test runner is Bun. New tests in that package
  should import from `bun:test`; `vitest` imports pass neither the package
  dependency boundary nor the broad agnostic type-check gate.
- Fixture coverage had no runtime surface for `zoneExit`, `attach`, or
  `flipReveal`; those primitives were only covered by Cyberpunk mapper tests.
- Adding another visible zone to the fixture table broke the desktop no-scroll
  requirement. New primitive fixture coverage should reuse the existing zone
  layout unless the change is specifically about empty-zone behavior.
- Real-board primitive checks must use the visible board action menu, not direct
  POM engine dispatch, because direct harness dispatch can bypass the
  `rawEngineEvents` stream consumed by the shared animation layer.
- Reduced-motion fixture tests should assert fast final state, not transient
  overlay visibility. Transfer overlays can complete in about 30ms, so catching
  them directly is race-prone.
- The fixture public move exposed real neighbor movement during the overlay
  phase. Shared transfer suppression now also disables card layout transforms
  inside participating zones while the overlay owns the motion.
- A true empty-zone stability test must use an actually emptied grid zone. The
  prior battlefield height check kept two cards in the source zone, so it was
  source-zone stability, not empty-zone proof.
- The real-board attach path can be exercised through the card action menu:
  playing a gear arms a selectable host card, and clicking that host dispatches
  the attach while still flowing through the shared raw animation event path.
- Real-board `flipReveal` coverage can use the face-down legend action menu
  without leaking the hidden legend id in DOM attributes. The test reads the
  expected instance id from the engine projection, then asserts only the shared
  overlay and final face-down slot count in the rendered board.
- The prompt-verb Call Legend path is closer to existing checklist specs, but
  timed out on the focused shared-layer route during validation. The face-down
  legend action-menu path stayed stable and still dispatches through the real
  board.
- Real-board reduced-motion coverage should use the same fast-final-state
  shape as the primitive fixture: emulate reduced motion, trigger real board
  actions, assert final board state within a short timeout, then assert shared
  overlay counts return to zero.
- Flipping `sharedAnimationLayer` default-on by flag alone is unsafe because
  `ScriptPlayer` was unmounted in shared mode while `cardLand`, `combat`,
  `gigMove`, `phaseChange`, and `resourceFloat` still intentionally remain
  Cyberpunk recipe steps.
- The lowest-noise real-board draw path is passing turn from `openingMain`
  through the visible center-row phase button. This appends raw engine events
  through `EngineProvider.dispatch`; the older POM `passPhase()` helper is
  engine-direct and bypasses the raw animation event stream.
- Desktop `openingMain` exposes pass through `data-testid="phase-advance"`,
  not the prompt banner. The confirmation dialog's exact `Pass turn` button is
  the stable selector after the phase button is clicked.
- Real-board draw from P2 deck to P2 hand is hidden-to-hidden from the P1
  viewer. This proves the draw transfer primitive and opponent redaction path;
  owner-view hidden-to-public draw needs its own first-person proof.
- Real-board transient overlay tests should install a `MutationObserver`
  before the UI action and assert captured semantic attributes. Under parallel
  Playwright load, overlays can disappear between `toBeVisible()` and later
  `toHaveAttribute()` checks.
- Unsupported Cyberpunk fallback cues such as `cardLand` are also transient.
  Real-board tests should observe `data-script-card-land` before the action,
  the same way shared overlays are observed, rather than waiting for the short
  pulse after the shared transfer assertion finishes.
- The `opponentTurn` route with pass-only step AI can produce an owner-view P1
  phase draw while keeping `humanSide=player`, but it was too transient under
  full parallel Playwright load. The more stable first-person proof is Kerry
  Eurodyne's visible field-card action menu on
  `unitKerryEurodyneTheLastRockerboy`; it dispatches through the real board
  menu and produces two owner-visible draw overlays.
- Local browser validation of the fixture route needs
  `VITE_BASE_URL=/cyberpunk/simulator/`. Without that base path, the dev server
  loads but `/cyberpunk/simulator/animation-fixtures` routes to the harness 404
  page.
- After the shared layer became the validated default, the explicit opt-out
  path became the last place duplicate shared primitive recipes could run.
  Keeping that path would preserve a second implementation for movement,
  draw-like enters, exits, attach, reveal, and effect targeting.
- A subagent completion audit found the acceptance criteria mostly proved, with
  `layoutShift` as the remaining shared primitive gap because it was typed in
  `events.ts` but not animated or tested.
- A follow-up completion audit found fixture coverage still lacked
  spectator-style visibility, public-to-private movement, and browser proof for
  `zoneEnter`. It also identified broader non-card real-board anchor and
  `effectTarget` precision work as outside the current card/zone movement slice.

### Decisions

- `resolveAnimationCardFaceForViewer` is the shared source of truth for whether
  an animation may render a public card face or must render a hidden face.
- Secret zones remain hidden to every viewer unless the event context includes
  an explicit `revealedEntityIds` grant for the moving entity.
- Reduced-motion is represented in the event contract as a small policy value;
  existing `ZoneTransferAnimator` runtime behavior still owns the concrete
  fallback timing for this patch.
- Cyberpunk step mapping for convergence:
  - `cardMove` maps to `zoneTransfer`.
  - `cardEnter` maps to `draw` for draw-like hand entries, otherwise
    `zoneEnter`.
  - `cardExit` maps to `zoneExit`.
  - `cardAttach` maps to `attach`.
  - `legendReveal` maps to `flipReveal`.
  - `gigMove` can only map if the shared primitive generalizes from cards to
    entities.
  - `effectTarget`, `resourceFloat`, `combat`, and `phaseChange` remain
    Cyberpunk-specific overlays for now.
- `cardLand` is a post-transfer emphasis, not a clean `layoutShift` primitive.
  Do not force it into the shared movement layer until shared emphasis events
  exist.
- Real-board Phase 2 anchors are metadata-only. They preserve the existing
  Cyberpunk `data-testid`, `data-card-id`, and `data-side` contracts so the
  current `ScriptPlayer` and tests keep working while shared-layer mounting is
  prepared.
- Face-down/private Cyberpunk card wrappers do not receive
  `data-sim-entity-id` unless the card id is already exposed by the current DOM
  path. Zone anchors provide hidden-source rectangles without leaking card
  identity.
- `SimulatorAnimationLayer` is now the narrow shared facade over
  `ZoneTransferAnimator`. It accepts typed `SimulatorAnimationEvent` values and
  maps only `zoneTransfer` and `draw` into the existing FLIP transfer path.
  Unsupported primitives stay typed but unmapped until their own shared recipes
  are implemented.
- `ZoneTransferAnimator` now reads standard `data-sim-zone-id` /
  `data-sim-entity-id` anchors first, with `data-zone-id` / `data-entity-id`
  retained as fixture compatibility fallbacks.
- `CardFace` must treat hidden entities as a redaction boundary too. The event
  resolver redacts hidden projections before rendering, and the renderer avoids
  showing hidden stats, traits, states, badges, frame styling, or owner labels if
  a hidden entity reaches it.
- Cyberpunk has an adapter-local script-step translator in
  `apps/multi-game-simulator/src/games/cyberpunk/animation/sharedEvents.ts`.
  It maps `cardMove`, draw-like `cardEnter`, `cardExit`, `cardAttach`, and
  `legendReveal` to shared event contracts while leaving `cardLand`, combat,
  gig, phase, and resource overlays on the existing recipe path.
- The real Cyberpunk board can mount the shared layer behind the experimental
  `sharedAnimationLayer=1` URL flag or `cyberpunk:sharedAnimationLayer`
  localStorage key. This was the pre-default-on behavior before the hybrid
  mount split below.
- `SimulatorAnimationLayer` now composes the existing transfer animator with a
  shared primitive overlay animator. `zoneTransfer` and `draw` still use the
  FLIP transfer path; `zoneEnter`, `zoneExit`, `attach`, and `flipReveal` render
  semantic overlays with `data-testid="sim-animation-overlay"`.
- Shared primitive overlays expose game-agnostic test attributes:
  `data-animation-primitive`, `data-animation-kind`, `data-animation-id`,
  `data-entity-id`, zone ids, target entity id for attach, and source /
  destination / current face values.
- `attach` lands on the target entity rectangle when available and falls back to
  the destination zone rectangle. This avoids requiring a game-specific attached
  gear zone in shared UI.
- `p-attached-gear` remains a semantic shared animation destination, not a
  required physical Cyberpunk zone anchor. Real attached gear still renders with
  the game-local `attached-gear` zone id once the board state owns layout.
- Card layout wrappers expose `data-card-layout-id` so the transfer layer can
  suppress in-zone layout transforms while a transfer is in flight.
- The primitive fixture now reuses the existing `secret-cache` zone for
  empty-zone proof instead of adding another board block and risking the
  desktop no-scroll budget.
- Cyberpunk shared-supported WAAPI recipes were removed rather than preserved
  as an opt-out compatibility layer.
- The Cyberpunk shared animation layer is now the only real-board card and zone
  movement path. The temporary `sharedAnimationLayer` query/localStorage
  override was removed after default-on validation.
- `ScriptPlayer` is now limited to Cyberpunk-specific effects only:
  `cardLand`, `combat`, `gigMove`, `phaseChange`, and `resourceFloat`.
  Duplicate shared-supported recipe files for `cardMove`, draw-like
  `cardEnter`, `cardExit`, `cardAttach`, `legendReveal`, `effectTarget`, and
  program-to-trash staging were removed.
- `isCyberpunkAnimationStepSharedSupported` is the central predicate for the
  split between shared primitives and unsupported legacy recipes. It stays
  next to the Cyberpunk step-to-shared-event mapper so the two paths cannot
  drift silently.
- `cardLand` exposes `data-script-card-land="true"` while its fallback pulse is
  active. This is a test-only semantic hook for proving the unsupported
  Cyberpunk-specific pulse still runs alongside the shared layer.
- `layoutShift` now animates the real registered entity elements from cached
  previous rectangles to their current rectangles using transform-only WAAPI.
  It does not render a card overlay because the primitive is for non-transfer
  position changes whose final content is already owned by the board layout.
- The fixture covers `layoutShift` by reordering existing discard cards inside
  the `Run primitives` flow, instead of adding another control or zone that
  could break the desktop no-scroll budget.
- Cyberpunk `cardAttach` now maps its shared destination to the host's real
  field zone (`p-field` / `opp-field`) and uses `targetEntityId` for the host
  landing rectangle. The older semantic-only `p-attached-gear` destination did
  not correspond to a registered board zone and weakened destination
  suppression.
- Transfer suppression is owned by each overlay so completed staggered
  transfers stop hiding their zones independently. Delayed overlays still render
  only their suppression stylesheet before motion starts; otherwise overlapping
  draw batches can expose committed real cards during the delay window.
- A subagent anchor audit originally found PInfo, gig/die, and fixer dice
  missing full standard anchors. PInfo, gig/die, and fixer dice are now covered;
  the remaining non-card targeting limitation is player-seat semantics for
  `effectTarget`, because PInfo exposes zone anchors rather than a standard
  `data-sim-seat-id` target.
- Desktop PInfo/player target zones now expose standard shared zone metadata
  (`p-pinfo` and `opp-pinfo`) while keeping the existing `pinfo-zone` test id
  and drop behavior. They use `role="custom"` and `visibility="public"`
  because they are player/rival target surfaces, not card containers.
- Desktop gig lanes now expose shared `p-gigs` / `opp-gigs` zone anchors, and
  rendered gig dice expose `data-sim-entity-id` plus their owning gig zone. This
  lets shared entity-target lookup find gig targets without adding a Cyberpunk
  die-specific selector to `packages/simulator-ui`.
- Fixer dice now expose shared entity anchors in the existing
  `player-fixer` / `opponent-fixer` resource zones. The zone ids intentionally
  keep the existing `FixerZone` side naming instead of introducing parallel
  `p-*` aliases that no runtime mapper consumes today.
- Real-board gig `effectTarget` proof uses Afterparty at Lizzie's because it
  drives the actual soft-adjust flow: play the program, select a rival gig die,
  then click the inline adjustment value. The first die click is local selection
  only; the adjustment button dispatches `resolveEffectTarget` and
  `resolveAdjustGig`, which is when the shared target beam appears.
- The fixture now includes a spectator perspective that is neither player owner
  nor opponent seat. This proves the resolver's non-owner private-zone behavior
  in the browser instead of relying only on unit tests.
- Public-to-private movement is a separate fixture action. It reuses the real
  public card and existing private hand zone so the primitive is covered without
  adding another board block or risking the desktop no-scroll budget.
- `zoneEnter` is covered in the existing `Run primitives` fixture sequence by
  rendering a semantic entry overlay into the public discard zone. The fixture
  does not need to commit that entity into final board state because the
  primitive proof is the overlay source/destination semantics.
- `effectTarget` source-zone mapping is still derived from the current projected
  entity kind because the engine `EffectTargetStep` carries `sourceCardId` and
  targets, but not the source zone. The covered program path maps to trash
  correctly after resolution; broader source-zone precision needs an engine
  animation contract extension.
- Real-board `layoutShift` is not currently provable from Cyberpunk
  engine/shared animation events. The shared primitive is implemented and
  fixture-tested, but no Cyberpunk script step maps to `layoutShift`; a
  real-board proof should wait for the engine/script contract to emit a genuine
  non-transfer position-change primitive instead of injecting a synthetic test
  event.

### Validation

- `bun test` in `packages/simulator-ui`: passes 14 resolver/redaction,
  transfer-event mapper, and primitive overlay helper tests.
- `vp run typecheck`, `vp run lint`, and `vp fmt --check ./src` in
  `packages/simulator-ui`: pass. After Phase 7 cleanup,
  `vp fmt --check ./src/animation/SimulatorPrimitiveAnimator.tsx && vp run lint`
  also passes.
- Current `vp check` in `packages/simulator-ui`: pass after the `layoutShift`
  runtime and browser-proof log update.
- Earlier `vp check` in `apps/multi-game-simulator`: pass before unrelated
  staged card-test renames appeared.
- Earlier
  `vp test run src/games/cyberpunk/testing/cyberpunk-simulator-pom.test.tsx` in
  `apps/multi-game-simulator`: pass, including real-board anchor assertions.
- After Phase 7 cleanup,
  `vp test run src/games/cyberpunk/animation/sharedEvents.test.ts` in
  `apps/multi-game-simulator`: pass, covering Cyberpunk shared-step mapping and
  the supported-vs-unsupported step split.
- `pnpm exec playwright test --project=chromium e2e/specs/animation-fixtures.spec.ts`
  in `apps/multi-game-simulator`: pass, including fixture draw/move behavior,
  no-scroll layout, grouped `zoneExit` / `attach` / `flipReveal` primitive
  overlays, `layoutShift` animation on reordered discard cards, reduced-motion
  fast final states, true empty-zone stability, and neighboring-card rect
  stability during public transfer.
- `pnpm exec playwright test --project=chromium e2e/specs/shared-animation-layer.spec.ts`
  in `apps/multi-game-simulator`: pass, including real-board
  `zoneTransfer`, opponent hidden-to-hidden `draw`, owner hidden-to-public
  `draw` through Kerry Eurodyne's visible action menu, `zoneExit`, `attach`,
  `flipReveal`, `effectTarget`, and real-board reduced-motion fast final states
  for `zoneTransfer`, `zoneExit`, `attach`, and `flipReveal`, plus
  Cyberpunk-only `cardLand` script-player behavior.
- `bun test src/animation/events.test.ts src/animation/zoneTransferEvent.test.ts src/animation/primitiveEvent.test.ts`
  in `packages/simulator-ui`: pass after adding `layoutShift` runtime support.
- `vp run lint` in `packages/simulator-ui`: pass after adding `layoutShift`
  runtime support.
- `vp lint ./src/games/cyberpunk/animation ./src/games/cyberpunk/pages/Board.page.tsx ./e2e/specs/shared-animation-layer.spec.ts --no-error-on-unmatched-pattern`
  in `apps/multi-game-simulator`: pass after Phase 7 cleanup.
- `vp lint ./src/components/AnimationFixturesPage.tsx ./e2e/specs/animation-fixtures.spec.ts ./e2e/specs/shared-animation-layer.spec.ts ./src/games/cyberpunk/animation ./src/games/cyberpunk/pages/Board.page.tsx --no-error-on-unmatched-pattern`
  in `apps/multi-game-simulator`: pass after adding owner-draw and
  `layoutShift` coverage.
- `vp fmt --check ./src/games/cyberpunk/animation ./src/games/cyberpunk/pages/Board.page.tsx ./e2e/specs/shared-animation-layer.spec.ts`
  in `apps/multi-game-simulator`: pass after Phase 7 cleanup.
- `vp fmt --check ./src/components/AnimationFixturesPage.tsx ./e2e/specs/animation-fixtures.spec.ts ./e2e/specs/shared-animation-layer.spec.ts ./src/games/cyberpunk/animation ./src/games/cyberpunk/pages/Board.page.tsx`
  in `apps/multi-game-simulator`: pass after adding owner-draw and
  `layoutShift` coverage.
- `vp fmt --check ./docs/simulator-animation-convergence-log.md` in
  `submodules/agnostic-simulator`: pass.
- `git diff --check` on touched animation, real-board, primitive animator, and
  convergence-log paths: pass.
- In-app browser validation with
  `VITE_BASE_URL=/cyberpunk/simulator/ vp dev --host 127.0.0.1 --port 5173`:
  pass. At `1440x980`, the fixture has no page scroll and the animation table
  does not overflow its own frame. The real-board `openingMain` route exposes
  shared zone/entity anchors, and playing a hand card through the visible board
  menu produced a live shared transfer overlay with `data-transfer-kind="move-zone"`,
  `data-from-zone-id="p-hand"`, `data-to-zone-id="p-field"`, and public-to-public
  face attributes.
- Follow-up in-app browser validation on the fixture route captured
  `data-sim-layout-shift-animation="shared-primitive-layout-shift-human-seat-1"`
  on `secondhand-bombus` and `delamain-cab` while `Run primitives` was active.
  The same `1440x980` probe still reported `documentScrollHeight=980` and an
  animation table `clientHeight=708` / `scrollHeight=708`.
- `vp test run src/games/cyberpunk/animation/sharedEvents.test.ts` in
  `apps/multi-game-simulator`: pass after mapping shared attach destinations
  to the real host field zone.
- `PLAYWRIGHT_PORT=5174 pnpm exec playwright test --project=chromium e2e/specs/shared-animation-layer.spec.ts --grep "real board attach"`
  in `apps/multi-game-simulator`: pass after avoiding an unrelated port-5173
  listener. The spec now asserts `toZoneId="p-field"` and that the attached
  gear is hidden while the shared attach overlay owns the visual motion.
- `PLAYWRIGHT_PORT=5182 pnpm exec playwright test --project=chromium e2e/specs/shared-animation-layer.spec.ts`
  in `apps/multi-game-simulator`: pass against the Docker multi-game simulator
  container already bound on port 5182. This run covered real-board transfer,
  owner and opponent draw visibility, exit, attach, legend reveal, effect
  target, reduced motion, and the unsupported `cardLand` fallback cue.
- `PLAYWRIGHT_PORT=5182 pnpm exec playwright test --project=chromium e2e/specs/animation-fixtures.spec.ts`
  in `apps/multi-game-simulator`: pass against the Docker multi-game simulator
  container after preserving delayed transfer suppression for staggered
  overlays.
- `vp check` in `apps/multi-game-simulator`: pass after the Docker-backed
  fixture and real-board Playwright runs.
- `vp check` in `apps/multi-game-simulator`: pass after adding spectator,
  public-to-private, and `zoneEnter` fixture coverage.
- `PLAYWRIGHT_PORT=5182 pnpm exec playwright test --project=chromium e2e/specs/animation-fixtures.spec.ts`
  in `apps/multi-game-simulator`: pass against the Docker multi-game simulator
  container with 9 tests covering no-scroll, spectator redaction,
  public-to-private redaction, and `zoneEnter` primitive semantics.
- `vp test run src/games/cyberpunk/testing/cyberpunk-simulator-pom.test.tsx`
  in `apps/multi-game-simulator`: pass after adding PInfo shared zone anchor
  assertions.
- `PLAYWRIGHT_PORT=5182 pnpm exec playwright test --project=chromium e2e/specs/shared-animation-layer.spec.ts`
  in `apps/multi-game-simulator`: pass against the Docker multi-game simulator
  container after adding real-board PInfo anchor assertions and making attached
  gear suppression a pre-observed transient proof.
- `vp test run src/games/cyberpunk/testing/cyberpunk-simulator-pom.test.tsx`
  in `apps/multi-game-simulator`: pass after adding gig zone and gig die shared
  anchor assertions. The die assertion uses `stealGigTest`, not `gameStart`,
  because `gameStart` intentionally has no gigs.
- `PLAYWRIGHT_PORT=5182 pnpm exec playwright test --project=chromium e2e/specs/shared-animation-layer.spec.ts`
  in `apps/multi-game-simulator`: pass against the Docker multi-game simulator
  container after adding real-board gig zone and gig die anchor assertions.
- `PLAYWRIGHT_PORT=5182 pnpm exec playwright test --project=chromium e2e/specs/shared-animation-layer.spec.ts --grep "gig effect target"`
  in `apps/multi-game-simulator`: pass against the Docker multi-game simulator
  container after adding the Afterparty gig-target effect proof.
- `PLAYWRIGHT_PORT=5182 pnpm exec playwright test --project=chromium e2e/specs/shared-animation-layer.spec.ts`
  in `apps/multi-game-simulator`: pass with 10 real-board shared-animation
  tests, including card-target and gig-target `effectTarget` paths.
- Earlier `bun run ci:agnostic:check` from the repo root: pass before unrelated
  staged worktree changes appeared.
- Current `vp check` in `apps/multi-game-simulator`: fails on unrelated
  formatting in
  `src/games/cyberpunk/components/Prompt/PromptBanner.tsx`. Focused
  convergence validation remains green; the prompt files are dirty worktree
  changes outside this animation slice.
- `vp test run src/games/cyberpunk/testing/cyberpunk-simulator-pom.test.tsx`
  in `apps/multi-game-simulator`: pass after adding fixer dice shared entity
  anchors.
- `PLAYWRIGHT_PORT=5182 pnpm exec playwright test --project=chromium e2e/specs/shared-animation-layer.spec.ts`
  in `apps/multi-game-simulator`: pass with 10 real-board tests against the
  already-running Docker multi-game simulator after the final anchor/log audit.
- `PLAYWRIGHT_PORT=5182 pnpm exec playwright test --project=chromium e2e/specs/animation-fixtures.spec.ts`
  in `apps/multi-game-simulator`: pass with 9 fixture tests against the
  already-running Docker multi-game simulator after the final anchor/log audit.
- `vp fmt --check ./apps/multi-game-simulator/src/games/cyberpunk/components/GameBoard/FixerZone.tsx ./apps/multi-game-simulator/src/games/cyberpunk/testing/cyberpunk-simulator-pom.test.tsx ./docs/simulator-animation-convergence-log.md`
  in `submodules/agnostic-simulator`: pass.
- `git diff --check` in `submodules/agnostic-simulator`: pass.
