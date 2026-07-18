# One Piece Parser Improvement Progress

This is the coordinator-owned ledger for the long-running Character, Event, and
Stage parser audit. Card-level evidence remains in the generated inventories
and focused engine tests.

## Current checkpoint

- Set: `OP12-003` through `OP12-069`; fourteenth fifty-card checkpoint
  frozen for coordinator validation and publication.
- Ownership: five persistent implementers are frozen after disjoint ten-card
  leases; the coordinator owns shared parser, types, engine, inventory,
  validation, and Git paths.
- Card evidence: all 50 audits pass; 37 focused files pass 56 command-driven
  tests for 37 ability cards; 13 vanilla cards remain catalog-invariant only.
  Combined publication proof is parser 97 files/1,185 tests and engine 1,387 files/2,630 passed with
  2 intentional skips; all owning checks pass.
- Human inventory: 1,121 verified, 203 pending, 20 gaps, and 200 vanilla cards;
  next canonical card is `OP12-070` Sanji.
- Generated Character inventory: 1,768 definitions, 1,567 with text, 201
  generated vanilla classifications, 1,337 exact parser transformations, 230
  queued mismatches, 1,768 exports, and 929 files found by the legacy behavior
  detector.
- Shared repairs: heterogeneous named-card-or-color/category search branches;
  compound Leader-attribute and rested-DON!! permanent protection; base-cost
  Character-count conditions; and compound power-plus-cost modifiers.
- External GitHub checks are intentionally outside this campaign workflow.

## Earlier reconciliation snapshot

- Set: `OP09` Characters / completed `EB01` Events and Stages
- Gate: five-card Character slice and complete EB01 Event/Stage set green; integration freeze active
- Agent A — Characters: `OP09-035`, `OP09-036`, `OP09-037`, `OP09-043`, and `OP09-044` audited and behavior-verified; frozen
- Agent B — Events/Stages: EB01 inventory complete at zero mismatches; frozen
- Coordinator: inventory reconciliation, scoped commit, rebase, and publication
- Shared lock: coordinator; parser, aggregate inventory, validation, and Git paths
- Concurrent worktree: frozen with coordinator-only validation and Git

## Evidence

- Local reconciliation `8086ed696` and authoritative remote checkpoint
  `267362715` are semantically combined, retaining the strongest definitions,
  runtime paths, parser regressions, and command-driven behavior tests.
- Character inventory: 1,768 definitions, 1,567 with text, 201 vanilla, 1,146
  exact parser transformations, 421 queued mismatches, 1,768 exports, and 868
  definitions with command-driven behavior tests.
- OP06 inventory: 99 definitions, 92 with text, 7 vanilla, 88 exact parser
  transformations, 4 queued mismatches, 99 exports, and 85 behavior tests.
- OP07 inventory: 99 definitions, 93 with text, 6 vanilla, 92 exact parser
  transformations, 1 queued mismatch, 99 exports, and 86 behavior tests.
- OP08 inventory: 96 definitions, 86 with text, 10 vanilla, 81 exact parser
  transformations, 5 queued mismatches, 96 exports, and 79 behavior tests.
- OP09 inventory: 99 definitions, 89 with text, 10 vanilla, 58 exact parser
  transformations, 31 queued mismatches, 99 exports, and 31 behavior tests.
- Character behavior inventory: 829 verified, 477 pending, 38 gaps, and 200
  vanilla cards; the next canonical card is `OP09-045` Cabaji.
- Event inventory: 351 printings, 303 canonical cards, 269 exact parser
  transformations, 82 mismatches, 351 exports, and 303 behavior files.
- Stage inventory: 44 printings, 39 canonical cards, 31 exact parser
  transformations, 13 mismatches, 44 exports, and 39 behavior files.
- Local exact checkpoint audit matrix passes 51/51 Character cards and 15/15
  direct-cost/Event-reprint entries; remote behavior coverage is integrated
  through `OP09-034`.
- Mandatory-cost Event matrix passes 12 files and 25 tests; the three affected
  opponent-effect protection regressions pass 3 files and 11 tests.
- Combined full parser gate passes 77 files and 1,102 tests.
- Full engine gate passes 1,321 files and 2,533 tests with 2 skipped.
- The five OP09 Character files pass 7 tests; the five EB01 Event/Stage files
  pass 11 tests; all seven parser-dependent card audits pass.
- Types, cards, engine, and parser checks pass; the root serial One Piece gate
  passes all 10 check/test tasks in 29.7 seconds, and the root agent harness
  check passes.
- The changed One Piece server adapter passes its 2 focused tests, typecheck,
  formatting, and lint. The broad agnostic gate remains blocked by unrelated
  Gundam workspace type resolution for `@tcg/gundam-types`.
- Pull request: `#2591`
- Branch: `codex/one-piece-card-behavior-checkpoints-continuation`
- Merge parents: local `8086ed696` and authoritative remote `267362715`.
- Last published checkpoint: `09c7fa2e8`; PR head and all observed checks are green.
- Upstream synchronization: `origin/main` is already an ancestor of the
  checkpoint; a merge-aware rebase replay was aborted after it attempted to
  duplicate historical OP03 commits, and `git merge-tree` reports a clean tree.
- Thread-aware review snapshot: 164 unresolved threads, of which 98 are current;
  current findings include 18 P1 and 54 P2 comments and remain queued for
  family-level triage rather than per-comment duplicate repair.
- Synchronization: semantic merge in progress locally; no unresolved paths.
- Shared request queued after publication: OP09-044 search traits must parse as
  one `anyOf` alternative instead of two conjunctive filters.
- Shared request queued after publication: OP09-036's single DON!!-or-Character
  rest choice must parse as one mixed-zone action, not two alternative prompts;
  the existing mixed-rest runtime can execute the intended representation.
- EB01 Event/Stage preflight: 9/12 Events and 0/2 Stages parse exactly; the
  five mismatches are `EB01-051`, `EB01-059`, `EB01-060`, `EB01-011`, and
  `EB01-030`. Their five command-driven files pass 9 tests.
- Shared request queued after publication: restore Event Trigger/Main parsing,
  mandatory until-one-Life continuations, and ordered Stage activation costs;
  Bandai verification also requires adding `EB01-051`'s Trigger and removing
  the stray `life` word from `EB01-060` source and i18n text.

## Outstanding work

- Commit and push the coherent EB01/OP09 parser slice, then inspect thread-aware
  PR review state.
- Release the two persistent lanes: Agent A resumes at `OP09-045`; Agent B
  resumes at the five-card EB02 Event mismatch lease.

## Combined checkpoint retrospective

- Signal: authored card work stayed parallel, but shared parser/engine repair,
  merge reconciliation, repeated broad gates, and stale inventory regeneration
  remained the longest serial steps.
- Change: keep exactly two persistent ownership lanes warm, run focused proof
  inside each lane, and reserve shared parser/engine edits, full gates, inventory
  regeneration, and Git for the coordinator-owned freeze.
- Proof: focused reconciliation caught integration regressions before the
  coordinator-owned full gate; the final inventory and behavior queue agree on
  863 Character behavior files and `OP09-035` as the next card.
- Next-two result: measure OP09-035 and OP09-036 for first-pass handoff time and
  whether all shared friction is reported before the next freeze.

## EB01 and OP09 rolling-slice improvement

- Signal: focused tests and audits were fast, but the workers spent roughly
  five to six minutes waiting for shared parser ownership; EB01 also required
  four grammar families that were discovered after dispatch.
- Change: preflight the complete five-card lease before authoring, cluster
  shared grammar repairs under the coordinator lock, use one combined focused
  test invocation per lane, and overlap lock waits with read-only next-set
  preflight.
- Proof: all seven dependent audits pass; the combined Character and
  Event/Stage slices pass 18 behavior tests; the full parser and engine suites
  pass in under 20 seconds together.
- Next-two result: measure `OP09-045` through `OP09-052` and the five EB02 Event
  mismatches for shared-lock wait time and post-dispatch repair cycles.

## Parser and engine changes in the active set

- Preserve the remote checkpoint's extra-turn scheduling, ordered multi-card
  deck returns, field-aware alternative payments, attached-DON!! cleanup,
  dynamic attack restrictions, and Trigger-activation reactions.
- Preserve the local typed `playCard` and alternative-option `trashCard`
  activation costs, parser grammar, runtime payment, and strengthened
  definition and behavior coverage.
- Preserve opponent-owned choices, shared once-per-turn identities, end-of-turn
  field trash, inclusive named/trait costs, dynamic discard scaling, and
  compound Leader-or-Character conditions.
- Execute `OP06-086` as a grouped play with zero/one/two selection, chosen
  active/rested assignment, player-ordered On Play continuations, and
  zone-incarnation cancellation.
- Parse direct Main/Counter/Trigger DON!! costs as mandatory after activation
  while keeping conditions printed after the colon on their resulting actions.
- Parse compound Event continuations, conditional top-deck reveals, battle
  target changes, different-color post-return plays, rested-card totals, and
  search plays that enter rested.
- Preserve the opponent-only source qualifier on group K.O.-protection text so
  the protected Characters remain legal targets for their controller's effects.
- Normalized legacy `NULL` sentinels across the audit, generated parser
  inventory, and canonical behavior queue so vanilla cards are not reported as
  ability gaps.
- Dispatched `whenCardDrawn` outside the Draw Phase and mapped the printed draw
  condition to its dedicated trigger.
- Preserved other-Character K.O., rest, and deck-bottom costs; opponent-owned
  trash ordering; exact trash-return-and-shuffle payments; inclusive cost
  ranges; name exclusions; and inclusive only-trait field conditions.

- Parsed return-to-bottom trash costs, alternative included traits on Life
  movement, excluded-self trait Character costs, excluded-self power checks,
  own-Leader effective-power checks, and category/cost-qualified rest payments.
- Preflighted supported Activate Main conditions in legal-command projection
  and command acceptance, replacing accepted silent no-ops with public command
  rejection while retaining judge routing for unsupported conditions.
- Added natural Rush: Character wording and aligned `OP03-004` Curiel with the
  parser's dynamic permanent effects.
- Preserved end-of-turn delayed self-trash for `OP03-005` Thatch.
- Added compound keyword-plus-power continuation parsing for `OP03-016` Flame
  Emperor and card-category hand-cost parsing for `OP03-018` Fire Fist.
- Moved `OP03-020` Striker's Leader condition after its printed costs.
- Scoped named generic-card targets to Leaders and Characters for `OP03-036`
  Out-of-the-Bag, following official OP03 Q&A.
- Removed legacy `NULL` sentinels from both `OP03-006` Speed Jil printings.
- Added a typed qualified Character-trash cost for `OP03-012`
  Marshall.D.Teach, including prompt revalidation, original-owner routing, and
  attached-DON!! cleanup without an On K.O. event.
- Reclassified `OP03-023` Alvida from a stale `NULL` gap to official vanilla.
- Preserved included matching for the compound `{East Blue}` trait across
  `OP03-024`, `OP03-026`, `OP03-027`, and `OP03-028`.
- Parsed Jango's shared-verb "Rest this Character and up to 1..." choice into
  ordered self and opposing rest actions.
- Restored parser-derived Slash battle-K.O. protection for `OP03-032` Buggy.
- Removed the stale `NULL` sentinel from vanilla `OP03-035` Momoo.
- Distinguished a whole-block optional top-deck trash from an embedded
  up-to-count action, so `OP03-041` Usopp trashes exactly seven after acceptance.
- Added broad `whenYouDealDamage` parsing and in-play dispatch for `OP03-043`
  Gaimon, with exact-trash `thenActions` preserving its dependent self-trash.
- Aligned damage-dealt reactions before Life Trigger activation per official
  OP03 Q389.
- Parsed alternative named-card play lists and behavior-tested PRB02-018
  Portgas.D.Ace's face-up-Life play candidates.
- Restored OP12-051 Hina's printed self-rest cost before its Blocker lock and
  routed Banished foreign-owned Life cards to their original owner's Trash.
- Added an action-level optional continuation so embedded "you may trash N"
  clauses are decline-or-exactly-N instead of an incorrect 0-through-N count;
  aligned OP03-047 Zeff and the OP03 blue Event parser regressions.
- Preserved OP03-070 Monkey.D.Luffy's second optional payment as a typed
  Character-from-hand cost with an exact printed cost-5 filter.
- Kept broad battle-scoped Blocker activation locks at player scope so a
  Character that gains Blocker later in the same battle remains restricted.
- Preserved included-trait filters on ordered trash-to-deck costs for OP03-080
  Kaku.
- Extended deck rearrangement with a typed looked-card trash bound, physical
  trash selection, and fixed-position remainder ordering for OP03-083 Corgy.
- Reclassified `OP03-085` Jabra and `OP03-087` Nero from stale `NULL` gaps to
  official vanilla.
- Restored included-CP Leader and search filters for `OP03-086` Spandam,
  effect-K.O. protection for `OP03-088` Fukurou, and included-Navy matching for
  `OP03-089` Brannew.
- Corrected `OP03-090` Blueno's malformed printed text, DON!!-gated Blocker,
  and filtered rested On K.O. play; changed `OP03-091` Helmeppo to set cost
  rather than add zero; restored `OP03-092` Rob Lucci's ordered included-CP
  cost; and kept `OP03-093` Wanze's Leader gate after its optional hand cost.
- Added selectable top-or-bottom `trashLife` costs through parser, types,
  prompt resolution, original-owner Trash routing, and `OP03-100` Kingbaum's
  executable Life Trigger.
- Kept foreign-owned looked cards in the deck currently being rearranged while
  still routing selected trash cards to their original owner's Trash.
- Reclassified `OP03-101` Camie and `OP03-103` Bobbin the Disposer from stale
  `NULL` gaps to official vanilla.
- Preserved top-only versus top-or-bottom `addLifeToHand` cost positions and
  restored `OP03-102` Sanji's selectable Life payment before its top-deck Life
  replacement.
- Replaced the parser's deck-rearrangement approximation with typed,
  private `lookAtLife` semantics for `OP03-104` Shirley, and parsed
  Trigger-filtered hand-trash costs for `OP03-105` Charlotte Oven.
- Restored the same parser-derived Trigger-filtered hand cost on `OP03-115`
  Streusen and retained its optional cost-1 K.O. target.
- Randomized opaque concealed-hand mappings per prompt with replay-stable
  secret inputs, covering target, trash, and reveal choices.
- Restored official mixed named-card/trait searches for `OP03-112`, physical
  Trigger self-play for `OP03-113`, `OP03-116`, and `OP03-117`, and included
  compound Leader matching for `OP03-114`.
- Corrected `OP03-122` Sogeking and `ST03-009` Doflamingo to select either
  player's Character, made the canonical `ST04-003` Kaido activation optional,
  and preserved `OP03-123` Katakuri's owner-specific top-or-bottom Life choice.
- Replaced OP03-054/055's incorrect partial top-deck trash counts with
  decline-or-exactly-N optional continuations.
- Added command-driven proof for `OP03-002` through `OP03-005`, including
  battle completion, exact hidden deck-bottom order, zero selection, dynamic
  Rush, and delayed cleanup.
- Bound delayed `trashThisCard` actions to the source card's current zone
  incarnation so Thatch is not followed into hand, deck, or a replayed field
  object.
- Distinguished printed targets that must already be a `[Blocker] Character`
  from broader Characters that cannot activate Blocker after gaining it later.
- Preserved owner-neutral Character targets and selectable top-or-bottom Life
  placement for `OP03-123`, and preserved `OP04-002`'s numbered active-Leader
  power cost and included-Alabasta search.
- Preserved `OP04-004` Karoo's included-Alabasta matching, per-recipient DON!!
  distribution, and zero-to-all recipient choice.
- Parsed another physical named Character with source exclusion for
  `OP04-005` Kung Fu Jugon's dynamic Blocker.
- Reclassified `OP04-007` Sanji from a stale `NULL` gap to official vanilla.
- Suppressed per-card movement logs while privately rearranging or bottoming
  looked-at deck cards, preventing opponent-visible identity leaks.
- Made an exact top-deck trash leave the deck unchanged when fewer than the
  printed number of cards remain.
- Updated existing Counter-event interaction tests to accept `OP04-076`'s
  optional DON!! -1 before asserting return-DON!! reactions.
- Bound every delayed self zone-move, including self-targeted return actions,
  to the source card's zone incarnation.
- Parsed OP04-011 Nami's conditional Character/power reveal continuation and
  mandatory deck-bottom placement.
- Preserved OP04-012 Nefeltari Cobra's included-Alabasta target and explicit
  source exclusion.
- Reclassified `OP04-023` Kuro as official vanilla while retaining `OP04-013`
  as the next canonical behavior card.
- Ended an attack without damage when its attacker leaves the field while
  paying an effect cost, dispatched `whenYouDealDamage` after effect damage,
  and required both zero active and zero attached DON!! for all-rested gates.
- Centralized rest-action eligibility so already-rested or un-restable
  Characters are excluded from effect target prompts.
- Updated seven older behavior tests to preserve their printed assertions while
  excluding attacking or otherwise already-rested cards from later rest
  choices.
- Aligned `EB04-030` Kaido with current parser output and its printed optional
  DON!! -2 activation, with accept and decline behavior coverage.
- Integrated a concurrent parser/card batch for `OP04-046`, `OP04-050`,
  `OP04-051`, and `OP04-052`; its behavior files remain outside the human
  verified count until their missing printed boundaries are strengthened.
- Aligned verified `EB04-036` Foxy with current parser output and its printed
  optional DON!! -1 activation, including a decline regression.
- Kept conditions printed after a cost at action-resolution scope even when a
  trailing action is delayed, so Senor Pink pays before its Leader gate.
- Distinguished active DON!! counts from total DON!! on the field in the
  shared condition type, parser, and evaluator.
- Integrated concurrent end-of-battle trigger support and `OP04-047` Ice Oni
  parser/behavior coverage; it remains outside the human verified count until
  its canonical turn.
- Redacted identity-bearing logs whenever a concealed hand card moves to a
  deck, including same-controller opponent choices.
- Integrated concurrent atomic hand-redraw support and `OP04-048` Sasaki
  parser/behavior coverage; it remains outside the human verified count until
  its canonical turn.
- Aligned `OP04-034` Lao.G with the parser's active-DON!! condition and taught
  quoted attribute targets to preserve `OP04-042` Ipponmatsu's Slash-only
  power action before its mandatory top-deck trash.
- Rejected `[Activate: Main]` commands before enqueue when no unused effect
  block has payable costs, keeping legal descriptors and command acceptance
  aligned for Hanger and Black Maria.
- Corrected “When you activate an Event” to the controller-owned Event trigger
  and behavior-tested Page One across Main, Counter, opponent, DON!!, and
  once-per-turn boundaries.
- Reclassified `OP04-054` Rokki from a stale `NULL` gap to official vanilla.
- Re-applied concealed hand-to-deck identity redaction after the concurrent
  remote merge reintroduced public Page One and Sasaki identities.
- Reconciled merged parser/card prework for `OP04-059` through `OP04-063` with
  command-driven cost, decline, failed-gate, zero-choice, once-per-turn, and
  battle-cleanup proof.
- Reconciled merged parser/card prework for `OP04-064` through `OP04-068` with
  nested Trigger-to-On-Play continuation, zero-choice, duration cleanup,
  physical Life routing, and Blocker proof.
- Bound power-copy actions to the physical attacking Leader or Character from
  opponent-attack trigger provenance for `OP04-069`.
- Parsed compound self-trash plus a distinct included-trait Character trash
  cost for `OP04-073`, including source exclusion and filtered payment.
- Corrected optional opponent-attack costs on `OP04-069` through `OP04-071`
  and updated the ST01-012 interaction regression to accept the effect before
  asserting the later Blocker lock.
- Routed Character removals paid as effect costs through the shared
  `whenCharacterRemoved` and filtered `whenLeaving` trigger path.
- Routed add-to-Life actions to the seat named by the action target instead of
  a transferred physical card's retained original owner.
- Reclassified `OP04-078` Oimo & Kashii from a stale structured-effect gap to
  official vanilla.
- Preserved included-Dressrosa trait matching for `OP04-080` Gyats and added
  `OP04-081` Cavendish's printed Leader-rest cost before its K.O. continuation.
- Redacted every face-down Life-to-hand or Life-to-deck movement from viewers
  who cannot see that Life card, including a controller moving its own Life.
- Kept exact hand-reveal actions indivisible when fewer than the printed number
  of cards remain instead of partially revealing the available hand.
- Reconciled concurrent definition and test prework for `OP04-084` through
  `OP04-087`; those cards remain outside the human verified count until their
  canonical checkpoint.
- Guarded compound Character-trash cost indexing from a latent negative offset
  when another plain Character-trash phrase appears in the same text.
- Parsed Kyros's Leader-or-named-Stage K.O. replacement payment and preserved
  the replacement condition's self-target identity through the builder.
- Routed deck mills and trashed search remainders by each physical card's
  retained owner after cross-owner deck transfers.

## Checkpoint improvement

- Signal: Kyros and the existing self-replacement catalog both require the
  physical “this Character” identity to survive condition-to-effect mapping.
- Change: preserved `targetSelf` in generated replacement event filters and
  added a Leader-or-named-Stage rest target parser.
- Proof: 22 focused behavior/parser tests and all five audits pass; Kyros
  replaces its own battle/effect K.O. but cannot protect another Character.
- Next-two result: measure `OP04-087` and `OP04-088` for whether the corrected
  vanilla classification and existing activation surfaces avoid a repair
  cycle.
- Prior next-two result: `OP04-082` exposed the self-replacement parser loss;
  `OP04-083` reused existing Blocker, protection-duration, and exact-trash
  surfaces without a shared engine repair.

## Fourth fifty-card checkpoint improvement

- Signal: six queue parser mismatches were discovered after implementer
  handoff, while Kamakiri, Braham, and Wyper all required the same Stage payment.
- Change: added reusable Stage-zone deck-return costs and made queue-wide parser
  audits a pre-dispatch gate so repeated parser families are repaired once.
- Proof: all 50 audits and 103 focused behavior tests pass; the full parser and
  engine suites pass with the counts recorded above.
- Next-two result: measure OP07-002 and OP07-003 for first-pass completion and
  absence of post-handoff parser repair.

## Fifth fifty-card checkpoint improvement

- Signal: the complete 50-card behavior gate took 13 seconds, while a bare
  watch-mode test command occupied every worker slot and six shared defects
  serialized through coordinator integration.
- Change: all One Piece test-generation examples now use finite `vp test run`.
  Queue-wide parser audits remain pre-dispatch, and the next wave assigns ten
  cards to each of five persistent implementers with rolling ten-card
  integration slices.
- Proof: the harness check passes; all 50 audits and 87 focused behavior tests
  pass; full parser and engine suites pass with the counts recorded above.
- Next-two result: OP07-002 exposed shared set-power execution despite the
  preflight, while OP07-003 stayed card-local. Measure OP07-069 and OP07-070
  for worker handoff latency and post-assignment parser repair.

## Sixth fifty-card checkpoint improvement

- Signal: five persistent ten-card leases produced all definitions and behavior
  files in one parallel wave, but four shared semantic gaps still serialized at
  freeze: opponent-trash continuation, full-hand reveal, grouped previous-action
  scaling, and search-play qualifiers before `rested`.
- Change: retain persistent ten-card leases and the queue-wide audit, but add a
  small semantic preflight for sentence continuations, dynamic amounts, grouped
  scaling, and destination-state suffixes before dispatch.
- Proof: all 50 audits pass; 50 focused files pass 82 tests; parser and engine
  suites pass with the counts above; cards, types, parser, and engine checks pass.
- Next-two result: OP07-069 and OP07-070 both completed first-pass without a
  post-assignment shared repair. Measure OP08-025 and OP08-026 against the new
  semantic preflight.

## Eighth fifty-card checkpoint improvement

- Signal: queue preflight found 19 definition mismatches and nine shared
  semantic boundaries, while the full local parser and engine gates together
  completed in under 20 seconds. Shared investigation, not test runtime, was
  the dominant serial cost.
- Change: release safe cards immediately per completed preflight lease, hold
  only shared-dependent cards, and batch shared repairs by parser/engine family.
  Keep GitHub checks completely outside the campaign loop.
- Proof: 45 focused files pass 77 tests; parser passes 77 files and 1,086 tests;
  engine passes 1,316 files and 2,499 tests with 2 skipped; all owning package
  checks pass.
- Next-two result: OP09-035 and OP09-036 measure whether rolling release avoids
  idle implementer time without allowing work to build on unexplained failures.

## Ninth fifty-card checkpoint improvement

- Signal: 32 cards were safe before the slowest repair completed, while 13
  blocked cards grouped into three reusable parser/engine families.
- Change: transferred exclusive shared-file leases by mechanic family so the
  alternative-target parser and variable return-DON!! runtime could be repaired
  concurrently, with card definitions remaining under their original owners.
- Proof: 43 focused files pass 69 tests; the parser passes 80 files and 1,117
  tests; the engine passes 1,322 files and 2,537 tests with 2 skipped; all owning
  checks pass.
- Next-two result: measure OP09-104 and OP09-105 for first-pass completion and
  whether shared lease routing prevents coordinator serialization.

## Tenth fifty-card checkpoint improvement

- Signal: 40 cards reached safe handoff before the slowest shared repair, but
  OP09-104 and OP09-118 passed parser equality while parser and definition both
  omitted a printed choice or alternate win condition.
- Change: keep queue-wide parallel audits, then tag top-or-bottom choices,
  alternate wins, non-self replacements, and compound costs for one early
  command-driven smoke scenario even when equality passes.
- Proof: 46 focused files pass 71 tests; parser passes 80 files and 1,123 tests;
  engine passes 1,322 files and 2,537 tests with 2 skipped; all owning checks
  pass.
- Next-two result: measure OP10-050 and OP10-051 for first-pass completion and
  whether semantic risk tagging avoids another equality-audit repair cycle.

## Eleventh fifty-card checkpoint improvement

- Signal: queue-wide audits and focused gates stayed cheap, but five cards
  passed parser equality while parser and definition both omitted a printed
  compound cost, reveal continuation, or removal-protection behavior.
- Change: keep the five ten-card leases and parallel audits, then smoke every
  multi-cost, reveal-then-play, and removal-protection card through its first
  public decision before aligning definitions. Compound engine payments now
  preserve printed order and independent physical selections.
- Proof: all 50 audits pass and 42 focused files pass 60 tests; parser broad
  passes 86 files/1,147 tests and engine broad passes 1,322 files/2,543 tests
  with 2 intentional skips; all owning checks and the root harness check pass.
- Next-two result: OP10-050 stayed catalog-only and OP10-051 completed without
  repair, so the semantic smoke rule is retained for OP10-111 and OP10-112.

## Twelfth fifty-card checkpoint improvement

- Signal: 35 ability cards completed in safe lanes while four cards exposed
  reusable shared defects; the remaining serial time clustered around exact
  physical-card continuations, source-filter negation, and parser equality that
  omitted mandatory prevention.
- Change: retain rolling safe-subset handoffs and exclusive mechanic-family
  leases. Preflight reveal-then-move and `without <attribute>` clauses before
  definition alignment, and model mandatory no-op prevention as a real
  once-per-turn replacement rather than a permanent blanket.
- Proof: all 50 audits pass and 42 focused files pass 72 tests; parser broad
  passes 94 files/1,164 tests and engine broad passes 1,338 files/2,567 tests
  with 2 intentional skips; cards, types, parser, and engine checks pass.
- Next-two result: measure OP11-056 and OP11-057 for first-pass completion;
  both were scouted as safe local cards, so any shared repair cycle will reject
  the new preflight rule.

## Thirteenth fifty-card checkpoint improvement

- Signal: four cards reused the same guessed-cost reveal wrapper, while the
  only apparent shared-engine blocker was actually a co-triggering Leader in
  the test fixture. OP11-056 and OP11-057 both completed first-pass without a
  shared repair, validating the prior preflight rule.
- Change: keep five persistent ten-card leases and mechanic-family parser
  batching. For reactive tests, preflight every in-play Leader and Character
  that shares the trigger before diagnosing payment or once-per-turn state as
  an engine defect.
- Proof: all 50 audits pass; 40 authored files pass 69 behavior tests; parser
  passes 94 files/1,177 tests; engine passes 1,338 files/2,567 tests with 2
  intentional skips; cards, types, parser, and engine checks pass.
- Next-two result: measure OP12-003 and OP12-004 for first-pass completion and
  whether trigger-fixture preflight avoids another false shared blocker.

## Fourteenth fifty-card checkpoint improvement

- Signal: OP12-006, OP12-021, OP12-042, and OP12-063 all passed structural
  equality while parser and definition jointly omitted a heterogeneous search
  branch or conditional permanent clause. OP12-003 and OP12-004 both completed
  first-pass without shared repair, validating the prior trigger preflight.
- Change: retain five persistent leases and rolling handoffs, but smoke one
  public behavior path before trusting equality for heterogeneous `or` searches
  and every conditional permanent stat or protection sentence.
- Proof: all 50 audits pass; 37 authored files pass 56 behavior tests; combined
  parser passes 97 files/1,185 tests; engine passes 1,387 files/2,630 tests with 2
  intentional skips; all owning checks pass.
- Next-two result: measure OP12-070 and OP12-071 for first-pass completion and
  whether the semantic smoke catches omitted conditional clauses before lease
  handoff.

## Known risks and next rejecting check

- Risk: historical checkpoints contain concurrent cross-card repairs; preserve
  shared history and keep future staging path-exact.
- Risk: the new compound parser correctly exposed nine older OP10/OP12
  definitions or printings as stale; they remain queued inventory mismatches
  rather than being hidden by compatibility logic.
- Risk: the stricter Life-position, Life-look, and Trigger-cost parser now
  exposes five older definitions as stale; they remain queued inventory
  mismatches rather than retaining incomplete generated semantics.
- Risk: preserving replacement `targetSelf` exposes older self-replacement
  definitions that omitted that identity as queued mismatches rather than
  silently retaining over-broad protection.
- Risk: broad workspace formatting drift can obscure scoped results; continue
  reporting it separately from set-owned failures.
- Next rejecting check: publication diff review and staged checks.
