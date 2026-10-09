# One Piece Rules Test Coverage

This index maps the One Piece Card Game Comprehensive Rules (Version 1.2.1,
last updated 8/28/2026) to the executable test specification suite in
`packages/engine/tests/rules/`. The rules source of truth is
`.agents/skills/op-rules/comprehensive-rules.md`.

For a per-test evaluation of how each rule proves engine correctness (including negative/edge cases), see [`rules-test-evaluation-summary.md`](./rules-test-evaluation-summary.md).

## Conventions

- One spec file per rules chapter; every test name cites its rule numbers
  (e.g. `6-3-1: the first player does not draw on their first turn`).
- Tests drive real commands through `OnePieceTestEngine` (play, attack, give
  DON!!, activate, resolve prompts, end turn) and assert player-visible state
  through `getView` / `pendingDecision`. Data-level rules (categories, colors,
  printed fields) are proven as catalog invariants over `@tcg/op-cards`.
- Where a rule has no executable surface, it is classified below instead of
  being forced into a fragile scenario.

## Chapter Map

| Chapter | Spec file | Scope |
| ------- | --------- | ----- |
| 1. Game Overview | `01-game-overview.test.ts` | defeat conditions, impossible actions, precedence, numeric rules, cost definitions |
| 2. Card Information | `02-card-information.test.ts` | names, categories, colors, types, attributes, power, cost, Life, Counter, Trigger, card number |
| 3. Game Areas | `03-game-areas.test.ts` | open/secret areas, zone movement, area limits, Life stack |
| 4. Basic Terminology | `04-terminology.test.ts` | draw, damage processing, "up to", "base", if/then, Set Power to 0 |
| 5. Game Setup | `05-game-setup.test.ts` | deck construction, opening hand, mulligan, Life placement, first player |
| 6. Game Progression | `06-game-progression.test.ts` | phase sequence, Refresh/Draw/DON!!/Main/End, giving DON!!, durations |
| 7. Attacks and Battles | `07-battle.test.ts` | attack declaration, targets, Block/Counter/Damage steps, battle end |
| 8. Activating and Resolving Effects | `08-effects.test.ts` | effect categories, costs, conditions, resolution order, replacements |
| 9. Rule Processing | `09-rule-processing.test.ts` | defeat judgment timing |
| 10. Keyword Effects | `10-keyword-effects.test.ts` | Rush, Double Attack, Banish, Blocker, Trigger, Rush: Character, Unblockable |
| 10. Keywords | `10-keywords.test.ts` | K.O., Activate: Main, Main, Counter, DON!! xX / −X, Once Per Turn, On Play/K.O./Block, etc. |
| 11. Other | `11-other.test.ts` | revealing cards, viewing secret areas, audited mandatory and optional loops |

Deck-construction rules (5-1-2 family) are proven through the public
`validateDeckForFormat("standard", …)` API exported from `@tcg/op-cards`
(`packages/cards/src/deck-validation.ts`); the server adapter's
`onePieceServerAdapter.validateDeckForFormat` is a thin delegate over it.

## Coverage classifications and remaining limits

Physical and definitional entries do not need isolated engine tests. The other
entries distinguish existing executable coverage from remaining proof gaps.

- **Physical/meta procedure**: 2-3-3-1 hexagon layout, 2-12/2-13/2-15/2-16/2-17 (copyright, rarity, block
  symbol, illustration, illustrator), 5-2-1-1 deck presentation, 5-2-1-4-1
  no-intervention in the first/second decision.
- **Definitional text** with no isolated observable: 1-1-1 support statement,
  2-8-4 / 2-8-4-1 / 2-8-4-2 (explanatory notes in parentheses; do not drive
  gameplay except when effect text is intentionally parenthesized — not a
  separate engine surface), 3-1-2 "the field", 3-1-5, 3-7-1/3-7-3, 3-8-1/3-8-3,
  3-9-1, 4-1/4-2/4-9-1, 4-11, 6-5-6-2 cross-reference, 8-1-3-3-1/8-1-3-3-4,
  8-3-1, 8-3-1-8, 8-3-2, 8-4-1 procedure steps, 8-4-4-3, 8-4-6, 8-5-1, 2-14-1.
  Parent intro clauses such as 2-2-1, 2-3-1, 2-4-1, 2-5-1, 2-6-1, 2-7-1, 2-8-1,
  2-9-1, 3-3-1, 5-1-1, 6-1-2, 8-1-1 are cited on sibling/parent outcome tests
  rather than as standalone specs.
- **Representation and randomization**: given DON!! is modeled as a counter,
  not a rest-state card (4-4-2). Shuffle and mulligan have seeded public-command
  tests, including Imu's startup search; these do not prove a statistical
  distribution. No current printed action dealing exactly zero damage was found
  for the 4-6-2-2 zero branch.
- **No current catalog example found in the bounded review**: 1-3-8
  (simultaneous rest and set-active) now has an explicit field-card and DON!!
  instruction. Ordinary sequential actions remain ordered. Simultaneous DON!!
  processing retains physical identities across replacement effects. Native
  DON!! groups accept state filters; other DON!! qualifications request judge
  review instead of silently ignoring the filter.
  Life-value modification (2-9-4) and multiple base-cost setters (4-9-2-2) now
  have native support and synthetic command proofs described below. Resolved
  additions of activation costs and conditions (8-3-1-2, 8-3-2-2) now have native
  support and synthetic proofs below. Permanent condition grants also have a
  live evaluator. Permanent cost grants remain excluded from the native type
  because their order relative to resolved grants is not established. These are implementation/proof limits, not a claim
  that such cards cannot exist.
- **Existing real-card coverage previously classified as absent**: event
  Monkey.D.Luffy proves default type and attribute identities (2-4-4, 2-5-7);
  OP13 Imu proves startup order and search shuffle (5-2-1-5-1/2); PRB02 Luffy
  proves the Main Phase boundary (6-5-1); EB01 Oden proves a rules effect in
  hand (8-1-3-3-3); ST13 Luffy proves replacement plus following-action
  continuations (8-1-3-4-4). Their primary files and
  `03-life-replacement-order.test.ts` contain the public commands.
- **Existing synthetic rules coverage**: `08-replacement-chains.test.ts`
  exercises replacement chains and replacement-owner provenance
  (8-1-3-4-6/7). `10-end-of-opponent-turn.test.ts` proves 10-2-8 using a
  synthetic native block: own-turn exclusion, opponent-end saved choice before
  handoff, optional decline, and negation before expiry. These are executable
  engine tests, not real-card combination claims. P-086 also proves a real ordered compound-cost failure, preserving
  the paid DON!! prefix and consuming the activation's once-per-turn use.
- **Bounded iterative permanent ordering**: 8-1-3-3-5 now has public OP10 Usopp
  FAQ proofs for resolved reductions and turn-player Issho precedence. Vista now
  copies a Leader's live base power after another permanent base setter, with
  both source orders, additive-power exclusion, source removal and turn expiry.
  An additional 59-entry catalog dependency review found no further concrete
  ordering defect; it does not prove all combinations. Synthetic public-command
  tests now cover joint controller-selected numeric cost and power ordering,
  saved choices, ordered actions within one block, and payment continuations.
  Separate cost/power solvers are not used because mixed dependencies can yield
  different stable outcomes. Unresolved numeric/keyword feedback in base settings
  and copies still requires judge review. Timing-scoped and static negation now
  preserve ordinary base-setting behavior; only graph-connected numeric negation
  is treated as a dependency of the affected source (see the scoped-negation
  checkpoint below).
  These tests do not certify all permanent-effect types or inline trigger capture. Replaced K.O. costs exercise
  payment failure and the once-per-turn boundary below. Rule 11-1-1-1 now detects exact repeated semantic queue states for
  audited mandatory rest/activation transitions with a single target or a forced
  complete group, including cross-player cycles. Group support excludes optional
  or surplus target selection, replacements, and moving actions. Synthetic public-command
  tests prove draw, optional-choice safety, and finite repetition. The separate
  `11-mandatory-zone-loop.test.ts` also proves a bare compulsory self-K.O./self-play
  cycle from trash. The hand-loop test adds forced self-return and self-play from
  hand, preserving movement-completion and previous-target references.
  Sequence and conditional wrappers are also audited recursively. Only the
  selected branch is admitted, and its predicate and action gate must use a
  supported stable condition. Each dequeued movement checks its current zone.
  It normalizes current zone generations only after excluding
  stale source stamps, replacements, modifiers, delays, battle state, and complex
  continuations. Physical cards, zones, ordering, and generation relationships
  remain significant. Fulfilled turn conditions are now supported by both
  mandatory auditors because these transitions cannot change the active player.
  Watchdog-bounded public subprocess tests prove these draw paths and preserve
  false-condition, finite-deck, optional-choice, and target-choice results. The
  moving auditor remains limited to turn conditions; rest/ready supports the
  additional stable gates listed below. No unavoidable loop using real catalog
  cards is established.
- **Remaining infinite-loop limits**: moving cycles outside that narrow family
  and unaudited actions (including random actions) clear detection evidence.
  A separate optional moving profile now supports one physical Character with
  mandatory bare On Play self-K.O. and optional bare On K.O. self-play, or an
  optional On Play self-return/replay from hand, with turn-only gates. The hand
  profile permits a matching mandatory Activate Main bootstrap for restart tests.
  An On Play block containing one optional action wrapper has the same saved
  declaration support. Strict single-chain nested wrappers retain separate choices and support a
  declaration after a proven repeated cycle. A mirrored opponent-play profile
  supports exactly two physical sources with opposing controllers.
  It excludes costs, unaudited extra actions, replacements, battle,
  modifiers and unrelated queued or saved references. A positive declaration
  executes one normal representative cycle to create a fresh object before
  compressing equivalent cycles; zero stops immediately. Synthetic tests cover
  saved plans, both controllers, large counts and unchanged-state restart
  rejection. Other optional moving cycles retain ordinary choices.
  Rules 11-1-1-2/3 have an engine numeric declaration protocol
  for audited deterministic rest/active cycles. One player declares a finite
  count; with two players, the turn player declares first and the smaller count
  determines the stopping player. The engine selects the turn player on a tie;
  the rule does not give a separate equal-count priority. Exact repeated states
  permit a constant-time repetition shortcut. Tests cover invalid counts,
  snapshot reload, same-state restart rejection, and changed-state restart.
  Existing server number inputs carry the count; bots declare zero. No UI code
  changes are required. Detection remains partial outside this audited family;
  this is not a claim that all forms of rule 11-1 are implemented. Stable Leader
  name/type and hand/Life/DON count gates are now also certified for rest/ready
  cycles, with exact shape checks and rejection of nonempty post-cost conditions.
  Moving profiles remain turn-only.

## Type Membership and Protected Effect Targets

Ordinary type references use exact membership in the card's official separated
array. Explicit “type includes” text alone uses substring matching. Public
Chopper, Brannew, Nami, and Kuzan tests distinguish compound membership from
Animal Kingdom Pirates, Former Navy, and Blackbeard Pirates' Underlings.
The catalog normalization manifest records the official source and corrections.

Rules 8-4-4 selection and 1-3-3 prohibition are separate. Official Orlumbus and
Crocodile FAQ answers permit selecting protected Characters for removal effects.
Public tests select them and prove that prohibited movement does not occur for
all five effect-removal action families. Cost payment still checks performability.
Rosinante tests preserve simultaneous protection even when its source moves first,
including replacement decisions restored from serialized state. These tests do
not establish general replacement priority.

Rest uses the same selection/execution distinction. Public tests select protected
Yonji and already-rested Characters without rest reactions or replacement prompts.
OP11 FAQ Hatchan entries retain strict attack, Blocker, and rest-cost handling.
Mixed DON choices and saved replacement continuations are tested separately.
Effect-rest costs publish the Character-rest reaction with source provenance,
including self-rest and selected Enel payment; ordinary attack rests do not.
Return-to-deck cost candidates exclude Crocodile-protected opponent Characters;
Plague Rounds and Aramaki prove affordability, valid own payment, and atomic
rejection/retry after restoring a saved prompt.

Mary Geoise's continuous cost-of-playing reduction affects payment only (2-7,
6-5-3-1). Canonical and parsed public tests preserve Rebecca's printed cost limit
and repeat the reduced paid play. This does not change card cost modifiers.
Enel records Life count at the removal event, retaining its pending effect after
Ikoku restores Life. The non-last-Life negative and serialized Trigger boundary
are covered; live “if” conditions and Double Attack scheduling remain unchanged.

## Immediate Defeat During Resolution

Rule 9-1-2 stops further processing when a defeat condition occurs. The finite
variant in `11-mandatory-zone-loop.test.ts` draws the last deck card, loses,
and does not execute its remaining K.O. or newly ready effects. All queued
work, active battle, and pending prompts are cleared; further commands fail
without changing the state. A broad run exposed thirty old neutral scenarios
across twenty-seven files that accidentally exhausted their decks before the
intended follow-up. Each now keeps one unused bottom card; clause assertions
and intentional defeat tests remain intact.

## Activation Cost Replacements

`tests/rules/08-ko-cost-replacements.test.ts` proves rule 8-3-1-7 with
Hakuba/Kyros and Hakuba/Thatch. Replacement processing resolves before a saved
payment continuation. A replaced K.O. does not pay the printed cost, even when
the replacement also moves the original Character to trash. Declining Kyros
permits the original K.O. and Hakuba's cost reduction. Tests include invalid
input retry and snapshot reload. A clearly marked synthetic once-per-turn
variant proves rule 10-2-13-5; real Oars, Moria, and Crocodile cost consumers
retain public-command payment tests.
`tests/rules/08-bottom-deck-cost-replacements.test.ts` also proves Plague Rounds
against OP15-094 Zoro. The defending owner may replace the bottom-deck payment;
Ice Oni is not played, and the hand card paid earlier stays trashed. Original
movement alone completes payment. Snapshot reload, invalid retry, and decline
are covered. Rest-cost paths have no reachable matching replacement in the
current catalog: PRB02-006 requires an opponent's Character effect, while current
rest costs rest the controller's cards through its own effect. This observation
is not a claim of general replacement support for every future cost form.

## Opponent-Turn Effect Durations

`tests/rules/08-opponent-duration-expiry.test.ts` verifies the shared duration
creation boundary (rule 8-1-4-2 and the official OP01 Galdino FAQ). Oinkchuck's
battle-K.O. cost bonus expires at the end of the current opponent's turn.
Labelled synthetic Counter effects cover power and base-power for both opponent
turn/End Phase duration forms. An extra-own-turn fixture preserves a real
Barrier Bulls bonus until the opponent's turn ends. Galdino's card test also
checks attack legality before and after expiry. These tests cover a shared
helper used by sixteen action branches; they are not separate proof of every
modifier/interaction combination.

## Next Paid Play And Search Counts

Kin'emon and Rosinante's Leader tests distinguish the cost paid to play a card
from its cost characteristic (official OP02 Kin'emon FAQ). Next-play discounts
remain pending through unrelated and effect-driven plays and apply to eligible
cards drawn later. Both Leaders have saved-state continuation tests.

Dadan's card tests implement rule 4-8-1 for looking at up to five deck cards:
the controller chooses the number before seeing the cards. Zero, short decks,
private partial inspection, invalid retries, and saved-state continuation are
covered; the existing exact-count search behavior stays separate.

## Exact Types, Attack Restrictions, And Cost Settings

Brannew's public search distinguishes Navy from Former Navy and Neo Navy while
retaining cards with Navy and another printed type. The normalization source is
the official card list's separated types; literal "includes" filters remain
substring filters. This repairs the shared Navy selector family, not only one
search. Other flattened type families still require authoritative normalization
when exact membership is needed.

Curiel proves that a played-turn prohibition on attacking Leaders is independent
of Rush. Permanent attack validation enforces the prohibition even with DON,
while no-DON cannot attack Characters on that turn. Marco separately decides
whether to pay its Event cost and whether to replay. Parser-derived public tests
cover both forms in addition to the authored definitions.

Helmeppo's resolved cost setting survives Kuzan leaving the field. Tests cover
printed costs one and six, saved-state continuation, and end-turn expiry.
Rule 4-12's snapshot subtraction for power zero is not applied to cost zero.
The distinct modifier does not change printed base cost. No direct later-positive-
cost ordering ruling was found; that combination is not claimed as verified.
A reachable Helmeppo/Lola/Oinkchuck probe retains cost zero after the positive
modifier, but no official source establishes a contradiction. This is an
unverified ruling, not a confirmed missing runtime mechanic.
Arlong OP11-023 instead has an additive minus-three hand discount: public tests
require four DON, reject three, and retain printed cost seven on the field.

## Known Limitations

- Multiple eligible replacement choices are supported for battle K.O., effect
  K.O., and field removal (8-1-3-4-2). Tests use two physical Rosinante copies,
  optional decline, and compulsory Thatch priority. Replacement chains now carry
  per-process applied source/effect identities (8-1-3-4-3), including the source's
  area generation. The evidence is serialized on queued actions and prompts;
  newly triggered effect blocks and independent actions begin fresh processes.
  Synthetic public-command tests cover chained replacements and snapshot reload.
  Both-player source scans, turn-player-before-opponent choice groups, decline
  fallback, and multiple rest replacements now have public-command tests.
  Declined scopes are independent for grouped sibling targets, and candidates
  are reconsidered when another replacement transforms the attempted result.
  Mandatory affected-card priority is implemented and has real Thatch and
  Luffy/Rosinante command proofs. Luffy must use its first effect-K.O. replacement
  before optional Rosinante; after its once-per-turn use, Rosinante is offered.
  Optional self-replacement priority remains an unresolved interpretation of
  8-1-3-4-2; this audit does not extend the mandatory rule to optional effects. A real
  Hawkins-to-Zoro chain is proven: Hawkins replaces a Counter K.O. by resting
  Zoro, then Zoro replaces that rest with resting another Character.

- 3-7-6-1 replacement play is implemented for both the `playCard` command
  path and effect-driven plays (`play`/`playThisCard` actions, search-to-play,
  reveal-from-Life plays, and `playCard` costs): the playing player chooses 1
  of their Characters to trash as rule processing, then the play completes
  into the freed slot. Grouped plays (`playGrouped`) also chain rule-trash
  choices, preserve active/rested assignments across pauses, and defer their
  On Play effects until all selected Characters have entered. Moria and Rebecca
  tests cover full fields and removal of the effect source during replacement.
  Rule 8-1-3-1-3 is also covered: deferred On Play effects do not activate
  after their source changes areas, including a return used as another effect's cost.
- The `don-deck` validation rule passes when no DON!! cards are submitted
  (the deck API has no DON!! slot); once present, exactly 10 is enforced.
- During setup (before `startGame`), projections show 0 Life and larger deck
  counts; Life is placed at game start per 5-2-1-6 → 5-2-1-7 ordering.
- Mid-game `OnePieceTestEngine.create` fixtures (`skipSetup: true`) start at
  `turnNumber` 3 so both seats are past 6-5-6-1; tests that must exercise a
  player's first-turn battle ban pass `{ turnNumber: 1 }` (or `2`). Fixture
  `playedOnTurn: 1` is remapped to the effective turn number (legacy
  "played this turn" convention when fixtures always started at turn 1).


## Runner wiring

The rules suite is included in the engine package default Vitest include
(`packages/engine/vite.config.ts` → `tests/rules/**/*.test.ts`). Run with:

```sh
cd packages/engine && vp test run tests/rules
```

## Engine Repairs Driven By This Suite

Writing the specification exposed and fixed these rule violations:

- 6-5-6-1: neither player can battle on their first turn. Tracked per seat via
  `PlayerState.turnsStarted` (not absolute game-turn indices), so an early
  extra turn cannot let the second player battle on their first active turn.
  [Rush] does not override this.
- 6-4-1: the first player now receives 1 DON!! on their first turn.
- 5-2-1-7 / 2-9-2-1: starting Life order corrected (deck-top card at the
  bottom of the Life stack); Life is placed after the mulligan per 5-2-1-6.
- 7-1-1-4 / 7-1-2-3 / 7-1-3-3: battle ends without damage when the attacker or
  target leaves the area at a step boundary.
- 10-2-2-1 / 10-2-3-1 / 6-5-5 / 6-5-6: `playCard`, `activateEffect`,
  `attachDon`, and `declareAttack` are rejected while a battle is in progress.
  Main actions are also rejected while any non-judge choice remains pending;
  the direct command API enforces this, not only legal-move projection.
- 3-1-6: modifiers, once-per-turn usage (10-2-13-4), and battle history reset
  when a card leaves the field (new card in a new area); negation state is
  snapshotted so [On K.O.] activation checks stay correct (10-2-17-1).
- 4-9-2-1: competing set-base-power effects resolve highest-wins through a
  dedicated `basePower` modifier family.
- 8-6-1 and 8-6-1-1: ready effects form a saved group. Its original turn-player
  effects resolve in the owner's chosen order, then its original non-turn-player
  effects, before effects triggered during that group. Public-command synthetic
  tests cover A/B/C ordering, multiple blocks on one source, source reentry,
  costs made payable by an earlier sibling, trigger-time DON!! conditions, and
  atomic costs/actions. Life Trigger tests cover battle and effect-damage
  interruptions. Real Moria/Perona/Absalom tests prove both chosen orders and
  snapshot restore. This replaces the former Moria-specific ordering path.
- 3-7-6-1: playing a sixth Character reveals the card, trashes one Character
  as rule processing (no effects, 3-7-6-1-1 / 10-2-1-3), then completes the
  play.
- 5-1-2 / 5-1-2-1 / 5-1-2-2: deck validation enforces exactly 50 main-deck
  cards, Character/Event/Stage only, and Leader-color legality (unlimited
  copies cards remain color-checked; 5-1-2-4 replaces only the copy limit).
- Card definitions: EB03-009 Makino (power 0, counter 2000) and EB03-050
  Conis (power 0) now carry their printed values.

- 3-1-7 / 3-1-8: simultaneous face-up Life-to-hand moves replaced by ST13 Luffy
  give each owner a private first-to-last deck-bottom ordering decision. Tests
  cover both owners, mixed Life face states, saved prompts, rejected retries,
  failed replacement costs, preserved later payment slots, nested continuation
  timing and actual-arrival counts. Mixed Life/field replacement now settles each
  owner's mandatory Life subset before a field replacement can draw from that
  deck, independent of submitted target order. Saved continuation retains the
  original movement identity and does not recheck the original condition.

- 8-3-1-3/4/7: OP09-101 Kuzan requires a completed opposing Character-to-Life
  payment. Choice of endpoint retains payment provenance through saved prompts;
  protection or accepted removal replacement suppresses the discard result.
- 11-1-1-2/3: optional rest/ready cycles can certify fulfilled stable turn
  conditions. Tests prove false gates, saved declaration, same-state restart
  prevention, turn-player-first declarations and minimum stopping count.
- OP09-097/098 FAQ: negated OP03 Nami loses when its deck becomes empty;
  Leader lose-game replacements respect effect negation. Existing normal Nami
  wins and Brook deferred-defeat cases remain green.

- OP10-026/027 FAQ: source plus filtered trash cards form one ordered deck payment;
  private saved selection rejects missing source, duplicates and wrong-power cards.
- OP10-069 FAQ: attached-DON conditions are rechecked after payment. Returning
  the last attached DON suppresses the effect without refunding its paid cost.
- OP10-042 FAQ / 8-1-3-3-5: continuous cost contributions are evaluated in
  turn-player order and rechecked after resolved modifiers. Tsuru leaves
  Bartolomeo at two; Kaku and turn-player Issho leave it at zero.


### Additional Main activation and numeric rules proofs

- OP12-041 Sanji now excludes Counter/Trigger-only Events from Main activation.
  A saved choice rejects an ineligible Event and retains the pending choice;
  choosing zero remains valid. Existing Bartolomeo and Sabo activation proofs
  cover the shared action. Source: official OP12 FAQ.
- CR 1-3-6-2-1: real Tsuru and ST14 Event actions prove that a negative cost
  remains part of later arithmetic, although its displayed cost is zero.
- CR 8-2-2: Black Vortex negates Nami's activation without making her a printed
  no-effect Character for Makino's target condition.
- CR 8-2-4: after Black Vortex negates Law's activation, Buggy can grant a new
  Double Attack effect; the Leader then deals two Life damage.
- Loop comparisons omit the derived continuous-cost input fingerprint, while
  retaining cost contributions, results, pending choices and unsupported state.
  Watchdog tests cover mandatory moving loops and saved optional declarations
  with unrelated cost effects. A moving source with its own numeric cost
  contribution also reaches a repeated trash boundary and draws. Finite draw
  and saved optional-choice controls distinguish that path from a mandatory loop.


### Added activation requirements

`08-added-effect-requirements.test.ts` proves resolved additions under CR 8-3-1-2
and 8-3-2-2. Added costs follow printed common/alternative costs in grant order.
Each cost has its own payment cursor and physical selection; saved continuations
retain the activated block. Initial affordability follows original payments in
sequence, including hand supply and DON!! reuse, and rejects shared-resource
overcommitment. A child-process watchdog proves the large impossible-hand case
without enumerating every combination. Added conditions combine with printed
conditions, including DON!! qualification at trigger fulfillment. Tests also cover
expiry, source movement and recipient generation changes. These are synthetic
engine proofs; no current card printing is claimed.

`08-permanent-activation-conditions.test.ts` adds a live evaluator for permanent
condition grants. Provider block and action conditions use the provider's
context; the added conditions use the recipient's context and combine with
printed and resolved conditions. Tests cover removal, negation, action gates,
effect-type scope and saved payment continuation. Permanent cost grants remain
unsupported: neither the general ordering rules nor the reviewed official FAQs
establish how to merge their order with already resolved cost grants.

`08-inactive-absolute-cost-setter.test.ts` separates applicable permanent effects
from declarations on inactive cards. A setter in the deck or trash cannot stop
unrelated numeric settlement; static false block/action conditions and negation
also suppress it. The source-area enumeration is shared with the existing
absolute-cost evaluator. Live numeric-dependent setters retain the conservative
review boundary because settlement can change their eligibility. These are
synthetic native-grammar proofs; the current catalog has no permanent `setCost`
card. OP03-091 Helmeppo uses a resolved On Play setter instead.

### Base-cost settings and Life value

`04-base-cost-setting.test.ts` proves CR 4-9-2-2 with a distinct `setBaseCost`
action. The highest applicable setter wins; printed cost is only the fallback.
Signed base cost remains part of arithmetic, while observable negative cost is
zero. Absolute current-cost settings remain distinct. Tests cover permanent and
resolved competition, expiry, negation, source removal, recipient zone changes,
saved state, and numeric ordering with a fixed base. Main, Counter, and
effect-driven Event activation capture base cost before zone movement; activation
history and nested base-cost and dynamic-cost Event filters use that snapshot.
Dependent permanent base-setting feedback remains an explicit unsupported
boundary pending a coherent rule model. `04-base-power-action-condition.test.ts`
also proves that a permanent base-power copy obeys its action-level condition
and copies base power without additive or DON!! power.

`02-life-value.test.ts` proves CR 2-9-4 using a Leader Life-value modifier.
Startup captures both Leaders' effective values before placement. Later value
changes do not move Life cards; damage and Life-count conditions still use
physical cards. Tests cover signed arithmetic, hidden projections, saved state,
expiry, negation, conditional setup quantities and deck exhaustion. Oversized
starting Life places the available cards, then processes empty-deck defeat.
Simultaneous ordinary defeat has no winner; this is not a Rule 11 loop draw.
Nami's alternate win and Brook's deferred loss retain their behavior. Competing
simultaneous alternate wins request judge review. Saved review does not start
the first turn until intervention resolves the conflicting state; simply
acknowledging the unresolved prompt keeps setup paused.
These are native-grammar fixtures, not claims about a current card printing.

### Hand movement loops and battle-object identity

`01-simultaneous-state-change.test.ts` proves an explicit grouped field-card
instruction under CR 1-3-8. All target choices precede mutation; the turn player
chooses first when both players choose. Saved choices retain candidate identity,
zone generation, numeric totals and rest protection. Rest wins an overlap, then
prohibitions and replacements apply; a prohibited rest does not revive the
suppressed set-active instruction. This combination is derived from CR 1-3-3 and
1-3-8, not a direct FAQ example. Original results commit together before rest
reactions are published. Tests cover both group orders, sequential controls,
overlap, independent targets, invalid replies, saved replacement decisions and
stale generations. The native type also admits cost-area DON!!. A serialized
identity ledger tracks original selections through replacement payments,
transfers and nested grouped instructions. Active/rested changes retain identity;
area changes create a new generation. A token that left and returned cannot
receive a change addressed to its old area identity. Counts alone do not decide
which original card survived. Ordinary state-filtered DON!! groups have native
support; unsupported additional DON!! qualifications request judge review.

`11-mandatory-hand-loop.test.ts` uses an external watchdog to prove that a forced
self-return-to-hand and self-play cycle terminates as a draw. The detector admits
only the audited deterministic movement shape and preserves moved physical IDs,
previous target IDs, ordered areas and queue identity relationships. Finite deck
loss, random-deck actions and optional stopping remain distinct.

`11-optional-hand-loop.test.ts` proves optional On Play hand-loop declarations,
saved zero and positive counts, invalid replies and same-state restart prevention.
A genuine state change permits a new loop. Fingerprints normalize only top-level
state field order; nested dictionary order remains exact because modifier order
can change activation-cost payment. `11-optional-action-hand-loop.test.ts` adds
native optional action wrappers, both controllers, saved retries and restart
checks. `11-optional-multi-moving.test.ts` adds strict single-chain nested
wrappers and a two-owner opponent-play/self-return cycle. Both players declare
in turn-player-first order. A positive declaration completes a whole
representative cycle before traversing the prefix to the stopping player.
Saved declarations, both active seats, zero/large counts, distinct minima,
equal-count policy and no-restart checks have public command proofs. Broader
arbitrary-action moving cycles remain outside the certified profile.

`11-mandatory-wrapped-loop.test.ts` checks sequence, true/false conditional and
nested sequence/conditional wrappers with mandatory hand movement. It also
checks wrapped rest/active cycles and forced grouped field-card instructions.
DON!! groups and replacement-bearing sources stay outside this loop proof.
Forced repeats end in a draw; false gates,
finite deck loss, random actions and optional choices keep their normal result.
All thirteen cases use public commands in externally bounded child processes.

Ice Oni's end-of-battle target now retains its original zone generation from
the completed power comparison. A real ST30 Marco regression pays its On K.O.
cost, replays the same physical card, and restores a snapshot during payment.
The replayed Character stays in play under CR 3-1-6; the existing surviving-target
test still returns that original target to the bottom of the deck.


### Overlapping DON!! Refresh restrictions

`06-overlapping-don-freeze.test.ts` plays two real OP07-026 Jewelry Bonney
cards. Selecting the same rested DON!! twice freezes one DON!!, while selecting
two different cards freezes both. A saved snapshot before Refresh retains the
result, and both restrictions expire before the following Refresh. Refresh now
counts distinct valid DON!! targets instead of modifier records. This proof
does not by itself certify restriction identity across later DON!! transfers.


### Physical DON!! payments and full-field play

`06-command-don-identity.test.ts` covers meaningful physical DON!! choices for
Character, Event, Stage and Counter Event costs, plus normal DON!! attachment.
Equivalent source pools keep their ordinary automatic payment path. Saved
choices retain exact candidates, card generation and Counter battle identity;
invalid replies keep the choice pending without payment. The played or
activated card is publicly revealed before its payment choice.

Under CR 2-7-2, full-field Character play now pays before the rule trash in
3-7-6-1. Real ST23-001 Uta costs two while its controller has a 10000-power
Character. Trashing that Character to make room neither changes the paid price
nor causes a second payment. Saved new and legacy unpaid replacement prompts
have separate public-command regression proofs.

Freeze restrictions bind to their physical DON!! through active/rested changes
within the cost area. They clear on area exit under CR 3-1-6-1. The ledger stays
while a grouped instruction or bound restriction needs identity, then releases.
Legacy freeze modifiers are bound before a command can mutate their DON!!.

### Delayed target identity

`03-delayed-target-identity.test.ts` applies CR 3-1-6 to saved delayed actions.
Runtime-only bindings retain source and previous-target generations through
nested wrappers and queue continuations. Validation occurs at actual target use,
so earlier queued removal/replay cannot substitute a new object. Independent
schedules retain separate bindings; actions within one schedule can consume the
fresh output of their preceding action. Historical counts and fresh selections
remain separate from old-object targeting. Legacy snapshots without the binding
retain their prior ID-only behavior.

Real OP11-092 Helmeppo and OP11-107 Topknot Neptunian tests cover removal/replay
before the End Phase, including JSON resume. The former preserves the replayed
Prince Grus; the latter keeps the Topknot replayed by OP13-031 Law rested.

### Mandatory DON!! resource loops

`11-mandatory-don-loop.test.ts` uses subprocess watchdogs for CR 11-1-1-1.
A synthetic costless mandatory `whenDonReturned` loop adds, gives and returns
one DON!!; both active seats and a simpler add/return loop finish as a draw.
The audit admits fixed positive add/give actions and forced whole-pool returns
only. It keeps exact DON!! counts, attachments, physical identities and ordered
queue state, with no new token or generation normalization. All reachable DON!!
reactions must fit the audited mandatory grammar. Identity ledgers, modifiers,
permanent/replacement effects and unaudited reactions prevent certification.
Optional, OPT, partial-pool choice and finite deck-loss controls remain finite
or request their normal choice. Ledger and permanent-restriction admission
controls do not execute an unsupported infinite program. No real catalog
mandatory resource cycle was established by the bounded review.


### Optional DON!! resource loops

`11-optional-don-loop.test.ts` adds 14 controls for CR 11-1-1-2. A synthetic
optional returned-DON!! reaction adds one active DON!!, gives it to its Leader,
and returns the whole pool. After the exact state repeats, the existing prompt
accepts a finite count and stops the loop. Both active seats, a non-turn stopping
owner, zero/one/maximum-safe counts, invalid replies, and JSON recovery are
covered. An unchanged-state restart is refused; a separate legal draw permits
a new choice. Finite drawing, partial returns, and up-to attachment retain their
normal outcomes or choices. Ledger, permanent-effect, and replacement controls
are excluded from certification. DON!! evidence cannot mix with rest/ready or
moving-card evidence.

This family admits one optional returned-DON!! source and fixed deterministic
DON!! actions only. The extracted mandatory audit retains its prior admission
rules. No card identities or resource counts are normalized; no real catalog
infinite resource cycle is claimed. The related loop gate passes 153 tests in
16 files. Broader optional resource programs remain outside this proof.


### Two-player optional DON!! resource loops

`11-two-player-don-loop.test.ts` extends the exact resource proof to two Leader
sources with different controllers. Each optional returned-DON!! reaction restores
its own resource and returns the opponent's whole pool. After the exact cycle
repeats, CR 11-1-1-3 asks the turn player and then the non-turn player for a count.
The smaller count controls stopping; the final asymmetric attachments and DON!!
decks identify the stopping boundary. Equal counts preserve the existing engine
policy of stopping at the turn player's boundary; this is not a new ruling on
tie priority.

Both active seats and either minimum-count owner are covered, including zero,
large safe counts, invalid replies, JSON recovery between declarations, the
initial active-to-attached transition, unchanged-state restart refusal and a
separate draw that permits a new choice. Finite draw, partial-return and up-to
choices retain ordinary handling. Stable source-ID membership prevents evidence
from crossing single-source, two-source or other loop profiles. The prior scalar
source marker remains valid for saved single-source boundaries. Opponent returns
are admitted only by the two-source audit; mandatory and single-source defaults
remain unchanged. No real catalog infinite cycle or broader resource program is
certified by this synthetic family. Nineteen new controls include rejection of
a third field DON!! reaction and direct proof that default and single-source
audits reject opponent returns. The revised three-file DON!! gate passes
43 tests; the preceding 17-file loop gate passed 170 before these two extra
fixture controls.


### Effect-play restriction ownership

The OP13-119 Ace primary proves that play restrictions belong to the player who
will play the selected card. In the real Mihawk/Ace/Soba Mask sequence, south's
base-cost restriction must not hide north's legal discounted Soba Mask. The test
restores JSON before north's choice and checks placement and the resulting On
Play action. This closes a candidate-filter mismatch with the existing placement
check; it does not establish a new rule about selecting unplayable cards.


### Opponent top-deck play

`04-opponent-top-deck-play.test.ts` proves the supported combination of
`source.player: opponent`, `source.zone: deck`, and `topOnly`. Candidate filtering
must use that opponent's top card, matching the existing playing seat used for
placement and the choice. Both seat orientations cover optional acceptance,
decline after JSON recovery, forced play, and an ineligible top card above an
eligible deeper card. The effect controller does not receive the opponent's
private choice. Neither a deeper card nor a card in the other deck is played.
These are synthetic native-action proofs, not a new catalog printing claim.


### Ordered permanent base-cost contributions

`04-ordered-base-cost.test.ts` extends the shared numeric solver with permanent
`setBaseCost` contributions. A permanent block remains one ordering unit; its
actions run in printed order. Applicable settings compete by highest value,
with printed cost used only when no setting applies. Raw signed base values
remain separate from the observable zero floor and additive cost changes.

Current-cost and base-cost predicates read the provisional contribution state.
Saved ordering choices retain those contributions, and settled base-cost queries
use the same result. A synthetic cost-six Character with base-cost two and a
separate conditional cost-plus-two effect proves the distinct outcomes two and
four. This prevents the setter from being evaluated ahead of the chosen order.

The supported extension includes stable eligibility and power-based selectors,
block conditions and action conditions when no live permanent power writer can
feed cost back into power. Resolved power and base-power modifiers remain valid
inputs in the existing common stage-zero/stage-one model; their stored values
are fixed, but their staged application is preserved. No separate per-action
numeric context is used. Self-dependent cost/base-cost eligibility, keyword and
negation feedback, and dependent base-power settings remain outside this proof.
These are synthetic native-action tests, not new card definitions.

The focused base-cost gate passes 157 tests in 11 files, including 26 new
controls. Dynamic-cost dependency, mixed hand/field action scope, source and
target re-entry, saved history and legacy snapshots are covered.

### Ordered permanent base-power contributions

`04-ordered-base-power.test.ts` extends the same numeric process with stable
permanent base-power settings and deterministic own-Leader base-power copies.
CR 8-1-3-3-5 controls effect order; CR 4-9-2-1 selects the highest applicable
base setting. Printed power is the fallback, and power can remain negative.
Base-power reads, current-power reads, saved choices and prior contributions
use the same provisional and settled values. Resolved modifiers retain the
existing shared settlement stages.

A synthetic printed-power-6000 Character with a base-power-2000 effect and a
conditional +2000 effect can settle at 2000 or 4000. The selected result survives
JSON recovery and a later public action. These rules fixtures do not change
printed card definitions.

Property-specific dependency checks retain independent legacy settings without
freezing connected feedback. They follow base/current power and cost, keywords,
attributes and effect negation. Unknown predicates cannot prove independence.
Setter exclusion uses the physical source, zone generation, block and action.
Connected unresolved legacy feedback still requires judge review.

`04-base-power-mixed.test.ts` adds real-card baselines for Linlin with Fuza and
Holly, Luffy with Vista, and Ju Peter with Linlin. The ordered-power fixtures
also place the synthetic order choice beside these independent card families.
This proves coexistence for those cases, not general self-referential settings.

The focused gate passes 188 tests in 13 files, including 28 new ordered-power
controls and three real mixed-card tests. Both active seats, field targets,
signed values, highest settings, saved history, source re-entry, copy qualifiers
and connected feedback boundaries are covered. Full-engine validation passes
12,025 tests in 2,769 files; three opt-in tests remain skipped.

### Acyclic base-cost eligibility and dynamic current-cost filters

`04-dependent-base-cost-order.test.ts` replaces blanket numeric-dependency
rejection with a per-setter dependency check. A base-cost setting may read
another card's changing cost, base cost or power when its output cannot change
its own eligibility. Native condition scopes use player, zone and immutable
filters; numeric predicates never narrow the dependency audit by their current
result. Ordinary additive feedback retains its existing ordered history.

Self-dependent and transitive base-setting cycles remain explicit boundaries.
Mutable keyword, attribute and negation grants still require ordered-grant
support when they affect setter eligibility. Fixed or unrelated grants do not
cause blanket rejection. Existing real Linlin and Vista behavior remains
separate from these synthetic base-cost rules programs.

The real Gedatsu tests prove dynamic cost limits use current cost. Ice Age makes
printed-cost-four Apoo eligible at current cost zero against one Life; Doll's
opponent-turn cost increase makes it ineligible against three Life. The reduced
cost choice also survives JSON recovery. Explicit base-cost filters retain
their separate activation snapshot, while dynamic cost filters use the same
current-cost getter as ordinary cost filters. Synthetic Main, Counter and
effect-driven Event cases distinguish those values.

Immutable false action gates do not create live dependencies; their contribution
identities remain stable. Payment-only discounts do not write current card cost
in the dependency model. The focused gate passes 231 tests in 18 files, including
29 new dependency controls and five added card/Event cases. Full validation
passes 12,059 tests in 2,770 files, with three opt-in tests skipped.

### Aggregate play-choice validation

OP17-118 Rocks.D.Xebec's primary test proves invalid aggregate choices are
rejected atomically. In both seats, a saved choice rejects total eleven against
the limit of nine, retains the prompt and hand, and then accepts an exact-nine
retry after another JSON recovery. An empty selection remains legal under the
printed up-to clause. `effectPlaySelection` now uses the shared aggregate
validator before enqueueing; the later execution check remains in place.

The six-file related gate passes 15 tests, including four new both-seat cases.
The full engine suite passes 12,063 tests in 2,770 files with four workers; three
opt-in tests are skipped. An initial default-concurrency cost-cache watchdog
timeout does not recur in the isolated seven-test run or full four-worker run.
No timeout threshold was changed.

### Ordered printed activation costs

`08-ordered-printed-costs.test.ts` exercises CR 8-3-1-1 and 8-3-1-3-1 through
public activation and payment commands. Printed entries and selected alternative
branches use separate physical selections. Initial affordability uses the whole
ordered list; later shortages pay available units and payable later entries but
suppress the effect body. Saved progress preserves reduced payments, original
source identity, and the incomplete flag. Compound costs can still pay their
generic hand/trash part after the original source moves.

DON tokens in rest-card preflight and full-field play-cost replacement are
covered. Existing bottom-deck protection controls now assert the printed hand
payment precedes the removal prompt, including after invalid replies and JSON
recovery. Replaced Life and removal payments preserve later payable entries
while suppressing the body under CR 8-3-1-7. ST34-004 and physical DON identity
controls assert each paid prefix before the next choice.
These synthetic native-cost programs do not imply repeated-cost printed cards.

Validation: 18 new controls, 153 related tests in 22 files, and 12,081 full
engine tests in 2,771 files pass. Three opt-in tests remain skipped. Engine build,
eight-file checks, all 30 adapter tests and adapter type check pass.

### Rest activation-cost replacement

`08-rest-cost-replacements.test.ts` isolates CR 8-3-1-7 and 10-2-13-5 with
synthetic native replacements. Rest costs retain an explicit saved payment
process; original payment is distinct from replacement action results. Later
costs continue and the effect body is suppressed when original payment fails.
Physical DON identity and card generation remain part of the payment binding.
The exported rest replacement's opponent-effect restriction gives no current
own-cost caller; these are engine grammar controls.

OP17-004's primary test now proves Rush with a newly played Character and a
rejected pre-grant attack. OP17-119 rejects aggregate cost five, preserves the
pending choice, and then removes exact cost four. Its own-turn cost eighteen
is also asserted. These strengthen existing card proof without definition edits.

Validation: seven new rules controls and 127 related tests in 16 files pass.
Both repaired card files pass five tests. The full engine passes 12,088 tests
in 2,772 files, with three opt-in tests skipped. Engine build, seven-file scoped
checks, all 30 adapter tests and adapter type check pass.

### OP17 defining-clause controls

Primary files 011, 027, 049, 061, 063 and 064 now exercise missing printed
boundaries: DON threshold, restricted Rush, two-target rest and Leader gate,
payable once-per-turn reuse, battle expiry, optional declines, named choices,
and post-cost conditions after a real turn cycle. Lead Performers distinguishes
cost decline from a paid zero-Life choice and a paid wrong-Leader condition.
Kaido's later-turn condition suppresses its result without refunding the cost.
These are test-only proof repairs; card definitions and runtime are unchanged.

The combined eight-file gate passes 52 tests; six-file scoped checks pass.
No new full-engine, build, or adapter run was needed for this test-only batch.

### OP17 field-condition and duration controls

Primaries 081, 083, 084, 085, 090, 091, 092 and 093 now prove absent conditions,
payable decline, named hand selection, zero-selection consequences, real-turn
expiry, and live loss of cost-based power or Rush after the enabling Character
leaves. Public attacks distinguish Blocker and Unblockable from mere projected
labels. Card definitions and runtime are unchanged.

The eight-file combined gate passes 33 tests; all eight scoped checks pass.
No full-engine, build or adapter rerun was needed for this test-only change.

### OP17 payment, Trigger and rejected-choice controls

Primaries 103, 104 and 106 distinguish conditions before and after payment,
payable decline, and insufficient payment. Primary 111 proves Life Trigger play
continues into On Play on the opponent's turn. Primary 114 proves zero Life
selection permits the following two-target reduction and its turn expiry.
Primary 118 proves same-name rejection below the aggregate cap in both seats;
name and aggregate rejection assertions now inspect the returned failed state
before JSON recovery and retry. No runtime or card definitions changed.

The combined seven-file gate passes 34 tests, including the existing late-clause
companion. All six changed test files pass scoped checks. No new full-engine,
build or adapter run is claimed for this test-only batch.

### Returned-state rejection proof

Bottom-deck cost protection, Lucci's simultaneous target groups and Moria's
grouped play tests now adopt the failed command's returned state before
asserting preserved payments, cards and choices. The view comparison permits
only the expected rejection diagnostic, and valid retries use that state.
The three-file gate passes 16 tests and scoped checks; no runtime change.

### Residual primary-clause proof

Wyper now proves Life visibility payment, all-opponent reduction then K.O.,
expiry and real rested-DON transfer. Risky Brothers proves freshly played
Rush: Character with a Leader exclusion, threshold after payment and Slash
expiry. Perona distinguishes base power from current power through opposing
non-K.O. removal; Mihawk proves exact draw/discard identities. Orochi/Kanjuro
retain accepted payment across false conditions; Usopp/Sanji lose live bonuses
after removal, while Sanji's unconditional draw/discard remains independent.
These are nine test-file proof repairs for eight cards; no runtime change.

The combined nine-file gate passes 36 tests, and all nine changed files pass
scoped formatting, lint and type checks. No new full-engine, build or adapter
run is claimed for this test-only batch. No simulator files changed.

### Scoped negation and numeric settlement

`08-independent-negation-base-setting.test.ts` covers six both-seat real cases:
opposing Teach and Roger do not invalidate Linlin/Saul; own Roger properly
negates Linlin after public play. Eleven controls in total include both negation
action forms and legacy numeric feedback. Timing-limited negation cannot disable
permanent numeric effects (CR 8-1-3-3, 8-2-1). Base-setting guards now use graph
reachability to the actual source's negation instead of any negation on the field.
Legacy setter writes remain part of that reachability check; unrestricted numeric
feedback still requires review. All 129 related tests in seven files also pass.

Final validation: engine build and three-file checks pass. The full engine
suite passes 12,124 tests in 2,773 files with four workers; three opt-in tests
are skipped. All 30 server-adapter tests and its type check pass.

### Real alternate-win trigger order

`09-rule-processing.test.ts` now distinguishes the real Roger/Boa/Nami timing
from the synthetic simultaneous-startup boundary. In both attacking seats,
zero-Life Roger wins when Boa blocks, before the non-turn player's Boa draws
Nami's final deck card (CR 8-6-1, 1-2-5). With Roger at one Life, Boa draws that
card and Nami wins instead. Deck/hand identities, winner, finish reason and the
surviving Blocker prove that the later game actions do not continue after a win.
All seven tests in the file and its scoped checks pass; no runtime change.

### Automated-game matrix after scoped negation

The [saved report](validation/automated-game-matrix-2026-10-08.json) records
2,880 completed games on engine commit `d042545b0242eaead4f73bbfddd92f125a85e438`.
The matrix uses six default deck archetypes, 24 deck pairs, 12 strategy pairs,
ten seeds per cell (6000–8879), alternating first player and a 500-command
limit. All 288 cells have zero rejected commands and zero unfinished games;
2,333 games were won by south and 547 by north, with no draws.

The runner returned exit code 1 for exceeding its 1,500-second test timeout.
All groups completed and the full report was written in 1,545.356 seconds
before that timeout result. The saved report was checked for all 288 cells,
2,880 games, consistent outcome totals and the complete seed range. This is
completed game evidence, not a green test-runner result. The temporary test
was removed after the process ended. No engine or card source changed during
the run; the later Roger/Nami addition changes tests only.

This matrix samples the default decks and strategies. It does not prove all
card combinations or close the documented rules and authority limits.
