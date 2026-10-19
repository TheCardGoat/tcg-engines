# Alpha Clash browser release baseline

The first release supports the eight audited practice decks admitted by the
existing setup gate. Arbitrary catalog decks and the withheld Kilimanjaro list
remain outside that pool. Acceptance in this pass is local practice in the
multi-game simulator. Hosted authentication, matchmaking, Redis persistence,
recovery and result delivery are deferred. Hidden-information remediation is
explicitly excluded and is not certified by this report.

## Changes

- Use the adapter revision to schedule shared-worker decisions and reject stale
  results. Native transitions can mutate the same state object. Worker failures
  pause playback, and Next/Resume can retry. A pending decision cannot be queued
  twice; non-advancing moves and excessive consecutive moves pause playback.
- Accept native `weaponId` commands as well as UI `cardId` commands for attaching
  and detaching weapons. The native command matrix no longer rewrites payloads
  before dispatch, and actual recommended-bot attachment has regression coverage.
- Resolve browser artwork through the authoritative cards package. Cover the
  seven newly published faces and the admitted card pool. Label send-cost choices
  with their Oblivion destination.
- Keep native fixture deck audits accurate for generated tokens, legal printed
  contenders and resource chronology. Mark synthetic contract fixtures explicitly;
  they do not establish printed-card admission.
- Avoid repeated search-state serialization and resource valuation within an
  expert decision, with work-count and fresh-revision regressions.
- Add the browser app to recursive CI type checks. Regression tests invoke the
  actual script and require failure for invalid TypeScript and success after
  correction. Repair the shared app's Cyberpunk catalog/projection contracts,
  including separate handling of dice entries and card entries.

## Validation scope

The release branch is based on main at
`07300a91948128073ea327fdea4621348eb5b3b7`, retaining its shared bot-worker
architecture. The earlier standalone Alpha Clash expert worker is superseded.

On this integration, the complete app type check and production build pass.
The worker page regressions cover repeated in-place transitions, cancellation by
pause/hot seat/unmount, pre-render stale revisions, Next and Resume recovery,
non-advancing moves, and the consecutive-move bound. The shared worker/planner
checks and the two CI type-gate regressions also pass.

A rendered Recommended-bot match (Clarity Hyper Aggro versus Season 3 XIII War,
seed `browser-release-shared-worker`) completed by contender defeat on turn 10,
with no captured console errors. The human kept the opening hand and played
passively to exercise progression and terminal delivery. This is not a strategic
quality benchmark.

The production-built Expert-bot smoke (Clarity Hyper Aggro versus Absence Makati,
seed `shared-worker-production-check`) completed the opponent's first turn and
returned control on human turn 3 with no captured console errors. Settings opened
and closed normally. This is a production-bundle smoke, not a full Expert match.

Earlier local validation of the carried-forward changes includes 7,480 native
engine tests, the 884-case native/adapter command matrix, focused weapon/cost
regressions, and eight curated adapter completion cases. Completed rendered games
covered all eight admitted decks before the shared-worker integration. These
results support the changed code but do not establish exhaustive card/matchup
coverage or hosted readiness. Review and branch CI are separate release gates.
