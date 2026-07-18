# One Piece Card Behavior Inventory

This inventory tracks executable behavior tests by canonical gameplay card.
Alternate art and reprint definitions share a canonical behavior test; catalog
signature tests remain responsible for detecting variant drift.

## Test Contract

For each printed behavior clause, add one focused happy path that:

1. reaches the effect through a legal player command;
2. checks any projected decision is owned by the correct player and contains
   the choices required by the card;
3. submits that decision through the public engine command;
4. asserts one player-visible result and no unresolved prompt.

Add a negative case only when a timing, ownership, threshold, filter, duration,
or optional choice is defining behavior for that card. Generic cost payment,
targeting, trigger, and combat boundaries belong in shared engine suites rather
than being repeated for every card. JSDOM and Playwright tests are sampled once
per distinct interaction family, not once per card.

### Fifty-card parallel self-improvement checkpoint

After each fifty-card batch—or sooner when the same friction affects two cards
or one card takes more than two repair cycles—pause the queue briefly and turn
the batch's evidence into a measurable workflow improvement. Run five
persistent implementers concurrently with disjoint ten-card leases. The
coordinator exclusively owns shared code, inventories, skills, validation, and
Git operations:

1. keep the per-card fast path to its focused behavior test and the smallest
   owning-package check that can reject the change;
2. classify each repair cycle as `card-definition`, `shared-engine`,
   `test-harness`, or `test-only`, and record the batch's first-run pass count;
3. choose at most one or two reusable changes backed by at least two cards;
   otherwise explicitly choose no change;
4. select the batch gate by blast radius: run the authored card-type directory
   for card-only work, or the full engine suite plus root `vp check` when shared
   engine, type, projection, targeting, or harness code changed;
5. use each retained improvement on the next two cards and keep it only when it
   removes setup, prevents a repair cycle, or safely narrows a gate.

Use one compact record so the checkpoint does not become a reporting task:

```text
Batch: <fifty canonical cards>
First-run pass: <n>/50
Signal: <repeated friction, or none>
Change: <one or two reusable improvements, or none>
Proof: <smallest check plus blast-radius batch gate>
Next-two result: <keep because ... | revise because ...>
```

Update both inventories only after focused behavior proof is green. Do not
rerun an unchanged broad baseline or restate the full progress narrative after
every card.

Previous checkpoint (OP10-001 through OP10-042, fourteenth Leader batch):

- **First-run pass:** 2/5 card files. Caesar and Usopp first exposed a missing
  shared Character-removal import, Law needed a test-only confirmation-shape
  correction, and Usopp's remaining failure was a non-Dressrosa fixture.
- **Signal:** Sugar and Usopp each depended on a domain event that only covered
  one legal origin: Main but not Counter Event activation, and effect movement
  but not battle K.O. Character removal. Law also distinguished summed current
  Character cost from raw zone count and exposed the existing unsupported
  reveal-from-Life family.
- **Change:** Counter Events now publish Event-activation reactions after their
  own effect; effect movement and battle K.O. publish one Character-removal
  event with cause provenance. A reusable live-property total condition and
  reveal-from-Life play/keep flow replace card-specific workarounds. Both One
  Piece skills now preflight these domain and aggregation distinctions.
- **Proof:** seven focused behavior paths and the full 746-test engine suite
  pass (2 skipped). All touched engine, card, and type checks plus the root
  harness check are green.
- **Next-two result:** use the origin-complete event and live-total preflight on
  OP10-099 and OP11-001.

Current checkpoint (OP10-099 through OP11-040, fifteenth Leader batch):

- **First-run pass:** 1/5 card files. Jinbe passed immediately. Kid and Luffy
  exposed fixture/timing setup, Koby separated quiet Rush: Character proof from
  a Character's own When Attacking behavior, and Shirahoshi used the dedicated
  effect-play decision rather than generic target selection.
- **Signal:** Luffy introduced the first start-of-turn choice and proved that a
  phase boundary must pause before Refresh completion and the turn draw. Koby's
  printed removal replacement also required distinguishing supported effect
  K.O. proof from broader non-K.O. and simultaneous-removal coverage.
- **Change:** the shared resolution queue now exposes `startOfYourTurn` before
  attached DON!! return, field refresh, and Draw Phase, with a continuation that
  waits for projected decisions. Both One Piece skills now preflight this timing
  and require origin-specific proof for remove-from-field replacements.
- **Proof:** six focused public-command behavior tests and the full 752-test
  engine suite pass (2 skipped). Touched type, card, and engine checks plus the
  root harness check are green; the broad cards-package check retains one
  unrelated formatter mismatch in `OP14EB04/events/098-crescent-cutlass.ts`.
- **Next-two result:** use the start-turn boundary and origin-specific
  replacement preflight on OP11-041 and OP11-062.

Current checkpoint (OP11-041 through OP12-040, sixteenth Leader batch):

- **First-run pass:** 1/5 card files. Kuzan's first focused proof passed after
  the shared trigger was wired; the other four exposed first-turn fixture,
  exact-cost auto-payment, battle-duration observation, or legal-command shape
  assumptions before their card behavior assertions became meaningful.
- **Signal:** these cards shared four reusable boundaries: private top-deck
  viewing, one once-per-turn family across alternate triggers, completed-battle
  history with filtered attack targets, and hand-trash events carrying both
  source-card provenance and a grouped amount after the originating effect.
- **Change:** the typed effect surface now supports those boundaries plus
  trigger-derived draw amounts. Rayleigh also exercises public reveal costs and
  deck-building restrictions, while Nami keeps a post-trigger `If` on the draw
  action rather than blocking activation.
- **Proof:** six focused public-command behavior tests and the broad 3,038-test
  engine run pass (2 skipped) without capability fallback. Focused type, card,
  and engine checks plus the root harness check are green.
- **Next-two result:** use provenance-aware grouped events and scoped legality
  restrictions while preflighting OP12-041 Sanji and OP12-061 Rosinante.

Current checkpoint (OP12-041 through OP13-002, seventeenth Leader batch):

- **First-run pass:** 2/5 card files. Luffy and Ace passed immediately; Sanji,
  Rosinante, and Koala exposed optional-DON, exact-cost auto-payment, and open
  battle-Counter fixture assumptions rather than additional product defects.
- **Signal:** this batch required Event activation without its upper-left cost,
  play-source zone provenance, a damage-completion reaction ordered after Life
  Trigger resolution, and a compound numeric choice whose selected DON!! count
  determines a later power modifier.
- **Change:** the typed effect and engine surfaces now support those shared
  boundaries. Card definitions also preserve qualifying names, target owners,
  source categories, shared once-per-turn families, and verified modifier signs.
- **Proof:** eight focused public-command behavior tests and the broad
  3,046-test engine run pass (2 skipped) without capability fallback. Focused
  type, card, and engine checks plus the root harness check are green.
- **Next-two result:** carry the compound numeric-choice and damage-continuation
  preflight into OP13-003 Gol.D.Roger and OP13-004 Sabo.

Current checkpoint (OP13-003 through OP14-020, eighteenth Leader batch):

- **First-run pass:** 2/5 card files. Bonney and Mihawk passed immediately;
  Roger exposed unsupported DON!! zone counting, while Sabo and Law converged
  on attached DON!! power incorrectly surviving turn handoff.
- **Signal:** phase placement must evaluate permanent conditions before the new
  resource enters play, Trigger-qualified Character play needs a real domain
  dispatch, and player-wide play restrictions must cover direct and effect play.
- **Change:** DON!!-Phase placement, Trigger-Character play, and filtered
  cannot-play rules now have shared engine paths. Attached DON!! contributes
  power only during its controller's turn, matching rule 6-5-5-2.
- **Proof:** five focused public-command behavior tests pass without capability
  fallback. Focused type, card, and engine checks are green; the broad 3,051-test
  engine run passes (2 skipped), as does the root harness check.
- **Next-two result:** carry turn-scoped DON!! power and player-wide play
  legality into OP14-040 Jinbe and OP14-041 Boa Hancock.

Current checkpoint (OP14-040 through OP14-080, nineteenth Leader batch):

- **First-run pass:** 1/5 card files. Jinbe passed after its alternative trait
  filter was corrected; the other four exposed missing event filters, battle
  retargeting, filtered Character K.O. costs, and permanent removal legality.
- **Signal:** two cards encoded text before the colon without an executable K.O.
  cost, and permanent “cannot be removed” text had no shared field-exit guard.
- **Change:** filtered Character K.O. is now a reusable cost with public choice
  and live revalidation, while effect-driven Character exits consult permanent
  removal restrictions. The five definitions now preserve alternative traits,
  K.O. event scope, battle target changes, and optional follow-up counts.
- **Proof:** eight focused public-command behavior tests pass without capability
  fallback. The 95-file Leader directory passes 115 tests, the full engine run
  passes 777 tests with 2 skipped, and the root harness check is green.
- **Next-two result:** carry filtered K.O. cost and permanent field-exit
  preflight into PRB01-001 Sanji and ST01-001 Monkey.D.Luffy.

Current checkpoint (PRB01-001 through ST01-001, Leader type completion):

- **First-run pass:** 1/2 card files. Sanji's existing structured behavior
  passed directly; Luffy exposed a redundant confirmation before its printed
  0–1 DON!! choice.
- **Signal:** the first Character inventory classified vanilla cards as parser
  gaps, which would waste per-card triage cycles and obscure real missing
  executable behavior.
- **Change:** Luffy now routes directly from Activate: Main to the 0–1 count and
  recipient mapping. The queue generator and test-generation skill now keep
  vanilla cards in a separate parameterized-invariant batch after ability cards.
- **Proof:** two focused public-command tests cover the final Leader behaviors;
  all 97 Leader files pass 117 tests, and the full engine suite passes 779 tests
  with 2 skipped. The regenerated Character inventory reports 1,184 structured
  pending, 240 printed gaps, and 119 vanilla cards; the root harness check is
  green.
- **Next-two result:** begin the Character queue with EB01-002 Izo and EB01-004
  Koza, reusing the completed Leader interaction families.

Current checkpoint (EB01-002 through EB01-008, first Character batch):

- **First-run pass:** 3/5 card files. Yamato and both LittleOars Jr. boundaries
  passed directly; Izo exposed exact matching for compound Leader traits, Koza
  exposed a missing colon cost, and Chopper exposed a projected Blocker payload
  that the resolver treated as declining.
- **Signal:** Character preflight must distinguish parser omissions, compound
  trait representation, and player-submission contracts before adding fixtures.
- **Change:** active-Leader power reduction is now an executable parser-generated
  cost family across six definitions. Leader trait conditions include compound
  trait strings by default, Blocker accepts projected entity selections, and
  K.O. replacements preserve battle-versus-effect origin.
- **Proof:** five focused public-command files pass six tests, covering On Play,
  opponent-attack, When Attacking, Activate: Main, Blocker, DON!! x2, and
  effect-only K.O. replacement interactions. The full engine passes 448 files
  and 785 tests with 2 skipped; the parser passes 21 files and 617 tests; types,
  parser, touched engine/card checks, and the agent harness pass. Broad package
  formatting remains blocked by unrelated pre-existing drift in 77 engine files
  and 2 card files.
- **Next-two result:** carry colon-cost preflight, compound-trait matching, and
  projected-selection validation into EB01-012 Cavendish and EB01-013 Kouzuki
  Hiyori.

Current checkpoint (EB01-012 through EB01-016, second Character batch):

- **First-run pass:** 4/5 card files. Cavendish, Sanji, Scratchmen Apoo, and
  Bingoh passed their first command-driven run; Hiyori exposed a test-only
  mismatch between effect-play selection and ordinary board targeting.
- **Signal:** generated self-relative conditions and variable permanent values
  need their semantic operator preserved, while effect-driven play has its own
  public decision intent.
- **Change:** `no other [Name]` now excludes the effect source, printed type
  alternatives generate `anyOf` includes filters, and complete rested-DON!!
  groups remain a live power multiplier instead of collapsing to a fixed bonus.
- **Proof:** five focused public-command files pass six tests, covering both
  Cavendish timings, self-trash and self-rest costs, effect-driven play followed
  by draw, live permanent power, opposing rest, and K.O. target mapping. The
  full engine passes 453 files and 791 tests with 2 skipped; the Character
  directory passes 10 files and 12 tests; the parser passes 21 files and 622
  tests; touched checks and the agent harness pass. The root One Piece gate
  remains blocked only by the known unrelated formatting drift in OP13-004 Sabo
  and OP14EB04-098 Crescent Cutlass.
- **Next-two result:** use source-relative condition preflight and projected
  play intents for EB01-017 Blueno and EB01-022 Inazuma.

Current checkpoint (EB01-017 through EB01-026, third Character batch):

- **First-run pass:** 2/5 card files. Hamlet and Prince Bellett passed their
  first command-driven run; Blueno, Inazuma, and Edward Weevil exposed test-only
  assumptions about completed battle removal and hidden deck projection.
- **Signal:** keyword-only definitions were misrouted as parser gaps, permanent
  plain statements lost leading inline conditions, and unqualified Character
  targets silently became opponent-only. The broad engine selector also spent
  several minutes traversing generated placeholders without adding relevant
  proof for this parser/card-definition batch.
- **Change:** the inventory now recognizes `effects.keywords`, permanent plain
  statements preserve inline conditions, printed trait filters use compound
  includes matching, and unqualified return targets map both players. Both One
  Piece skills now preflight these distinctions and select the full parser plus
  authored card-type directory for parser-only checkpoint blast radius.
- **Proof:** five focused public-command files pass five tests; the authored
  Character directory passes 15 files and 17 tests; the parser passes 21 files
  and 623 tests. The 14 touched TypeScript files pass format, lint, and type
  checks, and the root harness check is green.
- **Next-two result:** carry keyword-aware queue routing and conditional
  permanent parsing into EB01-027 Mr. 1 (Daz.Bonez) and EB01-031 Kalifa.

Current checkpoint (EB01-027 through EB01-035, fourth Character batch):

- **First-run pass:** 3/5 card files. Kalifa, Blueno, and Ms. Monday passed
  immediately; Mr. 1 needed a corrected draw/discard hand-count assertion, and
  Ms. Wednesday exposed that its sole legal DON!! return auto-pays.
- **Signal:** multiple imported definitions flatten “for every N cards” into a
  fixed bonus, and many Character Life Triggers parse “Play this card” as an
  impossible hand-source play. Three post-colon Leader conditions also sat on
  the whole block, incorrectly preventing the printed DON!! payment.
- **Change:** power modifiers can now count complete groups from a live filtered
  zone, `Play this card` parses to the physical-card action, and post-colon
  conditions gate only their resulting action. Both One Piece skills now
  preflight these distinctions.
- **Proof:** five focused public-command files pass five tests; all 20 authored
  Character files pass 22 tests; all 21 parser files pass 626 tests; the
  authored engine suite passes 796 tests across 462 files; the types package
  passes its test; focused format, lint, and type checks pass; and
  `pnpm run harness:check` passes.
- **Next-two result:** carry filtered live-zone grouping and Trigger physical
  card routing into EB01-036 Minochihuahua and EB01-037 Mr. 9.

Current checkpoint (EB01-036 through EB01-044, fifth Character batch):

- **First-run pass:** 3/5 card files. Scarlet, Spandine, and Funkfreed passed
  immediately; Minochihuahua and Mr. 9 needed fixture corrections for the first
  game turn's attack prohibition and deterministic auto-advanced decisions.
- **Signal:** Spandine's imported definition omitted its ordered three-card CP
  trash cost and every positive play filter except its name exclusion. The
  parser recognized neither the filtered cost phrase nor a mid-description
  “type including” play filter.
- **Change:** the parser now preserves ordered trait-filtered trash-to-deck
  costs and complete type-including play filters. The One Piece skills also
  preflight legal Rush turns, auto-advanced decisions, and ordered filtered
  costs. The official Scarlet ordering case passes without an engine change:
  its cost reduction resolves before played Kyros maps its On Play target.
- **Proof:** five focused public-command files pass five tests; all 25 authored
  Character files pass 27 tests; all 21 parser files pass 629 tests; the
  authored engine suite passes 801 tests across 467 files; the types package
  passes its test; focused format, lint, and type checks pass; and
  `pnpm run harness:check` passes.
- **Next-two result:** carry ordered filtered-cost and nested On Play ordering
  proof into EB01-045 Brook and EB01-046 Brook.

Current checkpoint (EB01-045 through EB01-049, sixth Character batch):

- **First-run pass:** 3/5 card files. Brook 046, Laboon 048, and T-Bone passed
  immediately; Brook 045 needed an auto-completed battle assertion, while
  Laboon 047 first needed a legal rested attack target and then exposed a
  shared trigger defect.
- **Signal:** battle and effect K.O. paths moved a Character to trash before
  scanning in-play `whenCharacterKod` listeners. That correctly found other
  listeners but incorrectly excluded the removed source, contradicting the
  official EB01-047 ruling that Laboon triggers when it alone is K.O.'d.
- **Change:** both K.O. paths now enqueue the removed source's matching trigger
  from the event snapshot before scanning remaining in-play listeners. Both One
  Piece skills now preflight self-listening post-movement triggers.
- **Proof:** five focused public-command files pass five tests; all 30 authored
  Character files pass 32 tests; all 21 parser files pass 629 tests; the
  authored engine suite passes 806 tests across 472 files; the types package
  passes its test; focused format, lint, and type checks pass; and
  `pnpm run harness:check` passes.
- **Next-two result:** carry post-movement event snapshots and effective-cost
  sequencing into EB01-052 Viola and EB01-053 Gastino.

Current checkpoint (EB01-052 through EB01-057, seventh Character batch):

- **First-run pass:** 1/5 card files. Gan.Fall passed immediately. Viola exposed
  a missing Life-order action and stale zone indexes; Gastino needed legal
  automatic-Counter sequencing; Flampe exposed a dropped Life payment; and
  Shirahoshi exposed missing K.O.-origin provenance plus a default-Life fixture
  assumption.
- **Signal:** deck ordering had been used as a placeholder for private Life
  ordering, colon parsing omitted top-or-bottom Life-to-hand costs, and ordinary
  On K.O. event filters could declare `koCause` without receiving or evaluating
  that domain-event property.
- **Change:** the engine now has private full-Life ordering that preserves face
  states and zone indexes, the parser maps `addLifeToHand` choice costs, and
  battle/effect K.O. events carry explicit origin through ordinary effect
  filters. Both One Piece skills now route these failures at their shared
  boundaries.
- **Proof:** five focused public-command files pass eight tests; all 35 authored
  Character files pass 40 tests; all 21 parser files pass 631 tests; the
  authored engine suite passes 814 tests across 477 files; the types package
  passes its test; focused format, lint, and type checks pass; and
  `pnpm run harness:check` passes.
- **Next-two result:** carry private-zone ordering, colon-cost preflight, and
  explicit K.O. origin into EB01-058 Mont Blanc Cricket and EB01-061
  Mr.2.Bon.Kurei (Bentham).

Current checkpoint (EB01-058 through EB02-005, eighth Character batch):

- **First-run pass:** 4/5 card files. Cricket, Bentham, Sabo, and Chopper
  reached their intended prompts immediately after definition repair. Fake
  Straw Hat Crew's first assertion caught the corrected negative value on the
  wrong turn branch, which was a local edit-placement mistake.
- **Signal:** generated “base power becomes the selected Character's power”
  text used an unsupported zero-value `setPower` sentinel and discarded the
  required opposing Character selection.
- **Change:** a typed `copyPower` action now maps that selection, snapshots the
  chosen Character's current power as the copying Character's temporary base,
  and preserves the copying card's own DON!! contribution. The parser and both
  One Piece skills now distinguish one-way copies from swaps and fixed values.
- **Proof:** five focused public-command files pass six tests; all 40 authored
  Character files pass 46 tests; all 21 parser files pass 632 tests; the
  authored engine suite passes 820 tests across 482 files; the types package
  passes its test; focused format, lint, and type checks pass; and
  `pnpm run harness:check` passes.
- **Next-two result:** carry current-power snapshots and compound-trait target
  matching into EB02-006 Yamato and EB02-011 Arlong.

Current checkpoint (EB02-006 through EB02-014, ninth Character batch):

- **First-run pass:** 2/5 card files. Yamato and Sarfunkel passed immediately;
  Arlong, Gaimon, and Carrot needed test-only corrections for automatic battle
  completion, post-block battle K.O., and the projected ordering shape.
- **Signal:** Arlong declared `cannotBeRested`, but the shared action fell back
  to judge review and no common legality boundary covered attack, Blocker,
  rest-cost, and effect-rest paths. Yamato also omitted its printed Leader gate
  and rested-DON!! action from structured behavior.
- **Change:** `cannotBeRested` now installs a duration-scoped flag consulted by
  public attack and Blocker legality, rest-card costs, self-rest activation
  costs, and effect-rest candidate mapping. Both One Piece skills now route
  partial support to that shared boundary.
- **Proof:** five focused public-command files pass nine tests; all 45 authored
  Character files pass 55 tests; all 21 parser files pass 632 tests; the
  authored engine suite passes 829 tests across 487 files; the types package
  passes its test; focused, engine, cards, parser, and types checks pass; and
  `pnpm run harness:check` passes.
- **Next-two result:** carry future-action legality and compound Leader
  preflight into EB02-015 Jewelry Bonney and EB02-016 Chopperman.

Current checkpoint (EB02-015 through EB02-019, tenth Character batch):

- **First-run pass:** 4/5 card files. Chopperman, Nami, Buggy, and Zoro passed
  their first focused run after definition preflight. Bonney needed one
  test-only correction because its sole legal Character-return cost
  auto-resolved instead of projecting a redundant prompt.
- **Signal:** three definitions used exact matching for compound printed types,
  while declarative rules text was only partially executable: Chopperman's
  alternate name had no runtime identity, Buggy lacked its Life Trigger and
  counted itself, Bonney activated DON!! immediately, and Zoro omitted its live
  conditional Rush: Character.
- **Change:** One Piece cards now expose `alternateNames`, and every shared
  rules-name matcher consults the complete identity set while preserving the
  primary display name. Both skills now preflight alternate identities and
  require delayed end-turn effects to be proved after public source removal
  when the ruling says they survive.
- **Proof:** five focused public-command files pass seven tests; all 50 authored
  Character files pass 62 tests; all 21 parser files pass 632 tests; the
  authored engine suite passes 836 tests across 492 files; cards pass nine
  catalog tests; types pass their test; touched checks and
  `pnpm run harness:check` are green. Chopperman proves alternate identity
  through Dr.Hiriluk, Bonney proves delayed resolution after Trafalgar Law
  returns her, and Zoro proves live keyword loss after battle reduces the
  opposing board below two Characters.
- **Next-two result:** carry declarative-text preflight and complete rules-name
  matching into EB02-022 Usopp and EB02-023 Crocodile.

Current checkpoint (EB02-022 through EB02-026, eleventh Character batch):

- **First-run pass:** 3/5 card files. Usopp, Rosinante, and Vivi passed their
  first command-driven run after definition preflight. Crocodile and Sogeking
  needed test-only corrections because the opponent hand correctly hides exact
  card identities from the effect controller's projected view.
- **Signal:** “No base effect” had been reduced to “no On Play,” search-play
  continuations discarded a printed rested state, and Crocodile's leave-field
  trigger lacked the controller/cause provenance required by shared dispatch.
- **Change:** parser output and target matching now treat normalized base effect
  and Trigger text (including legacy `NULL`), search selections preserve play state,
  and tests use narrow raw-state identity only after a public command moves an
  opponent's card into a hidden zone. Both One Piece skills record these proof
  and routing boundaries.
- **Proof:** five focused public-command files pass eight tests, including
  Usopp's current-power/self-count boundary, Crocodile's top-or-bottom order
  and once-per-turn limit, Sogeking's either-field return and Usopp identity,
  Rosinante's atomic costs/rested play, and Vivi's exact hand threshold. All 55
  Character files pass 70 tests; all 21 parser files pass 632 tests; the
  authored engine suite passes 844 tests across 497 files; cards pass nine
  catalog tests; types pass their test; touched checks and the agent harness
  are green.
- **Next-two result:** carry printed-base-effect matching and continuation state
  preservation into EB02-027 Vista and EB02-028 Portgas.D.Ace.

Current checkpoint (EB02-027 through EB02-036, twelfth Character batch):

- **First-run pass:** 1/5 card files. Klabautermann passed immediately. Vista,
  Ace, and Iceburg expected a synthetic skip candidate for `up to` entity
  prompts; Iceburg also confused rested cost payment with DON!! leaving the
  field, while Robin expected a generic entity step for its DON!! cost.
- **Signal:** three cards repeated the same projected optional-selection
  assumption even though the public contract already carries `min: 0`.
- **Change:** both One Piece skills now state that `up to` entity prompts contain
  only real candidates and decline through empty `selectedIds`. Nico Robin's
  definition also makes its DON!! −1 [On K.O.] activation optional and matches
  compound Straw Hat Crew types.
- **Proof:** five focused public-command files pass seven tests, covering
  current-power removal, condition-gated search/play chains, total DON!! field
  thresholds, dynamic Blocker legality, optional DON!! payment, and ordered
  secret-area interactions. All 60 Character files pass 77 tests; the authored
  engine suite passes 851 tests across 502 files; cards pass nine catalog
  tests; touched checks and the agent harness are green.
- **Next-two result:** use the explicit optional-selection contract on EB02-037
  Franky and EB02-038 Magellan.

Current checkpoint (EB02-037 through EB02-046, thirteenth Character batch):

- **First-run pass:** 4/5 card files. Franky, Magellan, Sengoku, and Trafalgar
  Law passed immediately after definition preflight; Hildon's only first-run
  failure was a test-only imported base-cost expectation.
- **Signal:** compound type filters on Magellan and Sengoku defaulted to exact
  matching, Trafalgar Law had lost both its ordered colon cost and the condition
  on only one choice branch, and Hildon's imported text/value had dropped the
  official minus sign.
- **Change:** the card definitions now preserve included-type matching, Law's
  optional ordered two-card trash payment plus opponent-hand condition, and
  Hildon's official −1 cost text in base/i18n/structured data. The existing One
  Piece skills already encode each reusable boundary, so this checkpoint
  revalidated them without duplicating card-specific guidance.
- **Proof:** five focused public-command files pass six tests, covering both
  Franky timings, compound-type hand/trash play, rested placement, Blocker
  ownership, ordered cost submission, choice ownership, top-deck trash, and
  modifier expiration. All 65 Character files pass 83 tests; the authored
  engine suite passes 857 tests across 507 files; cards pass nine catalog
  tests; types pass their test; touched checks and the agent harness are green.
- **Next-two result:** continue with EB02-047 Blueno and EB02-048 Brook.

Current checkpoint (EB02-047 through EB02-053, fourteenth Character batch):

- **First-run pass:** 3/5 card files. Blueno, Garp, and Enel passed their first
  command-driven run after definition preflight. Brook and Olga reached the
  intended battle interaction only after their test-only opponent decks gained
  filler cards instead of losing to an empty deck at turn start.
- **Signal:** Blueno had lost its self-trash cost and every positive play
  filter, Enel gated the whole attack effect before its optional cost and
  omitted conditional Rush, and Olga looked at the controller's deck rather
  than either player's Life.
- **Change:** the three card definitions now preserve those printed costs,
  filters, action-level condition, keyword, and private Life interaction. Both
  One Piece skills already route tiny-fixture deck exhaustion and the relevant
  card-definition boundaries, so this checkpoint revalidated them without
  duplicating guidance.
- **Proof:** five focused public-command files pass six tests, covering atomic
  activation costs, filtered trash play, trash recovery, battle K.O. play,
  rested DON!! assignment, self-rest activation, conditional Rush, post-cost
  Life evaluation, ordered then-power resolution, and private either-owner Life
  placement. All 70 Character files pass 89 tests; the authored engine suite
  passes 863 tests across 512 files; cards pass nine catalog tests; types pass
  their test; touched checks and the agent harness are green.
- **Next-two result:** continue with EB02-054 Sanji and the EB02-055 Jinbe
  executable Trigger gap.

Current checkpoint (EB02-054 through EB02-061, fifteenth Character batch):

- **First-run pass:** 4/5 card files. Sanji, Vegapunk, Mad Treasure, and Luffy
  passed immediately after definition preflight. Jinbe's runtime behavior was
  correct, but its five-Life Leader fixture did not provide enough configured
  Life-plus-deck cards for initial construction.
- **Signal:** Jinbe had only Trigger metadata, Vegapunk lost its post-search
  conditional trash and included-type matching, Mad Treasure lost its Life
  cost and placement choice, and Luffy lost both conditional Rush and its
  DON!! −2 cost. The only focused repair was a reusable fixture-construction
  rule for Leaders with non-default starting Life.
- **Change:** the four card definitions now preserve those printed clauses.
  Test generation records the starting-Life fixture requirement, and bug triage
  classifies the matching construction error as `test-only` before engine
  investigation.
- **Proof:** five focused public-command files pass seven tests, covering
  Blocker routing, draw/trash choice, physical Trigger-card play, private
  search eligibility and ordering, conditional hand trash, top-or-bottom Life
  payments and placements, conditional Rush, physical DON!! source selection,
  restand, top-Life removal, and the once-per-turn boundary. All 75 Character
  files pass 96 tests; the authored engine suite passes 870 tests across 517
  files; cards pass nine catalog tests; types pass their test; touched checks
  and the agent harness are green.
- **Next-two result:** continue with EB03-003 Uta and EB03-004 Carina using the
  explicit starting-Life fixture rule for any Trigger coverage.

Current checkpoint (EB03-003 through EB03-007, sixteenth Character batch):

- **First-run pass:** 2/5 card files. Uta and Carina passed their first focused
  command run. Sugar exposed its played Character's nested On Play prompt, Nami
  exposed a tiny-fixture empty-deck defeat, and Baccarat exposed the normal
  battle Counter window before its On K.O. effect.
- **Signal:** Uta and Baccarat incorrectly treated “no base effect” as only “no
  On Play,” Sugar used exact trait matching for a compound type, and Nami lost
  both printed negative signs and the active-Leader colon cost. Nami also
  revealed that spent once-per-turn activations were silently accepted as
  no-op commands.
- **Change:** the five definitions now preserve the printed filters, signs,
  cost, and play state. Shared activation legality rejects a command when every
  matching once-per-turn block is spent and honors custom once-per-turn keys.
  Both One Piece skills now require command-level repeat-activation proof and
  route silent no-op acceptance to the shared command/enqueue boundary.
- **Proof:** five focused public-command files pass six tests. All 80 Character
  files pass 102 tests; the authored engine suite passes 876 tests across 522
  files; cards pass nine catalog tests; types pass their test; touched checks
  and the agent harness are green.
- **Next-two result:** continue with EB03-008 Hibari and EB03-009 Makino using
  the nested-prompt and spent-activation preflight.

Current checkpoint (EB03-008 through EB03-013, seventeenth Character batch):

- **First-run pass:** 3/5 card files. Makino, Otama, and Carrot passed their
  first focused command run. Hibari reached judge fallback at both printed
  timings, while Monet's search passed and its remaining failure was an open
  Counter window after the searched Event entered hand.
- **Signal:** Hibari's negative modifier sign and compound SWORD matching were
  imported incorrectly, Monet had no search eligibility filters, Otama encoded
  printed alternatives as a conjunction, and Makino's type was replaced by a
  numeric sentinel. More importantly, `canAttackActive` existed in types and
  battle legality but remained unsupported in effect resolution.
- **Change:** the five definitions now preserve official signs, types,
  alternatives, and search filters. The shared action resolver maps a chosen
  recipient and applies the existing duration-scoped active-attack flag. Both
  One Piece skills now require projected recipient mapping followed by a real
  attack against an active Character.
- **Proof:** five focused public-command files pass seven tests. All 85
  Character files pass 109 tests; the authored engine suite passes 883 tests
  across 527 files; cards pass nine catalog tests; types pass their test;
  touched checks and the agent harness are green.
- **Next-two result:** continue with EB03-014 Kuina and EB03-015 Camie using
  the public resource-choice and active-target attack preflight.

Current checkpoint (EB03-014 through EB03-018, eighteenth Character batch):

- **First-run pass:** 3/5 card files. Camie, Jewelry Bonney, and Tashigi passed
  their first focused command run. Kuina and Kouzuki Hiyori initially expected
  a redundant prompt after their single legal Leader target auto-resolved;
  Hiyori then exposed exact matching against a compound Leader type.
- **Signal:** Kuina's imported text lost the printed Slash attribute symbol,
  Camie encoded Fish-Man or Merfolk as a conjunction, Tashigi omitted its
  rested-DON!! activation cost, and Hiyori used exact matching for a compound
  Land of Wano type.
- **Change:** the generic normalizer restores a missing source attribute symbol
  and the DON!! parser emits the corresponding attribute target. The four
  affected definitions now preserve official alternatives, inclusion matching,
  and atomic costs. Existing One Piece skills already cover auto-resolved
  single targets and compound-trait inclusion, so no duplicate guidance was
  added.
- **Proof:** parser-focused coverage passes 47 tests and the full parser passes 714. Five focused public-command files pass six tests; all 90 Character files
  pass 116 tests, the authored engine suite passes 897 tests with two skipped
  across 535 files, and cards pass nine catalog tests. Touched checks are green.
- **Next-two result:** continue with EB03-019 Wanda and EB03-021 Alvida using
  keyword-only Blocker and On Play preflight.

Current checkpoint (EB03-019 through EB03-024, nineteenth Character batch):

- **First-run pass:** 3/5 card files. Wanda, Isuka, and Kaya passed their first
  focused command run. Alvida initially encoded the unqualified second target
  as opponent-only, while Vivi's Blocker proof paused at a legal Counter window.
- **Signal:** unqualified Character targets were narrowed to the opponent on
  both Alvida and Isuka, and Vivi encoded the printed Alabasta-or-Straw Hat Crew
  alternative as a conjunctive pair of trait filters.
- **Change:** the three definitions now preserve either-field ownership and a
  single `anyOf` trait alternative with compound-trait inclusion. Existing
  skill guidance already covers target ownership, printed alternatives, and
  Counter-window fixture attribution, so no duplicate rule was added.
- **Proof:** five focused public-command files pass five tests; engine and cards
  package checks are green, and the cards catalog passes nine tests.
- **Next-two result:** continue with EB03-025 Hina and EB03-026 Boa Hancock
  using exact base-power targeting and multi-timing preflight.

Current checkpoint (EB03-025 through EB03-031, twentieth Character batch):

- **First-run pass:** 3/5 card files. Boa Hancock, Marguerite, and Yu passed
  their first focused runs. Hina exposed exact-cost auto-payment and legal
  source-card targeting in its fixture, while Reiju exposed a shared Event
  activation path hard-coded to hand.
- **Signal:** Hina and Marguerite retained stale opponent-only definitions even
  though the current parser correctly emits unqualified targets for either
  field. Yu placed a post-colon hand condition on block activation, Boa Hancock
  omitted choice ownership and its Character-bottom cost, and Reiju could not
  activate a filtered Event Main effect from trash.
- **Change:** the five definitions now preserve printed ownership, cost order,
  action-level conditions, split DON!! recipients, and official DON!! -1 text.
  Targeted effect activation can now execute another card's Main block without
  moving that source or publishing Event-card activation reactions, matching
  official EB03 Q1083. A parser assertion now preserves unqualified return
  ownership at `any`, and bug triage distinguishes stale generated definitions
  from current parser output. The PR review gate also restored whole-deck
  search sentinels, unqualified both-field conditions, multi-prompt cost
  selections, field-exit DON!! cleanup, and trigger-time DON!! snapshots.
- **Proof:** five focused public-command files pass eight tests, with the
  hand-origin Event activation and effect-play continuation regressions also
  green. The full engine passes 925 tests with two skipped across 549 files;
  parser passes 697 tests, cards passes nine, types passes one, and all package
  checks, focused parser ownership coverage, skill validation, and the root
  harness check are green.
- **Next-two result:** continue with EB03-032 Charlotte Flampe and EB03-033
  Charlotte Brulee using post-colon condition placement and source-zone-aware
  event/resource mutation preflight.

Current checkpoint (EB03-032 through EB03-036, twenty-first Character batch):

- **First-run pass:** 3/5 card files. Flampe, Brulee, and Pudding passed their
  first focused runs. Linlin and Baby 5 initially expected a redundant
  optional confirmation before their mandatory DON!! return payments.
- **Signal:** two printed `DON!! -1:` trigger costs exposed the same test-only
  assumption: a colon cost does not itself make an effect optional. Brulee also
  lacked its Big Mom Pirates Leader gate and own-effect DON!! return
  provenance, while the other four definitions already represented their
  printed clauses.
- **Change:** Brulee now preserves both printed gates. The test-generation
  workflow now distinguishes mandatory colon payment from an explicitly
  optional block, avoiding a nonexistent `effectOptional` prompt before public
  cost submission.
- **Proof:** five focused public-command files pass eight tests. The six
  current PR review regressions also pass seven tests and confirm that the
  pushed head already covers their reported shared-engine boundaries.
- **Next-two result:** continue with EB03-037 Lim and EB03-039 Ulti using the
  mandatory-cost prompt preflight before adding confirmation steps.

Current checkpoint (EB03-041 through EB03-045, twenty-second Character batch):

- **First-run pass:** 4/5 card files. Perona's compound
  `Thriller Bark Pirates Muggy Kingdom` fixture exposed an exact-match trait
  filter in both the generated definition and the play-action parser.
- **Signal:** Kujyaku, Stussy, and Perona each required printed type checks to
  include compound trait strings; exact matching would silently omit legal
  cards from projected costs or play choices.
- **Change:** play-action trait parsing now emits inclusive filters for both
  prefix `{Trait} type` and suffix `type including` wording, while reviewed
  card definitions preserve inclusive matching for their other effect families.
- **Proof:** the five focused public-command files pass ten tests; the focused
  play-action parser file passes 72 tests, including single, alternative, curly
  brace, and suffix trait forms. Lim and Ulti's four previously authored tests
  were also re-run while reconciling their stale inventory rows.
- **Next-two result:** measure EB03-046 and EB03-047 for whether inclusive
  parser output prevents a definition repair cycle without weakening candidate
  filtering.

Current checkpoint (EB03-046 through EB03-051, twenty-third Character batch):

- **First-run pass:** 3/5 card files. Miss Doublefinger, Miss Valentine, and
  Rebecca passed after fixture-only corrections. Conis exposed both corrupted
  counter/type metadata and exact matching for a typed keyword target; Smoothie
  exposed an explicitly unsupported `faceUpLife` engine condition.
- **Signal:** typed target wording still produced exact trait filters outside
  the previously repaired play-action family, and a declared condition type
  could still be present in definitions while its evaluator returned
  unsupported.
- **Change:** the shared target parser now emits inclusive trait filters for
  typed Character and Leader targets, `faceUpLife` evaluates the requested
  player's physical Life zone, and Conis's official counter/type metadata is
  restored. Generated `validateCardAbility(...)` placeholders for this batch
  were removed in favor of command-driven behavior files.
- **Proof:** five focused public-command files pass nine tests; the focused
  keyword parser file passes 39 tests. Cards, engine, and parser package checks
  pass.
- **Next-two result:** measure EB03-052 and EB03-053 for whether physical Life
  conditions and inclusive typed targets now avoid a shared-repair cycle.

Current checkpoint (EB03-052 through EB03-056, twenty-fourth Character batch):

- **First-run pass:** 2/5 card files. Shirahoshi and Belo Betty needed only
  definition/test corrections. Nami was missing its opponent-Life result;
  both Nico Robin definitions had lost their printed top-Life costs, and the
  Trigger Robin exposed generic self-play losing the source card in resolution.
- **Signal:** two adjacent cards repeated the same optional top-Life cost
  omission, while cost-before-condition sequencing and Trigger physical
  identity were represented declaratively but not preserved end to end.
- **Change:** the parser now emits top/bottom `trashLife` costs and keeps
  after-colon conditions on result actions; generic `play` with `self: true`
  accepts its physical source from Life Trigger resolution. The five stale
  `validateCardAbility(...)` placeholders were replaced with command-driven
  files.
- **Proof:** five focused public-command files pass ten tests; the focused
  parser regression file passes 92 tests. The full engine passes 1,002 tests
  with 2 skipped, the full parser passes 726 tests, all owning package checks
  pass, and all five definitions pass fresh character audits.
- **Next-two result:** measure EB03-057 and EB03-058 for whether post-cost
  action conditions and physical Trigger self-play avoid another repair cycle.

Current checkpoint (EB03-057 through EB03-062, twenty-fifth Character batch):

- **First-run pass:** 3/5 card files. Lilith, S-Snake, and Trafalgar Law passed
  their first focused behavior runs; Yamato needed a rested battle target, and
  Uta's test initially requested generic targeting instead of the established
  numeric DON!! and mixed field-or-DON!! decisions.
- **Signal:** Yamato and Uta both target printed types stored inside compound
  trait strings. Uta already parsed inclusively, while the trait-filtered
  Leader branch used by Yamato still emitted exact matching.
- **Change:** trait-filtered Leader targets in DON!! actions now emit
  `match: "includes"`. The five stale `validateCardAbility(...)` placeholders
  were replaced with command-driven files; no additional skill rule was needed
  because the existing mixed field-or-DON!! guidance already described Uta's
  prompt family.
- **Proof:** five focused public-command files pass ten tests; the focused DON!!
  parser file passes 18 tests. All five definitions pass fresh character
  audits, and cards, engine, and parser package checks pass.
- **Next-two result:** measure EB04-011 and EB04-012 for whether inclusive typed
  targets and the existing mixed-target prompt guidance avoid a repair cycle.

Current checkpoint (EB04-011 through EB04-015, twenty-sixth Character batch):

- **First-run pass:** 3/5 card files. Kikunojo, Kouzuki Sukiyaki, and Jinbe
  passed the first combined focused run after Jinbe's battle-counter fixture
  was corrected. Scaled Neptunian exposed a target-derived amount continuation
  gap, while Carrot exposed a conjunctive target collapsed into one count.
- **Signal:** two printed relationships were represented lossily: “for each”
  used an undocumented zero amount, and “up to 2 Characters and your Leader”
  merged independently counted targets.
- **Change:** draw and hand-trash actions now carry a typed
  `amountFromTarget`, including continuation-safe prompt validation. The parser
  emits separate set-active actions for a counted Character group and the
  Leader. The campaign publication workflow also skips GitHub check queries,
  retaining local gates, exact remote SHA verification, and thread-aware PR
  review inspection.
- **Proof:** five focused public-command files pass nine tests; the focused
  parser regressions pass 33 tests. The full engine passes 1,021 tests with 2
  skipped, the full parser passes 729 tests, all owning package checks pass,
  and `pnpm run harness:check` passes after the workflow update.
- **Next-two result:** measure EB04-016 and EB04-017 for whether typed dynamic
  amounts and explicit conjunctive target cardinality avoid another shared
  repair cycle.

Current checkpoint (EB04-016 through EB04-022, twenty-seventh Character batch):

- **First-run pass:** 3/5 card files. Megalo, Igaram, and Issho passed their
  initial focused runs; Bird Neptunian and Mystoms exposed exact-only typed
  zone counts. Whole-card review then found Issho's passing test inherited the
  wrong decision owner and pre-cost condition placement.
- **Signal:** Bird Neptunian and Mystoms both needed included-trait zone counts.
  Issho and the prior Jinbe definition both had conditions printed after a
  colon incorrectly hoisted ahead of their costs.
- **Change:** typed Character-count conditions now emit inclusive trait filters;
  inline conditions after any explicit cost stay on result actions. Opponent
  hand-to-deck text now routes the ordered choice to the opponent. A typed
  turn-scoped restriction prevents Character effects from setting DON!! active
  after Bird Neptunian resolves its first activation.
- **Proof:** the five Wave 6 public-command files pass nine tests; the
  strengthened Jinbe file adds three passing tests, including its new post-cost
  regression. Focused parser regressions pass 160 tests, the full engine passes
  1,032 tests with 2 skipped, the full parser passes 733 tests, and all six
  fresh character audits pass.
- **Next-two result:** measure EB04-023 and EB04-024 for whether post-cost
  sequencing and explicit choice ownership avoid another repair cycle.

Current checkpoint (EB04-023 through EB04-027, twenty-eighth Character batch):

- **First-run pass:** 4/5 card files. Chaka & Pell, Nefeltari Vivi, Bluegrass,
  and Boa Hancock passed their first focused behavior runs. Terracotta's only
  failure was a test-only expectation for a prompt where its sole legal
  unordered hand cost was paid automatically.
- **Signal:** fresh audits on Chaka & Pell and Nefeltari Vivi each exposed a
  missing printed clause before behavior fixtures were built: an active-Leader
  power cost and an opponent-selected cross-player hand-to-deck continuation.
- **Change:** colon-cost parsing now emits typed active-Leader power
  modifications. Return-to-deck actions can explicitly route to the other
  player's deck, while preserving separate candidate and chooser ownership.
- **Proof:** five public-command files pass ten tests and all five fresh
  character audits pass. The full engine passes 1,042 tests with 2 skipped,
  the full parser passes 735 tests, and cards, engine, parser, and types checks
  pass.
- **Next-two result:** measure EB04-030 and EB04-031 for whether fresh
  clause-count audits avoid incomplete definitions without another shared
  repair.

Current checkpoint (EB04-030 through EB04-034, twenty-ninth Character batch):

- **First-run pass:** 2/5 card files. Groggy Monsters and Charlotte Pudding
  passed their focused behavior runs; Kaido, King, and Queen exposed fixture
  sequencing plus shared parser semantics.
- **Signal:** Kaido, Queen, Groggy Monsters, and Charlotte Pudding all had
  post-cost conditions whose checked-in scope could prevent legal payment or a
  later unconditional result. King and Queen also exposed source-inclusive
  “no other” matching and exact-only trait-filtered hand costs.
- **Change:** paid inline conditions before a new `Then,` sentence now scope
  only the preceding actions. “No other [name]” excludes the source card, and
  typed hand-trash costs use inclusive trait matching. The test-generation
  skill now calls out the post-cost `Then,` boundary.
- **Proof:** five public-command files pass eleven tests and all five fresh
  character audits pass. The full engine passes 1,053 tests with 2 skipped,
  the full parser passes 736 tests, and cards, engine, and parser checks pass.
- **Next-two result:** measure EB04-035 and EB04-036 for whether post-cost
  action scoping and inclusive typed costs avoid another parser repair cycle.

Current checkpoint (EB04-035 through OP01-004, thirtieth Character batch):

- **First-run pass:** 2/5 card files. Eustass"Captain"Kid and Usopp passed
  their initial focused runs. Hitokiri Kamazo needed fixture/payment
  correction, while Foxy and Porche exposed definition and parser scoping or
  matching gaps.
- **Signal:** Porche's search and Kid's hand-play effect both require included
  trait matching for compound repository trait strings. Foxy also confirmed
  that a post-cost condition before `Then,` must not suppress the later
  unconditional action.
- **Change:** parser-authored search reveal filters now use inclusive trait
  matching for typed prefixes and “type including” suffixes. The Character
  audit accepts equivalent action-scoped Leader draw gates, and the
  test-generation skill now applies the same parser rule to search actions.
- **Proof:** five public-command files pass seven tests and all five fresh
  Character audits pass. Focused search parser regressions pass 125 tests.
  The full engine passes 1,060 tests with 2 skipped, the full parser passes
  736 tests, cards, engine, and parser checks pass, and
  `pnpm run harness:check` passes.
- **Next-two result:** measure OP01-005 and OP01-006 for whether inclusive
  parser-authored search/play filters avoid another definition repair cycle.

Current checkpoint (OP01-005 through OP01-009, thirty-first Character batch):

- **First-run pass:** 1/5 card files. Uta passed immediately. Otama and
  Caribou exposed fixture-only printed-stat and automatic-battle-resolution
  assumptions; Cavendish had stale pre-errata text and a missing Life cost;
  Carrot's Trigger definition omitted its self-play identity.
- **Signal:** Cavendish and Carrot both had checked-in definitions that were
  structurally plausible but omitted a physical-card movement required by
  current rules text: top Life to hand as a cost, and the resolving Trigger
  card itself into play.
- **Change:** no new workflow abstraction was added because the existing skill
  already requires official errata verification and self-playing Trigger
  identity. Cavendish now has a narrow parser regression preserving its
  optional top-Life cost before Rush.
- **Proof:** five public-command files pass six tests and all five fresh
  Character audits pass. The focused Cavendish parser file passes 96 tests.
  The full engine passes 1,066 tests with 2 skipped, the full parser passes
  737 tests, and cards, engine, and parser checks pass.
- **Next-two result:** measure OP01-010 and OP01-011 for whether applying the
  existing errata and self-identity checks before fixture authoring avoids
  another definition repair cycle.

Current checkpoint (OP01-011 through OP01-016, thirty-second Character batch):

- **First-run pass:** 2/5 ability files. Gordon and Nami passed their first
  behavior runs. Sanji needed an opponent-turn DON!! power expectation fix;
  Jinbe exposed missing shared `onBlock` dispatch; Chopper exposed exact-only
  quoted-trait trash recovery. OP01-010 Komachiyo was separately reclassified
  from a false `"NULL"` gap to vanilla using the official card list.
- **Signal:** Jinbe and Chopper both had valid structured trigger blocks that
  audits could not prove executable: one lacked its originating battle event,
  while the other could not map a compound-trait candidate.
- **Change:** blocker selection now dispatches the blocker's `onBlock` effect
  and board-wide blocker-activation reactions before the Counter step resumes.
  Quoted trait trash recovery uses inclusive matching, and ordered
  hand-to-deck colon costs are now parser-authored. The test-generation skill
  records the On Block sequencing boundary.
- **Proof:** five public-command files pass five tests and all five fresh
  Character audits pass. Focused parser regressions pass 169 tests, and
  `pnpm run harness:check` passes. The full engine passes 1,071 tests with 2
  skipped, the full parser passes 740 tests, and cards, engine, and parser
  checks pass.
- **Next-two result:** measure OP01-017 and OP01-018 for whether explicit
  reactive-event dispatch and fresh official-text classification avoid
  another shared repair cycle.

Current checkpoint (OP01-017 through OP01-022, thirty-third Character batch):

- **First-run pass:** 1/5 ability files. Hyogoro passed immediately. Nico Robin,
  Bartolomeo, and Brook exposed fixture-only Counter, printed-stat, or Refresh
  assumptions; Franky exposed a shared legality gap. OP01-018 Hajrudin was
  separately reclassified from a false `"NULL"` gap to vanilla using the
  official card list.
- **Signal:** Franky's checked-in permanent `canAttackActive` action was valid,
  but legal attack-target evaluation consulted only temporary flag modifiers.
  Nico Robin and Brook also reconfirmed that a Counter window with no legal
  hand Counter completes automatically.
- **Change:** active-Character attack legality now evaluates permanent
  `canAttackActive` actions through their live conditions and target pools.
  No workflow abstraction was added because the existing test-generation
  skill already records automatic Counter completion and official vanilla
  classification.
- **Proof:** five public-command files pass six focused behavior tests and all
  five fresh Character audits pass. The full engine passes 1,077 tests with 2
  skipped, the full parser passes 740 tests, engine, cards, and parser checks
  pass, and `pnpm run harness:check` passes.
- **Next-two result:** measure OP01-023 and OP01-024 for whether permanent
  permission preflight and automatic-battle completion avoid another repair
  cycle.

Current checkpoint (OP01-024 through OP01-034, thirty-fourth Character batch):

- **First-run pass:** 5/5 ability files. Luffy, Zoro, Ashura Doji, Izo, and
  Inuarashi all passed their first focused behavior run; scoped formatting was
  the only follow-up. OP01-023 Marco was separately reclassified from a false
  `"NULL"` gap to vanilla using the official card list.
- **Signal:** no repeated parser, engine, projection, or harness friction
  appeared across this batch. Existing public-command fixtures covered Rush,
  permanent battle K.O. prevention, live zone-count power, On Play rest, and
  When Attacking DON!! reactivation directly.
- **Change:** none. The prior permanent-permission and automatic-battle
  preflights were sufficient, so no new workflow abstraction or skill rule was
  justified.
- **Proof:** five public-command files pass six focused behavior tests and all
  five fresh Character audits pass. The full engine passes 1,083 tests with 2
  skipped, the full parser passes 740 tests, engine, cards, and parser checks
  pass, and `pnpm run harness:check` passes. A repo-root `vp check` remains
  blocked before analysis by unrelated `vite-plus` resolution failures in the
  Lorcana, Cyberpunk, and Platform workspace configs.
- **Next-two result:** measure OP01-035 and OP01-036 for whether the existing
  preflight continues to avoid shared repair cycles.

Current checkpoint (OP01-035 through OP01-040, thirty-fifth Character batch):

- **First-run pass:** 3/5 ability files. Okiku, Kawamatsu, and Killer passed
  their first legal behavior scenario. Kin'emon needed its On Play and
  When Attacking timings split, while Kanjuro exposed missing opponent choice
  ownership for a controller-owned hand. OP01-036 Otsuru was separately
  reclassified from a false `"NULL"` gap to vanilla using the official list.
- **Signal:** Kanjuro's printed candidate owner and decision actor differ:
  the discarded card comes from its controller's hand, but the opponent makes
  the physical-card choice. The previous single-seat hand-discard action could
  not represent that contract.
- **Change:** `trashFromHand` now carries an optional `chosenBy` actor through
  types, parser output, prompt projection, live revalidation, and resolution.
  Kawamatsu and Kin'emon were refreshed to current parser-equivalent self-play
  identity and included-trait matching.
- **Proof:** five public-command files pass six focused behavior tests and all
  five fresh Character audits pass. The full engine passes 1,089 tests with 2
  skipped, the full parser passes 740 tests, engine, cards, types, and parser
  checks pass, and `pnpm run harness:check` passes.
- **Next-two result:** measure OP01-041 and OP01-042 for whether explicit hand
  owner/choice actor preflight prevents another ownership repair.

Current checkpoint (OP01-041 through OP01-047, thirty-sixth Character batch):

- **First-run pass:** 4/5 ability files. Momonosuke, Komurasaki, Shachi, and
  Denjiro passed their first focused behavior run after definition repair.
  Trafalgar Law's implementation was correct, while its first assertions used
  an overpowered Blocker fixture and the wrong public cost-step shape.
  OP01-043 Shinobu and OP01-045 Jean Bart were separately reclassified from
  false `"NULL"` gaps to vanilla using the official card list.
- **Signal:** Momonosuke and Komurasaki independently required included
  `Land of Wano` trait matching. Trafalgar Law also exposed one parser wording
  variant—“return 1 Character to your hand”—that omitted the printed activation
  cost even though the equivalent “of your Characters” form already parsed.
- **Change:** retained the established compound-trait preflight and added one
  narrow parser regression for the owner-implied Character-return wording.
  The directly affected Koala regression now pays Law's restored cost before
  proving Character-effect play provenance. No new harness or skill abstraction
  was justified.
- **Proof:** five public-command files pass eight focused behavior tests and all
  five fresh Character audits pass. The focused parser regression passes 99
  tests. The full engine passes 1,097 tests with 2 skipped, the full parser
  passes 741 tests, engine, cards, and parser checks pass, and
  `pnpm run harness:check` passes.
- **Next-two result:** measure OP01-048 and OP01-049 for whether the existing
  compound-trait and colon-cost preflight continues to avoid repair cycles.

Current checkpoint (OP01-048 through OP01-052, thirty-seventh Character batch):

- **First-run pass:** 3/5 card files. Nekomamushi, Bepo, and Raizo reached their
  intended behavior immediately. Penguin needed a test-only correction because
  battle completed without an empty Counter prompt. Kid exposed that permanent
  `attackRestriction` was typed and parsed but absent from attack legality.
- **Signal:** Kid was the only current permanent `attackRestriction` card, and
  its declared action silently had no runtime reader. Bepo reused the prior
  included-trait preflight without another parser or engine repair.
- **Change:** legal attack targets now evaluate opposing in-play permanent
  restrictions with condition, target-pool, and re-entrancy handling. Kid's
  focused boundary proves the Leader and another rested Character are illegal
  targets only while the rested Kid has DON!! attached. The adjacent
  `canAttackActive` reader now uses the same guarded, action-conditioned shape,
  addressing the current PR review consistency finding.
- **Proof:** five public-command files pass eight focused behavior tests and all
  five fresh Character audits pass. The full engine passes 1,105 tests with 2
  skipped, and engine and cards checks pass. The unchanged full parser evidence
  remains 741 passing tests from the prior checkpoint.
- **Next-two result:** measure OP01-053 and OP01-054 for whether the permanent
  action-runtime preflight catches declared-but-unread action families before
  scenario authoring.

Current checkpoint (OP01-054, OP01-063, OP01-064, OP01-067, and OP01-068,
thirty-eighth Character batch; OP01-053, OP01-065, and OP01-066 are vanilla):

- **First-run pass:** 2/5 card files. X.Drake and Gecko Moria passed directly.
  Alvida and Crocodile needed test-only fixture/assertion corrections. Arlong
  exposed stale parser output plus missing shared support for cross-owner
  hidden-hand selection, conditional reveal continuations, and Life movement
  to deck bottom.
- **Signal:** Alvida and Arlong both separated the decision actor from the
  candidate owner; Arlong additionally required hidden candidates to remain
  opaque until the selected physical card was revealed.
- **Change:** `revealFromHand` now has a dedicated revalidated selection path,
  optional card-matching follow-up actions, and opaque cross-owner option
  labels. `removeFromLife` supports an explicit deck destination position. The
  test-generation skill now requires actor/owner separation and matching plus
  nonmatching continuation proof for opposing hidden-hand choices.
- **Proof:** five public-command files pass six focused behavior tests, all five
  fresh Character audits pass, and types, cards, engine, and parser checks pass.
  The full engine passes 1,111 tests with 2 skipped; the parser passes 742 tests.
- **Next-two result:** measure OP01-069 and OP01-070 for whether the new
  actor/owner preflight prevents hidden-zone prompt repair cycles without
  weakening physical-identity proof.

Current checkpoint (OP01-069 through OP01-073, thirty-ninth Character batch):

- **First-run pass:** 1/5 card files. Mihawk passed directly after the printed
  owner preflight identified its stale opponent-only definition. Caesar exposed
  a shared deck-source play boundary and a parser that discarded the final
  shuffle clause. Jinbe, Smiley, and Doflamingo needed fixture-only corrections
  before their complete printed behavior passed.
- **Signal:** Mihawk and Jinbe both use unqualified "a Character" ownership,
  while Caesar's ordered "then shuffle" clause was present in printed text but
  absent from executable behavior.
- **Change:** deck-source `play` selection is now supported, `shuffleDeck` is a
  first-class typed and deterministic engine action with a public log, and the
  parser preserves and emits the trailing shuffle action instead of stripping
  it. The existing owner-word preflight correctly kept Mihawk and Jinbe as
  card-definition repairs, so no additional skill rule was needed.
- **Proof:** five public-command files pass seven focused behavior tests and all
  five fresh Character audits pass. Types, cards, and engine checks pass; the
  parser passes 743 tests, and the full engine passes 1,118 tests with 2
  skipped.
- **Next-two result:** measure OP01-074 and OP01-075 for whether deck-search
  continuations and public keyword behavior need any additional shared support.

Current checkpoint (OP01-074, OP01-075, and OP01-077 through OP01-079,
fortieth Character batch; OP01-076 is vanilla):

- **First-run pass:** 4/5 ability files. Kuma, Pacifista, Perona, and Ms. All
  Sunday reached their intended behavior directly. Boa Hancock needed one
  test-only correction to complete the ordinary Counter window after its On
  Block draw.
- **Signal:** Kuma and Pacifista reused the existing public Blocker and
  hand-play paths, while Perona reused the prior top-five ordering fixture
  without shared repair. Bellamy's local `"NULL"` text again represented a
  catalog classification problem rather than an engine gap.
- **Change:** none. Existing public-command fixtures and the official-text
  vanilla preflight covered this batch without a reusable parser, engine,
  projection, harness, or skill change.
- **Proof:** five public-command files pass seven focused behavior tests and all
  five ability audits pass; Bellamy separately passes the vanilla audit. Cards
  and engine checks pass, and the full engine passes 1,125 tests with 2
  skipped. The unchanged full-parser evidence remains 743 passing tests from
  the prior checkpoint.
- **Next-two result:** measure OP01-080 and OP01-081 for whether official-text
  classification and existing On K.O. fixtures continue to avoid shared repair.

Current checkpoint (OP01-080 and OP01-082 through OP01-085, forty-first
Character batch; OP01-081 is vanilla):

- **First-run pass:** 4/5 ability files. Miss Doublefinger, Monet, Mr.1, and
  Mr.3 reached their intended behavior directly. Mr.2 needed one test-only
  correction because a search decision exposes every looked-at card and marks
  selection eligibility with `legal` instead of omitting ineligible cards.
- **Signal:** the prior official-text vanilla, included-trait search, grouped
  power scaling, and duration preflights all handled this batch without shared
  repair. Mocha's local `"NULL"` text was another false gap. The released
  parser lease also exposed that Event and Stage coverage lacked the same
  reproducible inventory and single-card audit surfaces as Characters.
- **Change:** added reusable Event and Stage inventory/audit commands, plus
  narrow parser support for unlimited-copy deck rules and a conditional
  follow-up power action that reuses the previous target. Existing Wave 20
  definitions needed only card-owned completion: Monet's Trigger self
  identity, Mr.1's two-Event scaling group, and Mr.2's inclusive Baroque Works
  trait filter.
- **Proof:** five public-command files pass six focused behavior tests and all
  five ability audits pass; Mocha separately passes the vanilla audit. Cards
  and engine checks pass. The parser passes 745 tests, the refreshed Character
  inventory records 233 definitions with behavior tests, and the new complete
  Event and Stage inventories provide explicit parser mismatch queues. The
  PR-review regressions additionally prove that an opponent choosing from a
  hidden hand receives generic labels without public card metadata, and that
  EB03-052's Neptunian boost is independent of its Shirahoshi Leader gate.
- **Next-two result:** measure OP01-092 and OP01-093 for whether official-text
  classification and On Play DON!! routing remain card-definition-only work;
  use the new audit commands to measure whether they avoid a parser diagnosis
  cycle without weakening command-driven proof.

Current checkpoint (OP01-093 through OP01-097, forty-second Character batch;
OP01-092 is vanilla):

- **First-run pass:** 4/5 ability files. Ulti, Kaido, Kyoshirou, and Queen used
  existing paid On Play, DON!! movement, condition, keyword, and modifier
  paths. King's initial behavior proof exposed a false-positive parser audit.
- **Signal:** OP01-096's printed text contains two separately bounded K.O.
  actions joined by `and`, but the parser retained only the first while
  reporting an exact match against the equally stale checked-in definition.
  Urashima's local `"NULL"` text was another false gap.
- **Change:** when a parsed K.O. clause is followed by an `up to` continuation,
  the parser now preserves the implied second K.O. verb. A narrow regression
  locks both OP01-096 target bounds before the corrected card definition is
  accepted by the audit.
- **Proof:** five command-driven ability files cover paid costs, condition
  success and failure, both-player field results, separate target bounds,
  optional count ownership, Rush legality, and turn cleanup. OP01-092 passes
  the vanilla audit, OP01-096 passes the repaired parser audit, the full parser
  passes 747 tests, and the full engine passes 1,137 tests with 2 skipped. The
  refreshed Character inventory records 238 definitions with behavior tests
  and correctly reclassifies the same stale two-K.O. structure on OP07-118 and
  its two reprints as queued mismatches.
- **Next-two result:** measure OP01-098 and OP01-099 for whether the repaired
  implied-verb rule prevents another silent multi-action omission while
  retaining exact target filtering.

Current checkpoint (OP01-098 through OP01-102, forty-third Character batch):

- **First-run pass:** 3/5 ability files. Higurashi, Sasaki, and Jack reached
  their printed behavior with existing command and prompt paths after narrow
  fixture corrections. Orochi and Semimaru exposed parser-definition drift.
- **Signal:** two adjacent cards had executable definitions that the parser
  could not reproduce: Orochi lost a full-deck named reveal before its explicit
  shuffle, while Semimaru lacked the permanent trait-wide K.O. protection form
  and initially excluded only the source instance instead of every card with
  the printed name.
- **Change:** the action orchestrator now preserves a standalone full-deck
  reveal followed by `Then, shuffle your deck`; K.O. restriction parsing now
  supports trait Characters other than a named Character and emits
  `excludeName`. Focused regressions lock both structures.
- **Proof:** five command-driven files pass seven behavior tests covering
  search eligibility and movement, visible shuffle, permanent protection and
  its same-name exclusion, Blocker routing, paid optional DON!! movement, and
  opponent-owned physical discard. OP01-098 and OP01-099 both pass fresh parser
  audits. The full engine passes 1,144 tests with 2 skipped, and the full parser
  passes 753 tests. The refreshed Character inventory records 243 definitions
  with behavior tests. The checkpoint parser gate also validates the corrected
  OP01-086 active-Character targeting and OP01-089 included Leader-trait
  condition, leaving the OP01 Event set at 20/20 exact transformations. A PR
  regression additionally proves that an opponent choosing from another
  player's hidden hand receives generic labels without card metadata.
- **Next-two result:** measure OP01-103 and OP01-104 for whether the new
  restriction and continuation preflights prevent another parser-definition
  cycle without weakening public-command proof.

Current checkpoint (OP01-103 through OP01-107, forty-fourth Character batch;
OP01-103 and OP01-107 are vanilla, with adjacent OP01-110 vanilla metadata
normalized):

- **First-run pass:** 3/3 ability files. Speed, Bao Huang, and Basil Hawkins
  reached their behavior through existing Life Trigger, hidden-hand reveal,
  self-play, and DON!! paths.
- **Signal:** Scratchmen Apoo, Babanuki, and adjacent Fukurokuju repeated the
  legacy `"NULL"` false-gap pattern, while Speed and Basil Hawkins repeated
  stale Trigger definitions that omitted the physical `self` identity already
  emitted by the parser.
- **Change:** no shared abstraction was needed. Official card-list preflight
  reclassified all three false gaps as vanilla, and the two stale Trigger
  definitions were aligned with the parser's physical self-play structure.
- **Proof:** three command-driven files prove Speed's physical Life card,
  Bao Huang's controller-owned opaque two-card opposing-hand selection followed
  by a public reveal, and Basil Hawkins's physical Trigger play followed by the
  optional rested DON!! addition. Speed, Bao Huang, and Basil Hawkins pass
  fresh parser audits; official OP01 card-list entries show no effect for
  Scratchmen Apoo, Babanuki, or Fukurokuju. Prior OP01-083 through OP01-085
  coverage also gains the queued empty-deck, missing-DON!!, and excluded-target
  boundaries. The corrected running inventory is 220 verified, 1,046 pending,
  144 gaps, and 134 vanilla. The full engine passes 1,151 tests with 2 skipped,
  and the refreshed Character inventory records 246 definitions with behavior
  tests.
- **Next-two result:** measure OP01-108 and OP01-109 for whether the official
  text and physical-self preflights continue to avoid shared repair.

Current checkpoint (OP01-108 through OP01-112, forty-fifth Character batch;
OP01-110 was already classified as vanilla):

- **First-run pass:** 4/4 ability files. Hitokiri Kamazo, Who's.Who, Black
  Maria, and Page One reached their behavior through existing On K.O.,
  permanent-power, On Block, and active-character attack paths.
- **Signal:** fixture-only attached DON!! and exhausted-cost setups could make
  permanent and once-per-turn assertions pass without proving the public
  command or the independent rejection boundary.
- **Change:** no shared abstraction was needed. The focused tests now attach
  DON!! through the public command, hand off the turn publicly, and retain a
  second payable DON!! when proving Page One's once-per-turn rejection.
- **Proof:** four command-driven files prove Kamazo's battle K.O., exact DON!!
  return, optional cost-5-or-less target boundary; Who's.Who's attached-DON!!,
  eight-field-DON!!, and own-turn gates; Black Maria's Blocker redirection,
  On Block DON!! return, temporary power gain, and cleanup; and Page One's
  activation cost, once-per-turn identity, active-target permission, and
  duration expiry. Fresh parser audits pass for all four ability cards. The
  running inventory is 224 verified, 1,042 pending, 144 gaps, and 134 vanilla,
  the full engine passes 1,152 tests with 2 skipped, and the refreshed
  Character inventory records 250 definitions with behavior tests.
- **Next-two result:** measure OP01-113 and OP01-114 for whether public
  resource commands continue to distinguish real timing gates from fixture
  coincidences.

Current checkpoint (OP01-113, OP01-114, OP01-120, OP01-121, and OP02-003;
forty-sixth Character batch, with OP02-003 vanilla):

- **First-run pass:** 4/4 ability files reached their printed timing through
  public commands, but Shanks exposed the first contradicted shared layer:
  `cannotActivate` still fell through to judge review and left prohibited
  Blockers in the battle prompt.
- **Signal:** the action union and generated definitions already represented
  keyword activation prevention, but runtime capability fallback and the
  Blocker candidate builder did not consume it.
- **Change:** `cannotActivate` now records keyword-scoped, duration-aware
  modifiers on its resolved physical targets, and Blocker candidate generation
  excludes only cards carrying the matching prohibition. The bug-triage skill
  records that shared diagnostic boundary.
- **Proof:** Holedem proves battle K.O. followed by an optional rested DON!!
  addition; X.Drake proves its DON!! return before the opponent-owned hand
  discard choice; Shanks proves same-turn Rush and the selective low-power
  Blocker lock without capability fallback; Yamato proves its Kouzuki Oden
  rules name plus Double Attack/Banish against Trigger Life. Official text
  reclassifies Atmos from a `"NULL"` false gap to vanilla. Fresh parser audits
  pass all four ability cards and Atmos's vanilla classification. The running
  inventory is 228 verified, 1,038 pending, 143 gaps, and 135 vanilla, with
  254 definitions carrying command-driven behavior tests. The full engine
  passes 1,158 tests with 2 skipped.
- **Next-two result:** measure OP02-004 and OP02-005 for whether the
  keyword-scoped modifier remains isolated while the queue moves into OP02.

Current checkpoint (OP02-004 through OP02-008; forty-seventh Character batch,
with OP02-006 and OP02-007 vanilla):

- **First-run pass:** 2/3 ability files passed. Edward.Newgate exposed the
  first contradicted shared layer: its installed Life-to-hand restriction did
  not participate in activation-cost legality, so Cavendish could still pay
  the prohibited Life cost.
- **Signal:** cost legality and optionality were being proved only through
  successful payment paths. Newgate exposed a prohibited cost still being
  offered, while the current Kaido review showed a destructive `DON!! -6`
  activation cost could not be declined.
- **Change:** `canPayCosts` now consumes the active Life-to-hand restriction;
  the parser preserves the optionality of `DON!! -N` activation costs, and the
  authoring skill now requires destructive acceptance and decline branches.
  No additional harness abstraction was added.
- **Proof:** Edward.Newgate proves its Leader boost, Life-to-hand lock, and
  DON!! x2 attack K.O.; Curly.Dadan proves the private top-five red cost-1
  search and ordered remainder; Jozu proves DON!!, two-Life, and compound
  Whitebeard Pirates Leader gates through a same-turn attack. Official text
  reclassifies Kingdew and Thatch from `"NULL"` gaps to vanilla. Review
  regressions additionally preserve original ownership across opposing decks,
  redact hidden transfer identity, make hand reveals transient, let Arlong
  choose the physical Life card, and let Kaido decline its activation cost.
  Fresh audits pass all five cards, the parser passes 753 tests, the engine
  passes 1,159 tests, and the running inventory is 231 verified, 1,035
  pending, 141 gaps, and 137 vanilla, with 257 definitions carrying
  command-driven behavior tests.
- **Next-two result:** measure OP02-009 and OP02-010 for whether activation
  cost decline and physical hidden-zone selection avoid a repair cycle.

Current checkpoint (OP02-009 through OP02-013; forty-eighth Character batch):

- **First-run pass:** all five behavior files passed after repairing two stale
  card definitions. No shared parser, engine, projection, or harness defect
  was exposed.
- **Signal:** Squard and Portgas.D.Ace both stored exact Leader-trait matches
  for printed `includes "Whitebeard Pirates"` gates.
- **Change:** no new abstraction. The existing fresh-card audit caught both
  definition mismatches before broad validation, so the definitions were
  repaired at the owning layer.
- **Proof:** Squard proves the compound Leader gate, optional opposing power
  target, and top-Life-to-hand result; Dogura proves its optional self-rest
  cost, red cost-1 non-Dogura hand filter, and decline path; Vista proves the
  power-3000 K.O. boundary; Blenheim proves public Blocker redirection and
  battle K.O.; Portgas.D.Ace proves up-to-two power reductions plus both sides
  of its compound Leader Rush gate. Fresh audits pass all five cards, focused
  behavior passes 8 tests, the full engine passes 1,173 tests with 2 skipped,
  and the running inventory is 236 verified, 1,030 pending, 141 gaps, and 137
  vanilla, with 262 definitions carrying command-driven behavior tests.
- **Next-two result:** OP02-009 and OP02-010 avoided a shared repair cycle;
  measure OP02-014 and OP02-015 for whether the fresh audit continues to catch
  stale condition semantics before test authoring.

Current checkpoint (OP02-014 through OP02-018; forty-ninth Character batch):

- **First-run pass:** Whitey Bay, Makino, Magura, and Masked Deuce passed
  without a shared repair. Marco exposed the first contradicted parser layer:
  filtered `card with a type including ... from your hand` activation costs
  were not recognized.
- **Signal:** Makino and Magura repeat the same red cost-1 power-target shape,
  but their activation cost and On Play timing keep the fixtures materially
  different. Marco separately proved that the parser's older filtered-hand
  cost wording did not cover the printed inclusive-type form.
- **Change:** no new harness abstraction. The parser now recognizes and emits
  inclusive trait filters for Marco-style hand-trash costs, with a narrow
  regression; Marco's definition now preserves the physical self-play and
  attaches its post-colon Life check to resolution after the cost.
- **Proof:** Whitey Bay proves DON!! x1 active-Character attack permission and
  the no-DON rejection; Makino proves optional self-rest, filtered +3000 power,
  cleanup, and decline; Magura proves ownership and red cost-1 filtering;
  Masked Deuce proves the DON!! x2 gate and power-2000 K.O. boundary; Marco
  proves Blocker, filtered payment, post-cost Life gating, and rested physical
  self-replay. Fresh audits pass all five cards, focused behavior passes 9
  tests, the parser passes 756 tests, the full engine passes 1,184 tests with 2
  skipped, and the running inventory is 241 verified, 1,025 pending, 141 gaps,
  and 137 vanilla, with 267 definitions carrying command-driven behavior
  tests.
- **Next-two result:** OP02-014 and OP02-015 needed no repair after their fresh
  audits; measure OP02-019 and OP02-020 for whether canonical gap preflight
  identifies complete executable clauses before behavior-test authoring.

Current checkpoint (OP02-019, OP02-020, and OP02-027 through OP02-029;
fiftieth Character batch, with OP02-020 and OP02-028 vanilla):

- **First-run pass:** Rakuyo and Carrot passed with card-owned coverage.
  Official text reclassified LittleOars Jr. and Usopp from `"NULL"` gaps to
  vanilla. Inuarashi exposed a parser condition gap and a shared permanent
  removal-protection ownership defect.
- **Signal:** Rakuyo and Inuarashi are both conditional permanent effects, but
  only Rakuyo's condition was already executable. Inuarashi also showed that
  target ownership and the removing effect's controller relationship are
  separate contracts.
- **Change:** the parser maps “all of your DON!! cards are rested” to the
  existing zero-active-DON condition; permanent `cannotBeRemoved` evaluation
  now supports both own-effect and opponent-effect sources. The bug-triage
  skill records that source relationship separately from target ownership.
- **Proof:** Rakuyo proves DON!! x1, controller-turn, and inclusive compound
  Whitebeard Pirates power boundaries; Inuarashi proves opponent-effect K.O.
  prevention at zero active DON!! and removal with one active DON!!; Carrot
  proves the end-turn owner choice and up-to-one DON!! reactivation. Official
  card text confirms LittleOars Jr. and Usopp have no effect. Fresh audits pass
  all five cards, focused behavior passes 4 tests, the parser passes 760 tests,
  the full engine passes 1,188 tests with 2 skipped, the harness check passes,
  and the running inventory is 244 verified, 1,024 pending, 137 gaps, and 139
  vanilla, with 270 definitions carrying command-driven behavior tests.
- **Next-two result:** OP02-019's parser-generated definition was directly
  usable and OP02-020 was correctly identified as vanilla; measure OP02-030
  and OP02-031 for whether the next permanent/activated clauses remain
  separable without another shared repair.

Campaign publication runs with GitHub check discovery and polling disabled by
user scope. Local focused, parser, engine, harness, push-verification, and
thread-aware PR review gates remain required.

Current checkpoint (OP02-030 through OP02-034; fifty-first Character batch,
with OP02-033 vanilla):

- **First-run pass:** Tony Tony.Chopper passed with its checked-in definition.
  Kouzuki Oden, Kouzuki Toki, and Shishilian needed card-definition refreshes;
  official text reclassified Jinbe from a `"NULL"` gap to vanilla.
- **Signal:** Oden and Shishilian both had stale structured filters after the
  parser learned compound-trait matching, while Toki lacked its conditional
  permanent keyword structure.
- **Change:** no new shared abstraction. Fresh audits repaired the owning card
  definitions, including Oden's required shuffle and Shishilian's optional
  cost, and the existing public-command harness covered each clause directly.
- **Proof:** Oden proves once-per-turn restand payment and On K.O. deck-play
  ownership, cost/color/compound-trait filters, physical selection, and
  shuffle; Toki proves conditional Blocker through an alternate Kouzuki Oden
  rules name and its absence boundary; Shishilian proves optional payment,
  compound Minks filtering, readying, and decline; Chopper proves the DON!! x1
  attack gate and opposing cost-2 rest boundary. Official card text confirms
  Jinbe has no effect. Fresh audits pass all five cards, focused behavior
  passes 8 tests, the full engine passes 1,198 tests with 2 skipped, and the
  running inventory is 248 verified, 1,021 pending, 135 gaps, and 140 vanilla,
  with 274 definitions carrying command-driven behavior tests.
- **Next-two result:** OP02-030 and OP02-031 remained separable without a
  shared repair; measure OP02-035 and OP02-036 for whether fresh audit plus
  command-driven authoring continues to avoid repair cycles.

Current checkpoint (OP02-035 through OP02-039; fifty-second Character batch,
with OP02-039 vanilla):

- **First-run pass:** Nami, Nico Robin, and Nekomamushi passed after
  card-definition refreshes already present on the shared branch; official text
  reclassified Franky from a `"NULL"` gap to vanilla. Trafalgar Law exposed a
  parser and shared-cost gap despite its initial audit reporting `PASS`.
- **Signal:** four cards use “return this Character to the owner's hand” as an
  identity-bound activation cost, but the parser omitted the clause and the
  engine only supported returning an arbitrary Character.
- **Change:** added a shared `returnThisToHand` cost through types, parser, and
  engine; Law now pays it after resting DON!! and before its hand play. The
  bug-triage skill records that a passing audit cannot override a missing
  printed colon cost. Two latest-HEAD Event consumer tests were updated to
  accept their newly optional DON!!-return blocks before payment.
- **Proof:** Law proves optional activation, exact DON!! payment, deterministic
  self-return identity, retained sibling Character, exact cost-3 hand filtering,
  physical play, and decline; Nami proves On Play search and When Attacking
  decline across compound FILM and excluded-name filters; Robin proves
  alternative FILM/Straw Hat Crew matching and cost/category boundaries;
  Nekomamushi proves public Blocker redirection, battle K.O., and unchanged
  Leader Life. Official card text confirms Franky has no effect. Fresh audits
  pass all five cards, focused behavior passes 6 tests, the parser passes 768
  tests, the full engine passes 1,206 tests with 2 skipped, and the running
  inventory is 252 verified, 1,017 pending, 134 gaps, and 141 vanilla, with
  278 definitions carrying command-driven behavior tests.
- **Next-two result:** OP02-035 invalidated the prior assumption that a fresh
  parser `PASS` proves every colon cost is represented; measure OP02-040 and
  OP02-041 by counting printed costs independently before accepting audit
  parity.

Current checkpoint (OP02-040 through OP02-044; fifty-third Character batch,
with OP02-043 vanilla):

- **First-run pass:** Brook, Monkey.D.Luffy, Yamato, and Wanda passed focused
  command-driven coverage without a shared repair. Official card text confirms
  Roronoa Zoro has no effect.
- **Signal:** Brook, Luffy, and Wanda repeat compound-trait hand-play filtering,
  but the existing target/filter model and focused fixture style handled all
  three without duplicated engine work.
- **Change:** none. The batch did not establish recurring friction that
  justified another helper or workflow rule.
- **Proof:** Brook and Luffy prove alternative FILM/Straw Hat Crew eligibility,
  exact cost/category boundaries, physical hand play, and prompt cleanup; Luffy
  additionally proves Blocker redirection and protected Leader Life. Yamato
  proves its Kouzuki Oden rules name and the opposing cost-6 rest boundary.
  Wanda proves compound Minks matching, excluded-name filtering, the cost
  boundary, and physical play. Focused behavior passes 5 tests, the owning card
  check passes, and the running inventory is 256 verified, 1,013 pending, 133
  gaps, and 142 vanilla, with 282 definitions carrying command-driven behavior
  tests.
- **Next-two result:** OP02-040 and OP02-041 both passed without a repair cycle,
  so the prior printed-clause audit remained useful. Measure OP02-050 and
  OP02-051 for whether permanent power plus Blocker and hand-size-sensitive
  draw/play behavior expose a reusable fixture boundary.

Current checkpoint (OP02-050 through OP02-054; fifty-fourth Character batch,
with OP02-053 and OP02-054 vanilla):

- **First-run pass:** Inazuma, Emporio.Ivankov, and Cabaji passed after focused
  fixture correction and existing structured-effect review. Official card-list
  evidence confirms Crocodile and Gecko Moria have no effect.
- **Signal:** battle equality surfaced once in Inazuma's Blocker fixture:
  7,000 attack power equals its conditional 7,000 power, so the blocker is
  correctly K.O.'d rather than remaining on the field.
- **Change:** none. The existing fixture diagnostic already identifies equality
  as attacker-favored, and one occurrence does not justify another helper.
- **Proof:** Inazuma proves the 1-or-fewer hand boundary at 0, 1, and 2 cards,
  plus Blocker redirection, battle K.O., and protected Leader Life. Ivankov
  proves exact draw-to-3 behavior, deck consumption, blue/Impel Down/cost
  filtering, physical play, and prompt cleanup. Cabaji proves the Mohji field
  gate, draw 2, player-owned discard choice, visible hand/trash results, and
  the no-Mohji boundary. Focused behavior passes 5 tests and the owning card
  check passes. The running inventory is 259 verified, 1,010 pending, 131 gaps,
  and 144 vanilla, with 285 definitions carrying command-driven behavior
  tests.
- **Next-two result:** OP02-050 needed only the known equality fixture
  correction, while OP02-051 passed without repair. Measure OP02-055 and
  OP02-056 for whether vanilla cleanup and top-deck selection expose recurring
  parser or hidden-zone friction.

Current checkpoint (OP02-055 through OP02-059; fifty-fifth Character batch,
with OP02-055 vanilla):

- **First-run pass:** Donquixote Doflamingo, Buggy, and Boa Hancock passed their
  focused behavior suites from the existing engine surface. Official card-list
  evidence confirms Dracule Mihawk has no effect. Bartholomew Kuma exposed one
  narrow parser mismatch.
- **Signal:** search remainder parsing recognized “your deck” but defaulted to
  bottom for the equally valid printed phrase “the deck,” losing Kuma's
  top-or-bottom choice.
- **Change:** broadened the shared search remainder parser to preserve
  top-or-bottom as `remainderPosition: "any"` for either deck phrasing, with a
  focused parser regression.
- **Proof:** Doflamingo proves top-3 ordering and deck-end choice, plus DON!! x1,
  optional hand-discard payment, opposing cost-1 target filtering, physical
  bottom-deck movement, and decline. Kuma proves compound Warlords matching,
  optional selection, remainder ordering, and both top/bottom choices. Buggy
  proves blue Impel Down compound matching, excluded-name filtering, and
  ordered bottom placement. Boa proves draw-before-discard ordering, the exact
  mandatory discard, the independent up-to-3 choice, and selecting zero.
  Focused behavior passes 8 tests, the parser passes 771 tests, the full engine
  passes 1,229 tests with 2 skipped, and the running inventory is 263 verified,
  1,006 pending, 130 gaps, and 145 vanilla, with 289 definitions carrying
  command-driven behavior tests.
- **Next-two result:** OP02-055 required only official vanilla cleanup and
  OP02-056 passed without repair. Measure OP02-060 and OP02-061 for whether
  keyword normalization or blocker-prevention behavior creates reusable parser
  or engine friction.

Current checkpoint (OP02-060 through OP02-064; fifty-sixth Character batch,
with OP02-060 vanilla):

- **First-run pass:** official card-list evidence confirms Mohji has no effect.
  Morley and Mr.1 passed on the existing runtime after fixture correction.
  Monkey.D.Luffy required stale either-player target ownership to be restored.
  Mr.2 exposed a shared battle-timing gap and matching parser omission.
- **Signal:** an optional paid attack effect can schedule a dependent result for
  the end of that specific battle. Modeling the later sentence as an
  independent trigger would incorrectly resolve after decline, while the
  engine previously supported delayed work only at turn end.
- **Change:** added battle-scoped delayed actions keyed to the active battle,
  resolves them after battle resolution and before cleanup, and taught the
  parser to preserve the printed dependent end-of-battle clause. The testing
  skill now requires accepted and declined branch proof for this pattern.
- **Proof:** Morley proves the one-card hand boundary and cost-5-or-less Blocker
  prevention. Luffy proves both timings, chosen two-card payment, either-field
  cost-4 return, prompt cleanup, and two-Life Double Attack damage. Mr.1 proves
  blue Event/category filtering and an excluded red card. Mr.2 proves either
  player may own the cost-2 target, its accepted branch bottoms both physical
  Characters only after battle counters finish, and decline schedules nothing.
  Focused behavior passes 5 tests, the parser passes 772 tests, the full engine
  passes 1,234 tests with 2 skipped, and the running inventory is 267 verified,
  1,002 pending, 129 gaps, and 146 vanilla, with 293 definitions carrying
  command-driven behavior tests.
- **Next-two result:** OP02-060 required only official vanilla cleanup and
  OP02-061 used the existing battle-restriction surface without repair. Measure
  OP02-065 and OP02-073 for whether the battle-delayed primitive avoids a repair
  cycle or whether filtered effect-play behavior exposes separate friction.

Current checkpoint (OP02-065 and OP02-073 through OP02-076; fifty-seventh
Character batch):

- **First-run pass:** Mr.3 and Little Sadi used established Blocker, end-turn,
  and filtered effect-play surfaces after correcting test timing and one stale
  inclusive trait filter. Shiki and Shiryu required their executable optional
  DON!!-return blocks to match current parser output. Saldeath exposed the only
  parser gap.
- **Signal:** unbracketed permanent text can grant a keyword to every own
  Character with one printed name, a target shape not covered by the parser's
  existing self, all-Character, or trait target forms.
- **Change:** added a narrow named-character target mapping for permanent
  keyword grants. No new harness or skill abstraction was justified; the other
  friction was isolated fixture sequencing or stale definitions.
- **Proof:** Mr.3 proves public Blocker and both end-turn hand-trash branches.
  Little Sadi proves included Jailer Beast matching, nonmatching exclusion,
  physical effect-play, and prompt cleanup. Saldeath proves only Blugori gains
  Blocker and that the grant depends on Saldeath remaining in play. Shiki proves
  Life Trigger activation, optional DON!! return, physical play, and decline.
  Shiryu proves the cost-1 boundary, selected K.O., DON!! return, and decline.
  Focused behavior passes 9 tests, the parser passes 773 tests, the full engine
  passes 1,245 tests with 2 skipped, and the running inventory is 272 verified,
  999 pending, 127 gaps, and 146 vanilla, with 298 definitions carrying
  command-driven behavior tests.
- **Next-two result:** OP02-065 and OP02-073 both completed without a shared
  engine repair, so the previous battle-delayed primitive caused no spillover.
  Measure OP02-077 and OP02-078 for whether another static named-card modifier
  reuses the parser target mapping or exposes a distinct action gap.

Current checkpoint (OP02-077 through OP02-081; fifty-eighth Character batch,
with OP02-077 and OP02-080 vanilla):

- **First-run pass:** official card-list evidence confirms Solitaire and Dobon
  have no printed effect. Daifugo and Douglas Bullet used the established
  optional DON!!-return and filtered target surfaces after stale definitions
  were synchronized with current parser output. Domino used the existing
  public Blocker path without repair.
- **Signal:** two cards classified as unstructured gaps carried the same legacy
  `"NULL"` effect sentinel even though the official cards are vanilla.
- **Change:** normalized both definitions and translations to true vanilla
  cards. No new helper or skill rule was warranted because this repeats the
  established vanilla cleanup rather than exposing new runtime friction.
- **Proof:** Daifugo proves optional DON!! -2 payment, included SMILE matching,
  same-name exclusion, physical effect-play, and decline. Douglas Bullet proves
  optional DON!! -1 payment, the opposing cost-4 boundary, physical rest, and
  decline. Domino proves public Blocker selection, attack retargeting, Blocker
  K.O., and protected Leader Life. Focused behavior passes 5 tests, the parser
  passes 773 tests, the full engine passes 1,251 tests with 2 skipped, and the
  running inventory is 275 verified, 996 pending, 125 gaps, and 148 vanilla,
  with 301 definitions carrying command-driven behavior tests.
- **Next-two result:** OP02-077 required only the established vanilla cleanup
  and OP02-078 required only stale definition repair, so the prior named-card
  parser mapping caused no repair cycle. Measure OP02-082 and OP02-083 for
  whether their target and activation shapes expose reusable friction.

Post-publication review follow-up:

- Shared `cannotActivate` targeting now intersects candidates with the printed
  keyword at both prompt publication and resolution, while unqualified
  all-Blocker restrictions also cover eligible Leader Blockers.
- Generic Character-removal events now snapshot the target's controller before
  movement, preserving correct self/opponent event filters for cross-controlled
  cards.
- Limejuice proves a low-power vanilla Character is excluded from its Blocker
  choice, ST01 Luffy proves an opposing Blocker Leader cannot block during the
  restricted battle, and a focused review regression proves removal ownership
  is evaluated from the controller at event time. The focused gate passes 18
  tests, the full engine passes 1,254 tests with 2 skipped, and the reconciled
  inventory is 276 verified, 995 pending, 125 gaps, and 148 vanilla, with 302
  definitions carrying command-driven behavior tests.

Current checkpoint (OP02-082 through OP02-086; fifty-ninth Character batch,
with OP02-084 vanilla):

- **First-run pass:** official card-list evidence confirms Byrnndi World's
  unusual +792000 value and Blugori's lack of an effect. All four ability cards
  executed on established runtime surfaces after synchronizing current parser
  output into their stale definitions.
- **Signal:** this batch repeated two established definition-drift patterns:
  DON!!-return activation blocks missing optionality and exact matching where
  printed Impel Down membership must include compound traits.
- **Change:** synchronized those definitions and normalized Blugori's legacy
  `"NULL"` sentinel to true vanilla. No new helper or skill rule was warranted
  because both drift patterns already have focused diagnostics and runtime
  support.
- **Proof:** Byrnndi World proves optional DON!! -8 payment, its printed power
  gain, decline, and turn-end cleanup. Hannyabal proves exact and compound
  Impel Down eligibility, name/color exclusions, physical hand movement,
  optional zero selection, and chosen bottom order. Magellan proves both On
  Play branches, each player's DON!! choice ownership, and opponent-turn On
  K.O. DON!! -2. Minokoala proves Blocker, the compound Leader gate, optional
  rested DON!! addition, and the failed-gate branch. Focused behavior passes 9
  tests, the parser passes 773 tests, the full engine passes 1,263 tests with 2
  skipped, and the running inventory is 280 verified, 991 pending, 124 gaps,
  and 149 vanilla, with 306 definitions carrying command-driven behavior tests.
- **Next-two result:** OP02-082 and OP02-083 needed only established definition
  synchronization, so the prior batch's target and activation shapes caused no
  shared repair cycle. Measure OP02-087 and OP02-088 for whether their printed
  behavior exposes reusable friction.

Current checkpoint (OP02-087, OP02-088, and OP02-094 through OP02-096;
sixtieth Character batch, with OP02-088 vanilla):

- **First-run pass:** official card-list evidence confirms Sphinx has no effect.
  Minotaur and Kuzan used established runtime surfaces after definition
  synchronization. Isuka exposed missing battle-attacker provenance, while
  Onigumo exposed recursive evaluation between a keyword condition and an
  unrelated permanent cost reader.
- **Signal:** reactive K.O. text that names “this Character” needs the attacking
  physical source, and permanent evaluators must not execute conditions for
  action categories they do not consume.
- **Change:** battle K.O. events now carry the attacker identity, `sourceSelf`
  event filters enforce it, and the parser emits that filter for the printed
  battle-K.O. phrase. Permanent modifier evaluation now filters to relevant
  actions before evaluating conditions, avoiding unrelated recursive work.
- **Proof:** Minotaur proves Double Attack, compound Impel Down Leader matching,
  optional rested DON!! addition, and the failed gate. Isuka proves only its
  own battle K.O. reactivates it and that the once-per-turn limit survives a
  second K.O. Onigumo proves a live cost-0 Character grants Banish and that
  ordinary Life damage returns when the condition is absent. Kuzan proves On
  Play draw, optional opposing cost reduction, and turn-end cleanup. Focused
  behavior passes 10 tests, the parser passes 774 tests, the full engine passes
  1,273 tests with 2 skipped, and the running inventory is 284 verified, 988
  pending, 122 gaps, and 150 vanilla, with 310 definitions carrying
  command-driven behavior tests.
- **Next-two result:** OP02-087 required only established compound-trait
  synchronization and OP02-088 required only vanilla cleanup, so the prior
  batch's runtime surfaces avoided a shared repair. Measure OP02-097 and
  OP02-098 against the new provenance and evaluator boundaries.

Current checkpoint (OP02-097 through OP02-101; sixty-first Character batch,
with OP02-097 vanilla):

- **First-run pass:** official card-list evidence confirms Komille has no
  effect. Koby and Sakazuki used the established optional hand-trash and
  filtered K.O. flow. Jango's generated permanent battle protection worked
  without repair. Strawberry's stale definition only needed removal of an
  incorrectly imported Blocker keyword.
- **Signal:** the only repeated friction was established fixture behavior:
  exact single-card costs auto-pay without a prompt, and battle assertions must
  use a target whose live power actually loses the battle.
- **Change:** normalized Komille's legacy `"NULL"` sentinel and synchronized
  Jango and Strawberry with current parser output. No new helper or skill rule
  was warranted because neither fixture correction established a new workflow
  gap.
- **Proof:** Koby and Sakazuki prove optional hand-trash payment, filtered
  physical K.O. targets, decline, and zero-target resolution. Jango proves its
  named field condition prevents battle K.O. but not ordinary battle defeat
  without Fullbody. Strawberry proves its cost-0 gate excludes only
  cost-5-or-less Blockers and that both Blockers remain legal without the gate.
  Focused behavior passes 10 tests, all five parser audits pass, the parser
  passes 774 tests, and the full engine passes 1,283 tests with 2 skipped. The
  running inventory is 288 verified, 985 pending, 120 gaps, and 151 vanilla,
  with 314 definitions carrying command-driven behavior tests.
- **Next-two result:** OP02-097 required only established vanilla cleanup and
  OP02-098 completed on the existing optional-cost flow, so Wave 39's
  provenance and permanent-evaluator repairs caused no spillover. Measure
  OP02-102 and OP02-103 for another reusable friction signal.

Current checkpoint (OP02-102 through OP02-106; sixty-second Character batch):

- **First-run pass:** all five cards used established runtime behavior after
  synchronizing Smoker's effect-K.O. immunity and Sentomaru's physical
  Life-Trigger play action with current parser output. The remaining first-run
  failures were fixture assumptions around auto-paid exact costs, automatically
  completed blocker steps, and turn-scoped modifier expiry.
- **Signal:** Smoker, Sengoku, Tashigi, and Tsuru all compose existing
  effective-cost conditions or turn-scoped cost modifiers; Sentomaru repeats
  the established physical `playThisCard` Trigger mapping.
- **Change:** synchronized the two stale definitions. No new helper or skill
  rule was warranted because every correction followed an existing diagnostic
  and no shared parser, engine, projection, or harness defect appeared.
- **Proof:** Smoker proves effect-only K.O. immunity, ordinary battle K.O.,
  a live cost-0 power gate, and battle cleanup. Sengoku and Tashigi prove their
  DON!! attachment gates, optional opponent targets, and turn-end cost cleanup.
  Sentomaru proves the same physical Life card enters play. Tsuru proves its
  On Play target, zero-target branch, and turn cleanup. Focused behavior passes
  11 tests, all five parser audits pass, the parser passes 774 tests, and the
  full engine passes 1,296 tests with 2 skipped. The running inventory is 293
  verified, 980 pending, 120 gaps, and 151 vanilla, with 319 definitions
  carrying command-driven behavior tests.
- **Next-two result:** OP02-102 and OP02-103 completed without shared repair,
  so Wave 40's existing permanent and cost-modifier surfaces held. Measure
  OP02-107 and OP02-108 for the next repeated-friction signal.

Current checkpoint (OP02-107 through OP02-111; sixty-third Character batch,
with OP02-107 and OP02-109 vanilla):

- **First-run pass:** official card-list evidence confirms Doberman and
  Jaguar.D.Saul have no effect. Rosinante and Hina used the established public
  Blocker and On Block paths. Fullbody's first assertion needed a real opposing
  Blocker to hold the battle open while its temporary power was observable.
- **Signal:** this batch repeated only established vanilla-sentinel cleanup and
  battle-decision fixture timing.
- **Change:** normalized both vanilla definitions to omit effect text. No new
  helper or skill rule was warranted because the ability cards required no
  parser, engine, projection, or harness repair.
- **Proof:** Rosinante proves the defending player's Blocker choice,
  retargeting, visible K.O., protected Life, and decline. Hina proves Blocker,
  On Block choice ownership, the cost-6 boundary, selected attack prohibition,
  and zero selection. Fullbody proves the Jango field gate, its in-battle
  +3000, cleanup, and failed gate. Focused behavior passes 6 tests, all five
  parser audits pass, the parser passes 774 tests, and the full engine passes
  1,304 tests with 2 skipped. The running inventory is 296 verified, 977
  pending, 118 gaps, and 153 vanilla, with 322 definitions carrying
  command-driven behavior tests.
- **Next-two result:** OP02-107 required only established vanilla cleanup and
  OP02-108 completed on the existing Blocker path, so Wave 41's surfaces caused
  no shared repair. Measure OP02-112 and OP02-113 next.

Current checkpoint (OP02-112 through OP02-116; sixty-fourth Character batch,
with OP02-116 vanilla):

- **First-run pass:** Bell-mere and Helmeppo passed on their first focused run.
  Borsalino and Garp initially exposed fixture mistakes: X.Drake requires a
  rested target, a rested Blocker cannot block, and a natural cost-0 Character
  carried unrelated effect-K.O. protection.
- **Signal:** Helmeppo and Garp both needed a visible effective-cost-0 setup,
  while Borsalino repeated the established active/rested and battle-prompt
  fixture boundaries.
- **Change:** reused Sengoku's command-driven cost reduction for both cost-0
  proofs and kept the battle fixtures local. No helper or skill change was
  warranted because the existing engine commands made both scenarios concise
  after correcting their fixtures. Helmeppo's stale definition was aligned
  with current parser output, and Yamakaji's legacy `NULL` sentinel was
  removed.
- **Proof:** Bell-mere proves optional rest payment, both target owners,
  turn-scoped cost/power modifiers, decline, and cleanup. Helmeppo proves the
  cost-0-dependent battle bonus, zero target, cleanup, and physical Life
  Trigger identity. Borsalino proves opponent-turn power and effect-K.O.
  protection, Blocker ownership, battle K.O., and own-turn vulnerability. Garp
  proves the DON!! x2 gate, effective cost-0 filtering, zero selection, and
  failed gate. Focused behavior passes 13
  tests, all five parser audits pass, the parser passes 774 tests, and the full
  engine passes 1,322 tests with 2 skipped. Scoped cards/engine checks also
  pass. The running inventory is 300 verified, 973 pending, 117 gaps, and 154
  vanilla, with 326 definitions carrying command-driven behavior tests.
- **Next-two result:** OP02-112 and OP02-113 completed without shared repair,
  so Wave 42's compact activation and battle fixtures held. Measure OP02-120
  and OP02-121 next.

Publication review follow-up after the sixty-fourth Character batch:

- Two current P2 findings were classified as `card-definition`, not
  `shared-engine`: the On Block dispatcher correctly reached stale Bellamy and
  Zeff definitions. Bellamy now pays its printed 2-DON!! rest cost before its
  optional active-DON!! choice. Zeff now requires an included East Blue Leader
  and offers its deck-trash action optionally.
- A focused command-driven regression proves Bellamy's paid and declined
  branches and Zeff's matching and nonmatching Leader branches through real
  Blocker activation. Four focused review tests, both parser audits, scoped
  cards/engine checks, and the 1,322-test full engine suite pass. The generated
  parser inventory advances to 802 exact transformations and 813 mismatches;
  canonical human counts remain unchanged because both cards still have later
  printed clauses to verify in queue order.

OP02 set-boundary tail (OP02-120 and OP02-121):

- **Signal:** both cards reused established optional DON!! payment, field-wide
  temporary power, dynamic permanent cost, and up-to target behavior.
- **Change:** aligned Uta's stale definition with the parser's optional payment
  and added no shared abstraction. Kuzan's definition already matched.
- **Proof:** Uta proves accepting and declining DON!! -2, all own Leader and
  Character recipients, and cleanup at the start of the controller's next
  turn. Kuzan proves its live opposing -5 cost during its controller's turn,
  cleanup on the opponent's turn, cost-0 On Play K.O., and zero target. Five
  focused tests and both parser audits pass. The generated inventory now has
  804 exact transformations, 811 mismatches, and 328 behavior files. The
  running human inventory is 302 verified, 971 pending, 117 gaps, and 154
  vanilla cards.
- **Next-two result:** this was the two-card OP02 tail, so the next measurement
  begins with OP03-002 and OP03-003.

Publication review follow-up after the OP02 set boundary:

- Shuraiya's stale `setPower: 0` placeholders are replaced by executable
  opposing-Leader base-power copies for both When Attacking and On Block,
  sharing one physical-card once-per-turn identity. Public battle tests prove
  both trigger timings and start-of-next-turn cleanup. Its parser audit remains
  a documented `parser` gap because the compound trigger sentence currently
  generates only Blocker.
- The shared DON!! activation lock now applies uniformly to Character effects
  that activate existing cost-area DON!! or add active DON!! from the deck.
  Immediate action processing and already-published numeric choices both
  revalidate the affected Leader's lock. Focused regressions prove suppression
  through public commands and the narrow published-prompt invariant.
- Eight focused review regressions, four existing Bird Neptunian/Bentham
  regressions, scoped checks, and the 1,331-pass full engine gate succeed with
  2 skipped.

Current checkpoint (OP03-002 through OP03-006; sixty-fifth Character batch,
with OP03-006 vanilla):

- **First-run pass:** Adio's candidate filter, Curiel's two Rush modes, and
  Thatch's runtime delayed action passed focused behavior immediately. Izo
  needed its missing included-trait filter restored. Official card-list
  evidence confirmed Speed Jil and its Dash Pack printing have no effect.
- **Signal:** Curiel and Thatch both exposed parser output that discarded
  meaningful timing or attack-permission text, while OP03 Event audits exposed
  the same broader clause-order friction.
- **Change:** the parser now recognizes natural Rush: Character wording,
  preserves delayed self-trash at end of turn, parses compound keyword-plus-
  power follow-ups, and retains card-category hand costs. Related OP03 parser
  repairs also place Striker's post-colon Leader condition after its costs and
  scope named generic cards to Leader/Character where official Q&A requires.
- **Proof:** Adio proves its DON!! gate, exact low-power Blocker exclusion, and
  both legal battle outcomes. Izo proves compound trait/name filtering,
  selected physical identity, zero selection, and exact bottom order. Curiel
  proves same-turn Character-only attacking and DON!!-gated Leader attacking.
  Thatch proves once-per-turn power, in-play duration, and end-turn self-trash.
  Seven focused Character tests, five related Event/Stage tests, all five
  Character audits, three Event/Stage audits, the 780-test parser suite, and
  scoped checks pass. The running human inventory is 306 verified, 967
  pending, 116 gaps, and 155 vanilla cards, with 332 definitions carrying
  command-driven behavior tests.
- **Next-two result:** OP03-002 and OP03-003 completed without engine repair;
  the strengthened scenarios removed two partial-proof gaps. Measure OP03-007
  and OP03-008 against the new parser diagnostics.

Current checkpoint (OP03-007 through OP03-011; sixty-sixth Character batch,
with OP03-007 vanilla):

- **First-run pass:** official card-list evidence confirmed Namule has no
  effect. Buggy, Haruta, and Fossa passed on existing engine surfaces.
  Blamenco's first run exposed only a test fixture assumption: Doma has 3000
  base power, so its printed −2000 result is 1000.
- **Signal:** Buggy repeated Izo's hidden search ordering, while Haruta repeated
  the numeric up-to-zero DON!! choice from recent checkpoints.
- **Change:** reused the narrow hidden-zone identity/order boundary and added
  no shared abstraction. The following two cards measure whether these
  established fixtures continue to avoid repair cycles.
- **Proof:** Buggy proves red Event category/color filtering, selected physical
  identity, zero selection, bottom order, Slash battle-K.O. protection, and a
  non-Slash boundary. Haruta proves the rested-DON!! count, both recipient
  categories, once per turn, and zero selection. Fossa proves public Blocker
  selection, retargeting, battle K.O., and protected Life. Blamenco proves its
  DON!! gate, opposing target, −2000 modifier, and turn-end cleanup. Nine
  focused tests, all five parser audits, scoped checks, the 785-test parser
  suite, and the full engine gate at 1,349 passing with 2 skipped all succeed.
  The running human inventory is 310 verified, 963 pending, 115 gaps, and 156
  vanilla cards, with 336 definitions carrying command-driven behavior tests.
- **Next-two result:** OP03-007 needed only established vanilla cleanup and
  OP03-008 reused the hidden search fixture without engine repair. Measure
  OP03-012 and OP03-013 next.

Current checkpoint (OP03-012 through OP03-015 and OP03-023; sixty-seventh
Character batch, with OP03-023 vanilla):

- **First-run pass:** 3/4 ability files. Marco, Monkey.D.Garp, and Lim passed
  focused behavior on existing command surfaces. Marshall.D.Teach exposed a
  missing qualified Character-trash activation cost. Official card-list
  evidence confirmed Alvida has no effect and its stale `NULL` sentinel was
  normalized to the canonical empty vanilla representation.
- **Signal:** Teach's colon cost is neither a K.O. nor a hand discard: it must
  trash a chosen red Character at the live 4000-power boundary without
  publishing On K.O., while still returning attached DON!! when that Character
  leaves the Character area.
- **Change:** added typed `trashCharacter` cost parsing, prompt projection,
  live candidate revalidation, original-owner Trash routing, and attached-DON!!
  cleanup. This was required card behavior rather than repeated workflow
  friction, so no new harness or skill abstraction was added.
- **Proof:** Teach proves optional decline, source eligibility, red/power
  filtering, physical payment identity, no false Marco On K.O., draw,
  battle-only +1000 power, and attached-DON!! return. Marco proves its
  your-turn K.O. boundary and optional Event payment into same-identity rested
  replay. Garp proves exact color/category/cost hand filtering and effect play.
  Lim proves public Blocker routing, opponent-turn K.O. gating, target
  ownership, and duration cleanup. Alvida passes the vanilla Character audit.
  Seven focused Character tests, the 793-test parser suite, the 1,370-pass
  engine suite with 2 skipped, and cards, engine, parser, and types checks pass.
  The running human inventory is 314 verified, 958 pending, 115 gaps, and 157
  vanilla cards.
- **Next-two result:** the prior colon-cost preflight identified Teach's
  missing primitive before fixture work, while Marco reused the existing
  filtered hand-cost path. Measure OP03-024 and OP03-025 for whether this keeps
  the next On Play/permanent pair card-local.

Current checkpoint (OP03-024 through OP03-028; sixty-eighth Character batch):

- **First-run pass:** Gin and Krieg passed on existing engine surfaces.
  Kuroobi, Sham, and Jango exposed stale card definitions: compound traits
  needed included matching, Kuroobi's Trigger needed to play the resolving
  physical card, and Jango's second choice had lost its opposing rest.
- **Signal:** four cards in one batch use the same compound `{East Blue}` trait
  boundary, and Jango demonstrated that splitting a shared rest verb can
  silently discard the second target.
- **Change:** normalized the four included-trait filters and added one narrow
  compound-rest parser helper and regression. No harness abstraction was
  needed.
- **Proof:** Gin proves the Leader gate, up-to-two bound, opposing cost filter,
  and wrong-Leader boundary. Krieg proves optional decline, physical discard,
  rested/cost filtering, K.O., DON!!-gated Double Attack, and ordinary
  one-damage combat. Kuroobi proves an optional opposing rest and that its Life
  Trigger plays the same resolving card before the On Play continuation. Sham
  proves opposing cost filtering and conditionally plays the selected physical
  Buchi only when none is controlled. Jango proves both choices, included
  trait/cost filtering, and ordered self-plus-opponent rests. Thirteen focused
  Character tests and the narrow 119-test parser regression pass.
  The running human inventory is 319 verified, 953 pending, 115 gaps, and 157
  vanilla cards.
- **Next-two result:** OP03-024 and OP03-025 needed no shared repair, so the
  preceding colon-cost preflight avoided another engine cycle. Measure
  OP03-029 and OP03-030 for whether the established Life Trigger fixture keeps
  both cards local.

Current checkpoint (OP03-029 through OP03-033; sixty-ninth Character batch):

- **First-run pass:** all five cards passed on existing engine surfaces.
  Buggy's stale unstructured gap was repaired with its parser-derived
  battle-only Slash protection. The concurrently prelanded Momoo cleanup also
  removed a stale `NULL` sentinel and restored its canonical vanilla shape,
  but Momoo is not counted among this batch's five verified cards.
- **Signal:** Chew, Nami, and Hatchan all needed proof that a Life Trigger
  moves the resolving physical card before any continuation, while Nami also
  reused the established hidden search and bottom-order fixture.
- **Change:** reused the existing Life Trigger and search fixtures without a
  new helper. No shared engine, parser, harness, or skill change was needed.
- **Proof:** Chew proves rested/cost filtering, optional targeting, K.O., and
  same-card Trigger play. Nami proves top-five scope, green/included-trait/name
  filtering, selected identity, zero choice, bottom order, and same-card
  Trigger play. Pearl proves public Blocker choice, retargeting, and battle
  K.O. Buggy proves Slash battle-K.O. immunity and a non-Slash boundary.
  Hatchan proves its included Leader gate, same-card Trigger play, and the
  failed-condition Trash outcome. Eight focused tests and all five parser
  audits pass. The publication gate also exposed a prelanded OP03-041 parser
  defect: whole-block optional self-mill had been modeled as an additional
  up-to count. A narrow regression now preserves the optional trigger but
  trashes exactly seven once accepted. The 794-test parser suite and full
  engine gate at 1,391 passing with 2 skipped succeed. The running human
  inventory is 324 verified, 949 pending, 113 gaps, and 158 vanilla cards,
  including prelanded Momoo.
- **Next-two result:** both OP03-029 and OP03-030 reused the Life Trigger
  fixture without a repair cycle. Measure OP03-034 and OP03-041 next for
  continued card-local K.O. and damage-trigger coverage.

Current checkpoint (OP03-034, OP03-035, and OP03-041 through OP03-043;
seventieth Character batch, with OP03-035 vanilla):

- **First-run pass:** Buchi, Momoo, Usopp, and Usopp's Pirate Crew passed on
  established surfaces. Gaimon exposed the first missing broad damage trigger:
  its untagged "When you deal damage" must observe Life damage from any of its
  controller's attackers, not only Gaimon itself.
- **Signal:** Usopp and Gaimon both use whole-block optional exact self-mill,
  while Gaimon's "If you do" additionally requires its self-trash to depend on
  successfully trashing all three cards.
- **Change:** added a distinct `whenYouDealDamage` trigger dispatched to the
  attacker's in-play cards, parser recognition for the broad wording, and
  dependent `thenActions` on exact top-deck trash. This keeps source-specific
  `whenDealsDamage` cards scoped to their own attacks and avoids modeling
  optional exact amounts as up-to counts.
- **Proof:** Buchi proves the optional bound, rested/cost filter, opposing
  ownership, and K.O. Usopp proves Rush, the attached-DON!! gate, Life-damage
  timing, optional accept/decline, and exact-seven self-mill. Usopp's Pirate
  Crew proves blue/name filtering, selected identity, and zero choice. Gaimon
  proves another Character can trigger it, accept and decline branches,
  exact-three self-mill, dependent self-trash, and the insufficient-deck
  boundary. Momoo passes the vanilla parser audit. Nine focused behavior tests
  and all five parser audits pass. The 795-test parser suite, full engine gate
  at 1,401 passing with 2 skipped, and scoped cards, engine, parser, and types
  checks succeed. The prelanded Genzo definition also moved one stale gap into
  the canonical vanilla catalog. The running human inventory is 328 verified,
  946 pending, 111 gaps, and 159 vanilla cards.
- **Next-two result:** OP03-034 stayed card-local, while OP03-041 reused the
  exact optional self-mill normalization without another repair cycle. Measure
  OP03-044 and OP03-045 next against the established hand-cost and permanent
  effect fixtures.

Current checkpoint (OP04-087 through OP05-031; first fifty-card parallel
Character batch, with four vanilla cards):

- **First-run pass:** 49/50 command-driven card scenarios passed before shared
  integration repair. OP05-004 exposed activation commands that were accepted
  despite a false supported condition; six cards independently exposed parser
  qualifier gaps while their reviewed runtime definitions and focused behavior
  remained correct.
- **Signal:** trash-to-deck verbs, alternative traits, exclude-self qualifiers,
  Leader-vs-source power, and filtered rest costs repeatedly lost information
  at parser boundaries. False activation conditions also produced accepted
  no-op commands across several existing cards.
- **Change:** normalized those six parser families and preflighted supported
  activation conditions in legal-command projection and command acceptance.
  The campaign workflow now publishes every fifty cards using ten disjoint
  five-card implementer leases; the coordinator retains shared code and Git.
- **Proof:** all 50 parser audits pass; 50 focused files pass 99 tests; the
  parser passes 49 files and 915 tests; the engine passes 974 files and 1,833
  tests with 2 skipped; cards, parser, engine, and harness checks pass. Human
  inventory is 488 verified, 791 pending, 87 gaps, and 178 vanilla cards.
- **Next-two result:** measure OP05-032 and OP05-033 against activation
  preflight and filtered-cost parsing before retaining further workflow changes.

Current checkpoint (OP05-032 through OP05-093; second fifty-card parallel
Character batch, with four vanilla cards):

- **First-run pass:** 49/50 command-driven card scenarios passed before shared
  repair. Mozambia exposed the missing outside-Draw-Phase draw dispatch; the
  remaining runtime changes were reviewed card-definition corrections.
- **Signal:** four legacy `NULL` cards were repeatedly misclassified as parser
  gaps, while nine ability cards lost choice ownership, inclusive ranges,
  additional field costs, or inclusive trait semantics during regeneration.
- **Change:** normalized the `NULL` sentinel across audit and both inventories,
  added the dedicated draw reaction, and repaired the repeated parser families
  with narrow regressions instead of preserving card-local exceptions.
- **Proof:** all 50 parser audits pass; 50 focused files pass 89 tests; the
  parser passes 50 files and 924 tests; the engine passes 1,024 files and 1,922
  tests with 2 skipped; cards, parser, engine, and harness checks pass. Human
  inventory is 534 verified, 747 pending, 63 gaps, and 200 vanilla cards.
- **Next-two result:** OP05-032 and OP05-033 did not reuse the prior activation
  preflight directly; both stayed card-local after definition alignment. Use
  OP05-099 and OP05-100 to measure the new sentinel and trigger/cost parsing
  preflights.

Current checkpoint (OP05-099 through OP06-051; third fifty-card parallel
Character batch):

- **First-run pass:** 40/50 card scenarios passed before shared integration
  repair. Ten cards exposed opponent-choice ownership, once-per-turn
  replacement identity, delayed movement, extra turns, Trigger reactions,
  field-aware costs, or turn-wide attack restrictions.
- **Signal:** multiple cards again crossed the same two boundaries: text before
  a colon required executable payment semantics beyond hand-only costs, and
  reactions needed durable event provenance or player scope instead of a
  snapshot of current field objects.
- **Change:** generalized field-aware alternative payments and field-exit DON!!
  cleanup, and completed the shared reaction/turn surfaces for Trigger
  activation, extra turns, opponent choices, shared replacement identity, and
  player-wide attack restrictions. Narrow parser regressions preserve the same
  ownership, timing, dynamic amount, and compound-condition clauses.
- **Proof:** all 50 parser audits pass; 50 focused files pass 75 tests; the
  parser passes 51 files and 928 tests; the engine passes 1,074 files and 1,997
  tests with 2 skipped; cards, types, parser, and engine checks pass. Human
  inventory is 584 verified, 702 pending, 58 gaps, and 200 vanilla cards.
- **Next-two result:** measure OP06-052 and OP06-053 for whether the expanded
  cost and reaction preflight avoids another shared repair cycle.

Current checkpoint (OP06-052 through OP06-119; fourth fifty-card parallel
Character batch):

- **First-run pass:** 43/50 focused card files passed before coordinator repair.
  The remaining seven exposed one test-only prompt assumption, ordered compound
  costs, a DON!!-field difference, two stale definitions, and the shared
  Stage-to-owner-deck payment gap.
- **Signal:** three cards used the same cost-1 Stage payment, while six parser
  mismatches surfaced only after worker handoff. The actual 50-card behavior
  gate completed in seconds; repeated late parser investigation dominated the
  integration time.
- **Change:** `returnCharacterToDeck` costs now select Character or Stage zones,
  preserve printed multi-cost order, and move the physical payment to its
  owner's deck. The next wave will pre-audit all 50 cards before assignment and
  batch repeated parser repairs before implementers build fixtures.
- **Proof:** all 50 parser audits pass; 50 focused files pass 103 tests; the
  parser passes 63 files and 995 tests; the engine passes 1,126 files and 2,162
  tests with 2 skipped; cards, types, parser, and engine checks pass. Human
  inventory is 634 verified, 658 pending, 52 gaps, and 200 vanilla cards.
- **Next-two result:** measure OP07-002 and OP07-003 for first-pass behavior and
  whether queue-wide parser preflight eliminates post-handoff shared repair.

Current checkpoint (OP07-002 through OP07-068; fifth fifty-card parallel
Character batch):

- **First-run pass:** 44/50 card assignments reached a clean focused handoff.
  Six cards exposed shared set-power execution, rested-DON!! conditions and
  freezing, rest-by-effect dispatch, ordered multi-card deck positioning, or a
  conditional in-hand cost modifier.
- **Signal:** the 50-card behavior gate itself finished in 13 seconds, but a
  bare `vp test` entered watch mode and occupied every worker slot. The initial
  parser preflight classified 29 mismatches, mostly stale definitions, yet two
  narrow parser gaps still reached implementer handoff.
- **Change:** all skill examples now use finite `vp test run`; queue-wide parser
  audit remains the pre-dispatch sieve. The next wave uses ten five-card
  implementers and integrates five-card slices while
  retaining one 50-card publication checkpoint.
- **Proof:** all 50 parser audits pass; 50 focused files pass 87 tests; the
  parser passes 64 files and 1,003 tests; the engine passes 1,176 files and
  2,249 tests with 2 skipped; cards, types, parser, engine, and harness checks
  pass. Human inventory is 684 verified, 610 pending, 50 gaps, and 200 vanilla
  cards. Generated parser inventory is 1,067 exact, 500 mismatched, and 723
  behavior files across 1,768 Character definitions.
- **Next-two result:** OP07-002 still exposed a shared set-power gap while
  OP07-003 stayed card-local. Measure OP07-069 and OP07-070 for whether the
  persistent-worker queue and earlier mechanic-family preflight reduce both
  handoff latency and post-assignment parser repair.

Current checkpoint (OP07-069 through OP08-024; sixth fifty-card parallel
Character batch):

- **First-run pass:** 46/50 card assignments reached a clean focused handoff.
  Four cards exposed shared parser or engine semantics for optional opponent
  trash movement, full-hand reveal, grouped previous-action scaling, and a
  power qualifier followed by `rested`.
- **Signal:** persistent ten-card leases eliminated worker respawn and handoff
  churn, while shared semantic repairs at freeze remained the dominant serial
  integration cost.
- **Change:** use ten five-card implementers and one 50-card publication
  checkpoint. Extend queue preflight with sentence-continuation, dynamic-amount,
  grouped-scaling, and destination-state-suffix checks.
- **Proof:** all 50 parser audits pass; 50 focused files pass 82 tests; parser
  passes 77 files and 1,066 tests; engine passes 1,225 files and 2,336 tests with
  2 skipped; cards, types, parser, and engine checks pass. Human inventory is
  734 verified, 565 pending, 45 gaps, and 200 vanilla cards. Generated parser
  inventory is 1,107 exact, 460 mismatched, and 772 behavior files across 1,768
  Character definitions.
- **Next-two result:** OP07-069 and OP07-070 both completed first-pass without
  shared repair. Measure OP08-025 and OP08-026 against the expanded preflight.

Current checkpoint (OP08-025 through OP08-087; seventh fifty-card parallel
Character batch):

- **First-run pass:** 48/50 card assignments reached a clean focused handoff.
  Queue-wide semantic preflight found and repaired eleven parser/type/engine
  gaps before dependent implementation. The freeze report exposed two remaining
  shared defects for mandatory replacements and source-only `whenLeaving` blocks.
- **Signal:** five persistent ten-card leases kept implementation parallel, and
  the 45-file behavior gate completed in seconds. The remaining serial cost was
  semantic shared repair; incomplete interim worker status delayed two known
  failures until the formal freeze. Inventory regeneration also found and
  closed the historically skipped OP06-086 before publication.
- **Change:** retain the full 50-card semantic preflight and require workers to
  report every focused failure immediately, not only in the final freeze.
  Replacement preflight now distinguishes mandatory text from “you may,” and
  reactive trigger discovery checks `source` provenance independently from an
  `eventFilter`.
- **Proof:** all wave audits pass; 46 focused ability files pass 84 tests,
  including the OP06-086 catch-up; the
  parser passes 77 files and 1,076 tests; the engine passes 1,271 files and
  2,422 tests with 2 skipped; cards, types, parser, engine, and the One Piece
  adapter checks pass. Human inventory is 779 verified, 522 pending, 43 gaps,
  and 200 vanilla cards. Generated parser inventory is 1,125 exact, 442
  mismatched, and 818 behavior files across 1,768 Character definitions.
- **Next-two result:** measure OP08-088 and OP08-090 for whether mandatory-vs-
  optional replacement and provenance preflight prevents another late shared
  repair; OP08-089 remains in the vanilla invariant batch.

Current checkpoint (OP08-088 through OP09-034; eighth fifty-card parallel
Character batch):

- **First-run pass:** all 45 ability cards reached a clean focused handoff after
  preflight repairs; five vanilla cards remained in the catalog invariant. The
  queue audit found 19 stale structured definitions, while semantic preflight
  found nine shared parser/engine boundaries before dependent card work.
- **Signal:** focused and broad test execution was not the bottleneck: the
  45-file behavior gate took about 16 seconds, the parser suite about 2 seconds,
  and the full engine suite about 14 seconds. The longest serial work remained
  official-text reconciliation and shared semantic repair. Waiting for every
  preflight report before releasing safe cards would have left most workers idle.
- **Change:** keep queue-wide semantic preflight, but release each worker's safe
  subset as soon as its report arrives and hold only cards depending on a shared
  repair. Batch parser fixes by mechanic family and use the blocked card's
  focused test as the acceptance gate. Do not spend cycle time querying GitHub
  checks; publication uses local blast-radius evidence and thread-aware review.
- **Proof:** all 50 card audits pass; 45 focused files pass 77 tests; parser
  passes 77 files and 1,096 tests; engine passes 1,316 files and 2,524 tests with
  2 skipped; cards, types, parser, and engine checks pass. Human inventory is
  824 verified, 482 pending, 38 gaps, and 200 vanilla cards. Generated parser
  inventory is 1,142 exact, 425 mismatched, and 863 behavior files across 1,768
  Character definitions.
- **Next-two result:** measure OP09-035 and OP09-036 for first-pass completion
  and worker idle time under rolling safe-subset release.

Current checkpoint (OP09-035 through OP09-103; ninth fifty-card parallel
Character batch):

- **First-run pass:** 32 of 50 cards reached a safe handoff before the shared
  repair lanes completed. Forty-three ability cards now have command-driven
  coverage; seven vanilla cards remain covered by the catalog invariant.
- **Signal:** local validation remained cheap (43 files in 15 seconds, parser
  in about 1 second, engine in about 15 seconds). The serial cost came from 13
  cards collapsing onto three shared families: alternative/mixed parser
  targets, variable return-DON!! costs, and conditional continuation/duration
  semantics.
- **Change:** retain rolling safe-subset handoff, but transfer disjoint shared
  leases to the agents that found each repeated family. Batch all dependent
  cards behind that lease, keep unrelated cards moving, and return the lease to
  the coordinator before integration.
- **Proof:** 43 focused files pass 69 tests; parser passes 80 files and 1,117
  tests; engine passes 1,322 files and 2,537 tests with 2 skipped; cards, types,
  parser, and engine checks pass. Human inventory is 867 verified, 441 pending,
  36 gaps, and 200 vanilla cards. After reconciling the remote checkpoint
  branch, generated parser inventory is 1,172 exact and 395 mismatched across
  1,768 Character definitions.
- **Next-two result:** OP09-035 completed without shared repair, while OP09-036
  joined a seven-card parser lease without blocking the 32-card safe handoff.
  Measure OP09-104 and OP09-105 for whether mechanic-family lease routing keeps
  shared repair off the coordinator's critical path.

Current checkpoint (OP09-104 through OP10-049; tenth fifty-card parallel
Character batch):

- **First-run pass:** 40 of 50 cards reached a safe handoff before the final
  shared repair completed. Forty-six ability cards now have command-driven
  coverage; four vanilla cards remain covered by the catalog invariant.
- **Signal:** parallel audits found 25 definition mismatches quickly, but two
  cards still passed equality audits while both parser and definition omitted
  a printed top-or-bottom choice or alternate win condition. Ten blocked cards
  grouped into six narrow parser/engine families instead of fifty independent
  investigations.
- **Change:** retain parallel audit plus rolling safe handoff, and add semantic
  risk tags for top-or-bottom choices, alternate wins, non-self replacements,
  and compound costs. Each tagged card gets one command-driven smoke scenario
  during preflight even when parser equality passes.
- **Proof:** all 50 card audits pass; 46 focused files pass 71 tests; parser
  passes 80 files and 1,123 tests; engine passes 1,322 files and 2,537 tests with
  2 skipped; cards, types, parser, and engine checks pass. Human inventory is
  913 verified, 400 pending, 31 gaps, and 200 vanilla cards. Generated parser
  inventory is 1,205 exact and 362 mismatched across 1,768 Character
  definitions.
- **Next-two result:** OP09-104 and OP09-105 both completed in the first lease;
  the semantic smoke caught OP09-104's audit blind spot before publication.
  Measure OP10-050 and OP10-051 for first-pass completion with risk tagging.

Parallel Event/Stage checkpoint (EB02-007 through OP09-059; 29 canonical
cards, integrated alongside the ninth Character batch):

- **First-run pass:** transition telemetry was not captured as one reliable
  denominator; all 29 assignments reached a clean frozen handoff.
- **Signal:** test execution remained under 130 ms per five-card lease while
  imports took 6–9 seconds. Most serial work was official-text reconciliation
  and shared parser semantics, including search alternatives, only-trait
  conditions, filtered trash play, reveal continuations, and Life orientation.
- **Change:** retain whole-lease semantic preflight, release its safe subset
  immediately, and cluster repeated grammar into one shared repair and one
  combined focused invocation.
- **Proof:** all 26 Event and 3 Stage audits pass. After branch reconciliation,
  the parser passes 1,139 tests across 86 files and the engine passes 2,541
  tests across 1,322 files with two existing skips. Stage inventory is 5
  verified and 34 pending.
- **Next-two result:** preflight OP08-096 and OP08-116 together because both
  expose dependent optional-cost continuations; keep unrelated safe cards
  moving while that shared family is repaired.

Current checkpoint (OP10-050 through OP10-109; eleventh fifty-card parallel
Character batch):

- **First-run pass:** 34 of 50 cards reached safe or vanilla handoff before the
  shared repair lanes completed. Forty-two ability cards now have
  command-driven coverage; eight vanilla cards remain covered by the catalog
  invariant.
- **Signal:** the 50-card parser sweep completed in under two seconds and the
  final 42-file behavior gate in about 15 seconds, while serial time clustered
  around compound cost payment, filtered reveal continuations, and semantic
  audit blind spots. Equality PASS missed OP10-058, OP10-082, OP10-083,
  OP10-088, and OP10-091 because parser and definition omitted the same printed
  clause.
- **Change:** retain five disjoint ten-card leases and queue-wide audits, but
  preflight every multi-cost, reveal-then-play, and removal-protection card with
  one public-command smoke before definition alignment. Shared cost payments
  now preserve printed order and independent physical selections instead of
  collapsing all selected IDs into one list.
- **Coordination:** this checkpoint exposed duplicate OP10 leases across two
  worktrees on the same branch. Future work must claim canonical card IDs in a
  shared lease ledger, sync the remote checkpoint SHA before assignment, and
  refuse an overlapping live lease; this removes more wasted time than adding
  another uncoordinated worker.
- **Proof:** all 50 audits pass; 42 focused files pass 60 tests; the parser
  broad suite passes 86 files and 1,147 tests; the engine broad suite passes
  1,322 files and 2,543 tests with 2 intentional skips. Parser, engine, cards,
  and types checks plus the root harness check pass. Human inventory is 955
  verified, 360 pending, 29 gaps, and 200 vanilla cards.
- **PR review:** exact-head triage reduced the unresolved backlog to two live
  defects. Black Maria now prompts for the physical DON!! cards returned, and
  setting power to 0 no longer raises an already-negative Character; both
  focused regressions and the updated broad engine gate pass.
- **Next-two result:** OP10-050 remained catalog-only and OP10-051 completed on
  the first lease without repair, so semantic risk tagging is retained. Measure
  OP10-111 and OP10-112 for the new multi-cost/reveal/removal smoke preflight.

Current checkpoint (OP10-111 through OP11-055; twelfth fifty-card parallel
Character batch):

- **First-run pass:** 35 ability cards reached safe handoff while four cards
  paused for shared repair; 39 ability cards now have command-driven coverage
  and 11 vanilla cards remain covered by the catalog invariant.
- **Signal:** queue-wide audits and focused gates remained fast, while serial
  time clustered around reveal-then-move identity, source-filter negation, and
  mandatory prevention omitted by otherwise-equal parser output.
- **Change:** retain rolling safe-subset handoffs and exclusive shared
  mechanic-family leases. Preflight exact-card continuations and `without
  <attribute>` clauses, and represent mandatory no-op prevention as a real
  once-per-turn replacement.
- **Proof:** all 50 audits pass; 42 focused files pass 72 tests; parser broad
  passes 94 files and 1,164 tests; engine broad passes 1,338 files and 2,567
  tests with 2 intentional skips. Cards, types, parser, and engine checks pass.
  Human Character inventory is 994 verified, 322 pending, 28 gaps, and 200
  vanilla cards.
- **Next-two result:** OP11-056 and OP11-057 were read-only scouted as safe
  local cards; measure whether both complete without a shared repair cycle.

Current checkpoint (OP11-056 through OP11-119; thirteenth fifty-card parallel
Character batch):

- **First-run pass:** 39 ability cards reached complete lease handoff while one
  card paused on an apparent shared payment failure; all 40 ability cards now
  have command-driven coverage and 10 vanilla cards use the catalog invariant.
- **Signal:** four cards reused the same guessed-cost reveal wrapper, while the
  only late blocker was a test fixture whose Leader independently shared the
  opponent-attack trigger and paid its own DON!! cost. OP11-056 and OP11-057
  both completed without a shared repair, validating the prior preflight.
- **Change:** keep five persistent ten-card leases, rolling safe handoffs, and
  mechanic-family parser batching. Before classifying reactive payment or
  once-per-turn failures, inventory every in-play card sharing that trigger.
- **Proof:** all 50 audits pass; 40 focused files pass 69 tests; parser broad
  passes 94 files and 1,177 tests; engine broad passes 1,338 files and 2,567
  tests with 2 intentional skips. Cards, types, parser, and engine checks pass.
  Human Character inventory is 1,034 verified, 286 pending, 24 gaps, and 200
  vanilla cards; the generated inventory has 1,293 exact transformations and
  274 mismatches.
- **PR review:** the new current actionable finding is fixed: grouped-play On
  Play effects remain queued after another On Play moves their source. Rebecca
  and Gecko Moria regressions pass 6 tests, followed by the full engine gate.
- **Next-two result:** measure OP12-003 and OP12-004 for first-pass completion
  and whether trigger-fixture preflight prevents another false shared blocker.

Concurrent tail checkpoint (PRB02-006 through PRB02-017 plus the remaining
pending ST01 through ST19 reprints; fifty disjoint Characters):

- **Throughput:** ten disjoint five-card leases crossed one rolling 50-card
  publication boundary. Combined five-card invocations kept assertion time
  below 100 ms in measured leases; module import and transform remained the
  dominant fixed cost at roughly 7–9 seconds per invocation.
- **Shared repairs:** colored included-trait trash costs now preserve both color
  and trait filters; full-Life rearrangement can move one chosen card to deck
  top and privately order the remainder; opponent Character effects can now
  offer an optional `rested` replacement before mutating the target.
- **Coordination:** both persistent workers froze after their final lease. The
  coordinator retained exclusive ownership of parser, types, engine,
  inventories, validation, and Git state, avoiding shared-file collisions.
- **Proof:** all 50 cards have focused command-driven or catalog-invariant
  coverage, including the new PRB02-006 rested-replacement execution proof.
  All fresh equality audits pass against their owning definitions; 49 focused
  files pass 63 tests. After integration, the parser broad suite passes 97
  files and 1,181 tests and the engine broad suite passes 1,387 files and 2,630
  tests with 2 intentional skips.
- **Combined inventory:** 1,084 verified, 236 pending, 24 gaps, and 200 vanilla
  Characters. Retain tail-first disjoint assignment while the remote forward
  queue advances, claiming exact IDs before either worker begins.

Concurrent forward checkpoint (OP12-003 through OP12-069; fifty parallel
Characters):

- **First-run pass:** 33 ability cards and all 13 vanilla classifications
  reached safe handoff; four ability cards paused on structural-equality false
  positives and completed after reusable parser repairs.
- **Signal:** OP12-006, OP12-021, OP12-042, and OP12-063 showed that equality
  can jointly omit a heterogeneous search branch or conditional permanent
  clause. OP12-003 and OP12-004 completed first-pass, validating the previous
  trigger-fixture preflight.
- **Change:** retain five persistent ten-card leases and rolling handoffs, and
  add one early public behavior smoke for heterogeneous `or` searches and each
  conditional permanent stat or protection sentence.
- **Proof:** all 50 audits pass; 37 focused files pass 56 tests. Combined parser
  broad passes 97 files and 1,185 tests; engine broad passes 1,387 files and
  2,630 tests with 2 intentional skips. Cards, types, parser, and engine checks
  pass; the generated inventory has 1,337 exact transformations, 230
  mismatches, and 929 behavior-test detections.
- **Combined inventory:** 1,121 verified, 203 pending, 20 gaps, and 200 vanilla
  Characters. The next forward canonical card is OP12-070 Sanji.
- **Next-two result:** measure OP12-070 and OP12-071 for first-pass completion
  and whether semantic smoke catches omitted conditional clauses before lease
  handoff.

The next-card inspection now checks owner-view routing, compound-trait matching,
effective versus printed cost/power filters, optional counts, and whether one
legal sequence can cover multiple player-choice branches. It also treats text
before a colon as a real atomic cost and checks deterministic top/bottom
hidden-zone movement before assuming a generic target selection.
Hidden deck identity and order are not exposed in ordinary player projections;
when exact top/bottom routing is the printed behavior, use the narrow raw-state
identity assertion as a documented helper gap. A Life fixture with an explicit
deck must supply at least the Leader's starting Life count across configured
Life and deck zones before fixture reassignment occurs.

Before writing assertions, compare each printed sentence, colon cost, and
"Then" clause with the structured conditions, costs, and ordered actions. This
cheap clause count catches partially structured cards before a test fixture is
built around incomplete behavior.
Also reconcile every printed ownership word ("your", "your opponent's", or
unqualified) with both `target.player` and `chosenBy`; candidate ownership and
decision ownership are separate contracts. The OP09-058 checkpoint caught an
opponent-only Trigger and an over-broad Main pool before the broad suite.
For “Choose one” effects, also count printed bullets against structured option
groups and inspect any text after the choice as a separate dependent action.
When imported cards expose a separate top-level `trigger` text field, reconcile
it with executable `effects` Trigger blocks; metadata presence alone does not
make the Life Trigger resolvable.
This check was retained after it caught missing executable Trigger blocks on
three consecutive OP06 Events.
Printed “any number” targeting uses `amount: "all"` with `upTo: true`; unlike a
mandatory all-target action, it must publish a 0–N player selection.

Direct effect damage now uses a queued damage continuation rather than moving a
Life card inside the card action. This preserves printed action order, offers
the damaged player the normal Life Trigger decision, and resumes any remaining
effect actions only after that decision resolves. Last-Life Trigger fixtures
with an explicit deck must still provide at least the Leader's starting Life
count across all configured zones so match construction can complete before the
fixture zones are reassigned.

Character-to-hand payments use a shared cost decision: filter live Characters,
publish the exact candidate set to the controller, revalidate the submitted
physical card, then move it before dependent actions resolve. Effects that make
one selected attacker immune to [Blocker] grant that attacker the existing
`unblockable` keyword; battle routing skips only the blocker choice and keeps
the normal Counter and damage steps.

Search preflight distinguishes conjunction from alternatives. Multiple printed
requirements continue to use the default all-filter match, while “type A or
type B” sets the search filter mode to `any`; each type filter separately uses
included matching when the printed text says the card has that type.

When an imported numeric modifier conflicts with the card's color/mechanic or
produces an implausible beneficiary, verify the signed value against the
official card list before designing the assertion. This caught lost minus signs
on consecutive OP08 red opposing-power effects.

K.O. prevention retains its printed scope on the modifier. Battle resolution
ignores protection limited to opponent effects, while effect-driven K.O. ignores
protection limited to battle. Search remainders with a printed top-or-bottom
choice first collect the controller's exact order, then publish a separate
position decision and preserve that order at either end of the deck.

Reveal-from-hand costs publish a controller-owned filtered selection, revalidate
the chosen physical cards when the answer arrives, and reveal their identities
publicly without moving them out of hand. Tests assert candidate filtering,
opponent-visible names, unchanged hand membership, and the dependent action.

Ordered costs from an open zone still publish a decision when the number of
candidates exactly equals the required amount, because their order remains a
player choice. Dependent “that card” clauses carry the preceding moved-card
identity through any intervening target prompt, then re-evaluate the condition
from that physical card when the answer resumes resolution.

Aggregate target limits such as “total power of 4000 or less” are both
projected as decision constraints and revalidated from effective live values
when the answer arrives. Their focused proof submits one over-budget group and
confirms rejection before resolving a legal combination; invalid effect answers
must not fall through to an unrelated battle-prompt resolver.

Scope optional clauses explicitly: for “Then, you may [cost]. If you do,
[effect],” keep any preceding mandatory action in its own block and model only
the payment plus dependent action as optional. This preserves the printed
result when the player declines the later branch. When both clauses share the
same timing, two ordered effect blocks let the mandatory block resolve before
the optional cost confirmation without making the first result optional.

For owner-neutral printed targets such as "a Character," verify whether both
fields are legal and keep chooser, controller, and destination owner separate.
Battle-trigger fixtures also preflight attack power and counter availability so
the command sequence actually reaches damage and Life Trigger timing.
Because an attack succeeds when attack and defense power are equal, a test for
conditional additional Counter power sets the attacker equal to the defense
produced by only the base bonus; the additional bonus must be what changes the
battle result.
Leader-dependent tests set an explicit mono- or multicolored Leader instead of
relying on the harness default, which is multicolored and can silently satisfy
color-count conditions.

Threshold preflight uses resolution-time state: Event payment, cost payment,
and source movement may change trash, hand, Life, or DON!! counts before a
conditional clause is evaluated.

For Life manipulation, distinguish fixed top/bottom movement from a printed
player choice, and verify destination ownership independently from the effect
controller. Conditions that count both players' Life should be modeled once as
a shared numeric condition instead of duplicated card-specific branches.
For “trash until N cards,” derive the exact selection count from the live hand
at resolution and issue one owner-routed decision per affected player.

Run the broad test gate from `packages/engine`; its explicit authored-suite
include avoids rediscovering the 2,280 generated placeholder tests. The catalog
sentinel also accounts for ST01's 17 legacy definitions bundled in `index.ts`,
so it no longer reports a false export/source mismatch.

## Catalog Summary

| Card type | Authored definitions | Canonical cards | Printed behavior | Structured behavior | Printed but unstructured | Canonical vanilla |
| --------- | -------------------: | --------------: | ---------------: | ------------------: | -----------------------: | ----------------: |
| Leader    |                  123 |              97 |               97 |                  80 |                       17 |                 0 |
| Character |                1,779 |           1,543 |            1,424 |               1,184 |                      240 |               119 |
| Event     |                  351 |             303 |              303 |                 302 |                        1 |                 0 |
| Stage     |                   44 |              39 |               39 |                  39 |                        0 |                 0 |
| DON!!     |                    1 |               1 |                0 |                   0 |                        0 |                 1 |
| **Total** |            **2,298** |       **1,983** |        **1,863** |           **1,605** |                  **258** |           **120** |

The old generated inventory contains 2,280 placeholder files. Those files call
`validateCardAbility`, which is a no-op, and are intentionally excluded from
the executable suite. Authored behavior tests live under
`packages/engine/tests/cards/<type>`.

## Type Order

1. Stage: smallest complete printed-behavior type and a useful cross-section of
   activation, costs, targets, triggers, and persistent effects.
2. Event: Main, Counter, Trigger, and one-shot resolution.
3. Leader: persistent and activated effects without play-card fixture noise.
4. Character: ability cards by interaction family, followed by one
   parameterized invariant for the 200 canonical vanilla cards.
5. DON!!: one catalog/play invariant; it has no printed behavior.

## Stage Queue

Work in canonical ID order. `verified` means the focused behavior test passes;
`gap` means printed text cannot yet be expressed faithfully by the current
structured card data or engine; `pending` has not been converted.

| Canonical ID | Card                         | Status   | Behavior or next evidence                                                                       |
| ------------ | ---------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| EB01-011     | Mini-Merry                   | verified | Controller confirmation, filtered Character cost choice, Stage rest, bottom-deck movement, draw |
| EB01-030     | Loguetown                    | verified | Ordered Stage + hand bottom-deck cost, draw 2, Life Trigger play                                |
| EB02-009     | Thousand Sunny               | verified | Optional staged DON!! source/recipient choices, Stage rest, transfer, recipient power update    |
| EB02-041     | Merry Go                     | verified | Leader-trait On Play draw; DON!! field comparison; optional filtered +2 cost through next turn  |
| EB02-060     | Merry Go                     | verified | Compound Stage-rest/top-Life-face-up cost, public Life visibility, filtered power modifier      |
| OP02-024     | Moby Dick                    | verified | Dynamic turn/Life-gated named and trait power bonus; Life Trigger play                          |
| OP02-048     | Land of Wano                 | verified | Filtered hand-trash cost, Stage rest, numeric 0–1 rested-DON activation choice                  |
| OP02-070     | New Kama Land                | verified | Leader gate, printed action order, exact and up-to hand-trash choices                           |
| OP02-092     | Impel Down                   | verified | Hand + Stage-rest costs, private search selection, reveal, ordered deck-bottom remainder        |
| OP03-020     | Striker                      | verified | Leader gate, atomic DON!! + Stage-rest costs, filtered Event search and remainder ordering      |
| OP03-075     | Galley-La Company            | verified | Leader gate, Stage rest, optional 0–1 DON!!-deck count choice, rested DON!! result              |
| OP03-098     | Enies Lobby                  | verified | Includes-type Leader gate, optional opposing target, turn cost modifier, Life Trigger play      |
| OP04-096     | Corrida Coliseum             | verified | Dynamic Dressrosa gate/keyword, played-turn attack action, Character-only target restriction    |
| OP05-021     | Revolutionary Army HQ        | verified | Hand + Stage-rest costs, included-type search, reveal-to-hand and remainder ordering            |
| OP05-040     | Birdcage                     | verified | Both-player Refresh restriction, cost boundary, end-turn K.O. sweep and self-trash              |
| OP05-097     | Mary Geoise                  | verified | Dynamic hand cost, included-type filter, legal play action/payment, Your Turn boundary          |
| OP05-117     | Upper Yard                   | verified | Legal Stage play, DON!! payment, included-type search, reveal and bottom ordering               |
| OP06-041     | The Ark Noah                 | verified | Life Trigger confirmation/play and automatic all-opponent Character rest on play                |
| OP06-079     | Kingdom of GERMA             | verified | Optional discard + Stage-rest costs, included-type search, reveal and bottom ordering           |
| OP06-098     | Thriller Bark                | verified | Leader gate, compound rest costs, filtered trash play choice and rested entry                   |
| OP06-117     | The Ark Maxim                | verified | Optional Enel rest payment choice, Stage rest, and automatic opposing cost-2 K.O. sweep         |
| OP07-058     | Island of Women              | verified | Composite Leader gate, discard + Stage-rest costs, either-trait target choice, return to hand   |
| OP07-117     | Egghead                      | verified | Life boundary, controller up-to target choice, end-turn activation, and Life Trigger play       |
| OP08-020     | Drum Kingdom                 | verified | Legal Stage play and dynamic opponent-turn power for exact and composite type Characters        |
| OP08-039     | Zou                          | verified | Optional Stage-rest activation, DON!! count choice, and end-turn Minks Character choice         |
| OP08-056     | Moby Dick                    | verified | Effect-caused removal trigger, once-per-turn draw, hand choice, top/bottom choice, Life Trigger |
| OP09-021     | Red Force                    | verified | Optional rest before Leader check, opposing target choice, turn power reduction                 |
| OP09-060     | Emptee Bluffs Island         | verified | Ordered hand-to-bottom cost, Stage rest, post-cost Leader check, draw                           |
| OP09-080     | Thousand Sunny               | verified | Opponent-effect leave filter, opposing chooser, optional Stage rest and rested DON!! choice     |
| OP09-099     | Fullalead                    | verified | Hand-trash + Stage-rest costs, included-type search, reveal and remainder ordering              |
| OP10-021     | Punk Hazard                  | verified | Post-cost Leader check, 0–1 rested-DON choice, Leader-or-Character recipient                    |
| OP11-117     | Fish-Man Island              | verified | Shirahoshi gate, optional face-up Life cost, alternative-type choice, once-per-turn power       |
| OP12-080     | Baratie                      | verified | Self-to-bottom cost, post-cost Sanji gate, Event search and ordering, Life Trigger play         |
| OP13-022     | Windmill Village             | verified | Controller confirmation, filtered target choice, rest cost, this-turn power modifier            |
| OP13-078     | Oro Jackson                  | verified | Opponent-effect leave provenance, included type, 0–1 rested DON!! choice, once per turn         |
| OP13-099     | The Empty Throne             | verified | Trash-threshold turn power, compound rest costs, DON!!-field affordability, filtered hand play  |
| OP14-039     | Coffin Boat                  | verified | Dracule Mihawk identity gate, On Play draw, end-turn 0–1 rested DON!! reactivation              |
| ST01-017     | Thousand Sunny               | verified | Optional Stage-rest cost, filtered 0–1 power target choice, this-turn expiration                |
| ST14-017     | Thousand Sunny (Pirate Foil) | verified | Runtime ST14 identity, composite Leader gate, On Play draw, filtered permanent Character cost   |

## Event Queue

The complete 303-card canonical queue is tracked in
[`card-behavior-event-inventory.md`](card-behavior-event-inventory.md). It is
generated from the exported catalog in canonical ID order and now has no
pending or printed-but-unstructured Events.

- Event behavior tests: 303 / 303 canonical Events.
- Next canonical Event: complete.

## Leader Queue

The 97-card canonical queue is tracked in
[`card-behavior-leader-inventory.md`](card-behavior-leader-inventory.md).

- Leader behavior tests: 97 / 97 canonical Leaders.
- Next canonical Leader: complete.

## Character Queue

The 1,544-card canonical queue is tracked in
[`card-behavior-character-inventory.md`](card-behavior-character-inventory.md).
Ability cards remain in canonical order; vanilla cards are reserved for one
parameterized invariant after the ability queue.

- Character behavior tests: 1,084 / 1,544 canonical Characters.
- Structured pending: 236.
- Printed but unstructured gaps: 24.
- Canonical vanilla batch: 200.
- Next canonical Character: OP12-003 Crocus (`pending`).

## Progress

- Executable card tests: 1,723 / 1,983 canonical cards.
- Stage behavior tests: 39 / 39 canonical Stages.
- Interaction families covered by an authored card test: optional confirmation,
  filtered Character selection, selectable Character-to-deck cost, ordered
  compound costs, Stage rest cost, draw, Life Trigger confirmation and play,
  turn-scoped power modifiers, staged DON!! source/recipient selection, DON!!
  field comparisons, top-Life face-up costs and visibility, and modifiers lasting
  through the opponent's next turn, plus dynamically evaluated permanent power
  modifiers, filtered hand costs, and numeric optional DON!! activation choices.
  New Kama Land additionally covers sequential exact and optional-range hand
  selections while preserving printed action order.
  Impel Down adds privately viewed deck candidates with legal/disabled choices,
  public reveal-to-hand, and executable deck-bottom ordering.
  Striker adds leader-gated activation and atomic compound DON!! plus Stage-rest
  costs before reusing the established private search interaction.
  Galley-La Company adds an executable optional DON!!-deck count decision and
  verifies that the chosen DON!! card enters the cost area rested.
  Enies Lobby adds explicit exact-vs-includes Leader type matching, an opposing
  Character cost modifier through turn end, and Life Trigger play.
  Corrida Coliseum adds dynamically evaluated permanent keywords and verifies
  that Rush: Character publishes and executes only Character attack targets.
  Revolutionary Army HQ verifies a second compound-cost search card while
  specifically covering composite Revolutionary Army type matching.
  Birdcage adds both-player targets, dynamic Refresh prevention, and deferred
  end-turn finalization so end triggers resolve before the next turn begins.
  Mary Geoise adds turn-scoped continuous hand-cost computation and verifies
  that projected cost, legal play actions, and actual DON!! payment agree for
  both exact and composite Celestial Dragons type values.
  Upper Yard adds a mandatory On Play search reached through legal Stage play,
  with a controller-owned private choice, composite Sky Island type matching,
  public reveal-to-hand, and controller-defined deck-bottom ordering.
  The Ark Noah combines Life Trigger confirmation and cost-free Stage play with
  automatic On Play chaining, proving that an all-target rest resolves without
  publishing an unnecessary player selection.
  Kingdom of GERMA adds another compound-cost search proof while specifically
  covering an optional activation, controller-selected discard, Stage rest,
  and exact plus composite GERMA type eligibility.
  Thriller Bark adds a reusable filtered effect-play interaction: the engine
  projects a controller-owned hand/trash card choice, revalidates the submitted
  selection, places the Character rested, and queues its normal On Play path.
  The Ark Maxim adds reusable filtered rest-card cost payment, including active
  candidate projection, bounded submission, atomic payment, and an automatic
  cost-threshold K.O. sweep after both printed costs are paid.
  Island of Women adds alternative trait filtering, proving that exact Amazon
  Lily and composite Kuja Pirates Characters are eligible in the same projected
  target choice while an unrelated Character is excluded before submission.
  Egghead adds an automatic End Phase effect with an inclusive Life threshold,
  controller-owned up-to Character choice, composite type and cost filtering,
  turn finalization after resolution, and a sampled Life Trigger play path.
  Drum Kingdom confirms that conditional permanent power modifiers are computed
  dynamically across turn boundaries for exact and composite type values, with
  legal Stage play and DON!! payment as the player entry point.
  Zou composes optional activation confirmation, Stage-rest payment, a numeric
  rested-DON!! choice, and a later controller-owned up-to Minks Character choice
  while preserving End Phase turn finalization.
  Moby Dick adds explicit effect-movement provenance and filtered leave-field
  auto effects after the originating effect finishes, plus a revalidated hand
  selection and top-or-bottom deck-position choice. Its test also proves the
  per-physical-card once-per-turn limit and samples Life Trigger play.
  Red Force adds action-level conditions evaluated after activation costs: its
  Stage may be rested before a nonmatching Leader makes the effect do nothing.
  With a composite Red-Haired Pirates Leader, it publishes the opposing up-to-one
  Character choice, applies the printed negative modifier, and expires it at turn end.
  Emptee Bluffs Island adds a reusable ordered hand-to-deck activation cost,
  revalidates the two private selections, preserves their chosen bottom order,
  then rests the Stage before its post-cost Cross Guild check and draw.
  Thousand Sunny narrows reactive leave-field provenance by owner, opposing
  effect controller, opponent turn, and included Character type. Its scenario
  also fixes generic `chosenBy: "opponent"` prompt ownership and proves the
  Stage controller can accept the rest cost and choose 0–1 rested DON!! afterward.
  Fullalead verifies its compound hand-trash and Stage-rest cost before a
  private three-card search, including exact and composite Blackbeard Pirates
  eligibility, public reveal-to-hand, and controller-ordered deck-bottom remainder.
  Punk Hazard adds an explicit 0–1 DON!! source-count decision before the
  Leader-or-Character recipient choice. It also confirms the Stage-rest cost is
  paid before a non-Caesar Leader makes the conditional action do nothing.
  Fish-Man Island covers an optional top-Life face-up activation cost without
  resting the Stage, alternative exact and composite Character types in one
  up-to-one choice, its per-physical-card once-per-turn limit, and a power bonus
  that expires at the end of the controller's turn.
  Baratie adds a prompt-free self-to-deck activation cost, proves that the
  after-colon Sanji check happens only after that cost is paid, and exercises
  the private Event search, ordered remainder, and Life Trigger play paths.
  Oro Jackson reuses leave-field provenance for exact and composite Roger
  Pirates types, publishes the controller's 0–1 rested-DON!! choice, and
  suppresses a second qualifying removal with its once-per-turn limit.
  The Empty Throne adds a dynamically evaluated trash-threshold Leader bonus,
  compound Stage and DON!! rest costs, and a hand-play choice filtered by card
  category, color, included type, and the post-payment DON!! field count.
  Coffin Boat verifies its canonical Dracule Mihawk identity gate, On Play draw,
  and the Stage controller's end-turn 0–1 rested-DON!! reactivation choice.
  ST01 Thousand Sunny closes the activated Stage family with its optional rest
  cost, filtered power-target choice, and turn-scoped expiration. ST14 Thousand
  Sunny proves the runtime reprint identity, composite Leader gate, On Play
  draw, and dynamic +1 cost for only black Straw Hat Crew Characters.
  Iceburg and OP04 Nefeltari Vivi establish permanent cannot-attack legality
  through rejected public commands while their activated paths remain usable.
  Rob Lucci covers opponent-owned battle K.O. provenance, chosen multi-card
  trash payment, reactivation, and once-per-turn enforcement. Charlotte Linlin
  proves costs are paid before a post-colon Life condition gates its action.
  Charlotte Katakuri adds either-player private Life inspection, top-or-bottom
  routing, and the resulting battle-only power increase.
  OP04 Doflamingo and Issho cover deferred end-turn DON!!/Character choices,
  including paid activation and effective-cost boundaries. Rebecca combines a
  permanent attack prohibition with an included-trait top-2 search and trash
  remainder. Queen adds an aggregate Life-plus-hand threshold and a legal
  conditional draw replacement. Crocodile proves self-caused DON!! return
  provenance while rejecting the same mutation from an opponent's effect.
- Stage queue complete. Next card type: Event.
