# Shared rule audit

Status: in progress. This document is the completion checklist, not a claim that
the audit has passed.

## Scope and ownership

Audit every canonical card for targeting, counts, conditions, costs, attachment
eligibility, and continuous-effect timing. Audit the engine and parser that
interpret those definitions. Keep genuinely card-specific effect sequences in
the card definitions.

| Work | Evidence |
| --- | --- |
| Every canonical card compared with its printed requirements | `card-rule-audit.md` |
| Shared engine decisions and their callers inventoried | Pending; add the inventory before marking this audit complete |
| Parser output, printing differences, unsupported text, and regressions | `parser-rule-audit.md` |
| Combined verification and remaining limitations | This document |

## Design requirements

1. Effective card properties have one engine owner. A Legend on the field is
   both a Unit and a Legend (CR 4.2.1).
2. Matching, counting, existence checks, and cost reductions agree on membership
   when they use the same selector and evaluation state. A card appears once.
3. Shared selector constructors express recurring game concepts. Explicit
   area-specific card text retains its narrower area.
4. Conditions are checked at their specified timing (CR 10.3.3). Pending effects
   that need an invalid game piece use its last valid information (CR 10.10.1).
   Sharing predicates must not erase this distinction.
5. Persistent effects apply continuously while their conditions hold
   (CR 10.4.3). Values captured at resolution must remain distinct from values
   that recalculate.
6. Prompts and command validation must agree on legal choices. Card rules stay
   in Cyberpunk; platform and simulator contracts remain game-agnostic.
7. Every supported typed filter or condition has an explicit implementation.
   Unsupported parsed text is reported rather than silently approximated.
8. Parser regeneration cannot restore an audited rule defect.

## Completion evidence required

- Reconcile the card audit against the current canonical card list, including
  cards without relevant effects. Each entry records actual behavior and any
  discrepancy; generated listings alone do not prove review.
- Review engine and parser findings, including intentional duplication and
  event-time exceptions. Resolve confirmed defects within this scope.
- Exercise membership, counts, conditions, and costs across field/Legends area,
  friendly/rival ownership, face-up/face-down state, and dual Unit/Legend type.
- Exercise affected transitions, including Go Solo, defeat, attachment changes,
  and any applicable control or face changes.
- Check expected results independently of the shared helper being tested.
- Run focused tests first, then the complete relevant engine/card/parser suite
  and owner format, lint, and type checks. Record actual command scope; a cached
  package test task does not prove the whole engine suite.
- Reproduce suspected baseline failures separately before classifying them as
  pre-existing. A baseline failure in an audited shared rule still requires a
  decision and, where confirmed, a fix.

## Initial verified baseline

Before this expanded audit, 73 focused tests passed. A wider run of card,
effect, and parser tests passed 1,100 tests and failed 11. All 11 failures were
reproduced in an isolated archive of the committed code: six Gear error-code
expectations, two Padre activation/choice cases, one Zealots/River trigger
case, and two Null Street Cred cases. These are inputs to the audit, not
exemptions from it.

The owner `ci:check` passed at that point; its Turbo test stage executed only
one cached task. Direct test execution is required for final suite evidence.

## Check-command correction

`ci:check` now invokes the root `vp test` suite. The former `turbo run test`
only discovered package scripts, while the engine and parser register their
tests as Vite+ tasks. It therefore omitted those suites. Root test discovery
covers all workspace test files using the existing exclusions for browser E2E.

The first complete run discovered 267 files and 2,254 tests: 2,231 passed and
23 failed. This is a work-in-progress result. Three simulation test timeouts
passed when rerun with two workers; the deterministic generated-deck illegal
move remained. Root test concurrency is now bounded to two workers, matching
the CI runner capacity without weakening test assertions or increasing their
timeouts.

## Approved architecture changes

The user approved proceeding with the event snapshots, combat continuation,
and parser diagnostics. These are implemented:

- Defeat events capture last-valid properties before movement or detachment.
  Their filters share static card predicates; unsupported dynamic defeat
  filters are rejected by the types and runtime.
- A typed `fightResult` step resolves CR 9.18 triggers and choices before
  CR 9.19 defeats. Resume retains the result and last-valid opposing power.
- Parser results include unsupported actionable segments. Generation rejects
  partial results before replacing generated files.
- Scry legality uses the shared resolver. Prompts project eligible IDs to the
  bot and adapter; both removed their partial filter implementations. Private
  bound targets and resolution context remain server-side.
- Persisted combat snapshots and replays use version 3. Versions 1 and 2 are
  rejected explicitly; they cannot represent the new suspended state safely.

## Verified checkpoint after bounded fixes

- Canonical file inventory and audit table both contain 152 unique cards; no
  missing or extra card rows. Per-card decisions are in `card-rule-audit.md`.
- Parser parity has no exception list. It checks implemented abilities for 48
  matching printings, plus cost modifiers and attachment targets for all 152
  cards. Unsupported actionable segments remain explicitly listed as a gap.
- `vp run ci:check` uses direct full-suite discovery and two test workers. The
  verified run found 269 test files and 2,261 tests: **2,258 passed, 3 failed**.
  Format, lint, types, and canonical-card layout passed.
- Remaining test failures: the Zealots/River combat-order case pending the
  combat-state decision, and two immediate Eddie-secrecy expectations that
  conflict with the existing documented online reveal-until-cleanup extension.
  That display/rules conflict was preserved and reported, not changed merely
  to make tests green.
- Cyberpunk simulator consumers now import die limits and die-type validation
  from the same game types owner. Removed local copies and migrated type
  imports. The existing live-state and CenterRow overtime suites passed 18/18;
  focused format, lint, and type checks passed for all seven changed consumer
  files. These changes preserve behavior and presentation; no browser UI
  change was made.
- A final review hardened the exhaustive Gig-pair constraint branch to throw
  for an unknown runtime variant. Its focused format, lint, and type check
  passed after the full-suite run.

The checkpoint above predates the approved architecture changes. The two
Eddie visibility failures still require a product/rules decision. Current-card
test coverage is not a proof of all future DSL cases.

## Follow-up audit

- Partial discard now resolves the available cards and withholds a conditional
  benefit when the full requested discard was not completed. Optional partial
  discards retain the accept/decline choice. The mandatory, optional, and empty
  hand cases pass 19 focused tests across the shared handler, Maman, and Panam.
- The [historical Gig audit](historical-gig-event-audit.md) covers all ten
  authored consumers. It distinguishes event-time trigger predicates from
  resolution-time conditions and labels unproven mutation windows. It does
  not establish that all pending-effect values should be frozen.
- Gear attachment now uses one legal-host evaluator for normal play, effect
  play, and pending choices. `attachCard` delegates to the play pipeline,
  removing its separate payment, movement, and logging implementation. Tests
  cover Gear-specific restrictions, different candidate Gears, bound hosts,
  multiple-host choices, and insufficient payment. The attachment/card suites
  passed 42 focused tests.
- The follow-up `vp run ci:check` passed format, lint, types (796 files), and
  canonical layout (152 cards). It ran 271 files and 2,275 tests: **2,272 passed,
  3 failed**. The remaining failures are the same Zealots/River combat-order
  case and two Eddie-secrecy cases recorded above. This is not a green gate.
- After that gate began, the payment regression was strengthened to exercise
  a bound Gear through the direct effect path that formerly bypassed payment.
  The final seven-test Gear suite and its focused format/lint/type check pass.
  No production code changed after the full gate started.

## Approved architecture validation

- Direct full owner suite: **2,275 passed, 2 failed**, 272 files / 2,277
  tests. Only the two Eddie visibility expectations remain; the Zealots/River
  combat-order regression now passes. Log:
  `/tmp/cyberpunk-architecture-tests.log`.
- Final `vp check --no-fmt`: no lint or type errors in 801 files. Canonical
  layout: 152 cards pass. The combined gate is not green: owner formatting
  reports concurrent, unrelated `catalog/artwork-manifest.ts` and
  `catalog/artwork.ts` edits, and the two Eddie tests still fail.
- Adapter interaction and suspended-combat restore tests: 44/44 pass.
  Live hydration, mobile choice, and snapshot recovery tests: 24/24 pass.
  Final scry automation fixtures: 36/36 pass. Combat automation fixtures:
  36/36 pass. Focused changed-file checks pass.
- Real in-app browser proof used the existing Docker simulator at
  `/cyberpunk/simulator/tests/fightResultBeforeDefeats?ai=player&ai-mode=step`.
  Before selection, Zealots remained on field in FIGHT while River's scry was
  pending. Selecting Corpo Security resolved scry, then defeated Zealots;
  the board returned to MAIN PHASE, with Zealots in trash and both actions in
  the log. This proves the local simulator path, not a hosted deployment.
- Repeated hot reloads exposed PaymentSelection context identity replacement.
  Context creation now has a module with no runtime engine dependency. The
  browser proof and snapshot recovery test passed after this repair.

Open decision: retain the documented online reveal-until-cleanup Eddie rule,
or follow CR 5.8.3.1 and hide identity after sale. No implementation or test
expectation was changed without that decision. No commit or deployment was
performed for this audit.

## Completion review

The current card table was reconciled again against the definition files:
152 unique rows, 152 definitions, no missing or extra entries (translation
siblings excluded). The obsolete combat approval note in that table is now
replaced by the implemented result.

A final read-only caller review confirmed Synapse uses `legendsInPlay` and
numeric evaluation counts selector results. Effective types have one owner;
Legend face-up/equipped conditions and Eddie cost modifiers consume shared
selectors. The remaining authored Legends-area-only selectors perform
explicit area actions such as Call, look, or area payment. No additional
confirmed live Legend membership/count/cost bypass was found.

Historical Gig event reads remain a documented limitation, not a reproduced
current-card bug. Some event predicates still consult live die/card facts;
the ten-card audit found no authored mutation window before those predicates
run. Resolution-time conditions must continue to use current state. A future
historical predicate extension must supply the facts it needs at the event
boundary rather than infer them from a later state.

## New confirmed pending-effect gap

The final combat review found that Safety Override and Appetite for Destruction
bypass the authored trigger queue. The approved fightResult stage fixes the
order between authored fight triggers and result defeats, but does not let
players order delayed next-fight effects with those triggers. Stacked-copy and
attacker/defender assumptions also affect Safety Override and Reboot Optics.
These are confirmed source defects, not resolved by the earlier passing suite.

The [pending fight effects proposal](pending-fight-effects-proposal.md) specifies
one typed pending queue and its consumer migration. The user approved this additional
change on 2026-09-24 and required tests of observable behavior. Implementation
is in progress. The incomplete follow-up patch was removed precisely; the prior verified
implementation remains the checkpoint. Its four focused combat/card suites
pass 31/31 after restoration.
The audit cannot be marked complete until this gap and the Eddie decision are
resolved and validated.
