# One Piece Card Behavior Inventory

This inventory tracks executable behavior tests by canonical gameplay card.
Alternate art and reprint definitions share a canonical behavior test; catalog
signature tests remain responsible for detecting variant drift.

## October 7, 2026 semantic audit checkpoint

Completion remains unproven. The existing coverage and Grade A gates pass, but
several primary files prove only field placement or turn handoff. Such tests do
not prove every printed clause. Inventory row labels must not be used as a
substitute for command-driven clause audits.

Current inventory labels cover 2,818 canonical cards: 2,533 ability cards marked
verified and 285 vanilla cards.
These counts describe the inventory, not a new claim that every card clause is complete.

Confirmed corrections in this checkpoint:

- OP15-001 Krieg requires at least one friendly Character for its debuff.
- OP15-003, 010, 012, 017, and 023 allow either owner's DON!! while keeping
  donor and recipient ownership equal. Cost-area giving now lets the effect
  controller select the active/rested source mix; OP15-025 and 028 use it too.
- OP15-022 Brook trashes a partial or empty deck and continues its Then clause.
  Its deferred defeat remains due after the deck is refilled. OP03-043 Gaimon
  retains its distinct full-payment requirement for If you do.
- OP15-098 Luffy replaces opponent-caused battle or effect removal, without
  replacing its controller's own effects.
- Grouped optional removal replacements have one accept/decline decision and
  one payment per group. Declined deck movement retains its original ordering
  across other replacement choices.
- OP15-080 Oars checks the full field for Gecko Moria and other Oars cards.
- OP17-043 Ganzui has its missing On Play base-power effect. Battle replacement
  supports its two-card hand-trash payment and rejects an insufficient hand.
- EB04-048 Rob Lucci now has its paid On Play draw and dynamic per-five-card
  power/cost bonuses. The imported cost sign was corrected against the
  [official card list](https://en.onepiece-cardgame.com/cardlist/?freewords=EB04-048).
- Full-field grouped plays now pause for each replacement choice, retain
  active/rested assignments, and finish before resolving the played cards' On Play.
- Five OP17 Character cards gained missing On Play clauses; six Events gained
  missing Main/Counter blocks and distinct-name/current-turn K.O. conditions.
- Nineteen Life Trigger blocks and ST27-005's On K.O. block gained command proofs.
  A catalog guard now checks that printed timing headings have executable blocks;
  it supplements, rather than replaces, clause-specific behavior tests.
- Giving multiple DON!! publishes one Garp reaction per DON!!, including
  effect-based transfers and activation costs, after the parent effect finishes.

- Field auras no longer activate from hand. Ace, Kaido, and Xebec use fixed
  Counter values, with no stacking; Xebec requires at least one Character.
- Marco and Kyo gained their missing removal replacements. Kaido's K.O.
  remains bound to the Character selected for effect negation.
- ST15-005 Ace has conditional Rush and self-only, once-per-turn protection.
  EB04-057 Vegapunk protects yellow Scientist Characters at low Life.
- ST32-002 Oden applies its printed base-cost limit. OP16-058's Counter
  can target a Buggy Leader as well as a Buggy Character.
- Cracker gained its unbracketed Life Trigger. Streusen now orders the looked
  cards and chooses top or bottom. Shanks can choose either printed cost.
- Players can choose among eligible K.O./field-removal replacements, including
  physical Rosinante copies; compulsory Thatch replacement keeps priority.
- Audited mandatory self-rest/self-activation loops now finish as a draw.
  Optional choices and finite repetitions do not cause a false draw.

Source checks: official OP15 FAQ Q1170, Q1172–1193, Q1196–1198, Q1239 and
OP02 FAQ Q270; fixed Counter FAQ Q1339/1340, Q1391 and Q1419; Shanks/Streusen/Cracker
FAQ Q1372, Q1388 and Q1409; Comprehensive Rules 1-3-2, 4-10-2 and 4-11-2.

Validation: 2,309 engine files / 8,472 tests pass (3 opt-in automated-game
checks skipped); 101 parser files / 1,237 tests pass; 4 card-package files /
26 tests pass. All 138 changed TypeScript files pass scoped format, lint, and
type checks; the engine bundle and declarations build successfully. An earlier
opt-in run completed 3,280 bot matches, before the final Counter and replacement
changes; it is not claimed as validation of the final checkpoint.
No simulator UI files changed. The root check still has unrelated existing
formatting failures; this checkpoint does not claim a clean repository-wide gate.

Checkpoint feedback: timing-heading checks exposed omitted Trigger/Main/Counter
blocks on cards whose other clauses already had tests. The guard now also
recognizes unbracketed Trigger headings, which found OP17-104. The proof grader
now recognizes public fluent play/attack/decline helpers and literal parameterized
tests; it still requires a matching opener and a strict outcome for a decline.

Remaining work: audit weak primary tests against all printed clauses, confirm
new-set card behavior with official FAQs, and implement the documented missing
infinite-loop cases outside audited deterministic rest/active cycles. No
all-names Leader exists in the current catalog for a direct Oars Q1239 scenario.


### Follow-up qualifier audit

- OP16-015's discount applies only in hand, with a Leader name containing Ace.
- OP16-060 returns only active DON!! as printed; rested and attached DON!! cannot pay.
- OP16-033 Morley's replacement protects itself, not another friendly Character.
- OP05-001 Sabo's power loss stays bound to the saved Character.
- OP15-024 Usopp distinguishes Leader/Character effects from Events; mixed
  Character/DON!! rest prompts apply the same protection filter.
- OP15-064 Kotori and OP15-072 Hotori return two DON!! instead of resting them.
- A real Hawkins-to-Zoro nested replacement test passes without engine changes.

Follow-up validation: all 2,309 engine files / 8,485 tests pass (3 opt-in tests
skipped). All 21 changed TypeScript files pass scoped checks; the engine bundle
and declarations build. Official card-list text confirms Usopp's source-type
restriction and Kotori's DON!! return cost.


### Target, cost-timing, and loop audit

Kid OP10-099 keeps Blocker bound to the reactivated Character; choosing no
Character grants no Blocker. Shu OP11-088 reacts to Slash Characters, not Leaders.
The OP15 pass repairs missing cost, name, power, and DON!! filters, conditional
power, optional recovery, and unprinted Blocker. Named-Leader boundary tests use
explicit synthetic alternateNames fixtures and restore metadata; they do not
claim that an all-name Leader exists in the catalog.

The OP16/17 pass binds Yamato's Rush to the Character played from trash, rejects
an empty-field condition where required, permits the opponent's qualifying
Character for Otama, and applies printed conditions after payment. Decline and
payment-without-effect paths have public command tests.
Blenheim OP17-012 now plays only cost-1 Whitebeard Pirates cards from hand;
public tests include both Character and Stage cards, exclusions, and skipping.

The proof selector now recognizes numbered subject filenames such as
`OP15/stages/057.test.ts`. Fixture imports no longer replace those primaries.
This exposed two weak OP17 tests, which now check actual card clauses and
found Blenheim's missing filters.

Optional-loop declarations now work for audited deterministic rest/active
cycles, including two-player order, smaller-count stopping, invalid values,
restart restrictions, and snapshot continuation. Numeric input passes through
the existing server protocol; bots can stop the loop. Other loop forms remain
unimplemented or unverified. Simulator UI files are unchanged.

Validation: all 2,313 engine files / 8,534 tests pass (3 opt-in tests skipped);
all 7 server-adapter files / 30 tests pass. Parser tests (1,237) and card-package
tests (26) pass, as do scoped format/lint/type checks and the engine build.

### OP17 replacement and Event follow-up

Zoro OP17-095 now protects friendly Characters, including itself, from opponent
effect removal by returning three chosen trash cards to the deck bottom in the
chosen order. One payment protects a simultaneously removed group (official
FAQ Q1401/1402); decline, insufficient trash, battle K.O., and own-effect removal
remain distinct. Named targets on OP17-055 and OP17-115 now include Leaders.
Kundali Dragon Swarm OP17-077 checks its Animal Kingdom Pirates Leader condition
after paying both Main costs; its Counter works with any Leader.

Kong Gun OP17-098 has a real positive test using Shinobu's cost increase on
Momonosuke. Its earlier claim that cost 12 was unreachable was false. Tests
also cover Counter behavior and actual affordable optional declines. Zoro's
conditional +3000 power is now proven with the same real cost increase and
its end-of-turn expiry. The proof checker accepts exact quoted card IDs in
subject-bound play commands and still rejects an unrelated fixture card.

Validation: all 2,314 engine files / 8,555 tests pass (3 opt-in tests skipped).
All 11 changed TypeScript files pass scoped format, lint, and type checks.
This follow-up changes card definitions, tests, and this inventory only.

### OP16 clause audit and replacement-process follow-up

The bounded Character audit compared 42 definitions in OP16-001–055 (excluding
four previously repaired cards) and 31 in OP16-061–098 (excluding two previously
repaired cards). This is printed-structure evidence with focused behavior tests
for corrections, not full scenario proof for every card in those ranges.
Thatch and Kin'emon now keep field-only or hand-only cost changes in the printed
area. Both Mr.2 cards copy the opponent Leader's current power. Sakazuki's On Play
DON!! return is optional. Kuzan and Yamato tests now execute their Unblockable
attacks instead of relying on field placement or turn handoff.

OP16-019 now plays only 8000-power Whitebeard Pirates Characters. OP16-020 pays
its reveal cost and rejects lower-power cards; its Counter test now submits the
power target and proves the battle result. Hammer Rifle counts a Luffy Leader
for its field-name condition. OP16-058 includes a Leader with the required name;
this last boundary uses a temporary, explicit synthetic alternateNames fixture,
not a claim that such a Leader currently exists in the catalog. Official card
list text was checked for all four Events.

The additional 15-Character audit within OP16-101–119 repairs Devon's current-
power copy and Moria's missing Absalom cost cap. Moria's test now rejects its
Trigger above the Life threshold instead of asserting an unprinted Continuous
ability. Simultaneous named-card play ordering remains an investigation: the
current queue defers On Play, so sequential choices alone do not prove a bug.

Repeated current/base-power defects led to a parser repair. It now emits
`copyPower` for current Leader power and retains `setBasePowerFrom` only when
the source text explicitly says base power. Parser regressions distinguish both
forms and preserve Shuraiya's shared once-per-turn identity. Shuraiya and Sanji
receive the same current-power definition repair; Vista's explicit base-power
behavior is retained.

The engine now records which physical source/effect replacements have applied
within one replacement process. The record persists through prompts and JSON
snapshots; independent actions and triggered effects get a fresh process.
This prevents self-replacing rest/K.O. chains from applying the same replacement
again. Cross-player source ordering and general loop detection remain separate
unfinished requirements.

Validation: 2,315 engine files / 8,573 tests pass (3 opt-in tests skipped),
101 parser files / 1,239 tests pass, 4 card-package files / 26 tests pass,
and 7 server-adapter files / 30 tests pass. All 42 changed TypeScript files
pass scoped format, lint, and type checks. The engine build and full server-
adapter typecheck pass. No UI files changed.


### OP17 clause audit and replacement ordering follow-up

Two bounded audits inspected 35 earlier and 40 later OP17 Character definitions,
excluding previously repaired cards. This is printed-structure evidence, with
command tests for confirmed defects; it is not full scenario proof for 75 cards.
Newgate (040) gains its paid, shared-once-per-turn Leader battle bonus on either
player's attack. Kaido (042) applies -3000, rather than +3000, after revealing the
required Rocks Pirates cards. Kaido (062) adds an active DON!! before reactivating
one. Mont-d'or (111) must reveal two cards with Trigger before its two-target K.O.
Ga Ha Ha Ha (017) already applied -2000 correctly; its imported base and English
text now match that behavior. Event 037's former turn-handoff placeholder is
replaced by Counter battle tests for Leader, Character, and Stage rest payments,
plus declining payment. DON!! payment is covered separately after the Event
cost is paid. Shared rest-card costs now include active DON!!, as confirmed by
[official OP14 FAQ](https://www.onepiece-cardgame.com/rules/qa.php?tab=cardqa&type=1)
Q1119 and Q1124; tests cover all-DON!! and mixed field/DON!! payments.
Duplicate and wrong-owner payment rejection also exposed a shared prompt bug:
rejected submissions now keep the choice pending so a valid retry can resolve it.
Two Event tests that submitted invalid empty remainder orders now explicitly
decline the search and order all remaining cards; Buddha Sengoku still pays
its later hand trash. They no longer rely on rejected choices disappearing.

Replacement scans now include both players. Choice groups follow turn-player
then opponent order, declined groups fall through, and multiple rest replacement
sources can be chosen. Tests cover battle payment ownership, independent grouped
siblings, and reconsidering declined candidates after a transformed result.
The six OP17 Leaders and Stage 057 were also checked against official card
text, without a new definition defect. Luffy (079) now has real-card Blocker
battle proofs at cost 16, exactly 12 after Sabo, and below the threshold.
Linlin (099) no longer has the stale inventory label "unstructured".

Mandatory affected-card priority remains a pre-existing interpretation needing
clearer source evidence; optional replacement choices do not gain that priority.

A real Moria/Perona/Absalom probe confirms a separate ready-effect ordering gap:
the owner cannot choose Perona's cost reduction before Absalom's K.O. This is now
recorded as a required engine repair, rather than an unreachable rules case.
General loop forms outside the audited deterministic family also remain open.

The parser now retains a field card's paid observation of its Leader attacking
or being attacked. It emits both triggers, the Leader target filters, trait
condition, optional trash cost, and shared once-per-turn identity; regeneration
no longer drops Newgate's second ability. Existing source-bound Leader parsing
has a control regression.

Validation: 2,317 engine files / 8,605 tests pass (3 opt-in tests skipped),
102 parser files / 1,243 tests pass, 4 card-package files / 26 tests pass,
and 7 server-adapter files / 30 tests pass. All 28 changed TypeScript files
pass scoped format, lint, and type checks. The engine build and server-adapter
typecheck pass. This goal now changes 105 card definitions. No UI files changed.


### EB03 clause audit and simultaneous effect ordering follow-up

A bounded audit inspected 35 EB03 Character definitions within 002–040 against
official card text and relevant FAQs Q1072–1085. Uta (003) now requires an Uta
Leader for both its draw and its later play, as Q1072 specifies. The other 34
had no further demonstrated clause defect in this pass; this is not exhaustive
scenario proof. All six EB03 Event definitions were compared with official text.
Thanks for the Treat (038) now requires at least one Character for its only-GERMA
condition, as Q1084 specifies. The negative test confirms that an empty field
still permits paying the pre-colon cost but receives no DON!! afterward.

Source: [official EB03 FAQ](https://asia-en.onepiece-cardgame.com/rules/qa.php?freewords=EB03&tab=cardqa&type=1).

The remaining 19 EB03 Characters (041–048, 050–059, 061) were also compared with
official text and FAQs 1086–1093. The gameplay name of 061 is now Uta; its art
variant no longer prevents Tot Musica from paying a named-Uta rest cost. A
35-Character EB02 audit within 001–046 adds Sanji & Pudding's missing two-DON!!
return threshold, repairs Nico Robin's imported minus sign, and expands Gaimon
and Klabautermann name checks to the printed full field. The last two use explicit
synthetic named-Leader boundaries alongside existing real-card controls.

Parser regressions preserve Uta's Leader condition across its draw/play sequence
while keeping independent later conditions separate. All three supported
only-type-Character wordings now require a nonempty field; explicit absence
conditions remain distinct.

The engine now records ready auto effects separately from the active effect's
actions. It freezes each ready group, gives its original turn player and then
its original opponent their choices, and defers newly triggered groups. A
selected effect completes its costs and actions before its siblings; eligible
Life Triggers interrupt damage and finish before damage continues. Saved matches
retain these choices. Effects whose costs are enabled by an earlier sibling
remain available, while a source leaving and reentering loses its old effect.
The generic choice replaces the former Moria-specific order prompt.

Tests now choose actual ready effects rather than relying on queue insertion
order. The former direct-queue damage and Bonney tests now use public commands;
Bonney's own-turn Life Trigger case uses Robin's real On K.O. damage. Synthetic
multi-damage coverage is labeled as such.

Validation: 2,319 engine files / 8,621 tests pass (3 opt-in tests skipped),
104 parser files / 1,250 tests pass, 4 card-package files / 26 tests pass,
and 7 server-adapter files / 30 tests pass. All 53 changed TypeScript files
pass scoped format, lint, and type checks. Engine and card builds pass;
the server-adapter typecheck was also run without its task cache. Independent
review verified the ready-group and damage probes. This goal now changes 114
card definitions, including removal of obsolete grouped-play order flags.
No simulator UI files changed. Next bounded card audit: EB02-047 onward.

### EB02 completion audit and forced cross-player loops

The remaining ten EB02 Characters (047–049, 052–057, 061) and all twelve Events
were compared with official text and relevant FAQs Q873 and Q878–882. Enel (052)
now applies its post-cost Life condition to both Life gain and power (Q879).
Event 059 requires yellow on both named-Sanji and Straw Hat Crew branches (Q881).
Luffy (061) returns only active DON!! for its printed cost; tests reject using
rested or attached DON!! instead.

A follow-up of only-type field conditions repairs Leader EB02-010 and Event
OP13-097. Both need at least one Character. The Leader's whole post-cost effect
is conditional: returning two DON!! on an empty or nonmatching field gives
neither reactivation nor power (Q860). The Event can pay its cost on an empty
field but cannot K.O. (Q1059). Character-source versions were also inspected;
the source itself supplies their required Character while its effect is valid.

Sources: [official EB02 FAQ](https://asia-en.onepiece-cardgame.com/rules/qa.php?freewords=EB02&tab=cardqa&type=1),
[official OP13 FAQ](https://asia-en.onepiece-cardgame.com/rules/qa.php?freewords=OP13-097&tab=cardqa&type=1).

The mandatory loop guard now shares the optional guard's exact single-target
rest/activation audit. A synthetic public-command cross-player loop that never
returned before the change now ends in a draw after a proven repeated state.
Finite once-per-turn effects and target choices do not cause a false draw.
There is no arbitrary iteration limit. No actual catalog infinite loop was
established in this pass: the eight when-rested definitions and the DON-giving
reaction were checked, and their apparent feedback was finite or absent.
Other action families and loops with unresolved player choices remain outside
this automated proof.

Validation for this batch: 2,320 engine files / 8,629 tests pass (three opt-in
tests skipped); 105 parser files / 1,255 tests pass; four card-package files /
26 tests pass; seven server-adapter files / 30 tests pass. All 21 changed
TypeScript files pass scoped format, lint, and type checks. Engine and card
builds and an uncached server-adapter typecheck pass. Independent review found
no false draw in the bounded loop family.

### Conditional revealed-card placement and EB01 audit

EB01-029 now keeps a revealed card on top when its cost is below four, as
specified by [official FAQ Q640](https://asia-en.onepiece-cardgame.com/rules/qa.php?freewords=EB01-029&tab=cardqa&type=1).
The existing successful reveal and Life Trigger tests still pass. A new public
Counter test fails before the repair and proves the retained physical card is
drawn next. The reveal action can specify a final position inside its condition;
failed conditions use the fallback position. The parser preserves that shape.

The bounded audit found no further confirmed mismatch in EB02 Stages 009, 041,
060 or EB01 Characters 002–008, 012–018, 022–027, 031–037. Four vanilla Characters
were excluded from effect testing. These source and existing-test reviews do not
prove every interaction or duration boundary.

Fresh official English and Japanese rules v1.2.1 retain the ambiguous replacement
source-priority phrase in 8-1-3-4-2. They do not independently confirm affected-card
priority or the mandatory-only interpretation. No official competing-replacement
example was found; this remains an explicit unresolved interpretation.

Validation: all 8,630 engine tests and 1,256 parser tests pass; three opt-in
engine tests remain skipped. All 30 server-adapter tests, six-file scoped
checks, engine/card builds, and uncached adapter typecheck pass.

### EB01 audit completion and conditional reveal follow-up

The remaining 17 EB01 Characters (041–049, 052–058, 061) and all 17 Leaders,
Stages, and Events were compared with official text and applicable FAQs. Six
EB01 Characters across the set are vanilla. This completes the bounded EB01
clause audit; it does not prove every cross-card interaction. Added public FAQ
boundaries cover Chambres with no Characters (Q634), Hannyabal with an empty
DON!! deck (Q635), and Champion Rifle with a nonmatching Leader (Q639).

Four Bentham definitions (EB01-061, OP01-084, OP02-064, OP04-069) now use the
official name `Mr.2.Bon.Kurei(Bentham)`. Their extra space before the parenthesis
incorrectly bypassed OP14-091's same-name exclusion. All four public battle-K.O.
regressions failed before the correction; an eligible differently named card
remains playable after it.

Current Comprehensive Rules 4-10-1/2 also confirm the failed-reveal boundary
for OP04-011 Nami and OP07-048 Doflamingo: an unmet condition prevents the later
bottom-deck instruction. Both negative command tests reproduced the defect.
Successful Nami reveals still grant power and go to the bottom; Doflamingo's
eligible card goes to the bottom if its optional play is declined. Both parser
families now retain the same conditional placement.

Sources: [official EB01 FAQ](https://asia-en.onepiece-cardgame.com/rules/qa.php?freewords=EB01&tab=cardqa&type=1),
[current official comprehensive rules](https://en.onepiece-cardgame.com/pdf/rule_comprehensive.pdf?20260828=).

Validation: 8,638 engine tests pass (three opt-in tests skipped by default),
1,256 parser tests pass, and 26 card-package tests pass. All 19 changed
TypeScript files pass scoped checks; the card package builds. The extended
automated-game run is still in progress and is not counted as completed proof.

### Whole-sequence conditions and grouped removal

A current-rule audit found repeated misuse of “Then” as an escape from an unmet
preceding “If”. Twenty definitions now gate their complete following sequence.
Printed costs remain payable before post-colon conditions. Public negative
scenarios reproduced the defects, including a paid self-trash activation at
higher Life, wrong Leaders, missing field conditions, and opponent hand limits.
A successful Chopper condition remains satisfied for its following mill even
when the preceding discard reduces the opponent's hand below the threshold.
Law's missing-field negative already resolved correctly because its play needs
the returned Character; a regression records this without changing its definition.

The parser now applies the general rule instead of action-specific exceptions.
It preserves nested reveal/play identity, independent later conditions, and
post-cost evaluation. Independent review found and fixed a payment boundary:
deck-trash and shuffle payment processing must remain outside the later gate.
Public parser regressions cover both payment forms.

Single removal instructions containing two separately limited target groups
now collect both choices before moving cards. The engine reuses its existing
replacement and owner deck-order processing for one combined movement. The
public proofs cover Alvida's physical bottom order after snapshot restore,
duplicate selection rejection with retry, and one replacement payment or decline
for Lucci's joint K.O. Parser output preserves the same target groups.
Unsupported target groups now stop with a capability record and the existing
judge prompt before movement. Typed fault-injection tests cover initial selection
and the final recheck; current catalog groups use supported filters.

Validation: all 2,320 engine files pass (8,662 tests; three opt-in tests skipped),
107 parser files pass (1,263 tests), four card-package files pass (26 tests),
and seven server-adapter files pass (30 tests). The 83 changed TypeScript files
pass scoped checks, the engine and cards build, and the adapter passes an
uncached TypeScript check. The first broad run exposed a missing explicit
EB04-059 optional Life-payment decline proof; that proof and the full rerun pass.
Across this goal, 156 canonical card definitions have changed. No simulator UI
files changed.

The local rules sources now match official v1.2.1, including all 481 numbered
entries. Both text copies match the current PDF after typography normalization.
The skill harness still reports 81 unrelated baseline issues (80 broken links
and missing Alpha Clash frontmatter); none concern these rule files.

The opt-in stress run completed 4,000 games with zero illegal commands or stuck
games, but exceeded its five-minute test limit. This was a failed test gate,
not a passed stress test. The opt-in timeout now matches the larger benchmark;
the fresh run now passes: both automation files, all 13 tests, in 809.70 seconds.
This includes the four 1,000-game strategy pairings and extended heuristic
benchmark. The stress assertions require zero illegal commands and fewer than
50 stuck games; successful-run output does not expose an exact stuck count.
The prior run's zero-stuck count is not claimed for this new run.

### Follow-up gaps found at checkpoint e99286468d

A read-only follow-up audit found three concrete gaps after this checkpoint:

- OP05-087 Hakuba pays its Character K.O. cost through direct removal, bypassing
  Kyros replacement. The official OP05 FAQ, page 6, permits resting the Leader
  or Corrida Coliseum instead; Kyros remains and Hakuba must not apply its -5
  cost effect because the printed cost was not paid. Rules 8-3-1-7 and 10-2-13-5
  govern payment replacement and once-per-turn consumption. Other catalog
  `koCharacter` cost consumers are OP06-083, OP14-080, and OP14-079.
- EB03-049 places its hand Character before collecting the trash Character
  choice. One printed play instruction must collect both groups before placement;
  full-field rule removal must not manufacture the second group's candidate.
- `validateDeckForFormat` accepts fractional quantities and negative quantities
  that cancel other entries. The public validator needs a positive integer
  quantity check before such entries can establish a legal deck.

These defects were queued at e99286468d and are repaired by the next batch below. The EB03 bounded
read-only audit covered all 54 Characters (three vanilla), one Leader, and six
Events. Besides EB03-049 and the repaired 021/052 clauses, no further concrete
text/structure defect was established; independent boundary tests remain useful.

### Replaced K.O. costs, active grouped play, and deck quantities

K.O. activation costs now use the existing replacement pipeline with a saved
payment completion item. Kyros can replace Hakuba's cost K.O.; Hakuba's -5
cost effect then does not resolve. Mandatory Thatch replacement draws but also
fails to pay the original K.O. cost. The success record tracks actual original
K.O.s, not whether a Character reached trash. Public tests cover accept/decline,
invalid input retry, snapshot reload, and Oars paying by K.O.ing itself. A
clearly marked synthetic once-per-turn variant proves consumption on replaced
payment; real Moria/Crocodile activations retain repeated-use rejection. All
four current catalog `koCharacter` cost consumers have focused coverage.

EB03-049, OP14-084, and OP16-105 now select their complete groups before
placement. The shared grouped-play action supports any number of all-active
groups while retaining the existing mixed active/rested pair. Full-field tests
prevent a rule-trashed Character from becoming a newly selected candidate and
preserve physical identity after snapshot reload. Moria's three-name group
limits and both choices of subsequent On Play order pass. The parser preserves
two/three-group clauses and a following Then action without merging separately
stated play instructions.

Deck validation now rejects zero, negative, fractional, and unsafe quantities.
Three public red/green regressions cover fractions totaling 50, negative copy
cancellation, and a zero-count Leader used to bypass the real Leader's colors.
Additional EB03-051/061 tests prove the FAQ continuations after declining or
finding no eligible K.O. target, and after finding no own rested DON!!.

Independent review verified grouped-play and payment continuation behavior.
Validation: 2,321 engine files pass (8,675 tests; three opt-in tests skipped),
108 parser files pass (1,267 tests), four card-package files pass (29 tests),
and seven adapter files pass (30 tests). All 25 changed TypeScript files pass
scoped checks; engine/card builds and the uncached adapter typecheck pass.
The full rerun retains both owner-chosen simultaneous On Play order cases after
updating their stale selection commands. The goal has changed 158 canonical
card definitions; simulator UI files remain unchanged.
The earlier enabled stress/heuristic run passed at e99286468d; it is not a new
stress run for this batch. General unaudited loop forms and remaining card
clause audits remain open. Next bounded catalog audit: EB04.

### EB04 clause audit and named DON!! costs

The bounded audit inspected all 61 EB04 definitions: 47 Characters (no vanilla
cards), one Leader, twelve Events, and one Stage. Official card pages verified
the changed printed clauses. The repairs cover Bonney's optional Life draw,
Smoker & Tashigi's Navy-only Leader base power, Ginny's optional rest payment and
both-field Character count without an invented once-per-turn limit, Emet's
Character-only attack condition, Rayleigh-only DON!! recipients, named Leader
Counter targets, and Hawk Gatling's top-or-bottom Life payment. Shared zone
counting now supports both players rather than treating that scope as opponent.

The named-DON!! family audit also repaired OP12-016/017/019. Unblockable stays
bound to the physical DON!! recipient, including an automatically paid single
recipient. The search preserves red Event OR cost-3-or-more Character as
independent alternatives. Parser regressions cover named costs, Counter target
alternatives, physical-recipient binding, and optional Life choices. OP12-039
now restricts its Leader reactivation to Roronoa Zoro.

Bottom-deck activation costs now use the same saved original-payment result as
K.O. costs. Plague Rounds offers Zoro's removal replacement to the affected
opponent. A replacement prevents Ice Oni's play; previously paid discard is not
refunded. Public tests cover both choices, owner, invalid retry, and snapshot.
Independent review found no concrete defect in this bounded payment scope.

Behavior coverage was strengthened for EB04-007's power, threshold, attack
restriction and Rush: Character, EB04-049's Life Trigger, SWORD Main attack
permission and expiration, Lulucia's actual power changes, and the repaired
negative/decline branches. These checks and the definition audit do not prove
all cross-card interactions. General loop cases and other catalog clause audits
remain incomplete. Next bounded catalog audit: OP01.

Validation: 2,322 engine files pass (8,703 tests; three opt-in tests skipped),
110 parser files pass (1,272 tests), four card-package files pass (29 tests),
and seven adapter files pass (30 tests). All 41 changed TypeScript files pass
scoped checks; engine/card builds and an uncached adapter typecheck pass.
The skill harness retains the same 81 unrelated baseline issues. No new stress
run is claimed beyond the enabled run at e99286468d. Across the goal, 167
canonical card definitions have changed. No simulator UI files changed.

### OP01 clause audit and reaction boundaries

The bounded audit compared all 121 canonical OP01 definitions with their printed
clauses: 93 Characters (16 vanilla), eight Leaders, and twenty Events. The
Character audit consulted official card pages and the set FAQ. Existing tests
cover the primary Leader/Event clauses; new negative branches prove the repairs.
Luffy's Strike battle protection now excludes Leaders. Kaido and the related
OP03-076 Rob Lucci trigger only for an opponent's K.O., including when a player
pays an own-Character K.O. cost. Kanjuro now has explicit attack-trigger target
and DON!! boundary tests. Crocodile can decline a draw and accept a later Event's
draw in the same turn.

The reaction-family audit also corrected OP16-041 Buggy's missing DON!! x1,
removed-card owner, and Impel Down type gates. The previous positive test had
silently relied on the missing DON!! condition. Public negative tests now prove
all three gates, and the positive test attaches DON!! through the public command.
Declining optional activation leaves a later removal available in the same turn.
A parsed-effects integration test also proves battle K.O. dispatch for Buggy;
parser metadata alone had missed that boundary.

Reject's damage option checks the opponent's one-Life condition once around
both damage and the following own-Life addition. Failed conditions at zero or
two Life skip both actions. The K.O. option retains its follow-up. Parser tests
preserve conditional choice sequences and the shared Then, while retaining
OP05-096 and OP15-054's different continuation structures.

A shared expiry helper now applies the opponent-turn boundary in sixteen
modifier creation paths. Effects applied during the opponent's turn expire at
that turn's end. Galdino's attack restriction and Oinkchuck's cost bonus have
public regressions. Labelled synthetic Counter fixtures test power/base-power
variants; an extra-turn test confirms an own-turn bonus lasts through the next
opponent's turn. Existing seat-aware cleanup is retained.

Sources: [OP01 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op01.pdf?20240405=),
[OP06 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op06.pdf?20240419=),
[Buggy's official text](https://asia-en.onepiece-cardgame.com/cardlist/?freewords=OP16-041).
The replacement-priority review found no new authority to resolve mandatory
Thatch versus optional Rosinante ordering; no speculative change was made.
The audit is not exhaustive interaction proof. Remaining examples include
Smiley's hand changes during Counter, Bao Huang's simultaneous private choices,
and Shanks's Blocker eligibility after power changes. General loop families and
further set audits remain open. Next bounded catalog audit: OP02.
Parser review found one existing source-layout limit: a final bullet’s inline
Then can be classified as shared. No affected catalog card was confirmed;
flattened OP05-096 does require the shared interpretation. This audit does not
claim general recovery of lost bullet formatting.
Self-improvement: no new skill rule; existing trigger-provenance guidance applied.

Validation: 2,324 engine files / 8,720 tests pass (three opt-in tests skipped),
113 parser files / 1,283 tests pass, four card-package files / 29 tests pass,
and seven adapter files / 30 tests pass. All 23 changed TypeScript files pass
scoped checks. Engine/card builds and an uncached adapter typecheck pass.
The enabled stress run remains the earlier e99286468d checkpoint, not this
revision. Across the goal, 172 canonical definitions changed. No simulator UI
files changed.

### OP02 clause audit and search-count choices

The bounded OP02 audit covers 121 canonical cards: 93 Characters (20 vanilla),
eight Leaders, sixteen Events, and four Stages. Official card pages and the
set FAQ were compared with structured clauses and existing public tests. The
non-Character audit found Kin'emon's next-play discount family defects; the
Character audit found Dadan's missing optional look count.

Dadan now asks for zero to five cards before exposing their contents. The count
is capped by the remaining deck, and zero does not use the full-deck-search
sentinel. Public tests cover partial/full/zero selections, short decks, invalid
retries, saved-state continuation, and the following draw. The parser preserves
this option only when the text says to look at up to a number of deck cards.

Kin'emon and Rosinante now save a player-scoped next-paid-play discount. It
applies to eligible cards drawn after activation, and is consumed only by the
matching paid play. It does not change a card's cost characteristic, widen Law's
effect-play limit, or disappear after an effect play or an unrelated paid play.
Public tests cover both Leaders, actual payment, and saved-state continuation.
Kin'emon also covers a full field, invalid replacement retry without payment,
and restoration before the valid replacement pays exactly the discounted cost.

Added FAQ coverage proves Nami's attack search succeeds, Luffy gains Double
Attack after paying even with no return target, and Uta's snapshot bonus does
not include Characters played later. These are coverage additions, not claimed
repairs to those three definitions. Remaining interaction examples include
Inuarashi's non-K.O. removal protection, Inazuma's live hand-size changes during
Counter, Isuka's no-DON/effect-K.O. exclusions, and Hina's current-attacker case.
The audit does not prove every cross-card combination. Next set audit: OP03.

The queue now stops immediately when a rule defeat occurs during an action.
A synthetic mandatory self-K.O./replay cycle is recognized as a draw only in
the audited deterministic family. A finite draw variant instead loses when
its deck empties, before its remaining K.O.; optional and target choices remain
available. Generation checks preserve source identity across saved states.
Moving loops with replacements, modifiers, delays, battle state, or complex
continuations remain outside the detector. No real catalog unavoidable loop
is claimed. Thirty old neutral scenarios in twenty-seven files gained one
unused bottom card so their intended follow-ups no longer occur after defeat.

Sources: [official OP02 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op02.pdf?20240405=)
and the official OP02 card list. General loop cases and later set clause audits
remain open. Existing rules/test guidance was reused; no new skill rule was added.

Validation: 2,325 engine files / 8,736 tests pass (three opt-in tests skipped),
114 parser files / 1,285 tests pass, four card-package files / 29 tests pass,
and seven adapter files / 30 tests pass. All 48 changed TypeScript files pass
scoped checks. Engine/card builds and an uncached adapter typecheck pass.
No new stress run is claimed beyond e99286468d. Across the goal, 173 canonical
card definitions changed. Simulator UI files remain unchanged.

### OP03 clause audit and exact trait membership

The bounded OP03 audit covers all 123 canonical definitions: 89 Characters
(15 vanilla), eight Leaders, 23 Events, and three Stages. Curiel's printed
played-turn Leader prohibition is separate from its DON-gated Rush. The engine
now evaluates the permanent restriction when validating an attack. Marco's
Event payment and replay are separate optional decisions; paying the Event
cost does not force the physical Character to return from trash.

Brannew exposed a shared data/filter defect: ordinary Navy membership was
implemented with substring matching to compensate for flattened compound type
metadata. That also admitted Former Navy and Neo Navy. Official slash-separated
card types are the source for normalization; exact type filters remain distinct
from printed text that explicitly says a type includes a string. The repair
covers the Navy selector family, rather than adding exclusions to Brannew alone.

Helmeppo's cost setting is an absolute duration-bound modifier, not a snapshot
subtraction from the currently reduced cost. Public tests remove Kuzan after
setting both a one-cost and six-cost vanilla Character to zero, resume from
saved state, and prove turn-end expiry. Arlong OP11-023 is a separate imported
sign error: its printed minus-three hand discount is additive and costs four
DON when its conditions hold. Neither effect changes printed base cost.
Later positive-modifier ordering against a cost setting lacks a direct ruling
in the checked FAQ; the Kuzan departure cases are the verified boundary.

Additional command proofs cover Blueno playing a companion K.O.d simultaneously,
Kingbaum's last-Life payment exclusion, and Cracker retaining allocated Double
Attack damage after its Life condition stops being true. Ikoku Sovereignty adds
Life before the second damage. Leader proofs cover Kuro's active cost-five/six
boundary, Katakuri's skipped/empty and face-up Life choices, Ace's Character-target
negative and battle expiry, and Nami's Character-K.O. negative. Event condition
negatives include a non-Ace Flame Emperor and Buzz Cut Mochi at equal/more Life.

Sources: [official OP03 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op03.pdf?20230623=),
[current errata](https://en.onepiece-cardgame.com/rules/errata_card/), and official
card-list records. Historical Ace and damage-dealt timing FAQ answers differ
from the current comprehensive rules 7-1-1-3 and 8-6-2/8-6-2-1. Current rule
processing is preserved; the old FAQ is not used to reverse it.

The exact-type guidance replaces a prior overbroad substring recommendation.
The harness check still reports the same 81 unrelated baseline issues.
Validation: 2,326 engine files / 8,758 tests pass (three opt-in tests skipped),
116 parser files / 1,293 tests pass, four card-package files / 29 tests pass,
and seven adapter files / 30 tests pass. All 161 changed TypeScript files pass
scoped checks; engine/card builds and an uncached adapter typecheck pass.
The new helper also retains the utility package's existing test. Independent
reviews found no concrete defect in the cost-setting or exact-Navy repair.
The broad run found one stale rule fixture using Curiel as unconditional
Rush: Character; it now uses Izo, which prints that keyword.

The Navy repair updates 43 selectors in 38 definitions and normalizes verified
metadata, with 115 affected definitions across that family. Across the goal,
284 canonical definitions changed. No new stress run is claimed beyond
e99286468d. No simulator UI edits. General loop support and further card audits remain open;
the next bounded set audit is OP04.

### OP04 clause audit, complete type normalization, and removal selection

The bounded OP04 audit covers all 119 canonical definitions: 93 Characters
(eight vanilla), six Leaders, 19 Events, and one Stage. Added command proofs
cover Karoo's shortage of rested DON, Sugar leaving before its pending effect,
Rebecca's hand boundary and declined search, Queen's draw/Life choice,
Doflamingo's zero selection, and Spiderweb reactivating an attacked Character
without cancelling the battle.

Chopper exposed the next exact-type defect: Animal Kingdom Pirates was accepted
as Animal. The catalog now uses official separated types for all 2,376 canonical
cards with type metadata. The audit manifest in
[`data/trait-normalization-audit.json`](data/trait-normalization-audit.json)
records 795 ordinary selector changes, 124 preserved explicit substring sites,
and 22 card-specific metadata corrections. Generic import normalization uses
verified full strings; card-specific corrections use canonical IDs and known
printing aliases. Unknown strings and unknown suffixes are not guessed.
Parser grammar follows the same distinction for searches, play, conditions,
observers, and costs. Luffy OP01-003 also uses the official plural Supernovas
in its filter and text; the stale singular had relied on substring matching. Earlier checkpoint notes that recommend substring matching
for ordinary type text are superseded by this exact-membership correction.

Official OP04 Orlumbus and OP14-EB04 Crocodile FAQ answers establish that a
protected Character can be selected for a removal effect. The prohibition applies
when resolving the move. Tests now select the protected card and prove survival
for K.O., return to hand/deck, trash, and Life movement. K.O. cost payment still
requires an action that can occur. Rosinante's protection is evaluated for the
whole simultaneous K.O. group before movement, including a saved replacement
prompt after its source leaves. Actual K.O. counts exclude protected cards.

Sources: [OP04 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op04.pdf),
[current OP14-EB04 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op14_eb04.pdf?20260626=),
and [official card types](https://en.onepiece-cardgame.com/cardlist/).
Validation: 2,326 engine files / 8,785 tests pass (three opt-in skips),
116 parser files / 1,300 tests pass, 29 card-package tests, three utility tests,
and 30 adapter tests pass. All 1,491 changed TypeScript files pass scoped checks.
Engine/card builds and adapter typecheck pass. The harness check matches the
81-issue baseline. Independent removal review found no new defect. This
checkpoint changes 1,511 canonical definitions across the goal; it does not
claim a new enabled stress run beyond e99286468d. A separate public probe
found Izo OP01-033 excludes both an already-rested Character and rest-protected
Yonji OP11-046 despite having no active-only qualifier. The next shared repair
must separate rest selection from execution, preserve rest-cost and attack
legality, and avoid rest-trigger events when no state change occurs. General
loop forms and mandatory affected-card replacement priority also remain open.
No simulator UI files changed. The next bounded set audit is OP05.

### OP05 clause audit and action-selection boundaries

The OP05 audit covers all 119 canonical definitions: 91 Characters (seven
vanilla), six Leaders, 18 Events, and four Stages. Hawkins OP05-047 now gates
both draw and power gain on its hand condition, evaluated before the draw.
Amazon OP05-099 cannot offer an impossible Life payment to avoid its fallback.
Both parser branches reproduce the repaired conditions. Pagaya also has a
public opponent-Trigger and once-per-turn proof.

Mary Geoise OP05-097 has a continuous payment discount. It does not reduce the
card cost characteristic seen by Rebecca's effect-play limit. Canonical and
parser-generated Stage proofs exclude four-cost Saturn, retain legal payment
at one DON, and apply the discount to successive paid plays. The new
`paymentOnly` flag is for continuous modifiers; no transient flag behavior is
claimed.

Enel's “when Life becomes zero” condition now uses the Life count at removal.
Ikoku Sovereignty can restore Life before the pending Enel effect resolves;
Enel still adds its Life. Non-last-Life removal does not trigger it. Saved
states retain this event fact across the Life Trigger and effect continuations.
Actual “if” conditions remain live. Existing non-Trigger Double Attack
scheduling is preserved. Sabo's one replacement protects both qualifying
Characters in a simultaneous Kaido K.O.

Rest effects select by printed restrictions, then check whether a state change
can occur. Protected and already-rested cards remain choices, with no false
rest reaction or replacement prompt. Pure and mixed DON choices distinguish
active/rested slots; saved rest replacements retain the remaining selections.
Explicit active-only target text remains restrictive, including consecutive
PRB02-005 Luffy effects. Attack, Blocker, activation costs, and replacement
affordability remain strict. Return-to-deck costs exclude removal-
protected Characters; invalid or duplicate submissions retain the same prompt
and consume no cards. Plague Rounds and Aramaki prove both blocked and valid
payments, including saved-state retries.

Sources: [official OP05 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op05.pdf),
[OP05 card list](https://en.onepiece-cardgame.com/cardlist/?series=569105),
[OP11 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op11.pdf), and current rules
1-3-2-1, 1-3-3, 2-7, 6-5-3-1, and 8-4-4. The set audit does not establish every
cross-card combination. General loop forms, affected-card replacement priority,
and further card audits remain open. The next bounded set audit is OP06.
The mixed-DON continuation proof covers current printed replacements; it does
not establish identity tracking for arbitrary synthetic replacements that also
consume a pending DON pool.

Validation: all 2,329 engine files / 8,827 tests pass (three opt-in tests
skipped). All 118 parser files / 1,304 tests pass. Card-package tests (29) and
server-adapter tests (30) pass. The engine and card packages build; adapter type
checking passes. All 62 changed TypeScript files pass scoped checks. The skill
harness reports the identical 81 baseline issues. Across this goal, 1,513
canonical definitions have changed. No new enabled stress result is claimed
beyond e99286468d. No simulator UI edits.

### OP06 clause audit and official Trigger fields

The OP06 audit covers all 119 canonical definitions: 92 Characters (seven
vanilla), six Leaders, 17 Events, and four Stages. The official card list keeps
Trigger text in a separate field. Comparing only local effect text missed three
whole Trigger clauses: Kamakiri OP06-102, Kawamatsu OP06-103, and Ama no Murakumo
Sword OP06-056. They now have executable Life Triggers, with public damage-flow
proofs for the printed Life thresholds and the Event's two target groups.

Sanji OP06-119 must reveal the top card even when it cannot be played or the
player declines. Its old private-search action hid those cards. The corrected
public reveal preserves optional play and bottom-deck placement of the remainder.
The Character audit compares all 13 official Trigger fields; the Event audit
compares all 16 official Trigger fields, with OP06-017 correctly having none.

Additional public proofs cover Reiju resolving the played Character's On Play
before the pending Leader draw at five cards, Perona's rest branch and once-per-
turn limit, and The Ark Maxim paying its Enel rest cost with a Leader. The
mandatory replacement audit found no runtime defect: Luffy's first effect-K.O.
replacement takes priority over Rosinante; Rosinante remains available afterward.
This does not settle optional self-replacement priority.

A synthetic compulsory self-K.O./replay loop hung when its effect had a true
“your turn” condition. The stationary rest/active loop had the same gap. Both
mandatory detectors now accept fulfilled turn conditions, with the active seat
and controller retained in repeated-state comparison. Child-process watchdog
proofs preserve false-condition, finite-deck, optional-choice, and target-choice
outcomes. Other condition kinds and unaudited action families remain incomplete;
no unavoidable real-card loop is claimed.

Sources: [official OP06 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op06.pdf),
[OP06 card list](https://en.onepiece-cardgame.com/cardlist/?series=569106), and
[official OP10 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op10.pdf).
Validation: all 2,332 engine files / 8,848 tests pass (three opt-in tests
skipped). The full parser suite passes 120 files / 1,311 tests, including regeneration
guards. Both audit writers reject generation that loses an existing or supplied
Trigger. The retained upstream OP06 snapshot omitted the three Trigger clauses;
normal imports skip existing definitions, but audit writes previously could
erase repaired effects when local Trigger metadata was missing. All 22 changed
TypeScript files pass scoped checks. Across this goal, 1,515 canonical definitions have
changed. Card-package tests (29) and server-adapter tests (30) pass. Card and
engine builds and adapter type checking pass. The harness retains its identical
81 baseline issues. The enabled stress/heuristic run at a063d693fd passes all
13 tests across two files in 884.65 seconds, including the four seeded 1,000-game
matchups. This is prior-checkpoint stress proof, not a stress run of OP06 repairs.
The batch asserts zero illegal commands and fewer than 50 stuck games; the
silent successful output does not establish zero stuck games. The next bounded
set audit is OP07. No simulator UI files changed.

### OP07 audit, rest-cost reactions, and starter catalog gaps

The OP07 audit covers 119 canonical cards: 92 Characters (six vanilla), six
Leaders, 19 Events, and two Stages. Separate official Trigger text is included.
Foxy OP07-059 now requires the eligible rested Leader, independently of its
optional Character target. Egghead OP07-117 permits an eligible Character on
either field, as specified by both official English and Japanese text.

Bartolomeo OP07-031's official FAQ confirms that resting a Character as an
effect cost counts as resting it by an effect. Both self-rest and selected-card
rest costs now publish that reaction with the actual effect source. Real
Stainless and The Ark Maxim tests cover both paths; an ordinary attack does
not dispatch the effect-rest reaction.

The Sanji FAQ references ST10-001 Trafalgar Law, which was absent from the
catalog. It is now implemented with a primary behavior test. This exposed a
larger completion gap: the official 36 English starter products list 382 unique
primary ST-numbered cards. Before adding Law, 310 were absent; 309 remain after
this checkpoint. [The exact missing IDs and source links](starter-catalog-gaps.json)
were compared with the exported runtime catalog. Product reprints with other
card numbers are excluded from those totals. This is a catalog-presence audit,
not proof of the implemented cards' behavior. Earlier inventory coverage counts
apply to existing definitions and do not establish a complete game catalog.

The starter gaps must be implemented and behavior-tested as part of this goal.
The next work starts with missing starter cards, alongside remaining booster
audits. OP07 FAQ proofs also cover Sanji's post-Law-payment hand-cost threshold,
Morgans's newly drawn card staying private, Luffy's five-versus-six trash return
rounding, Ace's Rush after declining Life addition, and Vegapunk's play branches.

Validation: 2,335 engine files / 8,868 tests, 121 parser files / 1,314 tests,
and 29 card-package tests pass. All 21 changed TypeScript files pass scoped
checks. The card and engine builds, 30 adapter tests, and adapter type checking
pass. The harness retains its identical 81
baseline issues. Across the goal, 1,516 canonical definitions have changed.
The last enabled stress result remains a063d693fd; no OP07 stress run is claimed.
Sources: [official OP07 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op07.pdf),
[OP07 card list](https://en.onepiece-cardgame.com/cardlist/?series=569107), and
[ST10 card list](https://en.onepiece-cardgame.com/cardlist/?series=569010).
No simulator UI edits.

### ST02–ST05 starter catalog implementation

This batch adds 58 missing canonical cards and their English localization:
15 from ST02, 12 from ST03, 14 from ST04, and all 17 from ST05. Each set adds
four vanilla cards, covered by the catalog identity, printing, and stat
invariants. The 42 new ability cards have primary public-command proofs:
ST02 has 25 tests across 11 new primary files; ST03 has 24 across eight;
ST04 has 28 across ten; and ST05 has 40 across 13. The four category inventories
include these 58 cards and the preceding ST10-001 addition.

The exported runtime catalog now contains all primary cards in ST02–ST05.
The starter manifest was recomputed against those exports: 251 of the 382
unique primary ST-numbered cards remain absent, down from 309 at the preceding
checkpoint. These remaining cards and the unfinished booster clause audits are
still required work; catalog membership alone does not prove behavior.

Shared behavior proofs cover ST02 Hawkins and ST05 Zephyr requiring an actual
battle power comparison, including canceled-battle negatives. Zephyr gains
power after either battle role and accumulates the printed turn-long bonus.
Union Armada applies its protection to the same selected Character, including
snapshot restoration during the Counter choice. Parsed definitions have public
runtime proofs for both Zephyr battle roles, Union Armada, and declining Lion's
optional DON!! return after paying the Event play cost. The parser now preserves
optional DON!! return activation costs on Main and Counter Events.

The parser repair exposed eight existing canonical Event definitions needing
the same optional-cost correction: EB01-038, OP01-118, OP15-074, OP15-075,
OP15-076, OP15-077, OP15-078, and OP17-077. These definitions were only audited
in that batch; the following ST06–ST07 checkpoint resolves all eight.

Final integration validation: 2,378 engine files pass 9,095 tests, with three
opt-in tests skipped. The 122 parser files pass 1,317 tests, the card catalog
passes 29 tests, and the server adapter passes 30 tests. Card and engine builds,
adapter typecheck, and scoped format/lint/type checks on all 178 changed
TypeScript files pass. The Grade A gate passes. The harness retains the same
81 baseline issues. Across the goal, 1,574 canonical definitions have changed.
No new stress run or simulator UI change is claimed.

Sources: [official ST02 card list](https://en.onepiece-cardgame.com/cardlist/?series=569002),
[ST03 card list](https://en.onepiece-cardgame.com/cardlist/?series=569003),
[ST04 card list](https://en.onepiece-cardgame.com/cardlist/?series=569004),
[ST05 card list](https://en.onepiece-cardgame.com/cardlist/?series=569005), and
[combined ST01–ST04 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-01-st-04.pdf), and
[ST05 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-05.pdf?20230127=).

### ST06–ST07 starter cards and optional Event activation costs

This batch adds 29 missing canonical cards and their English localization:
13 from ST06 and 16 from ST07. Each set adds four vanilla cards. All 21 new
ability cards have primary public-command proofs. ST06's nine new primary files
pass 26 tests; its complete 13-file primary set passes 32 tests. ST07's 12 new
primary files pass 41 tests. The four category inventories now cover 2,479
canonical cards: 2,233 ability rows and 246 vanilla rows.

The runtime catalog now includes every primary ST06 and ST07 card. The starter
manifest records 222 missing primary ST-numbered cards, down from 251. Those
cards and remaining booster clause audits still prevent a completion claim.
The eight Event activation-cost gaps from the preceding checkpoint are repaired:
EB01-038, OP01-118, OP15-074, OP15-075, OP15-076, OP15-077, OP15-078, and OP17-077.
A player can decline the optional DON!! return after paying the Event play cost;
this does not refund the Event play cost. Their eight primary files pass 31
tests, with 12 additional dependent tests and eight static Grade A checks.

The new starter proofs include Smoker's effect-K.O. immunity and dynamic
Double Attack eligibility; White Out protecting only Characters present when
its Trigger resolves; and Charlotte Linlin's Life threshold checked after
payment. Opponent-owned Linlin and Soul Pocus choices retain both options even
when the opponent has no Life. Soul Pocus can replenish Life between Double
Attack damage instances. Power Mochi's private Life look precedes its battle
power, and skipping that look does not suppress the power effect. Queen Mama
Chanter checks the printed exact cost and moves the chosen field Character to
Life face-up after both costs are paid.

Parser repairs preserve Great Eruption's opponent-selected hand discard,
White Out's draw and current-Character protection, both opponent-owned Life
choices, and Power Mochi's ordered actions. Printed bullet layouts from the
card list are covered. All 123 parser files pass 1,326 tests; seven generated
public runtime tests cover all five affected cards, including snapshot recovery
and private-information boundaries. All six changed parser/proof files pass
scoped checks. No shared runtime change was required for these starter cards.

Final integration validation: 2,400 engine files pass 9,230 tests, with three
opt-in tests skipped. The parser passes 1,326 tests, the card catalog passes
29 tests, and the adapter passes 30 tests. Card and engine builds, adapter
typecheck, and scoped format/lint/type checks on all 107 changed TypeScript
files pass. The Grade A gate passes. Across the goal, 1,606 canonical definitions
have changed. No new stress run or simulator UI change is claimed.

Sources: [official ST06 card list](https://en.onepiece-cardgame.com/cardlist/?series=569006),
[ST07 card list](https://en.onepiece-cardgame.com/cardlist/?series=569007),
[ST06 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-06.pdf), and
[ST07 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-07.pdf).

### ST08–ST09 starter cards and battle-result follow-ups

This batch adds 29 missing canonical cards and their English localization:
15 from ST08 and 14 from ST09. Eight are vanilla cards; all 21 ability cards
have primary public-command proofs. ST08 has 40 passing cases in 11 primary
files: 39 printed-card cases and one explicitly synthetic continuation case.
ST09 has 34 passing cases in 10 primary files. The four category inventories
now contain 2,508 rows: 2,254 ability cards and 254 vanilla cards. No Stage
cards are added.

The starter manifest now records 193 missing primary ST-numbered cards, down
from 222. Existing ST09-014 is retained. The missing starters and remaining
clause audits still prevent a completion claim.

ST08 proofs cover separate Leader DON choices after simultaneous KOs, Uta's
Leader-only battle immunity, Koby's self-rest payment, Shanks's K.O. of both
fields' cost-one Characters, and Makino's cost-zero check on either field.
Blocker and Life Trigger behaviors are exercised through attacks. Gum-Gum
Bell's payment and recovery filters and Gum-Gum Pistol's distinct Main and
Trigger results have command proofs.

Mr.2.Bon.Kurei(Bentham) uses the exact opposing battle object at battle end.
Its self-K.O. follows only a successful effect K.O. of that object. Tests cover
attacking and surviving defense, decline, missing DON, immunity, replacement,
an opponent already K.O.d in battle, a replayed object's new identity, and a
canceled battle. A separate synthetic case checks that a successful self-K.O.
does not discard a non-self draw follow-up. Its related seven-file regression
scope passes 52 tests.

ST09 proofs cover Yamato's changing Life-based defense during Double Attack,
Kaido's battle-only protection, Oden's damage and paid On K.O. Life addition,
Shinobu's paid Blocker survival, and Ushimaru's separate color, trait, cost and
card-type filters. Tempura and Omusubi return themselves even with no opposing
target selected. Ace's optional K.O. replacement covers battle and both
players' effects, top or bottom Life, private selection, snapshot retry, zero
Life, decline, once-per-turn use and reset. Yamato's attack power persists
through the opposing turn. Thunder Bagua retains its Counter power when the
Life threshold prevents its separate Character-to-Life action.

The priority between an optional affected-card replacement and another eligible
replacement remains under review. Ace's multiple-replacement test does not
establish that the current priority order complies with rule 8-1-3-4-2.

Final integration validation: 2,422 engine files pass 9,362 tests, with three
opt-in tests skipped. The parser passes 1,328 tests, including both new clause
families; four generated public runtime tests pass. The card catalog passes
29 tests and the adapter passes 30 tests. Card and engine builds, adapter
typecheck, Grade A's four tests, and scoped format/lint/type checks on all
94 changed TypeScript files pass. The harness retains the same 81 baseline
issues. Across the goal, 1,635 canonical definitions have changed. No new
stress run or simulator UI change is claimed.

Sources: [official ST08 card list](https://en.onepiece-cardgame.com/cardlist/?series=569008),
[ST09 card list](https://en.onepiece-cardgame.com/cardlist/?series=569009),
[ST08 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-08.pdf), and
[ST09 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-09.pdf).

### ST10–ST12 starter cards and parser repair

Added all 31 missing primary definitions across ST10, ST11, and ST12. The 28
ability cards have 106 public-command cases in 28 primary files. The three
ST12 vanilla cards use the shared catalog invariant. Existing definitions
were retained. The exported catalog now includes every primary ID in ST01
through ST12; the official-product manifest records 162 missing starter IDs,
down from 193. Presence remains separate from complete behavior proof.

ST10 tests cover opponent Blocker activation without granting Luffy Blocker,
K.O. of the blocking card before Counter, and the alternate legal K.O. target.
Sanji's On Play Rush checks current opposing Character power and remains after
that Character leaves. Killer, Heat, and Wire react when an opponent's effect
returns their controller's DON, exclude opponent-owned DON, and enforce once
per turn. Killer and Heat exclude opponent-turn returns; Wire still draws and
discards on that turn. Counter and Life Trigger cases verify power expiration,
independent following clauses, and exact power/cost thresholds.

ST11 Uta publicly reveals the physical top card before its optional FILM hand
addition. Declined and non-FILM cards go to the bottom; Leader reactivation does
not reset its once-per-turn limit. Character Uta pays with an Event, readies
only FILM Characters, and can ready itself for Blocker. Backlight covers both
choices. New Genesis preserves private inspection, public selected reveal,
ordered remainder, and DON recovery after a declined search. I'm invincible
covers Leader reactivation and both Life Trigger power-recipient categories.
The official ST11-005 Music token is normalized from Japanese without changing
unknown longer tokens.

ST12 tests cover Mihawk's Muggy Kingdom-or-Slash alternatives and self-inclusive
Character count; Rika's payment before the opposing Life condition; revealed
physical cost-two plays; active versus rested play; and ordered top/bottom
remainder. Sanji's repeated attacks stack its turn-long power. Ivankov and the
Leader retain their once-per-turn limits after real-card reactivation. Lion
Strike proves Main, Counter, and Life Trigger behavior with Leader inclusion.

Eight parser families now retain compound DON conditions, opposing power
conditions, opponent-only Blocker ownership, outlined circled-number costs,
revealed FILM hand addition, trait-or-attribute alternatives, and rested reveal
play filters. Twelve generated-effect public cases supplement parser tests.
No shared engine runtime or simulator UI change was needed in this batch.

Validation: 2,451 engine files / 9,520 passing tests (three opt-in checks
skipped), 125 parser files / 1,336 tests, 29 card-package tests, four utility
tests, and 30 server-adapter tests pass. Card, engine, and utility builds,
adapter typecheck, Grade A coverage, and scoped checks on 106 changed
TypeScript files pass. Across the goal, 1,666 canonical definitions have
changed. No new stress run is claimed.

Self-improvement: the two outlined-number payment cards now use one central
parser correction. Both generated public payment tests pass. No new helper or
skill rule was needed. Remaining scope includes later starters, further card
clause audits, general loop forms, and the unresolved optional affected-card
replacement priority described above.

Sources: [ST10 card list](https://en.onepiece-cardgame.com/cardlist/?series=569010),
[ST11 card list](https://en.onepiece-cardgame.com/cardlist/?series=569011),
[ST12 card list](https://en.onepiece-cardgame.com/cardlist/?series=569012),
[ST10 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-10.pdf),
[ST11 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-11.pdf), and
[ST12 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-12.pdf).

### ST13–ST17 starter cards and face-up Life rules

Added all 31 missing primary definitions from ST13 through ST17: 30 ability
cards with 102 public-command cases in 30 primary files, plus ST14-005 as a
vanilla card. The official-product manifest now records 131 missing starter
IDs, down from 162. Exported primary membership is complete through ST18;
this does not establish that every existing card's clauses have been audited.

Sabo now pays a qualifying Character into face-up Life before choosing its
power recipient. Current power includes attached DON. The cost uses the same
removal and replacement completion path as other movement costs, so an accepted
replacement can move the Character without paying the printed Life cost.
Ace can search into publicly visible face-up Life and trashes only face-up Life
at turn end, including cards placed there by other effects. Shanks can choose
any eligible face-up Life card for its face-down payment; it is not limited to
the top card. Other costs that print top Life, including Katakuri and Urouge,
remain top-only. Saved choices revalidate physical cards before payment.

Luffy's permanent replacement now handles Life-to-hand movement at the shared
movement boundary. Face-up Life goes to deck bottom for battle damage, effect
damage, and ordinary Life additions; its Trigger is not offered. Face-down Life
retains its normal behavior. Makino can attempt the replaced cost, but its
reorder body does not run because no card reached hand. Invalid submissions
and saved-state recovery preserve this distinction. Banish trashes the Life
card under the active-player replacement order in rules 8-1-3-4-2 and 10-1-3-1;
this case is rules-derived, unlike the direct Makino and Reject FAQ examples.

The shared rules file has 12 cases. Three test declarations are explicitly
synthetic: a parameterized accepted/declined field-to-Life replacement, a
once-per-turn timing variant, and a prohibition-coexistence case. They produce
four executions.
These establish generic boundaries without claiming printed-card coexistence.
The other starter proofs include Dadan's grouped names, Ivankov's physical
revealed hand card, Garp's three-name search, mixed face-up/down Life ordering,
modified-cost conditions, power durations, Music discard counts, and both
Crocodile's and Hancock's deck interactions. Kingdew uses K.O. cause separately
from effect controller: either player's effect can qualify on the opponent's
turn, while battle K.O. cannot.

Fourteen parser cases retain every repaired clause and the top-Life cost boundary. Twenty generated-effect
public cases prove those structures execute through commands, including
separate Trigger text. Parser conditions after payment may use action-level
predicates where equivalent to the authored block's post-cost condition.

Remaining engine limit: simultaneous multi-card Life-to-hand replacements
append in processing order without a separate owner-order choice. A bounded
catalog scan found no current amount-greater-than-one Life-to-hand action or
cost, but this is not proof for missing definitions or arbitrary supported
amounts. Keep that general ordering requirement open, alongside later starter
cards, further clause audits, general loop forms, and optional affected-card
replacement priority. No UI changes were made.

Local validation: 9,688 engine tests, 1,350 parser tests, 29 card-package tests, and 30 server-adapter tests pass. All 117 TypeScript files changed in this checkpoint pass scoped format/lint/type checks. Types, cards, and engine builds, Grade A coverage, and adapter typecheck pass. Three opt-in engine tests are skipped by default. The enabled stress/heuristic run passed 13 tests at a063d693fd, including 4,000 seeded games; this is prior-checkpoint evidence, not a fresh stress run. No instruction files changed, so the harness guidance check was not rerun.

Self-improvement: no new helper or skill rule. Early generated-effect checks
and the independent shared-code review found the K.O.-cause distinction and a
misplaced payment-completion update before publication. The focused tests
remain regression evidence for both boundaries.

Sources: [ST13 card list](https://en.onepiece-cardgame.com/cardlist/?series=569013),
[ST14 card list](https://en.onepiece-cardgame.com/cardlist/?series=569014),
[ST15 card list](https://en.onepiece-cardgame.com/cardlist/?series=569015),
[ST16 card list](https://en.onepiece-cardgame.com/cardlist/?series=569016),
[ST17 card list](https://en.onepiece-cardgame.com/cardlist/?series=569017),
[ST13 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-13.pdf),
[ST14 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-14.pdf), and
[ST15–ST20 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-15-20.pdf).

### ST19–ST21 completion and ST22 reveal/Life continuations

Added 26 primary definitions: all 24 missing ST19–ST21 cards plus ST22-001 and
ST22-015. The batch contains 22 ability cards with 91 public-command cases in
22 primary files, and four vanilla Characters. Exported primary membership is
complete through ST21; 105 starter IDs remain missing. Existing ST19-002,
ST20-003 and ST21-003 were retained. Numeric metadata for all 26 new cards was
checked against official card-list HTML, including zero-value handling.

ST19 proofs cover Smoker's black-and-Navy payment, attack prevention and expiry;
Tashigi's independent activation and trash without K.O. reactions; and Hina's
and Garp's trash-to-deck payment. ST20 covers top-only Life orientation, Cracker's
own/opponent effect replacements and turn reset, Pudding's actual Life payment,
and Linlin's opponent-owned hand/Life choice including zero Life. ST21 proves
Bonney's pre-removal DON snapshot, Franky's base-power filter despite current
power changes, Zoro's independent Rush and hand-play effects, actual Blocker
and Rush use, and ordered Main/Trigger clauses on both Events.

Ace & Newgate now binds a return-to-deck action to the physical reveal-payment
card. A draw can no longer replace that binding with the drawn card. Automatic
single-candidate payment and chosen payment retain the same identity, including
saved prompt recovery and rejected invalid selections. Return execution
revalidates the bound cards against the current target pool. The parser retains
this instruction separately from the immediately preceding action's targets.

I Am Whitebeard!! retains its independent optional Life choice after playing
or declining to play Newgate. A replaced Life-to-hand move does not satisfy
its dependent power instruction. That replacement proof uses an explicitly
synthetic Luffy trait extension: printed ST13 Luffy does not meet this Event's
Leader condition. A separate shared fix accepts zero cards from bottom Life;
JavaScript's negative-zero slice previously selected the whole Life array and
rejected the choice. Canonical and generated-effect tests cover declined top
and bottom choices. Two parser cases and four generated-effect public cases
prove both repaired clauses. Top-level optional abilities retain their existing
single decision; optional actions after a paid cost remain independent.

Local validation: 9,821 engine tests, 1,352 parser tests, 29 card-package tests,
and 30 server-adapter tests pass. All 85 changed TypeScript files pass scoped
format, lint and type checks. Types, cards and engine builds, Grade A coverage,
and adapter typecheck pass. Three opt-in engine tests are skipped by default.
No fresh stress run or guidance harness check was needed for this checkpoint;
the last enabled stress evidence remains a063d693fd (13 tests, 4,000 seeded
games, zero-illegal and fewer-than-50-stuck threshold).

Self-improvement: no helper or skill change. Generated-effect playback found
the bottom-zero boundary after the primary top-zero case passed. Shared-code
review found no additional confirmed regression and checked the current
reveal-cost catalog for conflicting card-selection payments. No UI files changed.

Replacement priority remains a precise authority gap. Fresh English and
Japanese v1.2.1 rules and the ST09, OP05 and OP10 FAQs did not settle the
optional Ace/Rosinante prompt order. OP10-118 Luffy's first-use “cannot be
K.O.'d” protection is a prohibition; its mandatory protection test does not
prove priority for true “instead” replacements. Current Ace/Rosinante outcome
is possible by declining Ace first, so its board-state test does not prove the
required prompt order. No speculative priority change was made. Simultaneous
multi-card Life replacement ordering and general loop forms also remain open.

Next: the remaining 15 ST22 cards, then ST23–ST24. Static preflight identified
missing ST23-002 clauses and dropped ST24-004 rest/same-target freeze clauses;
these remain unfinished, not runtime-proven repairs.

Sources: [ST19 card list](https://en.onepiece-cardgame.com/cardlist/?series=569019),
[ST20 card list](https://en.onepiece-cardgame.com/cardlist/?series=569020),
[ST21 card list](https://en.onepiece-cardgame.com/cardlist/?series=569021),
[ST22 card list](https://en.onepiece-cardgame.com/cardlist/?series=569022), and
[ST15–ST20 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-15-20.pdf).
The ST21 FAQ was not available during this audit; no FAQ claim relies on it.

### ST22–ST24 starter completion and full product presence audit

Added the remaining 15 ST22 definitions and all ten ST23–ST24 definitions:
20 ability cards and five vanilla Characters. The 20 new primary files contain
90 public-command cases. Primary starter membership is complete through ST24;
80 starter IDs remain missing. Numeric metadata for all 25 cards matches the
official card-list HTML, with zero values handled explicitly.

ST22 proofs cover inclusive Whitebeard-type searches and reveal payments,
physical search selections and remainder order, opponent-attack self-trash,
Double Attack, conditional top-deck draw/discard, Whitey Bay's own-turn gate
and public reveal, Counter and Trigger outcomes, and actual Blocker use.
Oden pays both rest-three-DON and return-another-Character costs, including
saved payment recovery. Its opponent-effect replacement handles K.O. and
non-K.O. removal while excluding battle and own effects. Marco's separate
replacement limit and attack bonus have timing and negative-boundary proof.

ST23–ST24 proofs distinguish current-power hand discounts from base-power
hand discounts and K.O. filters. Leader alternatives remain independent from
Shanks's discount. Luffy can activate again after a real reactivation because
it has no printed once-per-turn limit. Bege counts the DON rested to pay its
own play cost. Drake's delayed DON activation survives leaving the field.
Law & Bepo rests and freezes the same physical Character, then evaluates the
opposing rested-Character count for the Leader bonus; selecting zero does not
suppress that independent count check.

The parser now retains both Shanks clauses and the Law & Bepo rest/freeze
sequence. Two parser cases and nine generated-effect public cases prove the
repaired structures. No shared runtime changes were required in this batch.

A fresh presence audit checked all 24 non-starter categories from the official
English product selector: 17 boosters, three extra boosters, two premium
boosters, Promotion card and Other Product Card. EB04 is included through
mixed booster products. All booster canonical IDs were present. The two other
categories expose 84 distinct missing P-numbered cards, now tracked in
`nonstarter-catalog-gaps.json`. Reprints are deduplicated, and alternate art
does not create a new gameplay ID. These are additional to the 80 starter
gaps: 164 known missing canonical definitions remain. Presence is not proof
that all clauses of existing definitions are correct.

Validation: 2,527 engine files pass (9,960 tests; three opt-in tests skipped),
128 parser files pass (1,354 tests), plus 29 card-package and 30 server-adapter
tests. All 77 changed TypeScript files pass scoped format, lint and type checks.
Cards and engine builds, all 20 primary Grade A checks, and adapter typecheck
pass. No fresh stress run or guidance harness run was required; the last enabled
stress evidence remains `a063d693fd` (4,000 seeded games).

Self-improvement: no helper or skill change. Independent review prompted
stronger negative fixtures for turn gates, available DON and inclusive types.
The final scope contains no unrelated formatting or UI changes.

Next: ST25–ST28. Static preflight found omitted Soba Mask, Sanjuan.Wolf and
Momonosuke clauses. Momonosuke also needs a cost for returning selected attached
DON to the cost area rested; existing DON-return costs go to the DON deck and
cannot represent it. That repair needs public behavior proof. Later starter
cards, missing promos, further existing-card clause audits, general loop forms,
optional replacement priority and simultaneous Life replacement order remain
open.

Sources: [ST22 card list](https://en.onepiece-cardgame.com/cardlist/?series=569022),
[ST23 card list](https://en.onepiece-cardgame.com/cardlist/?series=569023),
[ST24 card list](https://en.onepiece-cardgame.com/cardlist/?series=569024),
[Promotion card list](https://en.onepiece-cardgame.com/cardlist/?series=569901), and
[Other Product Card list](https://en.onepiece-cardgame.com/cardlist/?series=569801).
Every audited non-starter category has its source URL in the presence manifest.

### ST25–ST28 cards and attached-DON activation cost

Added all 18 missing ST25–ST28 definitions, each with printed abilities and a
primary public-command test file. The 84 primary cases complete starter
membership through ST28. There are 62 missing starter IDs and 84 missing
promotional IDs: 146 known absent canonical definitions remain. The new cards'
numeric metadata matches the official card-list HTML, including Yamato's zero
power. Catalog presence does not prove all existing card clauses.

ST25 proofs cover base-cost Character counts, conditional Blocker, opponent-turn
power, ordered draw/discard/play, Cross Guild filters, optional self-trash,
removal replacements and K.O. draw gates. Crocodile & Mihawk protects itself or
another eligible Character from opposing effects, including non-K.O. removal;
own effects and battle removal remain separate. ST26 proofs cover both named
Soba Mask discount conditions, base power despite current-power changes, return
of all own matching Characters, mixed DON/Character rest choices, optional DON
return and addition, and multi-target power reduction with expiry.

ST27 proofs cover named Stage payment, independent K.O. draws, self-trash without
K.O. reactions, rested trash play, and Sanjuan.Wolf's independent Blocker and
per-four-trash cost increase. ST28 proofs cover base-cost K.O. under independent
Leader/Life gates, Banish and its expiry, actual Blocker, physical Life Trigger
play, and exact-type search with owner-chosen remainder order.

Momonosuke exposed a shared cost gap. `returnDon` now has a typed destination
variant for returning only currently attached DON to the cost area rested.
The original DON-deck cost retains its destination and candidate pool. The new
variant selects attachment tokens from the controller's Leader and Characters,
reduces those attachments, increases rested DON, and does not change the DON
deck or dispatch DON-deck-return reactions. Prompt text states the destination.
Four public rule cases cover selected and automatic payment, JSON recovery,
wrong-owner and cost-area choices, duplicate/count rejection, live candidate
revalidation and a real Heat reaction negative. Primary Momonosuke proof uses
paid play, a legal Rush attack, both power clauses and turn expiry.

The parser retains Soba Mask's name/base-power discount and return-all clauses,
Sanjuan.Wolf's Leader-gated Blocker and cost groups, and Momonosuke's attached
DON cost. Three parser cases and 12 generated-effect public cases cover these
families. Independent review found no additional confirmed runtime defect in
this bounded batch.

Validation: 2,547 engine files pass (10,078 tests; three opt-in tests skipped),
129 parser files pass (1,357 tests), plus 29 card-package and 30 server-adapter
tests. All 67 changed TypeScript files pass scoped format, lint and type checks.
Types, cards and engine builds, all 18 primary Grade A checks, and adapter
typecheck pass. No fresh enabled stress run; the latest remains `a063d693fd`
(4,000 seeded games).

Self-improvement: the test guidance now requires all costs to remain payable
before a once-per-turn retry. Avalo gets a new active Fullalead; Momonosuke gets
two DON reattached. Both still reject the second command for the turn limit.
The harness guidance also explains that `expectFailure` returns a state without
updating the driver. Both invalid-payment tests now inspect and retry from that
returned state. `harness:check` reports the same 81 pre-existing issues as the
previous checkpoint, with no new or removed issue lines.

Next: ST29–ST30. Static preflight identifies seven parser omissions, including
named-Leader Unblockable, exact-power reveal costs, replacement sequences and
per-recipient DON giving. These need public behavior proof before completion.
Later starters, missing promos, further existing-card clause audits, general
loop forms, optional replacement priority and simultaneous Life replacement
ordering remain open. No simulator UI files changed.

Sources: official [ST25](https://en.onepiece-cardgame.com/cardlist/?series=569025),
[ST26](https://en.onepiece-cardgame.com/cardlist/?series=569026),
[ST27](https://en.onepiece-cardgame.com/cardlist/?series=569027), and
[ST28](https://en.onepiece-cardgame.com/cardlist/?series=569028) card lists;
Comprehensive Rules 3-9, 6-5-5 and 8-3-1.

### ST29–ST30 cards, variable DON allocation and self-trash attachments

Added all 34 missing ST29–ST30 canonical definitions: two Leaders, 26 Characters
and six Events. Thirty ability cards have 130 primary public-command cases;
four vanilla Characters use the catalog invariant. Primary starter membership
is complete through ST30. There are 28 missing starter IDs and 84 missing
promotional IDs, or 112 known absent canonical definitions. Numeric metadata for
all 34 matches official card-list HTML, including ST29 Luffy's zero power.

ST29 proofs cover both sides of Life comparisons, cost limits derived from Life,
exact-name Leader gates, Character and Event search, physical Life Trigger play,
Blocker, Rush: Character, Trigger-card discard and both DON recipient zones.
Nami's replacement pays with the exact top face-down Life card, protects the
source or an eligible teammate from opponent K.O., survives saved choices and
can be used again after Life changes. Already-face-up and absent Life cannot
pay; battle, own K.O. and non-K.O. removal do not qualify.

ST30 proofs distinguish base power from current power, exact names from a
combined Leader name, and Leader/field bonuses from hand-only costs. Reveal
payments leave the selected cards in hand for the subsequent discard. Actual
paid Rush attacks, Blocker battles, rested replay and freeze expiry prove the
printed timings. LittleOars trashes itself, returns its attached DON and draws
while replacing opponent removal; K.O., bounce, bottom-deck, saved replacement,
simultaneous source/teammate removal and last-card defeat have public proof.
Buggy's rest replacement excludes already-rested sources, own K.O. and battle,
and works for both K.O. and bottom-deck removal.

The six Event files cover Counter amounts and expiry, independent optional
steps, exact base-power/name conditions, wrong or duplicate names, Life Trigger
branches and owner-ordered physical search remainders. Skipping a power boost
does not suppress an independent draw or low-Life K.O. Kizaru's Main affects
only a named Luffy Leader; its Counter has no name restriction. ST30's Trigger
K.O. uses current power while its Counter condition uses base power.

Shared `giveDon` distribution now asks for each selected recipient's amount
when the printed amount is optional. Galdino can allocate one/one from two DON,
two/one from three, and one/zero from one. Previously the engine forced two per
recipient and excluded these legal choices. All choices are reserved before
resources move. Saved continuations retain physical recipient generations,
validate remaining pools and reject invalid retries without partial movement.
Each actual DON given still dispatches its reaction. The exported catalog scan
finds the same optional distribution on Karoo and Gorgon Sisters; their existing
public tests now use the corrected choices. Chopper's fixed amount is unchanged.

A separate real Rosinante reproduction exposed lost attached DON on the generic
`trashThisCard` action. It now returns those attachments rested before moving
the source. LittleOars uses the normal `trashFromField` sequence and does not need
a card-specific workaround. Six shared rule cases and 11 generated-effect
cases cover the repaired runtime and seven parser families.

Validation: 2,579 engine files pass (10,271 tests; three opt-in tests skipped),
130 parser files pass (1,364 tests), plus 29 card-package and 30 server-adapter
tests. All 114 changed TypeScript files pass scoped format, lint and type checks.
Types, cards and engine builds, all 30 primary Grade A checks, and adapter
typecheck pass. No fresh enabled stress run; the latest remains `a063d693fd`
(4,000 seeded games).

Self-improvement: no skill or helper change was needed. The preceding checkpoint's
payment-availability and rejected-result-state guidance was applied to the new
cost, turn-limit and saved-allocation proofs. The last guidance check retains
81 pre-existing issues. No UI files changed.

Next: ST31–ST36, the remaining 28 starter definitions. Static preflight found
attribute tokens that an HTML tag stripper would lose, omitted Slash clauses,
hand-discard history discounts, missing play filters and Life-orientation costs.
These need public tests and owning-layer repairs. Promotional cards, later
existing-card clause audits, general loop forms, optional replacement priority
and simultaneous Life replacement ordering remain open.

Sources: official [ST29](https://en.onepiece-cardgame.com/cardlist/?series=569029)
and [ST30](https://en.onepiece-cardgame.com/cardlist/?series=569030) card lists;
Comprehensive Rules 6-5-5, 8-3 and 8-4.

### ST31–ST36 starter completion and hand-discard provenance

Added the remaining 28 starter definitions: 27 Characters and one Stage, all
with executable abilities. Their 28 primary files pass 127 public-command
cases. All 382 primary ST-numbered IDs in the 36 official starter products are
now exported. This closes the starter presence gap; it does not prove every
old starter clause. The separate promotional audit still records 84 missing
canonical IDs.

ST31 proves draw-before-play, Character and Stage play, distributed given-DON
thresholds, live Blocker loss after a donor leaves, Rush, exact-name rested-DON
recipients, and private search with saved bottom ordering. ST32 proves both
alternative rest costs, Slash Leader gates, Perona-or-Slash play with a shared
cost ceiling, own-turn rest reactions, Rush Character and the first-turn ban.
ST33 covers hand costs, opponent-owned choices, bottom-deck order, Navy filters,
Blocker, and Borsalino's hand-only discount. ST34 covers DON-return provenance,
per-copy turn limits, independent optional results, compound payment choices,
and base-power settings that preserve additive modifiers. The two-Katakuri and
Linlin concurrent-base-power scenarios match the official FAQ.

ST35 distinguishes base from current power, exact Revolutionary Army filters,
hand/trash play, field-only cost eight, and independent DON/play choices.
Karasu's deck payment works before the opponent hand threshold, cannot partly
pay, and loses immediately when it empties the deck. ST36 proves Life additions,
physical Trigger play and turn gates, exact Supernovas costs, Apoo's independent
draw and base-power change, and Kid's two distinct once-per-turn effects.
Kid selects only a Life endpoint that can change orientation; saved choices
retain the physical card, and redirect targets keep the printed name and base
power limits.

Shared fixes:

- Borsalino now uses player turn history, including a discard that occurred
  before the card entered hand. Effect actions, replacement discards and
  activation-cost hand discards update that history. Ordinary Character Counter
  use and Event disposal do not. A direct OP12 Garp/Kuzan FAQ check disproved
  the existing omission of cost discards. The shared path now keeps source
  provenance and queues Kuzan's draw after Garp's full effect, including its
  pending play choice.
- Kid's Life-orientation cost supports a top-or-bottom choice, with live
  orientation and physical-card validation.
- An automatically selected homogeneous DON-return payment no longer skips a
  following hand-discard choice. Linlin retains all resources until the complete
  cost selection is available, including across a saved prompt.

The parser repairs ten cards across nine regression cases: official angle-bracket
attributes, alternate costs, missing Slash clauses, hand-discard history,
independent Then clauses, mixed name/attribute and exact-type play filters,
Trigger-only text and endpoint Life costs. Fifteen parser-generated engine
cases execute the repaired effects; six shared history cases prove provenance,
turn memory, saved state and parent-effect ordering.

Validation: 2,609 engine files / 10,447 tests pass (three opt-in skips),
131 parser files / 1,373 tests pass, plus 29 card-package and 30 server-adapter
tests. All 104 changed TypeScript files pass scoped format, lint and type checks.
Types, cards and engine builds, all 28 new primary Grade A checks and adapter
typecheck pass. Across the goal, 1,828 canonical definitions have changed.

Self-improvement: the test guide now requires activation-cost discard proof for
by-effect hand-trash behavior and keeps Counter/Event rule disposal separate.
Koby and Garp provide the two direct cases; the Garp/Kuzan FAQ establishes
reaction timing. The guidance harness reports the same 81 pre-existing issues
as the baseline. No simulator UI files changed.

Next: the 84 missing promotional cards, later existing-card clause audits,
general loop forms, optional replacement priority and simultaneous Life
replacement ordering. A read-only next-wave probe also confirms that deck
validation ignores a Leader's `cannotInclude` rule: an otherwise valid
OP12-001 deck of cost-five-or-higher Characters is incorrectly accepted.
This deck-validation gap remains open for the promotional-card work. No new enabled stress result is claimed beyond
`a063d693fd` (4,000 seeded games).

Sources: official ST31–ST36 card lists recorded in
[`starter-catalog-gaps.json`](starter-catalog-gaps.json),
[ST31 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-31.pdf?20260717=),
[ST32 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-32.pdf?20260717=),
[ST33 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-33.pdf?20260717=),
[ST34 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-34.pdf?20260821=),
[ST35 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-35.pdf?20260717=),
[ST36 FAQ](https://en.onepiece-cardgame.com/pdf/qa_st-36.pdf?20260717=), and
[OP12 Garp/Kuzan FAQ](https://en.onepiece-cardgame.com/pdf/qa_op12.pdf?20260206=).

### Promotional-card completion batch and Leader deck restrictions

Added 29 missing promotional definitions: P-001–013, P-015–020,
P-048–050, P-052, P-054, P-056–058, P-060 and P-061. These are 24
Characters, four Events and one Leader; four are vanilla. The 25 ability
primaries pass 90 public-command cases and Grade A. Official numeric,
color, attribute and exact-type metadata match all 29 definitions.
The runtime catalog now contains 2,730 canonical gameplay cards. The recorded
promotional presence gaps fall from 84 to 55; starter coverage remains complete
through ST36. Presence is separate from complete clause proof.

The first ten cards cover paid Rush, Double Attack damage, conditional Blocker,
repeatable Banish payments and expiry, Strike battle protection, self-rest
costs without a target, mandatory opponent Life movement and End Turn DON ramp.
Uta's optional rest-DON payment retains once-per-turn behavior and distinguishes
Counter-only cards from Trigger-only cards. Gordon pays by moving its physical
card to the deck bottom and returns attached DON rested.

Later cards prove opponent-owned hand-bottom selection, private five-card
ordering with a whole-group top-or-bottom choice, dynamic hand-size power,
Slash/Strike protection against both Leaders and Characters, and either-owner
cost-five bounce. Uta Events preserve the Leader gate only where printed.
Fleeting Lullaby freezes eligible rested Characters through their next Refresh;
Where the Wind Blows includes FILM Characters played and rested after Event
resolution. Tot Musica can rest an Uta Leader or Character as payment and can
select active or already-rested opposing DON without false pool changes.

The game-owned deck validator now enforces Leader `cannotInclude` restrictions
and declared DON-deck counts. Public red/green cases cover Rayleigh's cost-five
boundary, exact negated East Blue type filtering, unsupported-filter rejection,
and Enel's six-DON deck. The existing convention that a submission may omit
its DON entries is unchanged. Runtime-dependent deck filters are rejected.

The parser repairs P-007's fullwidth Strike and battle-source condition,
P-009's opponent top-Life movement and P-011's optional rest-DON cost. Six
generated public engine cases prove those paths. Two old optional-cost parser
expectations were corrected against their printed text.

Validation: 2,635 engine files / 10,572 tests pass (three opt-in skips),
132 parser files / 1,376 tests pass, plus 33 card-package and 30 server-adapter
tests. All 96 changed TypeScript files pass scoped format, lint and type checks.
Types, cards and engine builds and adapter typecheck pass. The guidance harness
has the same 81 pre-existing issues as its baseline. Across the goal, 1,857
canonical definitions have changed. No new enabled stress result is claimed
beyond `a063d693fd` (4,000 seeded games). No simulator UI files changed.

Remaining work: 55 missing promotional IDs, later existing-card clause audits,
general loop forms, optional replacement priority and simultaneous multi-card
Life replacement ordering. Grade A and inventory counts are not all-clause
completion proof. Post-declaration DON-loss continuations for P-001/P-004 and
negated printed text for P-011 were not separately added in this batch.

Sources: [official promotional cards](https://en.onepiece-cardgame.com/cardlist/?series=569901),
[promotional FAQ](https://en.onepiece-cardgame.com/pdf/qa_promotion-cards.pdf?20260206=),
and [OP01 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op01.pdf?20240405=).
The latter confirms that identically worded look-and-order effects move the
whole looked group to one end of the deck. The P-048 FAQ's timing/disposal
wording differs from its current card text; the implementation follows the
printed When Attacking and deck-bottom instruction.

### Promotional catalog completion and actual movement results

Added the remaining 55 promotional definitions: 50 Characters, two Events and
three Leaders. Seven are vanilla; 48 have executable abilities and public-command
primary tests. Official numeric, color, attribute and exact-type metadata match
all 55. The runtime now contains 2,785 canonical gameplay cards, including 2,503
ability cards and 282 vanilla cards. No canonical IDs remain missing from the
recorded 24 official non-starter product categories or the 36 starter products.
This closes the recorded presence gap, not the broader clause-audit requirement.

The cards cover conditional battle protection, aliases and base-power auras,
DON-return reactions, private hand/deck movement, Life payments, independent
optional results, exact type/name/color/attribute gates, Counter recipients,
Blocker and Rush, negation, delayed power, removal protection and replacements.
P-117 Nami has its exact East Blue deck restriction and an actual empty-deck
victory through damage-triggered milling. P-111 Robin's paid replacement applies
to effect K.O. and other opposing removal, shares its once-per-turn limit across
those paths, retains use after decline, survives a saved prompt and resets on a
later turn. These single-source cases do not settle general replacement priority.

Shared corrections:

- P-046 Yamato orders the entire remaining hand at the deck bottom and draws
  exactly the number returned, including zero. The draw action can use the
  preceding movement's physical result.
- P-059 The World's Continuation counts Characters actually returned, not merely
  selected. A completion record retains successful original movements through
  protection, replacement choices and saved states; replaced moves do not
  inflate the Counter power. P-051 Shanks uses actual hand-trash count for
  battle-only power.
- P-103 Ace exposed a top-deck ordering reversal. Both hand-order/position and
  owner-order continuations now keep the player's first-to-last order in the
  deck. Top insertion uses reverse execution while logs retain submitted order.
  The later DON gift still resolves. Bottom placement retains the same contract.

The parser repairs 13 effect families across P-024/025/036/046/051/059/071/076,
P-077/091/100/104/117. Generated-effect public tests cover their choices and
boundaries, including P-024's separate Life Trigger. P-027's rule-level Franky
alias now passes through normalization and card emission as metadata; temporary
name changes do not become rule aliases. Its aura and an explicitly synthetic
named consumer prove the separate effect and alias boundaries.

Validation: all 48 new ability primaries pass 162 focused public-command cases
and Grade A. The full engine passes 2,687 files / 10,868 tests (three opt-in
skips); the full parser passes 135 files / 1,392 tests. Card-package tests (33),
server-adapter tests (30), adapter typecheck, and types/cards/engine builds pass.
All 181 changed TypeScript files pass scoped format, lint and type checks. The
guidance harness has the same 81 pre-existing issues as its baseline. Across
the goal, 1,912 canonical card definitions have changed.

Self-improvement: the test guide now requires actual movement-count evidence
through protection/replacement and exact top/bottom order across later prompts.
Yamato, The World's Continuation and Ace provide the new public proofs. No
simulator UI files changed.

Remaining scope: later existing-card clause audits, general loop forms,
optional affected-card replacement priority and simultaneous multi-card Life
replacement ordering. A new read-only comparison of current English and Japanese
rules plus OP05/ST09 FAQs did not resolve optional affected-card priority;
Ace/Rosinante and Enel/Zoro are documented next-proof candidates, not executed
new ruling evidence. P-104's new immunity proof covers opposing bottom-deck
removal, either-side DON thresholds and battle, not a separate own-effect or
K.O.-effect case. Inventory labels and Grade A are not all-clause completion
proof. No new enabled stress result is claimed beyond `a063d693fd` (4,000 seeded
games).

Sources: [official promotional cards](https://en.onepiece-cardgame.com/cardlist/?series=569901),
[official other-product cards](https://en.onepiece-cardgame.com/cardlist/?series=569801),
[promotional FAQ](https://en.onepiece-cardgame.com/pdf/qa_promotion-cards.pdf?20260206=),
and Comprehensive Rules 3-2-3, 4-10, 8-3 and 8-4. The recorded product audit is
[`nonstarter-catalog-gaps.json`](nonstarter-catalog-gaps.json).

### OP08 clause audit and simultaneous Life replacement ordering

Reviewed all 119 OP08 canonical cards against the official English product list
and FAQ: 91 Characters (ten vanilla), six Leaders, 19 Events and three Stages.
All 109 ability primary files pass Grade A. This is a bounded semantic audit;
Grade A alone does not prove every possible combination.

Six definitions needed repairs. Chopper now permits zero or one rested DON!!
independently for each selected Character. We Would Never Sell a Comrade to an
Enemy!!! protects only against opposing effect K.O.; Orlumbus can still pay its
own effect K.O. Ace publicly reveals the physical top card before its eligible
play and top-or-bottom choice. Oven has its printed 1000 Counter, Sasaki has
2000 Counter, and Who's.Who has the exact name needed by a real search exclusion.
The parser now preserves per-recipient DON distribution and opposing-effect
provenance. Generated-effect public tests prove both repairs.

New FAQ and branch tests cover Wapol without opposing Characters, replaced K.O.
without a false Kaido reaction, already-rested Shakuyaku, retained King Rush,
King's five-versus-six hand draw gate, Pudding's exact top-two face-down payment,
Kalgara's declined play and zero-Life success, independent Event results and
separate Life Triggers. Biscuit Warrior has an actual unlimited-copy deck
validation proof. Kaido & Linlin uses a legal ten-DON fixture and a payable
decline rather than an impossible twenty-DON field.

The engine gives each owner a private order for multiple face-up Life cards
placed at the deck bottom by ST13 Luffy's mandatory replacement. Saved choices,
invalid retries, both owners, mixed face states, failed Life costs, and later
independent payments are covered. The order preserves the batch's physical deck
slots. Nested movement continuations now wait for completion and use actual hand
arrivals, excluding replaced cards; a draw through the moved batch proves that
ordering occurs first. A zone-generation stamp prevents a later incarnation of
a card from joining the earlier ordering group.

Validation: all 109 OP08 ability primaries pass Grade A. The full engine passes
2,689 files / 10,910 tests (three opt-in skips), and the full parser passes
135 files / 1,395 tests. Card-package tests (33), adapter tests (30), adapter
typecheck, and types/cards/engine builds pass. All 36 changed TypeScript files
pass scoped format, lint and type checks. The guidance harness still reports exactly
the same 81 pre-existing issues. Across this goal, 1,915 canonical definitions
have changed. No simulator UI files changed. No new enabled stress run is claimed.

Remaining scope includes OP09 and later existing-card clause audits, general
loop forms, optional affected-card replacement priority, and full simultaneous
cross-zone replacement atomicity. The last item is a synthetic mixed Life/field
case: another removal replacement can draw a bottomed Life card before the final
batch order is published. Generation validation prevents stale binding but does
not settle that wider movement sequence. Specific OP08 proof limits remain for
S-Snake's full expiry and negative filter boundaries, source removal before
Black Maria's delayed result, and Jewelry Bonney's Life provenance combinations.

Sources: [official OP08 card list](https://en.onepiece-cardgame.com/cardlist/?series=569108),
[OP08 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op08.pdf?20260206=), and
Comprehensive Rules 3-1-7, 3-1-8 and 8-1-3. Reusable test guidance now distinguishes
nested movement continuations from following sibling actions.

### OP09 audit, opposing Life payment and stable-turn optional loops

Reviewed all 119 OP09 cards against the official product list and FAQ: 91
Characters (ten vanilla), six Leaders, 18 Events and four Stages. Numeric, color,
attribute and type metadata match. All 109 ability primary files pass Grade A.
The following bounded repairs are complete; this is not proof of all engine
interaction combinations.

- Kuzan's opposing cost-three Character-to-Life placement is an activation cost.
  It now requires an eligible payment target, retains the chosen top/bottom
  face-up position across saved prompts, and discards from the opponent's hand
  only after actual payment. Immunity prevents payment eligibility; a replacement
  that moves the card elsewhere prevents the following discard. Earlier own-field
  Character-to-Life costs retain their default ownership.
- Teach's Character negation shares the printed duration of its attack restriction:
  through the opponent's next turn. Its separate Leader negation still lasts only
  this turn. The runtime now computes negation expiry for the full native duration
  set, so the corrected effect also expires. Public tests prove next-turn
  suppression, later restored activation, Blocker and once-per-turn limits.
- Gum-Gum Giant's printed text regains the missing DON!! minus sign. Its native
  payment was already correct; a new wrong-Leader case proves payment without
  power or draw.

Nami's empty-deck win replacement now respects effect negation. Black Vortex
and Black Hole reproduce the official FAQ loss through real damage, negation
and a later draw of the final deck card. The shared check also applies to
Leader effects that defer empty-deck defeat.

The parser recognizes Kuzan's colon payment instead of two independent actions,
preserves Teach's shared Character duration, and no longer assumes every triggered
cost is optional. Explicit may/can handling and existing DON-cost conventions
remain. Generated-effect public tests prove payment, failed activation, saved
position choices and negation expiry.

Optional deterministic rest/ready loops with fulfilled turn conditions now reach
the finite repetition declaration. The same narrow turn-condition verifier is
shared with mandatory loops. Two failing cases now pass: a single-owner loop
with saved declaration and same-state restart prevention, and a two-owner loop
with turn-player-first declarations and minimum-count stopping. A false turn
condition never creates the reaction. Other conditions, payments, choices and
moving-card optional loops remain outside this certification.

Additional proofs cover sequential rested-count rechecks, self-return payment,
trash versus K.O. provenance, persistent granted effects, dynamic battle power,
Roger's Life condition at Blocker activation, Life Trigger gates after damage,
zero/one-card Sanji hand trash, and independent choice declines. The FAQ confirms
that Shinobu taking the last Life only after Blocker activation does not create
Roger's win; the existing capture behavior passes this case.

Validation: 2,692 engine files / 10,960 tests pass (three opt-in skips). The full
parser passes 136 files / 1,397 tests. Card tests (33), adapter tests (30), adapter
typecheck and types/cards/engine builds pass. All 48 changed TypeScript files
pass scoped format, lint and type checks; all 109 ability primaries pass Grade A.
The guidance harness retains the same 81 pre-existing issues. Across the goal,
1,916 canonical definitions
have changed. No simulator UI files changed. No new enabled stress run is claimed.
Remaining scope begins with OP10 and later existing-card audits, broader optional
moving-card and stable-condition loop families, optional affected-card replacement
priority, and full simultaneous cross-zone replacement atomicity.

Sources: [official OP09 cards](https://en.onepiece-cardgame.com/cardlist/?series=569109),
[OP09 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op09.pdf), Comprehensive Rules
8-1-3-1, 8-3-1-3/4/7 and 11-1-1-2/3. Test guidance now warns against automatic
optional-cost classification and requires both duration persistence and expiry.

### OP10 audit, ordered compound payments and continuous cost

Reviewed all 119 OP10 cards against the official English product list and FAQ:
94 Characters (11 vanilla), six Leaders, 18 Events and one Stage. All 108 ability
primary files pass Grade A. Metadata review corrected Moocy's Counter to 2000;
a real battle proves the correction. No simulator UI files changed.

Kin'emon 026/027 now returns the field source and filtered trash card as one
payment in the player's chosen order. Both order directions survive saved
prompts and are proved by later public draws. Invalid missing-source, duplicate
and wrong-power submissions preserve the unpaid state. Attached DON returns
rested. Parser output retains this combined payment instead of two sequential
costs; ordinary trash-only payments remain covered.

Fighting Fish rechecks its attached-DON condition after payment. Returning the
last attached DON suppresses its KO; paying another DON retains the effect.
Removed-source On KO effects retain their captured DON conditions. These are
separate boundaries, not a general recheck of every textual condition.

Usopp's cost aura now uses staged continuous contributions in turn-player order.
Tsuru leaves base-three Bartolomeo at two; Kaku removes the threshold bonus and
leaves it at zero; turn-player Issho applies before non-turn-player Usopp and
also leaves it at zero. The runtime scan contains 64 permanent cost actions;
Usopp is the only direct current-cost threshold. This proves those catalog
interactions, not arbitrary cyclic dependencies or player-chosen ordering of
multiple same-controller permanent effects.

The earlier mixed Life/field replacement gap is repaired for the existing
mandatory ST13 Luffy path. Each owner's replaced Life subset moves and receives
private ordering before the remaining field replacement can draw from that
deck. Original movement identity, actual-arrival counts and saved continuation
remain intact; the parent condition is not rechecked halfway through movement.
Both target orders, both owners, accepted/declined replacements and invalid
saved retries pass public-command tests. Broader future conditional replacement
families remain outside this bounded proof.

Additional FAQ proofs cover Sugar's Counter-Event reaction despite declined
optional payment, exclusion of Event Life Triggers from Event activation,
Law's total-cost payment and face-down failed reveal return, Liberation's base
cost limits, Kid's already-face-up Life payment rejection, exact Trebol power
protection, independent Doflamingo reactions, and actual Hawkins/Heat & Wire
Life Triggers. Existing weak Cub/Sai payment-only assertions now prove actual
bounce and opposing cost-one eligibility.

Validation: 2,693 engine files / 11,004 tests pass (three opt-in skips).
The full parser passes 137 files / 1,399 tests. Card tests (33), adapter tests
(30), adapter typecheck and types/cards/engine builds pass. All 42 changed
TypeScript files pass scoped format, lint and type checks. The guidance harness
retains the same 81 pre-existing issues. The cumulative definition count stays
1,916 because these three corrected definitions were already changed earlier.
No fresh enabled stress run or deployment is claimed.
Remaining scope starts with OP11 and later clause audits, broader optional loop
families, optional affected-card replacement priority, and general continuous
ordering. The engine remains incomplete; catalog presence and Grade A do not
prove all printed clauses or all rule interactions.

Sources: [official OP10 cards](https://en.onepiece-cardgame.com/cardlist/?series=569110),
[OP10 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op10.pdf?20260206=), and
Comprehensive Rules 3-1-7/8, 8-1-3-3-5 and 8-3-1. Test guidance now requires
combined-payment order and post-payment DON proofs.

### OP11 audit, repeated Counter actions and replacement payment pools

Reviewed all 119 OP11 cards against the official English product list and FAQ:
94 Characters (21 vanilla), six Leaders, 18 Events and one Stage. All 98 ability
primary files pass Grade A. Smoker now protects against non-Special Character
effects only, so an Event can K.O. it. Camie accepts its optional activation
before checking the current Life threshold. The same wording audit corrected
Boa Hancock OP07-038, Usopp OP10-042 and Shu OP11-088: activation timing remains
separate from the result condition. Shu retains the actual attacker's attribute
through queued actions, nested choices and saved state.

Counter actions now resolve one at a time and repeat until the defender passes
or has no legal Counter. A Counter Event can recover or draw a Character which
is then used in the same battle. Event payment uses its current discounted hand
cost. Invalid multi-card submissions do not pay or move cards. Existing tests
now pass explicitly at the intended battle boundary; public test helpers do
not hide extra actions. Bots retain their defense plan across these decisions
and submit at most one card per action.

Simultaneous Koby replacements preserve initial payment affordability and the
physical trash-card pool. A card K.O.'d earlier in the same movement cannot
become a new payment for another replacement. Saved decisions, invalid retries,
grouped choices and a later separate removal are covered. Trigger provenance
is retained in the semantic loop fingerprint; its generation-free action
metadata no longer prevents recognition of the established moving-card loop.
General optional loop families remain unfinished.

Additional proofs cover independent Jinbe DON choices, already-face-up Life
payment rejection, Luffy's attached DON through turn handoff, same-count Nami
Life movement, Culverin's base-cost threshold, Red Hawk's post-payment Life
check, Blue Hole's insufficient deck payment, Arlong's current hand cost,
Franky's Event reaction and Life Trigger exclusion, compound-cost declines,
partial hand trash, and Koby's active-target permission without Rush.

Validation: 2,697 engine files / 11,045 tests pass (three existing opt-in skips).
The parser passes 138 files / 1,401 tests. Card-package tests (33), adapter tests
(30), adapter typecheck and types/cards/engine builds pass. All 191 changed
TypeScript files pass scoped format, lint and type checks. The guidance harness
retains its 81 pre-existing issues. Cumulative canonical definitions changed:
1,917. No simulator UI
files changed. No fresh enabled stress run or deployment is claimed.
Remaining scope starts with OP12 and later clause audits, broader optional loop
families, optional affected-card replacement priority and general continuous
ordering. Catalog presence and these bounded checks do not prove completion.

Sources: [official OP11 cards](https://en.onepiece-cardgame.com/cardlist/?series=569111),
[OP11 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op11.pdf), and Comprehensive
Rules 7-1-3-1, 8-1-3 and 8-3-1.

### OP12 audit, hand-only restrictions and private searches

Reviewed all 119 OP12 cards against the official English product list and FAQ:
92 Characters (24 vanilla), six Leaders, 20 Events and one Stage. All 95 ability
primary files pass Grade A. Five OP12 definitions needed corrections.

Zoro 036 now restricts effect play from hand only. Gecko Moria can play it from
trash, while the existing hand prohibition remains. Jewelry Bonney 101 gains
its missing Supernovas-gated Life Trigger in the canonical definition and
English text; both matching and nonmatching Leader branches are exercised.

Color of the Supreme King Haki 018 first boosts any Character or a Rayleigh
Leader, then separately offers its active-DON rest. Declining or having no
active DON preserves the boost and causes no opposing power reduction.
Already-rested DON cannot fund that reduction. Both battle and turn expiry
are covered. Parser output preserves this ordered optional action instead of
moving the payment before the boost or losing the dependent effect.

Color of Observation Haki 017 now applies red to both alternative search
branches, as required by the official FAQ. A non-red high-cost Character is
excluded. This corrects an earlier test and inventory statement which had
accepted a green Character; repeated quantity wording alone did not establish
qualifier scope.

The private search on 079 no longer reveals its chosen card in the opponent's
log. A native reveal flag preserves the public default for printed reveal
searches. Private searches emit a generic public message with a controller-only
named message, omit the chosen target ID from the public log, and keep hand
projection hidden. Saved selection and remainder decisions retain privacy.
The same printed look-and-add family is repaired for OP05 Ulti, OP15 Enel and
OP16 Moby Dick. A public Brannew reveal remains visible as a control.

Added FAQ and boundary proofs include Rayleigh's base-power selection, Zoro's
third attached DON and Blocker interaction, Garp/Kuzan payment-before-draw,
Sanji's printed Lightning cost, Law's discount retention, Koala's excluded
Character attacks and Life Triggers, simultaneous Koushirou protection, partial
Zephyr discard, Whitebeard event play decline, post-payment hand thresholds,
and paid Baratie activation under a nonmatching Leader.

Validation: 2,698 engine files / 11,090 tests pass (three existing opt-in skips).
The parser passes 139 files / 1,404 tests. Card tests (33), adapter tests (30),
adapter typecheck and types/cards/engine builds pass. All 61 changed TypeScript
files pass scoped checks. All 95 OP12 ability primaries pass Grade A after the
final Sanji decline proof. The guidance harness retains the same 81 baseline
issues. Cumulative canonical definitions changed: 1,920.

Remaining scope starts with OP13 and later clause audits, broader optional loop
families, optional affected-card replacement priority and general continuous
ordering. These bounded audits and catalog labels do not prove full completion.
No simulator UI files changed; no deployment or fresh enabled stress run claimed.

Sources: [official OP12 cards](https://en.onepiece-cardgame.com/cardlist/?series=569112)
and [OP12 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op12.pdf).

### OP13 audit and start-of-game effects

Reviewed all 120 OP13 cards against the official English product list and FAQ:
93 Characters (16 vanilla), six Leaders, 18 Events and three Stages. All 104
ability primary files pass Grade A. Eight definitions needed corrections.

Imu now rejects Events costing two or more while allowing one-cost Events and
higher-cost Characters. The deck validator supports category filters alongside
cost filters. Its optional startup search plays up to one Mary Geoise Stage,
shuffles after an accepted search (including zero choices), and resolves Stage
On Play effects before the next player's startup effect and opening hands.
Declining the search does not shuffle. Saved prompts, invalid-choice retry,
private candidates, public legal-command descriptors and both players are
covered through setup commands. Ordinary opening draws now occur after the
first-player decision and startup effects.

Current Comprehensive Rules 5-2-1-5-1 order startup effects by the player who
chose first or second, then the other player. The older OP13 FAQ instead says
first player, then second player. Current English and Japanese rules agree;
the engine follows the current rule, including the chooser going second.
A synthetic Stage On Play test proves queue timing before the second startup
and opening hands; Mary Geoise itself has no On Play effect.

Dragon now reduces opposing power by 2,000. Shanks prevents normal hand play
but permits effect play, including the official Law interaction after saved
state. A typed play-origin qualifier preserves the default restrictions on
other cards. Ju Peter applies his own-turn, ten-trash base-power-7,000 effect
to all own Five Elders, including lowering higher printed power and retaining
attached DON bonuses. His copied Saturn search and English text are removed.

If I Bowed Down to Power blocks Blocker only for Leader attacks, with turn
expiry; Character attacks still permit Blocker. Brilliant Punk regains its
missing draw Life Trigger. Go All the Way to the Top's Counter bonus lasts
only for the battle. Never Existed in the First Place pays its optional DON
cost before checking Imu. Parser contracts preserve these qualifiers, base
power, and Imu's startup and deck-building clauses.

Additional proofs cover self-removal replacements, Teach's draw without Life,
Roger's fixed affected group, replaced Ace return, Sabo's cost-11 target,
post-cost and given-DON gates, Counter K.O. before damage, excluded Oro Jackson
removal causes, Empty Throne's live trash threshold, and the exact top-Life
face-up payment boundary. Official printed metadata and separate Life Trigger
fields were compared across the complete set.

Validation: 2,698 engine files / 11,121 tests pass (three existing opt-in skips).
The parser passes 140 files / 1,408 tests. Card tests (33), adapter tests (30),
adapter typecheck and types/cards/engine builds pass. All 61 changed One Piece
TypeScript files pass scoped checks; the adapter test passes formatting and
package typecheck. All 104 OP13 ability primaries pass Grade A. The guidance
harness retains the same 81 baseline issues. Cumulative canonical definitions
changed: 1,922.

Remaining scope starts with OP14 and later clause audits, broader optional loop
families, optional affected-card replacement priority and general continuous
ordering. Bounded audits and catalog labels do not prove full completion.
No simulator UI files changed; no deployment or fresh enabled stress run claimed.

Sources: [official OP13 cards](https://en.onepiece-cardgame.com/cardlist/?series=569113),
[OP13 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op13.pdf),
[current English rules](https://en.onepiece-cardgame.com/pdf/rule_comprehensive.pdf?20260828=)
and [Japanese rules](https://onepiece-cardgame.com/pdf/rule_comprehensive.pdf?20260109=).

### OP14 audit, printed metadata and conditional effects

Reviewed all 120 OP14-numbered cards against the official English card list,
June 26, 2026 combined OP14/EB04 FAQ and the OP14-009 erratum: 93 Characters
(eight vanilla), seven Leaders, 19 Events and one Stage. The EB04-numbered
cards in the mixed product remain a separate audit scope.

Eight canonical definitions needed corrections. Leader Law now selects only
Supernovas or Heart Pirates Characters. Mihawk's post-cost cost-five condition
controls both DON reactivation and the subsequent Character-play prohibition;
a failed condition does not prohibit play. Character Law loses the obsolete
Seven Warlords type per the official erratum, proven by exclusion from Sengoku's
search. Nami regains her printed +1000 Counter. Mr.5's attribute is Special,
not Strike, proven through Zephyr's actual target choice. The OP14-019 search
Event costs one DON, not four, proven with only one active DON. Bullet String
permits the optional DON return before checking the Leader type; a failed type
check gives neither power bonus. You'll Frighten Me restores its printed heart
symbol in the canonical and English names.

The parser now retains Law's alternative type filters, Bullet String's second
bonus on the same physical recipient and Mihawk's opposing-Leader Slash
condition. It already grouped Mihawk's post-cost condition correctly; a new
contract preserves that group and its play restriction.

K.O. event filtering now preserves the Character's effective base power at the
K.O. timing. Vista's opponent-turn copied base power previously disappeared
when Ace's queued reaction checked Vista after movement to trash. The event
snapshot carries that base power across queued choices and saved state; only
the matching Character's K.O. event filter uses it. Action conditions and
ordinary target selection continue to read live state. Battle K.O., effect K.O.,
the eight-card hand negative and a saved optional listener with nested filters pass. The same event-filter correction covers Boa
Hancock; a catalog scan found no equivalent confirmed lost-property gap in
other current K.O. listeners.

A follow-up simultaneous K.O. check found that removing Ju Peter first changed
later Five Elders before their values were captured. The replacement process
now records the original group's base powers by physical ID and zone generation
before moving any member. Original continuations retain those observations;
transformed replacement actions begin fresh observations. Both target orders
and JSON-resumed accepted/declined replacements pass with a clearly labeled
unlimited observer fixture and the real Ju Peter aura. The focused shared gate
passes seven files / 71 tests. A possible older remaining-target continuation
issue after a card leaves and re-enters has no confirmed catalog reproduction;
that concern is not claimed as repaired by this snapshot change.

Additional proofs cover swapped base power after a partner leaves, Jinbe's
repeatable activation, mandatory Hancock draws for simultaneous plays,
owner/type-limited redirection, Crocodile/Moria action order before On K.O.,
fixed affected groups, the exact hand threshold after Event payment, independent
power and DON effects, and Life Trigger cards excluded from trash counts.
Paid Main/Counter Events enter trash before their effect resolves; Ground
Death's eight/nine-trash boundary proves that the paid Event itself counts.
This differs from resolving Life Triggers, which remain outside ordinary areas.
The reusable testing note now records this distinction, with Ground Death and
multiple OP14 Life Trigger cases as forward evidence.

Validation: 2,699 engine files / 11,152 tests pass (three existing opt-in skips).
The parser passes 141 files / 1,411 tests. Card tests (33), adapter tests (30),
adapter typecheck and types/cards/engine builds pass. All 48 changed TypeScript
files pass scoped checks. All 112 OP14 ability primaries pass Grade A. The
final numeric/color/trait/attribute metadata comparison has no mismatch, using
the official Law erratum to override its stale card-list trait row. The guidance
harness retains the same 81 baseline issues. Cumulative canonical definitions
changed: 1,925.

Remaining scope starts with OP15 and later card clauses, EB and promotion
clauses, broader optional loop families, optional affected-card replacement
priority and general continuous ordering. Bounded audits and catalog labels do
not prove full completion. No simulator UI files changed; no deployment or
fresh enabled stress run claimed.

Sources: [official OP14 cards](https://en.onepiece-cardgame.com/cardlist/?series=569114),
[OP14/EB04 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op14_eb04.pdf?20260626=)
and [OP14-009 erratum](https://en.onepiece-cardgame.com/topics/notice-op14-009.php).


### OP15 audit, optional actions and selection conditions

Reviewed all 119 OP15-numbered cards against the official English product list,
March 13, 2026 OP15/EB04 FAQ and Arlong erratum: 93 Characters (six vanilla),
six Leaders, 19 Events and one Stage. EB04-numbered cards remain separate scope.

Eleven canonical definitions needed corrections, including one related OP05 card.
Koby costs one DON. Arlong has
Slash and Luffy092 has Special, proven through real battle/target interactions.
Kuro permits either player's rested Character as the delayed target, but its
restriction applies only during the opponent's Refresh. Purinpurin permits a
rested Character whose cost differs from its attached DON to be selected; the
K.O. condition is checked after that choice. Amazon forces its power reduction
when the opponent has no active DON to return. Kotori and Hotori permit their
DON return before checking for the named companion. Fire Fist resolves its
power changes before an optional effect discard; discarding only one available
card is legal but does not enable the dependent K.O. Impact Dial regains its
separate Life Trigger, which K.O.s without removing another Life card.
The full parser gate also identified Charlestone's old split Counter model; its
optional discard now remains an action after the power bonus, with no DON
reactivation when the full discard does not occur.

Shared action types now express a specified Refresh player, selected-target
result filters, full-amount-dependent hand-discard continuations and an
opponent active-DON count. Parser contracts retain those distinctions, delayed
end-of-turn actions and explicit cost-area DON ownership. Six public tests run
parser-generated effects, including JSON-resumed Kuro and Purinpurin choices,
zero/one/two-card Fire Fist discards and Amazon's unavailable-payment case.
An independent read-only review found no confirmed defect in those four paths.

Added command proofs cover Lucy Event activation versus Life Triggers, Brook's
latched defeat after deck refill, same-physical-card Rebecca replay, Enel's
existing-DON assignment, simultaneous Luffy replacements, real Blocker battles,
DON-giving timing, separate Character/Event Triggers, Counter expiry, Event
trash thresholds and independent later clauses with no legal Character target.
Golden Rifle replenishes Life with no remaining hand cards; Dressrosa Kingdom's
On Play draw now uses an actual Dressrosa Leader. Six vanilla IDs are 016, 030,
049, 062, 089 and 107.

Validation: 2,700 engine files / 11,210 tests pass (three existing opt-in skips).
The parser passes 142 files / 1,415 tests. Card tests (33), adapter tests (30),
adapter typecheck and types/cards/engine builds pass. All 70 changed TypeScript
files pass scoped checks. All 113 OP15 ability primaries pass Grade A. The final
119-card numeric/color/trait/attribute comparison has no mismatch. The guidance
harness retains the same 81 baseline issues. Cumulative canonical definitions
changed: 1,928.

The full gate exposed stale fixtures for Purinpurin's broader legal selection,
Fire Fist's newly available optional action and Koby's corrected cost in grouped
removal. Their public choices and exact group outcomes now match the repaired
rules; all pass in the full rerun. The repeated optional-action issue also
produced a short test-authoring note, with Fire Fist and Charlestone as evidence.

Remaining scope starts with OP16 and later card clauses, EB and promotion
clauses, broader optional loop families, optional affected-card replacement
priority and general continuous ordering. Bounded audits and catalog labels do
not prove full completion. No simulator UI files changed; no deployment or
fresh enabled stress run claimed.

Sources: [official OP15 cards](https://en.onepiece-cardgame.com/cardlist/?series=569115),
[OP15/EB04 FAQ](https://en.onepiece-cardgame.com/pdf/faq_op15-eb04.pdf?20260313=)
and [Arlong erratum](https://en.onepiece-cardgame.com/topics/notice_op15-023.php).


### OP16 audit, shared qualifiers and ordered actions

Reviewed all 119 OP16-numbered cards against the official English product list,
August 21, 2026 FAQ and Otama erratum: 95 Characters (nine vanilla), six Leaders,
16 Events and two Stages. All exported IDs and the numeric/color/type/attribute
metadata match the official rows; dual-attribute Mohji & Cabaji remains intact.

Eight canonical definitions needed correction. Ace's 8000-power threshold now
applies to both the named Luffy and Whitebeard-type alternatives. The parser
previously omitted this whole effect; its target grammar now preserves the
shared qualifier, with an exact contract and public parsed-effect proof.
Ramba regains its printed +1000 Counter, proven through battle. Zoro's single
On Play sequence now resolves the rest action before an optional hand discard
and dependent DON assignment. The OP15 parser family already emits this shape;
a new contract preserves it. Kuzan's optional DON return can be declined.
Sakazuki's name no longer counts as a different name from other Sakazuki cards.
Otama's stored English/canonical text now matches the erratum and its already
correct either-field condition. Two Event names now match their printed names.

New proofs cover exact-8000 reveal costs, inclusive Whitebeard types, all four
Luffy distinct-name FAQ examples with dual-name cards, Marco revival and removal
replacement, actual Blocker/Unblockable battles, self-return continuations,
Sengoku partial Admiral plays, Buggy effect removal versus full-field rule trash,
Teach redirection and Character Triggers, Otama opponent-only conditions,
fixed Counter bonuses, and private Life selection. No new shared runtime
change was needed for these audited cases.

Event/Stage proofs now check active-aura and Blocker negation plus expiry,
separate Life Triggers, the resolving Trigger excluded from trash recovery,
all Black Vortex printings excluded by name, a paid Mahoroba becoming the tenth
trash card, Teach play with no opposing Life, and Stage payment/action order.
Hallowed Glacier Slash also permits reactivation after an opponent Marco's
self-K.O. replacement; this directly proves the FAQ's own-effect case. Moby
Dick retains private search disclosure. Marineford pays DON and self-rest costs
before draw/discard. Payable decline tests replace weak optional fixtures.

Validation: 2,702 engine files / 11,255 tests pass (three existing opt-in skips).
The parser passes 144 files / 1,417 tests. Card tests (33), adapter tests (30),
adapter typecheck and types/cards/engine builds pass. All 55 changed TypeScript
files pass scoped checks. All 110 OP16 ability primaries pass Grade A. The final
119-card numeric/color/trait/attribute comparison has no mismatch. The guidance
harness retains the same 81 baseline issues. Cumulative canonical definitions
changed: 1,931.

Checkpoint feedback: Zoro reused the optional-action structure established by
Fire Fist and Charlestone without a runtime extension. Ace again required
checking a qualifier shared by alternatives; the parser-generated command proof
now prevents an omitted parse from being mistaken for a complete definition.

Remaining scope starts with OP17, EB and promotion clauses, broader optional
loop families, optional affected-card replacement priority and general
continuous ordering. Bounded audits do not prove full completion. No simulator
UI files changed; no deployment or fresh enabled stress run claimed.

Sources: [official OP16 cards](https://en.onepiece-cardgame.com/cardlist/?series=569116),
[OP16 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op16.pdf?20260821=)
and [Otama erratum](https://en.onepiece-cardgame.com/news/notice-op16.html).

### OP17 audit, named attack targets and Leader alternatives

Reviewed the 119 OP17-numbered cards against the official English product list
and August 21, 2026 FAQ: 95 Characters (six vanilla), six Leaders, 17 Events and
one Stage. All 119 IDs and final names, numeric values, colors, traits and
attributes match the official rows. Separate Life Trigger fields were compared
as well as main card text; this caught OP17-076's omitted Trigger.

Eight canonical definitions were corrected. Oden permits either a Wano or an
inclusive Whitebeard Character instead of requiring both types. Crone Oli's name,
Fugar's cost of one, and Beckman's absence of a printed Counter now match the
source. Ulti & Page One adds its missing active DON. The New Era Event's name
has its printed punctuation. Sobered Up now returns one DON and draws two from
its Life Trigger. Linlin's controller selects the opposing hand card without
seeing its identity, while the opponent still selects the effect branch.

The shared permanent-effect evaluator now combines simultaneous named attack
target restrictions as alternatives. Captain John plus Kid permits either named
rested Character. Leader, unrelated Character and active-target attacks remain
illegal. A negated source no longer contributes; independent prohibitions still
apply. Public legal-command targets agree with actual attack legality. The FAQ
uses P-067, which is absent from the current catalog and official promotion-list
extract. These interaction tests use OP01-051's equivalent named restriction with
its DON condition satisfied; exact P-067 implementation remains open.

The parser now accepts a named Leader OR an exact Leader type. Oden's target
alternatives already parsed correctly; this previously missing Leader condition
caused the whole effect to be omitted. Parser contracts and generated public
plays cover both qualifying Leaders, wrong Leaders, eligible alternative types,
and the common power threshold.

New command proofs cover grouped self-rest and self-K.O. replacements, concurrent
base-power setters, optional effects declined then used on a later attack,
external Blocker grants under source/recipient negation, field-only cost bonuses,
Big Mom Trigger plays on the opponent's turn, and private hand selection. Event
proofs cover either-field high-cost conditions, post-cost Leader gates, actual
Trigger abilities versus text mentioning Trigger, late entrants excluded from an
already resolved cost reduction, Counter base-power conditions, and partial
opponent discards that still permit Maser Saber's controller-owned K.O.

Validation: 2,704 engine files / 11,306 tests pass (three existing opt-in skips).
The parser passes 145 files / 1,418 tests. Card tests (33), adapter tests (30),
adapter typecheck and types/cards/engine builds pass. All 58 changed TypeScript
files pass scoped checks; all 113 OP17 ability primaries pass Grade A. The
119-card metadata comparison has no mismatch. The guidance harness retains
its same 81 baseline issues. Cumulative canonical definitions changed: 1,932.

Checkpoint feedback: comparing separate Trigger fields found a clause that the
main-text scan missed. The named-target FAQ exposed an intersection bug despite
both cards' individual attack restrictions already passing. No new workflow
abstraction was added.

A final primary-proof review leaves explicit OP17 positive-clause gaps: 014,
015, 016, 024, 025, 029, 030, 031, 032, 033, 045, 046, 048, 052, 053 and 054;
050 still needs physical reordering and its bottom branch. These are proof gaps,
not confirmed new runtime failures. The audit above covers source/structure and
the listed added interactions, not full completion of every OP17 clause.

Remaining scope starts with those OP17 proofs, EB and promotion clauses, the missing P-067 definition,
broader optional loops, optional affected-card replacement priority and general
continuous ordering. Structural equality and Grade A are not complete clause
proof. No simulator UI files changed, and no deployment or fresh enabled stress
run is claimed.

Sources: [official OP17 cards](https://en.onepiece-cardgame.com/cardlist/?series=569117)
and [OP17 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op17.pdf?20260821=).

### OP17 positive-clause proof completion

The follow-up closes the explicit first-half gaps listed above and the weak
second-half primary cases found during a second review. Fifty-three Character
primary files now assert actual outcomes. Generic prompt-draining, field-placement
and turn-handoff checks were replaced where they did not prove a printed clause.
No card definitions, parser code, engine runtime or UI changed in this follow-up.

New proofs include Whitey Bay's accepted self-trash battle protection, Marco's
same-physical-card revival after a qualifying discard, Rakuyo's two real K.O.
targets including base power 2000/current power 5000, Howling Gab's Banish on
Trigger Life, and Building Snake's Shanks-only DON assignment and actual On K.O.
target. Searches assert the selected physical card, public reveal when required,
chosen deck-bottom order and saved-state continuation. Private Drake hand choices
remain hidden until the chosen card is discarded.

Other cases prove actual Rush:Character, Blocker and Unblockable battles,
compound attack-prevention costs and expiry, self/opponent high-cost conditions,
field-only cost increases, hand recovery filters, Dorry/Brogy play restrictions,
Big Mom own-turn effects and opponent-turn Trigger behavior, and ordered opponent
hand-to-deck movement. Life Triggers are entered through damage and continue
through their printed On Play effects where appropriate. Existing cross-card
suites supply the reviewed Counter, replacement, reaction and qualifier proofs.

Validation: all OP17 primaries plus the four OP17 cross-card suites and two
related rule suites pass: 127 files / 453 tests. All 53 changed TypeScript files
pass scoped checks. All 113 ability primaries pass Grade A after the explicit
positive and decline search tests. Cumulative canonical changes remain 1,932.

No new implementation defect was confirmed by this proof pass. The shared Shiki
once-per-turn key is covered separately for each trigger and for repeated opponent
attacks; a same-turn out-of-turn attack spanning both trigger types is not claimed.
This is a bounded printed-clause audit, not exhaustive proof of every interaction.

Next scope: missing P-067 and promotion/EB clause audits, broader optional loops,
optional affected-card replacement priority, and general continuous ordering.
The prior implementation checkpoint's full engine/parser/build results remain
recorded above; this test-only follow-up uses the narrower OP17 integration gate.

### EB01 audit and regional promotion-catalog correction

Reviewed all 61 EB01 cards against the official English product list and FAQ:
44 Characters (six vanilla), three Leaders, 12 Events and two Stages. Metadata
now matches all 61 source rows. Existing primary tests already prove each
positive clause; added cases close material FAQ and boundary gaps.

Three gameplay names were corrected. EB01-027 is Mr.1(Daz.Bonez). OP01-008 and
OP01-109 no longer include the printing label "Box Topper" in their canonical
or English names. The latter two defects had game effects: another printing of
Cavendish incorrectly permitted EB01-012's DON refresh, and OP04-051's named
exclusion incorrectly offered Who's.Who. Both public repros fail before the name
correction and pass afterward. Slugs, export names and printing identities remain
stable. No shared runtime or parser change was needed.

P-067 Eustass"Captain"Kid is now implemented and exported from an official English
prerelease image, independently confirmed by the English Asia card list. Four
public tests prove its rested restriction without DON, other named Kid targets,
illegal Leader/unrelated targets and the exact P-067 plus OP17 Captain John FAQ
pair. The catalog now has 2,786 gameplay cards, plus the separate DON definition;
the ability inventory increases to 2,504 while vanilla remains 282.

The P-067 investigation disproved the assumption that a Western-only card-list
comparison establishes complete promo coverage. Two official English Asia
products reveal 31 further missing canonical IDs after P-067 was added. Their
exact source rows are recorded in `regional-promo-catalog-gaps.json`; the expanded
`nonstarter-catalog-gaps.json` now covers 2,546 unique canonical source IDs and
records those 31 missing IDs. This comparison does not claim complete regional
coverage or tournament legality. No missing releases were inferred from numbering.

Additional public proofs cover persistent Oden/Kid attack bonuses after their
conditions cease, another-printing Cavendish, Ivankov/Inazuma end-turn order,
paid zero-card Hiyori play followed by draw, Oars payment eligibility and spent
turn limit, Brook Rush persistence, Laboon's reaction limit, paid wrong-Leader
conditions, active-Blocker Counter redirection without another Block Step,
face-up Life payment after Kyros's turn limit resets, and zero/one-Life behavior
for Kingdom Come and Kami. Bentham copies modified opposing power before its own
DON power is applied. Existing Mini-Merry and Loguetown tests retain exact compound
payment, physical deck order and Life Trigger proof.

Validation: 2,705 engine files / 11,402 tests pass, with three existing opt-in
skips. Cards (33), adapter tests (30), adapter typecheck and types/cards/engine
builds pass. All 33 changed TypeScript files pass scoped checks. Grade A passes
for 55 EB01 ability primaries plus P-067 and the two corrected OP01 cards. The
61-card metadata comparison has no mismatch. Guidance checks retain the same
81 baseline issues. Cumulative canonical definitions changed: 1,935.

Checkpoint feedback: the inventory procedure now treats source comparisons as
bounded and directs absent FAQ/event cards to official regional lists and card
images. This turned one absent FAQ card into a concrete 31-card remaining queue.

Next scope: implement the recorded regional promos, continue EB02/EB03/EB04 and
promotion clause audits, then resolve remaining optional-loop, replacement-priority
and continuous-ordering gaps. No simulator UI or deployment changed; no new
enabled stress run is claimed.

Sources: [EB01 cards](https://en.onepiece-cardgame.com/cardlist/?series=569201),
[EB01 FAQ](https://en.onepiece-cardgame.com/pdf/qa_eb01.pdf),
[OP01 cards](https://en.onepiece-cardgame.com/cardlist/?series=569101),
[P-067 official image](https://en.onepiece-cardgame.com/images/events/2024/store_tournament_op07/card_01.png),
[English Asia promos](https://asia-en.onepiece-cardgame.com/cardlist/?series=556901)
and [English Asia other products](https://asia-en.onepiece-cardgame.com/cardlist/?series=556801).

## October 8, 2026 regional promo implementation checkpoint

Added the 31 canonical IDs recorded in the preceding regional audit: P-038,
040, 064, 066, 080, 086, 087, 094, 095, 108, 109, 114, 116, 118, 121,
136–149, 157 and 159. The official sources are the
[English Asia Promotion list](https://asia-en.onepiece-cardgame.com/cardlist/?series=556901)
and [Other Product list](https://asia-en.onepiece-cardgame.com/cardlist/?series=556801).
All 31 names, numbers, colors, traits, attributes and applicable stats match
those source rows. The catalog now exports 2,817 gameplay cards plus one DON!!
card: 143 Leaders, 2,215 Characters, 410 Events and 49 Stages. The bounded
26-product source union has 2,546 unique IDs and zero missing IDs. This does
not establish worldwide release, tournament eligibility or full clause coverage.
The source rows remain in `regional-promo-catalog-gaps.json` as evidence.

The batch adds 28 ability primaries with 85 focused public-command tests. The
three new vanillas (P-064, P-080 and P-087) join the shared catalog and paid-play
checks. Their inventory completeness check now compares against every exported
vanilla Character; the two vanilla files pass 571 tests for 285 cards.

P-086 exposed a shared ordered-cost defect. DON!! payment IDs occupied the same
selection slot used by the later Character-to-deck payment, preventing its hand
play from resolving. The engine now completes the leading DON!! return before
constructing the later Character choices and saves the paid prefix across that
choice. Tests prove live power after DON!! return, physical Character selection,
attached-DON!! cleanup, invalid retry, saved-state resume, and no duplicate DON!!
payment. If the first payment makes the second impossible, the engine retains
the completed payment, suppresses the effect body and spends the once-per-turn
activation. A later retry has both costs payable and is still rejected. This
follows rules 8-3-1-1, 8-3-1-3-1 and 10-2-13-5. The repair is in shared cost
resolution; there is no card-specific runtime action.

Other proofs include actual Blocker, Rush, Character-only Rush and Double Attack
battles; ordered private deck choices; both branches of Lilith's hand-play filter;
hand and trash boundaries; and live cost-dependent effects. P-142 covers battle
and effect K.O. replacement, its Stage payment, decline, wrong type, high base
power and attached-DON!! power that must not change its base-power filter.
P-143's opponent-field cost-zero condition and Rush persistence are proved, but
an independent own-field cost-zero fixture remains open. Competing optional
replacement priority is not established by the P-142 tests.

Validation after sequential package builds:

- Full engine: 2,733 files, 11,527 tests pass, three existing opt-in skips.
- Cards: four files, 33 tests pass. Adapter: seven files, 30 tests pass;
  direct adapter TypeScript check passes.
- Types, cards and engine builds pass. All 96 changed TypeScript files pass
  scoped formatting, lint and type checks. All 28 new ability primaries pass
  Grade A; this is a structural gate, not a substitute for the clause proofs.
- The 31-row official metadata comparison has zero differences. Cumulative
  canonical definitions changed since `ce074e03a6^`: 1,966.
- Parser and guidance files are unchanged in this batch. No new stress,
  deployment or live-product result is claimed. Simulator UI files are unchanged.

Signal: the earlier vanilla inventory check proved only uniqueness, so adding a
new vanilla could leave it outside both shared checks. Change: compare inventory
IDs with the exported vanilla catalog. Proof: existing 282-card baseline and
expanded 285-card public-play batch both pass. No new card-specific helper or
engine abstraction was added for the other 30 promo cards.

Next: complete EB02–EB04 and remaining promotion clause audits, then resolve
broader optional-loop, optional affected-card replacement-priority and continuous
ordering questions. EB02 source preparation is complete: all 61 metadata rows
match its official product list; that does not yet prove its behavior clauses.

## October 8, 2026 EB02 clause audit checkpoint

Compared all 61 primary EB02 cards with the
[official product list](https://en.onepiece-cardgame.com/cardlist/?series=569202),
including its separate Trigger fields, and reviewed the
[official EB02 FAQ](https://en.onepiece-cardgame.com/pdf/qa_eb02.pdf).
The set has 45 Characters (six vanilla), 12 Events, one Leader and three Stages.
All names, applicable numeric stats, colors, traits and attributes match. No EB02
card-definition or shared-runtime correction was required by the tested cases.

Added 38 public-action cases across 35 existing primary files. Character proofs
now cover Wano and named-Leader branches, conditional Character-only attacks,
current power after an opposing aura, later activation after decline, paid
wrong-Leader conditions, discarded-card replay, separate versus grouped DON!!
return events, post-payment DON!! comparisons, Life Trigger eligibility after
the resolving card leaves Life, and dynamic Rush loss after opposing DON!! return.
Existing positive-clause tests were retained rather than replaced with placement
or metadata checks.

Each of the six search Events now has a successful Life Trigger search that adds
an actual cost-four Event, permits a qualifying Character, preserves the
untouched deck card and orders the exact remainder. Other additions prove a
later K.O. after declining an earlier buff, no unrelated refresh freeze after
zero target selection, battle replacement decline followed by a later accepted
payment, turn expiry with payment still available, and actual battle prevention
from a Counter bonus followed by expiry.

Leader and Stage checks cover a payable once-per-turn retry, zero DON!!
reactivation followed by the Leader bonus, DON!! transferred from the Leader,
and a face-up top Life card that cannot pay after the Stage refreshes. The
Merry Go DON!!-comparison negative fixture now contains a valid Straw Hat target,
so the failed condition is distinct from having no eligible target. Decline tests
also assert that each Stage stays active. Draw fixtures retain a deck card when
empty-deck defeat is not the behavior under test.

Validation:

- Full engine: 2,733 files, 11,565 tests pass, three existing opt-in skips.
- All 35 changed test files pass scoped formatting, lint and type checks.
- All 55 EB02 ability primaries pass Grade A. Their four audit groups pass
  145 focused tests in total. The 61-row metadata comparison has zero differences.
- This batch changes tests and evidence only. No package source, parser,
  Simulator UI or adapter code changed. Builds and adapter checks remain the
  verified results from the preceding runtime checkpoint; they were not rerun
  for these test-only changes. No new deployment or stress result is claimed.

The FAQ audit found an additional catalog and engine omission. Its all-name,
all-type, all-attribute Leader is the unnumbered six-color Monkey.D.Luffy from the
[Sealed Battle Leader Pack](https://en.onepiece-cardgame.com/events/2023/sealed_battle_vol1/).
The [official Leader image](https://en.onepiece-cardgame.com/images/events/2023/sealed_battle_vol1/card_01.png?1)
shows the universal-property text and event restriction; it has no numbered
P-### collector ID. The
[official English Asia eight-pack rules](https://asia-en.onepiece-cardgame.com/pdf/rule_8packs-battle.pdf)
change its printed Life from four to five. A current Western-rules cross-check
and implementation of this event Leader remain open. Existing synthetic named-
Leader tests for Gaimon and Klabautermann do not prove universal properties or
format eligibility. No numbered promo ID was invented for this omission.

Other audit limits: an isolated yellow Sanji above the play-cost ceiling and a
Whitebeard Allies-only Leader were not found in the current catalog; the real
eligible branches and independent printed filters are tested. These limits do
not justify narrowing the printed filters. Cumulative canonical definitions
changed remain 1,966; the catalog remains 2,817 gameplay cards plus DON!!.

Next: implement and prove the confirmed event-Leader omission, continue EB03,
EB04 and remaining promo clause audits, and resolve the outstanding optional-loop,
replacement-priority and continuous-ordering questions. Completion is unproven.

## October 8, 2026 event Leader and sealed rules checkpoint

Added the unnumbered six-color event Monkey.D.Luffy Leader with internal catalog
ID `EVENT-LEADER-MONKEY-D-LUFFY`. Its collector number remains empty. The
[current official Western event](https://en.onepiece-cardgame.com/events/store-tournament-op17.html)
and its [Leader image](https://en.onepiece-cardgame.com/onepiececg/bccard/en/news/2026/07/22/R1pSUVJg9PtQWvsu/batch_OPCG_card_L.webp)
confirm five Life; this agrees with the previously recorded Asia erratum.

The shared engine now treats this Leader as every name, type and all six
attributes, including `?`. Name equality, name exclusion, type filters and
Leader conditions use the rules identity. It remains a Leader for card-category
filters and retains its rules identity when abilities are negated. Nine primary
public tests prove five-Life setup, both EB02 conditional Blockers, named-Leader
and type gates, Slash targeting and battle protection, negation and category
limits. Three shared tests cover identity matching and distinct-name counting.

The native validator accepts `sealed` with exactly 40 main cards and a supplied
DON!! deck, permits any color and removes the four-copy limit. Printed deck
restrictions and DON!! overrides still apply. The event Leader also requires
`allowDesignatedEventCards: true`; Standard rejects it. This option records the
caller's event choice; it does not verify event entry or opened-pack provenance.
Rules source: [official Western sealed rules](https://en.onepiece-cardgame.com/pdf/tournament_rules_manual_op02.pdf).
No simulator, adapter or format-discovery code changed.

The catalog now has 2,818 gameplay cards plus DON!!: 144 Leaders, 2,215 Characters,
410 Events and 49 Stages. Cumulative changed canonical definitions are 1,967.
Coverage tooling and printing checks accept the explicit internal event ID
without treating it as an official numbered promo. The new primary passes
Grade A; that grade alone does not establish complete clause coverage.

Validation: 2,735 engine files / 11,579 tests pass, with three existing opt-in
skips. All 44 card-package tests and 30 read-only adapter tests pass. Types,
cards and engine builds, direct adapter typecheck and scoped checks of all
17 changed TypeScript files pass. All 145 parser files / 1,418 tests pass.
No new deployment or stress result is claimed.

Next: EB03, EB04 and remaining promo clause audits, the independent P-143
own-field cost-zero fixture, and outstanding optional-loop, replacement-priority
and continuous-ordering questions. Completion remains unproven.

## October 8, 2026 EB03 clause audit checkpoint

Compared all 62 current EB03 cards with the
[official Western product list](https://en.onepiece-cardgame.com/cardlist/?series=569203)
and [EB03 FAQ](https://en.onepiece-cardgame.com/pdf/qa_eb03.pdf). The list includes
EB03-062 Trafalgar Law. This scope has 55 Characters (three vanilla), six Events
and one Leader. All 62 names and applicable numeric/color/type/attribute rows
match after restoring the printed heart in EB03-038's canonical and English
names. No structured effect or shared runtime defect was confirmed in this wave.

Added 29 public test cases in 21 existing primary files, with stronger outcomes
in existing tests. Key proofs include Shuraiya's copied base power removing
Carina's bonus; Nami paying power below zero; Koby permitting Hibari's own attack;
Carrot skipping K.O. while still playing Zou; base-cost versus current-cost and
base-power versus current-power filters; Boa Hancock returning herself as cost;
actual Revolutionaries hand play; actual Rebecca Blocker; and Character-play
restrictions surviving a declined play and expiring on the next turn.

Robin's effect damage permits a Life Trigger and wins against zero Life. The
FAQ's Banish/Double Attack cases use explicitly synthetic keyword setup, followed
by real battle, K.O. and damage commands; they do not claim a real granting-card
interaction. Black Maria's obsolete synthetic Stage was replaced with the real
Onigashima Island. Vivi's tests prove When Attacking exclusion from Rush, skip
then continue, turn expiry, effect and battle K.O. replacement, base-cost use
through a live reduction, and decline/once-per-turn behavior. Event tests prove
same-recipient Counter behavior, payment before wrong-Leader gates, and actual
Life Trigger hand addition with physical deck-bottom ordering.

All 59 ability primaries pass Grade A. The four bounded groups pass 167 tests
(48 first-half Characters, 89 second-half Characters, 24 Events, six Leader).
Catalog counts remain 2,818 gameplay cards plus DON!!; cumulative changed
canonical definitions remain 1,967. No simulator UI code changed.

Validation: 2,735 engine files / 11,608 tests pass, with three existing opt-in
skips. All 44 card tests pass. The cards build and scoped checks of all 23
changed TypeScript files pass. The preceding runtime checkpoint retains its
types/engine build, parser and read-only adapter results; none is claimed as a
new run here. No new stress, deployment or live-product result is claimed.

A fresh English/Japanese rules and FAQ review did not resolve the source-card
referent in CR 8-1-3-4-2. The optional affected-card replacement priority remains
an explicit unverified policy, not a confirmed defect or completed rule proof.
See the existing Ace policy test and owning replacement code. The real existing
Ace/Rosinante fixture can test a correction once authoritative clarification
establishes which effect must take priority.

Next: EB04 and remaining promo clauses, independent P-143 own-field cost-zero
proof, broader optional-loop families and continuous-effect ordering.
Completion remains unproven.

## October 8, 2026 EB04 clause audit and P-143 follow-up

Audited all 61 EB04 cards: 47 Characters, 12 Events, one Leader and one Stage.
All have printed abilities. The Western release is split across products; the
[official EB04 search](https://en.onepiece-cardgame.com/cardlist/?freewords=EB04)
and [combined OP14/EB04 FAQ](https://en.onepiece-cardgame.com/pdf/qa_op14_eb04.pdf?20260626=)
provide this bounded source set.

Confirmed card repairs:

- EB04-025 Nefeltari Vivi now has its printed +1000 Counter. A public battle
  reproduction failed before the fix and now prevents the expected Life damage.
- EB04-038 Rosinante & Law now has both printed alternate names. Real Lammy and
  Rosinante name-based effects select and buff it; unrelated Characters remain
  excluded. Both named interactions failed before the repair.
- EB04-044 Koby checks a Leader type including Navy. A real Former Navy Leader
  now permits the replacement, with a physical hand payment and survival.
- EB04-050 regains the printed heart; EB04-059 is named Black Rope Dragon Twister.

Source conflict: EB04-014's web row says Kozuki Sukiyaki, while the
[official card image](https://en.onepiece-cardgame.com/images/cardlist/card/EB04-014.png)
prints Kouzuki Sukiyaki. The definition retains the printed name; no supporting
erratum was found. This is the sole remaining metadata comparison difference,
not an asserted zero-difference audit. EB04-009's image prints cost zero despite
the web row's dash; the native cost remains zero.

New behavior proof covers post-payment fourth-Event power, actual Blocker
interceptions, Life Trigger hand/play results, nine-versus-ten-DON payment,
base-power and base-cost filters under live modifiers, prevention of an End Turn
ready effect, and a no-Kaido Event payment/result. Bonney's first damage raises
her defense before the next attack. Lulucia Kingdom excludes a base-six Character
whose current cost becomes one. Decline and threshold tests retain actual payable
costs and eligible targets. The four EB04 groups pass 209 focused tests; all 61
ability primaries pass Grade A.

P-143's missing own-field branch now has a real public sequence: an opposing Air
Door Life Trigger plays Tsuru, which reduces the controller's Doma to zero cost.
The opponent's only Character remains cost one. Crocodile then enters play and
attacks with Rush. No synthetic card or state mutation is used. Its three primary
tests pass; the earlier isolated-branch proof limit is closed.

Catalog counts remain 2,818 gameplay cards plus DON!!; cumulative changed
canonical definitions remain 1,967. No simulator UI files changed.

Validation: 2,735 engine files / 11,640 tests pass, with three existing opt-in
skips. All 44 card tests pass. Cards and engine builds and scoped checks of all
33 changed TypeScript files pass. This checkpoint adds 32 test cases, including
the P-143 follow-up. Parser/types and read-only adapter results remain from the
preceding shared-runtime checkpoint. No new stress or deployment is claimed.

Next: finish the bounded remaining promo-clause review and extend audited loop
families, then address continuous-effect ordering. Optional affected-card
replacement priority retains its documented source ambiguity. Completion remains
unproven.

## October 8, 2026 older promos and stable-condition loops

Closed the remaining bounded older-promo audit: P-014, 029, 044, 053, 055, 063,
068, 069, 070, 073, 074, 075, 078, 079, 081, 082, 083, 084, 085, 088, 105 and 107.
These 22 older cards plus 84 Western additions, 31 regional additions and P-067
account for all 138 current numbered promos. All 22 metadata rows match fresh
[official per-card sources](https://en.onepiece-cardgame.com/cardlist/?freewords=P-084);
all 22 ability primaries pass Grade A. The bounded groups pass 67 tests.

P-084 had no printed types and incorrectly used Strike. The
[official image](https://en.onepiece-cardgame.com/images/cardlist/card/P-084.png?260929)
confirms The Four Emperors/Cross Guild and Slash. Public Buggy Leader effect play
and Ipponmatsu Slash selection failed before the repair and now pass. Tests also
prove both owners' cost-three/four attack bans, the Buggy Leader gate and the
unconditional self attack ban. P-029 now uses current printed exact FILM matching.
No current catalog type supplied a substring-only negative case for that change.
Non-card reprint disclaimers were removed from P-073/074/075/084/088 text.

Additional proofs cover P-055's official empty-field payment FAQ, top-deck physical
ordering, top/bottom Life payment without activating paid Triggers, opponent-turn
effect play, skip-then-draw, zero-DON independence, saved bottom-Life selection,
zero-Life failure, exact remaining-Life thresholds and P-107's opposing ten-DON
branch plus actual duration expiry. The earlier roster's clause-audit task is
closed at this bounded level; this does not claim all possible card combinations.

Rest/ready loop certification now accepts selected conditions that cannot change
within those transitions: Leader name/type and hand, Life, active-DON and field-DON
counts. Existing evaluation decides their truth, while an explicit shape whitelist
rejects other dependencies. Moving-card loop certification remains turn-only.
Exact fingerprints, physical IDs and saved declaration rules remain intact.
Both rest/ready auditors reject nonempty post-cost conditions. The 18 new rule
cases use explicitly synthetic cycle fixtures; no real catalog infinite cycle is
claimed. A mandatory-loop watchdog established the previous nontermination
without hanging the test runner. Finite sequences and false gates remain finite.

Validation: 2,736 engine files / 11,670 tests pass, with three existing opt-in skips.
All 44 card tests and 30 read-only adapter tests pass. Cards/engine builds, direct
adapter typecheck and all 30 changed-TypeScript checks pass. Parser/types results
remain from the preceding unchanged-package checks. No fresh stress or deployment
result is claimed. Catalog size stays 2,818 gameplay cards plus DON!!; cumulative
changed canonical definitions are now 1,968. No simulator UI code changed.

Next: investigate the concrete modified-Leader base-power copy candidate, extend
sound optional moving-loop handling, and finish continuous-effect dependency
review. Optional affected-card replacement priority retains its source ambiguity.
Completion remains unproven.

## October 8, 2026 live base-power and optional moving-loop checkpoint

Fixed a confirmed dependency failure: OP14-053 Vista copied printed Leader power
instead of the Leader's current base power. With OP10-042 Usopp and OP15-092
Monkey.D.Luffy, Vista now copies 7000 on the opponent's turn. Public tests cover
both source orders, a surviving Blocker battle, Counter additive-power exclusion,
source removal and turn expiry. The equivalent resolved action now uses the same
base-power reader. Its test is explicitly synthetic because no current active
card uses that action. Seven focused files / 33 tests pass.

Optional loop declarations now cover one physical Character with mandatory bare
On Play self-K.O. and optional bare On K.O. self-play. Only turn gates are allowed;
costs, extra actions, replacements, modifiers, battle and unrelated queued or
saved references prevent certification. Positive declarations execute one normal
representative cycle to create a fresh object, then compress equivalent cycles.
Physical IDs and relative source generations remain in the proof. Zero stops
immediately; a large safe integer does not allocate work proportional to its value.
Synthetic rule fixtures cover both controllers, saved declarations and execution
phases, unchanged-state restart rejection and unsupported-state exclusions. No
real catalog infinite cycle is claimed.

A static catalog scan found supported paths for all current action, condition,
cost and filter configurations: 10,276 nodes across 2,819 exports including DON!!.
This proves dispatch coverage only. The four category inventories have no missing,
extra or duplicate IDs; stale summary counts were corrected to 2,215 Characters,
144 Leaders, 410 Events and 49 Stages. The gameplay total remains 2,818.

A bounded review of 59 continuous-effect dependency entries found no additional
real-card ordering defect beyond Vista. It does not certify arbitrary effect
ordering or all possible dependencies under CR 8-1-3-3-5. Optional affected-card
replacement priority under CR 8-1-3-4-2 still has an unresolved source interpretation.
The [official French rules](https://fr.onepiece-cardgame.com/pdf/rule_comprehensive.pdf?20260828=)
and [Traditional Chinese rules](https://asia-tc.onepiece-cardgame.com/pdf/rule_comprehensive.pdf?20260911=)
use the same source-card referent and did not settle optional affected-card priority.
This is an interpretation limit, not evidence that no official ruling exists.
Broader moving-loop families are outside the certified profile. Completion remains
unproven. No simulator UI files changed.

Validation on the final runtime: 2,738 engine files / 11,688 tests pass, with
three opt-in tests skipped in the normal run. All 44 card tests, 30 read-only
adapter tests, adapter typecheck, engine build and all 12 changed-TypeScript
checks pass. The full seven-file loop rules gate passes 65 cases; the final
candidate-check reorder also passes its 13-case focused gate. The fresh enabled
bot and heuristic run passes both files / all 13 tests in 905 seconds, including
4,000 fixed-deck stress games and the extended strategy matrix. These use bounded
deck sets and assertions; they do not prove all catalog combinations or establish
zero stuck games beyond the suite's stated thresholds. No deployment or live-product
result is claimed.

## October 8, 2026 Main activation and continuous-cost ordering checkpoint

The shared Main activation action now excludes Events that have only Counter or
Trigger effects. OP12-041 Sanji proves valid Main selection, saved invalid-choice
rejection, and a zero-selection continuation. Bartolomeo and Sabo retain their
existing shared-action proofs. No canonical card definition changed in this step.

CR 8-1-3-3-5 has a new numeric-cost settlement path. Each controller can select
between permanent-effect orders that produce different results, with the turn
player first. A permanent block keeps its own printed action order. Saved choices,
source removal, turn expiry, a stable branch beside a cyclic branch, and disjoint
hand discounts have synthetic command proofs. Indirect cost dependencies through
negation and granted keywords preserve both legal orders. Cost and keyword readers
skip unrelated permanent blocks before evaluating their conditions.
Cost payment can pause before its
next cost slot or post-cost condition without repeating the paid prefix or losing
once-per-turn use. This covers numeric cost dependencies, not all permanent-effect
types or every inline trigger-capture boundary. A scan of 1,609 automatic blocks
found one current-cost event filter (Ice Oni) and 25 current-cost conditions;
these are evaluated after queue settlement. This is bounded source evidence.
A cyclic branch or unsupported absolute permanent setter uses an explicit judge
boundary.

Audited nonmoving loops now include forced complete groups for both mandatory
cycle draws and optional count declarations. Optional, surplus, empty, protected,
once-per-turn and finite-loss controls prevent false certification. Moving paths
retain their single-object restriction. Loop comparison excludes only the derived
continuous-cost input fingerprint; cost contributions, results and pending state
remain significant. Public watchdog tests prove moving-loop behavior with unrelated
cost effects. A moving source with its own cost contribution remains unproved.

Real-card rule proofs now cover negative intermediate cost followed by an increase,
negated Nami remaining ineligible for Makino's no-effect target, and Law gaining
Double Attack from Buggy after Black Vortex negates his existing activation.
The rules inventory now distinguishes existing public proofs, physical or
definitional rules, synthetic engine fixtures and actual missing catalog examples.

Validation: all 2,743 engine files / 11,732 tests pass, with three opt-in skips.
All 44 card tests, 30 read-only adapter tests, adapter typecheck, engine build and
18 changed-TypeScript checks pass. The numeric-cost suite has 24 public cases;
the related focused run passes 59 cases, and the loop rules gate passes 80 cases.
The first full run exposed Shiki cleanup and a slow synthetic keyword case. Both
were fixed without weakening the assertions or increasing the timeout; the final
full run passes. The earlier extended bot stress result predates this checkpoint.
The current catalog remains 2,818 gameplay cards plus DON!!. No simulator UI files changed.
Optional affected-card replacement priority remains a source interpretation limit;
completion remains unproven.

## October 8, 2026 joint numeric ordering and added requirements checkpoint

Permanent additive cost and power effects now share one settlement process.
Synthetic public tests prove two power outcomes, two mixed cost/power outcomes,
controller order, saved choices, wrong-seat rejection, ordered actions, expiry,
negative power and a subsequent power-filtered K.O. Visible choices identify the
effect number and signed value. A 24-hand-discount control exposed excessive
order enumeration; restricting direct numeric reads to their target set reduces
that case to 48 ms. Existing cost tests and real Vista/Luffy/Linlin proofs pass.
Numeric/keyword-dependent base setters or copies, and base setters affected by
permanent negation, retain an explicit judge boundary. General continuous-effect
ordering is not complete.

Native resolved effects can now add activation costs or conditions. Added costs
follow printed and alternative costs in grant order. An ordered payment cursor
preserves each physical choice and paid prefix through JSON snapshots. Initial
affordability checks sequential resource use instead of counting the same cards
or DON!! twice. Added conditions all apply, including DON!! qualification when
auto effects become ready. Tests cover source removal, recipient reentry, expiry,
invalid payment IDs and a large impossible hand payment with an external watchdog.
These actions are duration-bound resolved grants; continuous permanent requirement
grants remain unsupported and the native type excludes them. The parser explicitly
rejects such a grant without an activation timing instead of hiding the type gap.

The opponent-end keyword now has direct synthetic public proof: own-turn exclusion,
a saved choice before handoff, decline, and negation before expiry. A moving card's
own cost contribution does not require a loop runtime fix: the repeated trash
boundary already proves the mandatory cycle. Finite-loss and saved optional-choice
controls pass. Loop fingerprints retain power results and contributions, including
pending contributions. No simulator UI files or canonical card definitions changed.

Validation: 2,746 engine files / 11,769 tests pass, with three opt-in skips. The
types test, all 44 card tests, 30 read-only adapter tests and adapter typecheck pass.
Types, cards, engine and parser builds pass. All 145 parser files / 1,418 tests
and the full parser typecheck pass after the native-type boundary correction.
All 16 changed TypeScript files pass scoped checks. New numeric-power cases total 17, added-
requirement cases total 13, and opponent-end cases total three. The extended bot
stress result from an earlier checkpoint does not verify this runtime.

Remaining work includes general continuous base-setting dependencies, broader
loop families, simultaneous rest/active precedence, Life-value modification,
base-cost setters and continuous requirement grants. Optional affected-card
replacement priority remains an unresolved source interpretation. Completion
remains unproven.

## October 8, 2026 base-cost and Life-value checkpoint

Native base-cost settings now follow highest-setter precedence, with printed cost
used only when no setter applies. Signed arithmetic, current-cost overrides,
expiry, negation, source removal and recipient zone generations have public
proofs. Main, Counter and effect-driven Events capture base cost before movement;
activation history and nested base/dynamic-cost Event filters retain that value.
A separate fix makes permanent base-power copies obey their action condition.
The real Vista and Linlin controls remain green. General base-setting feedback
is still incomplete: official Linlin and Usopp examples do not establish a
general self-reference algorithm.

Leader Life value now has native resolved and permanent modifiers. It is separate
from the physical Life count. Startup captures both values before placement;
later modifiers, expiry, negation and damage do not change that distinction.
Oversized values place available cards and then process empty-deck defeat.
Tests cover simultaneous ordinary losses, Nami's alternate win and Brook's
deferred defeat. Competing simultaneous alternate wins request judge review;
saved intervention can restore the decks and resume the first turn, while an
unresolved acknowledgement stays paused.

Permanent added activation conditions now use a live evaluator. Provider gates
use provider context, while added conditions use recipient context. Printed,
resolved and permanent conditions combine, and payment continuations preserve
the activated requirements. Permanent added costs remain excluded from the native
type because their order relative to resolved grants is not established.

Validation: all 2,750 engine files / 11,806 tests pass, with three opt-in skips.
All 44 card tests, the types test, 1,418 parser tests and 30 read-only adapter
tests pass. Types, cards, engine and parser builds pass; parser and adapter full
typechecks pass. All 19 changed TypeScript files pass scoped checks. New native
proofs comprise 15 base-cost, 12 Life-value, nine permanent-condition and one
base-power-copy case. No canonical card definitions or simulator UI files changed.
Earlier extended bot stress does not verify this runtime; no deployment is claimed.

Remaining work includes general continuous base-setting dependencies, broader
loop families and simultaneous rest/active processing. Permanent added-cost order,
optional affected-card replacement priority and competing simultaneous alternate
wins remain unresolved rule boundaries. Completion remains unproven.

## October 8, 2026 card interactions and simultaneous field-state checkpoint

Two public card regressions exposed further defects. OP16-003 Edward.Newgate's
Leader target now grants Double Attack as well as power; the new attack proof
checks two Life damage and excludes the source Character and opposing Leader.
Ice Oni retains the original battle target's zone generation, so ST30 Marco's
On K.O. replay creates a new object that Ice Oni does not return to the deck.
The saved payment and surviving-original-target paths pass. A bounded review of
327 permanent-effect cards, including 282 non-keyword actions across 20 families,
found no further field-shape omission; this is not an all-interaction proof.

An explicit simultaneous-state instruction now collects field-card choices before
mutation, keeps rest on overlapping instructions, and applies protection and
replacement processing before committing the original changes together. Public
proofs cover both group orders, sequential controls, rest triggers, both players'
choice order, saved replies, numeric totals and zone generations. The native type
is restricted to Leader/Character/Stage. DON!! still needs stable resource tokens
across replacement costs, transfers and detachment; counts alone cannot establish
which originally selected DON!! survived.

A forced self-return-to-hand/replay loop now ends in a draw instead of hanging.
The optional On Play form supports saved repetition declarations and same-state
restart prevention. Finite deck loss and random actions remain outside the
shortcut. State comparison normalizes root field insertion order only; nested
modifier order is preserved because it can change activation-cost payment.
Optional action wrappers and multi-owner moving loops remain unfinished.

Validation: 2,753 engine files / 11,832 tests pass, with three opt-in skips.
The types test, 44 card tests, 1,418 parser tests and 30 read-only adapter tests
pass. Types, cards, engine and parser builds and parser/adapter typechecks pass.
All 18 files in this TypeScript change set pass scoped checks; the combined
32-file TypeScript PR scope also passes. New proofs include
14 simultaneous-state cases, four mandatory-hand cases, six optional-hand cases
and the two real-card regressions. No simulator UI files changed. Extended bot
stress from an earlier checkpoint is not proof of this runtime.

The completion goal remains open for simultaneous DON!! handling, general
continuous base-setting dependencies, broader loop forms and the documented
unresolved rule-ordering cases. No deployment or live-product proof is claimed.

## October 8, 2026 DON!! identity, paid play and loop checkpoint

Simultaneous state changes now include cost-area DON!!. Saved choices keep the
selected physical identities through replacement costs, equal-count removal and
refill, attachment, return and nested groups. Active/rested changes retain the
identity; area changes create a new generation. State-filtered native groups
have direct support. Other DON!! qualifiers request judge review before mutation.

Freeze restrictions now stay on the selected DON!! through active/rested changes
and end when the card changes areas. Two real Jewelry Bonney effects selecting
the same DON!! freeze one card, not two. Meaningful source choices use existing
cost prompts for ordinary play, Counter, attachment, effect transfers and costs.
Equivalent source pools do not add a choice. Compound costs preserve each
original selection when earlier costs change pool positions; invalid active-only
overlap is rejected before payment. Saved legacy restrictions also gain identity.

Full-field Character play pays before the rule trash under CR 2-7-2 and 3-7-6-1.
Real Uta and Shanks prove that losing the discount condition while making room
does not change the paid cost. Separate native DON fixtures prove saved physical
payment, invalid retries and legacy unpaid replacement continuation. Character,
Event, Stage and Counter Event cards are publicly revealed before payment choices.

Mandatory loops now inspect sequence and stable conditional wrappers, plus
forced grouped field-card state changes. Optional action wrappers, strict nested
chains and a two-owner opponent-play/self-return cycle support saved repetition
declarations. A positive moving declaration completes one whole representative
cycle before reaching the selected stopping player. Zero/large counts, both
active players, invalid replies, finite/random controls and no-restart rules have
public command tests. This does not certify arbitrary loop programs.

General continuous base-setting feedback, permanent added-cost ordering and the
documented optional affected-card replacement priority remain unresolved proof
boundaries. No simulator UI files changed. No deployment or live-product proof
is claimed.

Validation: 2,760 engine files / 11,901 tests pass, with three opt-in tests
skipped. Types pass 1 test; cards pass 44 tests; the parser passes 1,418 tests;
the read-only server-adapter gate passes 30 tests. Types, cards, engine and parser
builds pass. All 30 changed TypeScript files pass scoped formatting, lint and
type checks; parser and adapter direct type checks also pass. Adapter checks
use the final rebuilt engine. Catalog size and canonical definitions are unchanged.
No new automated-game stress result is claimed.

Next: resolve the documented source ambiguities and review remaining engine
capability boundaries. The bounded catalog audit is complete; exhaustive
interaction proof and general rules completion remain unproven.

## October 8, 2026 inactive effects and delayed object identity

Permanent absolute-cost declarations in the deck or trash no longer stop
unrelated numeric settlement. Static false block/action conditions and negation
also suppress inactive setters. Live numeric-dependent setters retain the
explicit review boundary. The tests use synthetic native effects because the
current catalog has no permanent absolute-cost setter.

Delayed effects keep the object identity selected when scheduled. OP11-092
Helmeppo no longer bottom-decks a Character that left play and returned through
another effect. The real Sabo/Teach/Helmeppo/Prince Grus sequence includes saved
state. OP11-107 Topknot Neptunian also remains rested after OP13-031 Law returns
and replays it; its old delayed reactivation cannot affect the new object.

Shared delayed-action tests distinguish independent schedules from ordered
actions within one schedule. Target validation happens when the action uses the
target, including after earlier queued movement. Historical target counts stay
available; a fresh target choice can select a replayed card. Saved legacy actions
without identity metadata retain their old ID-only behavior because their
original object generations cannot be recovered.

No card definitions or simulator UI files changed. General rules completion
remains unproven; the previously documented source ambiguities remain open.

Validation: 2,762 engine files / 11,922 tests pass, with three opt-in tests
skipped. The rebuilt engine passes all 30 server-adapter tests and its direct
type check. All 11 changed TypeScript files pass scoped formatting, lint and
type checks. The delayed family gate passes 68 tests in 20 files. Types, cards,
and parser packages are unchanged from their preceding verified gates. The
larger deck benchmark was interrupted before producing a result; no completed
benchmark or deployment result is claimed for this checkpoint.

## October 8, 2026 mandatory DON!! resource loops

A synthetic mandatory returned-DON!! reaction could repeatedly add one DON!!,
give it to the Leader, and return it. A subprocess watchdog confirmed that the
public activation did not terminate. CR 11-1-1-1 now ends this audited cycle as
a draw. A simpler add-and-return cycle and both player orientations are covered.

The new audit keeps existing exact game-state fingerprints. It admits fixed
mandatory DON!! actions without choices, costs, conditions, identity ledgers,
modifiers, permanent effects or replacements. It retains scalar DON!! pools,
attachments, physical card identities, and ordered queued reactions. Optional,
once-per-turn, partial-pool choice and finite draw-to-empty-deck controls remain
distinct. Admission controls reject identity tracking and permanent restrictions.
No unavoidable real-card resource loop is claimed; broader loop forms remain
outside the audited family. No card definitions or simulator UI code changed.

The opt-in six-deck benchmark passed on the preceding commit `d1e3d28cef`:
2,880 seeded games and zero rejected bot commands. It ran before this loop
extension. Console detail was suppressed by the test configuration, so this
result does not establish the number of unfinished games. No deployment or
live-product result is claimed.

Final loop-extension validation: 2,763 engine files / 11,932 tests pass, with
three opt-in tests skipped. All 30 server-adapter tests, its direct type check,
the engine build, and four-file scoped formatting/lint/type checks pass.

## October 8, 2026 optional DON!! resource loops

An audited optional returned-DON!! cycle now uses the existing finite repetition
prompt under CR 11-1-1-2. Fourteen synthetic controls cover both active seats,
non-turn stopping ownership, saved choices, valid and invalid counts, stopping,
restart refusal, and a legal state change that permits a new choice. Finite
programs and ordinary DON!! choices do not become loop declarations.

The shared audit retains mandatory behavior and rejects resource identity
ledgers, modifiers, permanent effects, replacements, and unaudited reactions.
Optional evidence records its DON!! source so it cannot cross into another
certified loop family. Exact scalar resources, attachments, physical card IDs,
and queued payloads remain in the comparison. One optional returned-DON!! source
is admitted; broader resource programs remain unfinished. No card definitions
or simulator UI code changed. The related loop gate passes 153 tests in 16 files,
and six-file formatting, lint, and type checks pass. Final validation passes
2,764 engine files / 11,946 tests, with three opt-in tests skipped. The engine
build, all 30 server-adapter tests, and its direct type check pass. No deployment
or fresh extended benchmark result is claimed.

## October 8, 2026 two-player DON!! loop declarations

The resource audit now admits two opposing Leader sources with one optional
returned-DON!! reaction each. CR 11-1-1-3 uses the existing turn-player-first
count prompt and stops at the smaller declaration. Public controls verify both
player orientations, both stopping owners, exact final DON!! attachments and
deck counts, saved declarations, invalid replies, initial state changes and
restart restrictions. Tie tests preserve the existing engine policy without
claiming a new official tie ruling.

Whole-pool opponent returns are restricted to this two-source proof. Stable
source membership separates its evidence from the one-source and other loop
families. Existing saved one-source markers remain supported. No identity,
resource, or generation normalization was added. The proofs are synthetic;
card definitions and simulator UI code are unchanged. Broader resource loops
and the recorded continuous-effect and replacement-order questions remain open.

Final validation: 2,765 engine files / 11,965 tests pass, three opt-in tests
skipped. All 30 server-adapter tests, its direct type check, the engine build,
and six-file formatting/lint/type checks pass. The final DON!! gate passes
43 tests in three files. No deployment or new extended benchmark is claimed.

## October 8, 2026 opponent effect-play restriction ownership

A real Mihawk/Ace/Soba Mask sequence exposed a wrong-player restriction check.
South plays OP12-030 Mihawk, readies four DON!! and gains a restriction against
playing base-cost-seven-or-more Characters. South can still play six-cost
OP13-119 Ace. North has OP05-065 San-Gorou, so ST26-001 Soba Mask costs two in
north's hand despite its base cost of seven. After Ace returns OP02-080 Dobon,
north must be able to select and play Soba Mask. The baseline prompt incorrectly
applied south's Mihawk restriction and omitted it.

Effect-play candidate filtering now uses the playing seat derived from the
source player, matching actual placement. Grouped play and restored prompt
validation already use this helper. The existing Ace primary now proves the
legal selection after JSON recovery, placement under north's control and Soba
Mask's On Play return of San-Gorou. Seven related files / 21 tests and two-file
formatting/lint/type checks pass. No card definitions or simulator UI changed.
Final integration passes 2,765 engine files / 11,966 tests, with three opt-in
tests skipped; engine build, all 30 adapter tests and adapter type check pass.
No deployment or new extended benchmark result is claimed.

## October 8, 2026 opponent top-deck play

The native play action permits an opponent deck source with `topOnly`. Its
candidate filter incorrectly compared that source pool with the controller's
top card, so no card could be played. The filter now uses the playing seat,
consistent with the existing choice owner and placement path.

Two public synthetic tests cover eight scenarios: both seats, optional accept
and decline, forced play, and an ineligible top card with an eligible deeper
card. Saved choices, private prompt visibility and both deck identities are
checked. The new rules file plus real Sanji top-deck and Ace play tests pass
11 tests in three files; two-file formatting/lint/type checks pass. No current
printed opponent-top-deck card is claimed. Card definitions and simulator UI
are unchanged. Final integration passes 2,766 engine files / 11,968 tests,
with three opt-in tests skipped; engine build, all 30 adapter tests and its
direct type check pass. No deployment or new extended benchmark is claimed.

## October 8, 2026 ordered permanent base-cost contributions

Permanent base-cost settings now participate in the existing numeric ordering
graph. The previous implementation computed them ahead of additive entries or
rejected power-dependent eligibility. First-class contribution maps preserve
block/action order, highest-setting precedence, raw signed arithmetic, current-
and base-cost reads, and saved choices. The public ordering discriminator proves
both cost-two and cost-four outcomes for a printed-cost-six Character.

Resolved power inputs use the existing shared settlement stages. Setters are
reevaluated at the normal stages; an irrelevant setter must not alter another
additive history. Existing contribution history survives restored and changed
states. This is an engine extension with synthetic behavior proof; card
definitions and simulator UI are unchanged. General self-dependent base-setting,
keyword and negation feedback remain unfinished.

Final validation passes 2,767 engine files / 11,994 tests, with three opt-in
tests skipped. The focused gate passes 157 tests in 11 files, including 26 new
controls. Five-file formatting/lint/type checks, the engine build, all 30
server-adapter tests and its direct type check pass. No deployment or new
extended benchmark result is claimed.

## October 8, 2026 ordered permanent base-power contributions

Stable permanent base-power settings and deterministic own-Leader base-power
copies now enter the existing numeric ordering process. The synthetic public
discriminator preserves the controller's choice between 2000 and 4000 power,
including saved choices. Highest-setting precedence, signed power, resolved
modifiers, DON!! additions, source generations and prior contributions remain
part of the same numeric state.

Property-specific dependency checks permit independent real-card settings to
coexist. Real baselines cover Linlin with Fuza and Holly, Luffy with Vista, and
Ju Peter with Linlin; synthetic ordering choices also run beside those families.
Connected legacy feedback remains outside this proof and requires judge review.
Unknown predicates cannot certify independence. Whole-field target expansion is
shared with the ordering independence check, fixing a reproduced missing choice.

This is an engine/test change. No card definitions or simulator UI changed.
General self-dependent base-setting and the other documented rules boundaries
remain unfinished.

Final validation passes 2,769 engine files / 12,025 tests, with three opt-in
tests skipped. The focused gate passes 188 tests in 13 files, including 28 new
ordered-power controls and three real mixed-card tests. The engine build,
seven-file formatting/lint/type check, all 30 server-adapter tests and its direct
type check pass. No deployment or new extended benchmark result is claimed.

## October 8, 2026 numeric eligibility and Gedatsu cost checkpoint

Dynamic cost limits now read current cost, matching ordinary cost filters.
Real Gedatsu tests reproduce both errors: Ice Age reduced Apoo to cost zero but
the target was excluded by its printed cost; Doll's opponent-turn cost increase
was ignored and made it an illegal candidate. The corrected filter admits the
former and excludes the latter. A saved Gedatsu choice resolves correctly.
Explicit base-cost Event snapshots remain separate from current-cost filters.

Permanent base-cost eligibility now uses a per-setter dependency audit instead
of rejecting every cost read or live power writer. Synthetic public actions
prove that a setter can depend on another card's cost, base cost or power when
its output cannot feed back into its own condition. Scoped conditions preserve
independent card families. Self/transitive setting cycles and connected mutable
grants outside the ordered model remain explicit boundaries. This does not
resolve general self-referential base setting.

A bounded export audit found no unsupported condition variant among 1,680
condition nodes in 2,819 exports. It identified 21 dynamic-cost payloads; that
structural count is not a claim that every interaction has been tested.
No card definitions or simulator UI changed.

Final validation passes 2,770 engine files / 12,059 tests, with three opt-in
tests skipped. The related gate passes 231 tests in 18 files. This adds 29
dependency controls, two real Gedatsu cases and three Event cost distinctions.
Inactive action gates and payment-only discounts no longer create false
feedback. The engine build, seven-file formatting/lint/type check, all 30
server-adapter tests and its direct type check pass. No deployment or new
extended benchmark result is claimed.

## October 8, 2026 Rocks aggregate-selection checkpoint

OP17-118 Rocks.D.Xebec now rejects a combined-cost violation before consuming
its play choice. Previously, total eleven was accepted against the printed
limit of nine, and later execution discarded the selection. Both-seat public
tests restore the choice, reject eleven without changing the hand or prompt,
then restore again and successfully play an exact-nine selection. The printed
up-to clause still permits an empty selection. Execution revalidation remains.

The aggregate audit found four exported constraints. Sabo, Get Out of Here and
Loki already validate their target totals before accepting a reply; Rocks was
the sole exported aggregate play action missing that check. A separate event
filter audit found no real missing current-cost/current-power movement snapshot
caller. Neither audit proves all possible interactions. No card definitions or
simulator UI changed.

Validation: 2,770 engine files / 12,063 tests pass with four workers; three
opt-in tests are skipped. The first default-concurrency run had one eight-second
child-process timeout in the existing finite cost-cache loop test. Its isolated
seven-test run and the complete four-worker rerun pass without changing the
timeout. The focused gate passes 15 tests in six files. Two-file checks, engine
build, all 30 server-adapter tests and its direct type check pass.

## October 8, 2026 printed activation-cost order

All multi-entry activation costs now use the ordered payment cursor, including
printed costs and common costs followed by a selected alternative. Each entry
keeps its own physical selection across saved-game recovery. Full original
payment must be possible before activation. If an earlier choice makes a later
cost only partly payable, the engine pays the available part and subsequent
payable entries, skips the effect body, and consumes the original once-per-turn
activation (CR 8-3-1-1, 8-3-1-3 and 8-3-1-3-1).

The captured original requirements remain unchanged. Self references retain
the activation object's identity; a moved source can qualify as an ordinary
card in a later hand/trash payment, but cannot also pay the old self component.
Preflight handles DON tokens in rest-card costs and legal full-field replacement
when playing as a cost. The full-field continuation pays only its current entry.
Replaced Life and removal costs still suppress the effect body under
CR 8-3-1-7. Their saved continuation finishes later payable cost entries.

Synthetic tests cover repeated cost kinds, distinct filters, partial and zero
payments, compound self payments, saved prompts, alternative branches, and a
full-field play between other costs. No exported cost array repeats a cost kind;
these controls prove native grammar, not additional printed card clauses.
OP04-055 and OP06-043 protection tests now assert the hand discard is already
paid before the later bottom-deck choice, and invalid replies spend nothing more.
ST34-004 now has explicit proof that its DON return is paid before the hand
choice. DON identity controls follow each printed payment in order and retain
freeze behavior. No card definitions or simulator UI changed. Overall completion
remains unproven. A bounded rest-replacement audit found that generic own-rest
cost replacement is still bypassed. The sole native rest replacement requires
an opponent Character effect, so this audit found no real own-cost caller.

Validation: 2,771 engine files / 12,081 tests pass with four workers; three
opt-in tests are skipped. The focused gate passes 153 tests in 22 files, including
18 new cost controls. Engine build, eight-file format/lint/type checks, all
30 server-adapter tests and its direct type check pass. The first full run
exposed five stale payment-order expectations and a lost Life-replacement tail;
these were corrected before the final full run. No deployment is claimed.


## October 8, 2026 rest-cost replacement and OP17 proof audit

Rest activation costs now use a saved payment process. The process offers the
same Character rest replacements as normal rest effects, retains original card
identity and physical DON tokens, and completes each selected payment before
advancing to later costs. Replacement processing is distinct from original
payment: even a replacement that rests the same Character leaves the original
cost unpaid and suppresses the effect body (CR 8-3-1-7). Once-per-turn use and
later payable costs remain enforced.

This closes the generic own-rest cost gap identified in the prior checkpoint.
No real exported caller is claimed: PRB02-006's rest replacement requires an
opponent Character effect. Synthetic tests isolate that native rules grammar.

A bounded ten-card OP17 audit found companion or embedded behavior tests for
all ten IDs, but two primary tests needed stronger proof. OP17-004 now plays a
Character this turn, proves it cannot attack, grants Rush, and attacks with it.
OP17-119 rejects a combined cost of five without changing the game or its
pending choice (apart from rejection feedback), then removes exact cost four.
Its cost remains eighteen during its controller's turn. No card definitions or
simulator UI changed; no new canonical-card count is claimed.

Validation: 2,772 engine files / 12,088 tests pass with four workers; three
opt-in tests are skipped. The rest-related gate passes 127 tests in 16 files,
including seven new controls; both repaired card files pass all five tests.
Engine build, seven-file scoped checks, all 30 server-adapter tests and its
direct type check pass. This checkpoint does not prove overall completion.
A further bounded audit identified missing negative/OPT proof for OP17-011,
027 and 049; these remain next work. No deployment is claimed.


## October 8, 2026 OP17 defining-clause proof

Six existing primary files now prove defining conditions and choices through
public commands. OP17-011 attacks with only one attached DON and gets no power
reduction. OP17-027 rejects a same-turn Leader attack, then attacks a Character;
its On Play draws and rests two active targets only with the required Leader.
OP17-049 pays once, loses its power bonus after battle, and cannot repeat despite
retaining a payable hand card; a separate decline leaves the hand cost unpaid.

OP17-061 now plays each named alternative (King, Queen and Jack), excludes an
unrelated name, and distinguishes declining the DON cost, paying for zero Life,
and paying with the wrong Leader for no Life result. Four generic prompt-drain
or handoff tests were replaced with explicit clause checks. OP17-063 is publicly
played and carried through a real turn cycle: its later DON cost is still paid,
but the played-this-turn result does not apply. OP17-064 tests both spending
its once-per-turn boost and declining first, then accepting on a second attack,
with a payable hand and explicit battle-power and expiry assertions.

The bounded audit used companion tests before classifying gaps; existing OP17
late-clause and permanent-effect tests already cover 062 and additional 063
behavior. No runtime or definition defect was found in this batch. Inventory
card counts are unchanged; stronger proof does not mean new canonical cards.
No simulator UI changed. Overall completion remains unproven.

Validation: all 52 tests in the six revised primary files and two companion
files pass. Format/lint/type checks pass for all six changed test files. This
is test-only work, so the unchanged runtime was not rebuilt or broadly retested;
its preceding checkpoint passed 12,088 engine tests and all 30 adapter tests.


## October 8, 2026 OP17 field conditions and duration proof

Eight primary files now distinguish eligible and ineligible states through
public play, attack, choice and turn commands. Gerd keeps printed cost two with
a non-Elbaph Leader and can decline a payable recovery cost. Jinbe has neither
Blocker nor its power bonus without a qualifying field Character. Chopper's
Unblockable grant requires the cost condition, bypasses a real Blocker, and
expires before a later-turn attack that the same Blocker can intercept.

Dorry and Brogy each play their named partner from hand as well as the already
covered trash source. Choosing zero still applies the Character-play restriction;
it expires on a later turn and does not apply with the wrong Leader. Franky and
Brook get neither On Play result nor power bonus without a cost-twelve field
Character; their live power returns to its printed value when the last qualifying
Character leaves. A qualifying card in hand does not enable these field effects.
Luffy's saved positive attack works while Saul is present; after a public sacrifice
removes Saul, the original newly played Luffy cannot attack. An absent enabler is
also covered independently.

The Character inventory now records these exact clauses. No card-definition or
runtime defect was found. This is test-only work and does not change the canonical
card count. Simulator UI is unchanged; overall completion remains unproven.

Validation: all 33 tests in the eight changed primary files pass together.
Format/lint/type checks pass for all eight files. The runtime is unchanged, so
no new full-engine, build or adapter run is claimed for this test-only batch.

## October 8, 2026 OP17 payment, Trigger and choice proof

Six primary files now prove missing boundaries through public commands:

- Katakuri (103): a non-Big-Mom Leader suppresses both Life addition and the
  following power reduction.
- Cracker (104): payable decline preserves DON and Life; accepting payment
  under the wrong Leader spends the two DON without adding Life.
- Smoothie (106): payable decline and zero/one available DON after play suppress
  both results. The opponent's own view proves its physical hand is unchanged.
- Mont-d'Or (111): opponent-turn Life Trigger plays the card, then its On Play
  reveal payment K.O.s two Characters without discarding the revealed hand cards.
  Existing companion tests retain hand-play, shortage and decline proof.
- Sweet 3 Generals (114): paying and choosing zero Life still draws and reduces
  two Characters' power; both reductions expire at the real turn handoff.
- Rocks (118): both seats reject duplicate names within the total cost limit,
  preserve the pending choice, and accept a different-name retry after JSON
  recovery. Both name and aggregate rejection tests inspect the returned failed
  state, allowing only the rejection diagnostic to differ.

Superseded placement, prompt-drain and turn-survival placeholders were removed.
No card-definition or runtime defect was found, and no simulator files changed.
Inventory counts do not change; full engine/card completion remains unproven.

A separate bounded reachability audit inspected unsupported action, condition,
flow-target and cost routes against 2,819 exports. The inspected search/Life
payloads, 11 target groups, 24 cost kinds, sole target-derived draw, and play-cost
continuation did not expose a current native-card caller of an unsupported route.
This is source/coverage evidence, not execution of every combination; existing
continuous-ordering, replacement-priority and general-loop limits remain open.

The combined seven-file gate passes 34 tests, including the existing late-clause
companion. All six changed test files pass scoped checks. No new full-engine,
build or adapter run is claimed for this test-only batch.

## October 8, 2026 rejected-choice returned-state proof

Three existing test files now inspect the state returned by failed commands,
rather than the original harness state. Plague Rounds and Aramaki retain the
already-paid hand-trash cost across empty, protected, mixed and duplicate
bottom-deck selections. Lucci retains its paid trash cost and first group while
rejecting a repeated physical target in the second group. Moria retains the
trash and pending grouped play after rejecting two Absaloms. Each valid retry
continues from the returned failure state; the complete view changes only by
one expected rejection diagnostic. Aramaki's failed initial activation also
uses the returned state for its no-payment assertions.

All 16 tests in the three files and all three scoped checks pass. No runtime
defect was found. This is test-only proof repair; no new build, full-engine or
adapter run is claimed, and no simulator files changed.

## October 8, 2026 residual primary-proof audit

A bounded review of all 72 primary files retaining generic play/turn-handoff
patterns at checkpoint cd8de90532 included full-name sibling and companion tests.
Sixty-four already had substantive core-clause proof elsewhere. Eight cards had
material missing result, condition, or timing proof; nine test files now address it:

- Wyper (OP15-114): actual top-Life face-up payment and decline, all-opponent
  power reduction, zero-power K.O., survivor expiry, rested DON transfer to both
  eligible card categories, target exclusions and a still-payable repeat attempt.
- Risky Brothers (OP15-093): a publicly played Luffy cannot attack before the
  grant, cannot attack a Leader after it, but can attack a Character. Self-trash
  reaches fifteen; a thirteen-to-fourteen negative pays without granting either
  result. Slash expires at turn end.
- Perona (OP15-090): opposing Red Roc Trigger bottom-deck removal is replaced for
  base3000/current8000; base8000/current6000 remains ineligible against Main
  Red Roc. Paid hand identity and the protected/removed physical target are checked.
- Mihawk (OP16-089): exact known cards are drawn and discarded before the existing
  cost reduction and freshly played attack proof.
- Orochi/Kanjuro (OP17-066/067): accepted DON payment remains spent when no own
  cost-ten Character exists, including when only the opponent has one.
- Usopp/Sanji (OP17-080/082): public battle removes the last qualifying opposing
  Character and immediately removes the power bonus. Sanji's draw/discard still
  resolves without that qualifier.

New fixtures use matching Leader colors. No card-definition or runtime defect
was found. This bounded audit does not establish every possible interaction or
close the documented unresolved engine rule families.

The combined nine-file gate passes 36 tests, and all nine changed files pass
scoped formatting, lint and type checks. No new full-engine, build or adapter
run is claimed for this test-only batch. No simulator files changed.

## October 8, 2026 scoped negation and numeric settlement

Real exported-card interactions exposed false judge stops. Opposing OP09-081
Teach's On Play-only restriction blocked Linlin/Daifuku when Saul entered.
Opposing OP13-064 Roger's own-card restriction caused the same stop. Playing
Roger alongside his own Linlin also stopped instead of disabling her bonus.
CR 8-1-3-3 and 8-2-1 distinguish effect timing, scope and validity.

Numeric settlement now excludes timing-limited negation from permanent-effect
dependencies. Its existing graph identifies which card's negation can actually
change due to numeric effects, preserving target and controller scope. Base-setting
guards use those affected source identities; static negation still applies through
the ordinary getters. A separate reachability seed includes legacy base-setting
writes, so numeric-dependent negation through an unordered setter remains guarded.
The ordered-setter eligibility proof itself is unchanged.

Six real cases cover both seats: Teach and opposing Roger permit Saul's search,
current cost 16 and Daifuku power 8000; publicly playing own Roger changes Daifuku
from 8000 to 4000 while opposing Saul retains cost 16. All finish without a judge
or player prompt. Five synthetic controls cover both negation action forms and
legacy-setter feedback; unresolved numeric-dependent cases still request review.
These synthetic effects are not claimed as printed Brook behavior.

All 11 new tests and 129 related tests in seven files pass. No card definitions
or simulator code changed. General self-dependent base setting remains separate;
this correction does not invent a ruling for it.

Final validation: engine build and three-file checks pass. The full engine
suite passes 12,124 tests in 2,773 files with four workers; three opt-in tests
are skipped. All 30 server-adapter tests and its type check pass.

## October 8, 2026 real alternate-win ordering

The current catalog's three `winGame` cards are the two empty-deck Nami Leaders
and OP09-118 Roger. A bounded review found no current exported Life-value action
that reaches the synthetic dual-Nami startup boundary. Ordinary deck movement
processes cards and defeat immediately, rather than accumulating simultaneous
empty decks. This source audit is not proof of every possible interaction.

Four real public-command cases now cover Roger attacking Nami with one deck
card and an active DON-attached Boa. Both seats prove that zero-Life Roger's
turn-player effect ends the game before Boa draws; the one-Life control instead
lets Boa draw and Nami win. The existing rule file passes seven tests and scoped
checks. No engine, card-definition or simulator code changed in this follow-up.

Further bounded audits found no new current-card numeric-grant/negation gap
after the Teach/Roger repair. General base-setting self-applicability and
optional affected-card replacement precedence remain source-ambiguous; existing
synthetic boundaries are not relabeled as demonstrated native-card failures.

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
| OP05-097     | Mary Geoise                  | verified | Continuous payment-only discount; exact type; successive payments; Rebecca cost limit; Your Turn boundary          |
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

- Character behavior tests: 1,296 / 1,544 canonical Characters.
- Structured pending: 37.
- Printed but unstructured gaps: 11.
- Canonical vanilla batch: 200.
- Next canonical Character: OP14-102 Kumacy (`pending`).

Current checkpoint (OP12-070 through OP13-015 reconciliation, five repaired blockers):

- **Signal:** OP12-071 and OP12-086 both lost heterogeneous search branches,
  while the generated parser inventory ignored command-driven tests under the
  current `src/cards` authored-test tree. Those two omissions repeatedly made
  correct card work appear incomplete.
- **Change:** preserve branch-local exclusions inside `anyOf` search filters,
  and teach the generated parser inventory to count only authored
  `OnePieceTestEngine` files while explicitly excluding
  `validateCardAbility(...)` placeholders. OP13-007 also adds the smallest
  reusable targeted active-DON!! activation cost required by its printed text.
- **Proof:** the three focused parser files pass 149 tests; the five-card gate
  passes 8 command-driven tests; regeneration reports 1,043 owned authored or
  legacy behavior definitions and all 99 OP12 definitions now parse exactly.
- **Next-two result:** measure OP09-035 and OP09-036 for whether canonical queue
  discovery and first-pass inventory attribution now require no manual repair.

Current checkpoint (OP09-035 through OP09-044, five reviewed ability cards):

- **Signal:** all five definitions already passed current parser audits and all
  five owned tests already used public commands; the remaining work was clause
  review, two missing negative/result branches, and stale queue classification.
- **Change:** no new abstraction. Reuse the corrected canonical inventory and
  strengthen only materially unproved branches instead of rewriting existing
  command-driven scenarios.
- **Proof:** all five audits pass and the combined focused gate passes 9 tests,
  including both OP09-036 mixed-rest outcomes and Alvida's negative Leader gate.
- **Next-two result:** OP09-045 and OP09-046 both preflight with exact parser
  output and complete command-driven tests, so the inventory repair removed a
  setup/repair cycle and should be retained.

Current checkpoint (OP09-045 through OP13-016, five reviewed ability cards):

- **Signal:** four exact definitions already had complete command-driven proof;
  only OP13-016 still used a generated validation placeholder.
- **Change:** no new abstraction. Preserve sufficient authored scenarios and
  replace only the placeholder with a parameterized printed-name gate plus one
  full search/result path and a negative Leader boundary.
- **Proof:** all five audits pass and the combined focused gate passes 8 tests;
  OP09-047/048 required no diff after clause-by-clause review.
- **Next-two result:** measure OP13-017 and OP13-023 for whether placeholder
  detection continues to isolate the only required authoring work before freeze.

Current checkpoint (OP13-017 through OP13-026, five verified ability cards):

- **Signal:** three stale card definitions and five generated placeholders were
  exposed quickly by audit-first preflight; Koby additionally revealed one
  reusable parser gap for a Leader trait-or-attribute alternative.
- **Change:** add the narrow compound Leader-condition grammar and regression;
  otherwise regenerate only stale definitions and replace placeholders with
  command-driven tests rather than adding another harness abstraction.
- **Proof:** all five audits pass, the parser suite passes 1,190 tests, and the
  combined five-card gate passes 11 command-driven tests.
- **Next-two result:** measure OP13-027 and OP13-028 for whether audit-first
  preflight again identifies definition and authoring work without a repair cycle.

Current checkpoint (OP13-027 through OP13-032, five verified ability cards):

- **Signal:** audit-first preflight isolated Sanji's trait-match metadata and
  Nico Robin's End-Phase duration as definition-only drift; all five behavior
  files were placeholders. The measured OP13-027/028 pair needed no shared repair.
- **Change:** none. Keep the audit-first flow and author tests directly against
  public commands; this batch did not justify another parser or harness abstraction.
- **Proof:** all five audits pass and the combined gate passes 10 command-driven
  tests spanning alternate Leader gates, nested On Play resolution, dynamic
  Blocker, play-restriction cleanup, and End-Phase duration cleanup.
- **Next-two result:** measure OP13-033 and OP13-034 for another no-repair-cycle
  preflight and whether their existing definitions need only focused proof.

Current checkpoint (OP13-033 through OP13-041, five verified ability cards):

- **Signal:** OP13-033/034 met the prior no-shared-repair measurement, but
  Bepo exposed a false parser PASS: the grammar recognized “this Character or
  up to 1 DON!!” yet silently retained only the DON!! branch.
- **Change:** preserve that printed `or` as an executable action choice between
  self activation and the up-to-one DON!! selection, with a narrow regression.
- **Proof:** the parser suite passes 1,191 tests and the combined five-card gate
  passes 12 command-driven tests, including both Bepo branches and Franky's
  opponent-only mixed-zone selection.
- **Next-two result:** inspect OP13-042 and OP13-043 for any audit-pass text with
  a dropped `or` branch; count a prevented behavior-authoring repair cycle.

Current checkpoint (OP13-042 through OP13-046, five verified ability cards):

- **Signal:** OP13-042/043 had no dropped `or` branch, but Edward.Newgate exposed
  another false parser PASS where an `and` merged two required recipient groups.
  Curiel and Vista independently showed that printed `type including` filters
  had been encoded as exact trait matches, and Vista split one printed
  once-per-turn replacement across two independently reusable engine branches.
- **Change:** preserve conjunctive Leader-plus-Character DON!! recipients as
  separate actions, consistently encode included-trait DON!! and hand-trash
  filters, and give compound replacement branches one shared once-per-turn key.
- **Proof:** all five audits pass; 12 focused command-driven behavior tests,
  1,195 parser tests, and 2,631 engine tests pass (2 skipped), covering the
  repaired recipient, filter, and replacement identity boundaries.
- **Next-two result:** use OP13-047 and the next canonical card to measure whether
  explicit conjunction and included-trait preflight prevents another repair cycle.

Current checkpoint (OP13-047 through OP13-053, five verified ability cards):

- **Signal:** OP13-047 and OP13-050 met the prior no-repair-cycle measurement:
  Fossa's previously unstructured replacement generated exactly, and Sandersonia
  needed only authored behavior proof. Teach later exposed a raw-cost truncation
  that retained `trashCharacter` but discarded its printed included-trait filter.
- **Change:** no workflow abstraction. The narrow parser repair now captures the
  full `Characters with a type including` cost phrase before generic Character
  trash parsing, with a regression for the preserved filter.
- **Proof:** all five audits, 12 focused command-driven behavior tests, 1,196
  parser tests, and 2,631 engine tests pass (2 skipped).
- **Next-two result:** inspect OP13-054 and OP13-055 for qualified Character costs
  whose suffix could be lost before authoring behavior tests.

Current checkpoint (OP13-054 through OP13-061, five verified ability cards):

- **Signal:** OP13-054/055 contained no qualified Character costs, so the prior
  suffix-risk measurement needed no repair. Audit-first preflight instead found
  Yamato's stale block-wide Life condition and LittleOars Jr.'s stale exact trait
  match; both printed gaps generated complete replacement or modifier structures.
- **Change:** none. Existing action-level condition, inclusive trait, and
  replacement-origin paths were sufficient; this batch did not justify another
  parser, engine, harness, or skill abstraction.
- **Proof:** all five audits, 12 focused command-driven behavior tests, 1,196
  parser tests, and 2,631 engine tests pass (2 skipped).
- **Next-two result:** inspect OP13-062 and OP13-063 for sentence-scoped
  conditions before treating an audit PASS as behavior proof.

Current checkpoint (OP13-062 through OP13-066, five verified ability cards):

- **Signal:** OP13-062/063 confirmed their given-DON!! gates without a repair
  cycle. OP13-064 and OP13-066 independently exposed parser omissions for
  permanent negation and delayed DON!!-deck addition, while Roger also exposed
  missing generic permanent `negateEffects` evaluation in the engine.
- **Change:** preserve end-of-turn timing around parsed `addDon` actions; parse
  Roger's zone-specific permanent negation into separate Leader and filtered
  Character targets; evaluate permanent `negateEffects` against its target pool.
- **Proof:** all five audits, 15 focused command-driven behavior tests, 1,199
  parser tests, and 2,631 engine tests pass (2 skipped); cards, types, parser,
  and engine package checks pass.
- **Next-two result:** inspect OP13-067 and OP13-068 for another permanent or
  delayed action that can reuse these paths without a repair cycle.

Current checkpoint (OP13-067 through OP13-072, five verified ability cards):

- **Signal:** OP13-067 reused inclusive Leader traits plus the established
  draw/trash/DON!! sequence, and OP13-068 reused dynamic permanent modifiers at
  the exact eight-DON!! boundary. Neither next-two card needed a shared repair.
- **Change:** none. The remaining cards composed existing optional DON!! costs,
  filtered trash recovery, compound conditions, and base-power targeting.
- **Proof:** all five audits, 12 focused command-driven behavior tests, and
  2,631 engine tests pass (2 skipped); cards and engine package checks pass.
- **Next-two result:** inspect OP13-074 and OP13-080 for whether the no-repair
  streak continues across the next On Play and When Attacking effects.

Current checkpoint (OP13-074 through OP13-084, five verified ability cards):

- **Signal:** OP13-074 and OP13-080 ended the prior no-repair streak with stale
  card definitions, but current parser output already preserved Hera's included
  Homies filter and all of Nusjuro's thresholded permanent and attack clauses.
  Saturn and Ju Peter repeated the same stale included-trait search and omitted
  permanent protection shape. Publication review then exposed that Rayleigh's
  leading condition was scoped differently by the action helper and full card
  definition despite the same conditional-then grammar already ruled for Yamato.
- **Change:** full parser generation now keeps a no-cost leading condition at
  block scope when its `Then` continuation consists of delayed actions. The
  established command-driven search, optional play, permanent-removal, Rush,
  modifier, and trash-cost paths needed no engine or harness abstraction.
- **Proof:** all five audits and 13 focused command-driven behavior tests pass;
  Rayleigh's 3 focused tests, 1,200 parser tests, and 2,631 engine tests pass
  (2 skipped), with cards, parser, and engine package checks green.
- **Next-two result:** inspect OP13-086 and OP13-087 for whether audit-first
  definition repair continues to avoid shared parser or engine work.

Current checkpoint (OP13-086 through OP13-092, five verified ability cards):

- **Signal:** audit-first preflight isolated OP13-086's stale exact trait match,
  OP13-089/091's omitted thresholded permanents, and OP13-092's stale exact
  Stage trait match before behavior authoring. OP13-087 and all generated
  replacements composed existing search, trash, Blocker, removal-protection,
  optional cost, base-cost targeting, and effect-play paths without repair.
- **Change:** none. The prior next-two measurement succeeded: OP13-086/087
  needed no shared parser, engine, projection, or harness cycle.
- **Proof:** all five audits and 12 focused command-driven behavior tests pass;
  2,631 engine tests pass (2 skipped), with cards and engine package checks green.
- **Next-two result:** inspect OP13-093 and OP13-094 for another stale definition
  that audit-first regeneration can resolve without shared work.

Current checkpoint (OP13-093 through OP13-104, five verified ability cards):

- **Signal:** OP13-093 passed immediately and OP13-094 needed only audit-first
  included-trait regeneration, satisfying the prior next-two measurement.
  OP13-095 exposed a second only-type condition that omitted included matching.
  OP13-102 and official Q&A Q1062 exposed the same conditional-then scoping
  error as OP13-054 Yamato, whose earlier action-only interpretation conflicted
  with official Q&A Q1049.
- **Change:** only-type Character conditions now reject only cards whose traits
  do not include the printed type. Full parser generation keeps the known
  Edison and Yamato conditional-then sequences under one block-level gate, and
  Yamato's definition and negative behavior proof now match the official ruling.
- **Proof:** all five current audits, Yamato's audit, 15 focused command-driven
  tests, and 1,202 parser tests pass; cards, parser, and engine checks pass, and
  the engine suite passes 2,631 tests with 2 skipped.
- **Next-two result:** inspect OP13-105 and OP13-106 for conditional follow-ups
  or included-trait gates that reuse these repairs without another cycle.

Current checkpoint (OP13-105 through OP13-110, five verified ability cards):

- **Signal:** OP13-106 and OP13-108 repeated the stale missing-Life-Trigger
  definition pattern, while OP13-109 and OP13-110 needed only audit-first
  regeneration. OP13-105 exposed a distinct parser ownership error: printed
  all-Life ordering was emitted as deck rearrangement, so no public Life-order
  decision could exist.
- **Change:** all-Life ordering now generates the existing `rearrangeLife`
  action for either owner, with narrow self/opponent parser regressions. The
  other four definitions were regenerated from already-correct parser output;
  no new harness abstraction was warranted.
- **Proof:** all five parser audits and 14 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the engine suite passes 2,631 with 2
  skipped; cards, parser, and engine checks pass. The generated inventory now
  records 1,399 exact transformations, 168 mismatches, and 1,100 behavior files.
- **Next-two result:** inspect OP13-112 and OP13-113 to measure whether
  audit-first regeneration again closes stale permanent or Trigger structure
  without shared repair.

Current checkpoint (OP13-112 through OP13-119, five verified ability cards):

- **Signal:** audit-first inspection immediately accepted OP13-112, OP13-118,
  and OP13-119, while OP13-113 and OP13-114 repeated the stale generated
  definition pattern. OP13-112's first Blocker scenario also exposed a fixture
  prompt from the default Leader after DON!! attachment, which initially looked
  like shared-engine failure.
- **Change:** regenerated only the two stale definitions and corrected
  S-Snake's localized minus sign. The Vegapunk scenario now names an inert
  Leader explicitly so its aggregate given-DON!! proof reaches battle without
  an unrelated pending effect. No shared abstraction or engine repair was
  warranted.
- **Proof:** all five parser audits and 15 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the engine suite passes 2,631 with 2
  skipped; cards, parser, and engine checks pass. The generated inventory now
  records 1,401 exact transformations, 166 mismatches, and 1,102 behavior files.
- **Next-two result:** inspect OP13-120 and OP14-002 audit-first, and explicitly
  name fixture Leaders whenever setup commands can trigger their abilities.

Current checkpoint (OP13-120 through OP14-005, five verified ability cards):

- **Signal:** all five definitions passed audit unchanged, so this batch was
  entirely placeholder replacement. OP14-002 and OP14-004 shared a dynamic
  current-power threshold, while OP14-003 required effect-source base power and
  category provenance rather than the target's modified state.
- **Change:** none. Existing public power projection, effect provenance, and
  command rejection made each boundary directly testable without a new helper.
  One test-only correction removed an expected hand-cost prompt because the
  engine automatically pays a sole exact unordered candidate.
- **Proof:** all five parser audits and 12 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped; parser and engine checks pass. The generated inventory
  records 1,401 exact transformations, 166 mismatches, and 1,106 behavior files.
- **Next-two result:** inspect OP14-006 and OP14-009 to measure whether the
  existing threshold/provenance fixtures remain sufficient without setup churn.

Current checkpoint (OP14-006 through OP14-012, five verified ability cards):

- **Signal:** OP14-006 and OP14-012 reused the 5000-current-power attack
  threshold without new setup, while OP14-010 repeated the stale missing
  included-trait marker. OP14-009 required reconciling catalog data with the
  official November 2025 errata before testing its battle-scoped swap.
- **Change:** repaired OP14-010's Supernovas search filter and removed The Seven
  Warlords of the Sea from OP14-009's traits per the official errata. Existing
  public command and projection paths covered both dynamic threshold cards, so
  no harness abstraction was added.
- **Proof:** all five parser audits and 11 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped; cards, parser, and engine checks pass. The generated
  inventory records 1,402 exact transformations, 165 mismatches, and 1,111
  behavior files.
- **Next-two result:** OP14-013 and OP14-014 are already known from read-only
  scouting to need only included-trait regeneration; measure whether both reach
  focused green without another definition cycle.

Current checkpoint (OP14-013 through OP14-021, five verified ability cards):

- **Signal:** OP14-013/014/016 repeated included-trait metadata drift, and
  OP14-013 additionally exposed a display suffix leaking into rules identity.
  OP14-021 showed the more serious boundary: its stored definition correctly
  filtered self-rest events, but current generated output would erase that
  provenance.
- **Change:** corrected OP14-013's rules-facing name, regenerated the three
  included-trait definitions, and taught generic `whenBecomesRested` parser
  blocks to emit `eventFilter.targetSelf`. A narrow OP14-021 parser regression
  proves the filter and its explicit top-Life position before regeneration.
- **Proof:** all five parser audits and 14 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,412 exact transformations, 155 mismatches, and 1,116
  behavior files.
- **Next-two result:** inspect OP14-022 and OP14-023 for self-event provenance
  and deferred-turn behavior to measure whether the parser repair prevents a
  second definition cycle.

Current checkpoint (OP14-022 through OP14-026, five verified ability cards):

- **Signal:** OP14-022 and OP14-025 repeated stale exact-trait definitions even
  though the current parser already emits included-trait matching. OP14-024's
  mixed card/DON!! rest prompt projects as a payment-shaped decision, but that
  friction appeared only once in this batch.
- **Change:** regenerated the two stale card definitions at the owning layer;
  no new helper or skill rule was added because the existing audit-first loop
  already diagnosed both and the mixed-rest projection has only one example.
- **Proof:** all five parser audits and 9 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,414 exact transformations, 153 mismatches, and 1,121
  behavior files.
- **Next-two result:** read-only audits for OP14-027 and OP14-028 already pass
  with self-rest provenance, showing checkpoint 19's parser repair prevents a
  regeneration cycle on the next two cards.

Current checkpoint (OP14-027 through OP14-032, five verified ability cards;
OP14-030 remains in the vanilla catalog batch):

- **Signal:** OP14-027, OP14-028, and OP14-032 all rely on self-only rest-event
  provenance, while OP14-029 relies on self-only removal provenance. All four
  now regenerate correctly through the existing parser paths. OP14-027 also
  showed that a partial command-driven test is useful evidence but not complete
  semantic verification.
- **Change:** regenerated OP14-029's stale replacement filter and added complete
  authored public-behavior coverage; no new helper or skill rule was needed
  because the inventory already excludes `validateCardAbility(...)`
  placeholders and warns that behavior-file presence is not semantic proof.
- **Proof:** all five parser audits and 12 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,415 exact transformations, 152 mismatches, and 1,125
  behavior files.
- **Next-two result:** inspect OP14-033 and OP14-034 for multi-timing and
  replacement completeness while preserving the audit-first, authored-proof
  distinction.

Current checkpoint (OP14-033 through OP14-043, five verified ability cards):

- **Signal:** OP14-034, OP14-042, and OP14-043 repeated stale exact-trait
  definitions while current parser output already uses included matching.
  OP14-033/034 also confirmed that multi-timing and replacement cards need
  clause-specific success, decline, source, target, and duration boundaries.
- **Change:** regenerated the three stale card definitions and strengthened the
  OP14-034 integration test after an explicit lease transfer; no new helper or
  skill rule was added because the existing audit and whole-diff review gates
  caught both forms of friction.
- **Proof:** all five parser audits and 14 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,418 exact transformations, 149 mismatches, and 1,130
  behavior files.
- **Next-two result:** read-only audits for OP14-044 and OP14-045 already pass;
  measure whether both reach focused green without a definition cycle.

Current checkpoint (OP14-044 through OP14-048, five verified ability cards):

- **Signal:** OP14-048 and three existing draw-then-trash regressions all
  reached a mandatory hand-trash action where every eligible card had to be
  selected, but the engine still created a no-choice prompt. OP14-044 also
  showed that the standalone conditional-reveal parser dropped printed
  inclusive trait matching, while OP14-045 exposed the unhandled singular
  hand-trash trigger already emitted by the parser.
- **Change:** auto-resolve mandatory hand-trash selections when their maximum
  equals the complete eligible pool; preserve `match: "includes"` in the
  standalone conditional-reveal parser; and dispatch the singular and batch
  effect-origin hand-trash trigger families from the same movement event.
- **Proof:** all five parser audits and 12 focused command-driven tests pass;
  the three directly affected hand-trash regressions pass; the parser suite
  passes 1,204 tests and the configured engine suite passes 2,631 with 2
  skipped. Cards, parser, and engine checks pass. The generated inventory
  records 1,420 exact transformations, 147 mismatches, and 1,135 behavior
  files.
- **Next-two result:** use OP14-049 and OP14-050 to measure whether singular
  hand-trash triggers and included-trait parser output now avoid another shared
  repair or regeneration cycle.

Current checkpoint (OP14-049 through OP14-053, five verified ability cards):

- **Signal:** OP14-049 exercised the singular effect-origin hand-trash trigger
  without another engine repair, validating checkpoint 23's shared change.
  OP14-050 and OP14-052 instead repeated stale exact-trait definitions even
  though current parser output already preserved included matching.
- **Change:** reconciled those two card definitions to current parser output;
  no new helper or skill rule was added because the per-card audit and generated
  inventory already caught both definition drift and the authored-test filename
  mismatch before publication.
- **Proof:** all five parser audits and 14 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,422 exact transformations, 145 mismatches, and 1,139
  behavior files.
- **Next-two result:** read-only audits already localize OP14-054's stale
  included Leader trait and show OP14-056 exact; measure whether both reach
  focused green without shared parser or engine work.

Current checkpoint (OP14-054 through OP14-063, five verified ability cards;
OP14-055 remains in the vanilla catalog batch):

- **Signal:** OP14-054, OP14-061, and OP14-062 all had current parser output
  that preserved printed inclusive matching or optional costs while their
  committed definitions remained stale. OP14-063 additionally had a stale
  audit invariant that contradicted the parser's correct inclusive trait
  filter.
- **Change:** reconciled the three stale definitions and the narrow OP14-063
  audit invariant; no new helper or skill rule was added because the existing
  audit-first gate localized every mismatch before behavior implementation.
- **Proof:** all five parser audits and 15 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,426 exact transformations, 141 mismatches, and 1,144
  behavior files.
- **Next-two result:** use OP14-064 and OP14-065 to measure whether the same
  audit-first reconciliation avoids a shared repair cycle on the next two
  cards.

Current checkpoint (OP14-064 through OP14-069, five verified ability cards;
OP14-066 remains in the vanilla catalog batch):

- **Signal:** OP14-064 and OP14-065 reached focused green directly from their
  audit-clean definitions. OP14-067, OP14-068, and OP14-069 repeated the
  established pattern where current parser output preserved inclusive traits
  or optional costs but both committed definitions and narrow audit sentinels
  lagged behind it.
- **Change:** reconciled those three definitions and their audit sentinels to
  the current parser; no new helper or skill rule was needed because the
  audit-first workflow separated definition drift from runtime behavior before
  test authoring.
- **Proof:** all five parser audits and 11 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,429 exact transformations, 138 mismatches, and 1,149
  behavior files.
- **Next-two result:** use OP14-070 and OP14-071 to measure whether audit-first
  reconciliation continues to avoid shared parser or engine repair.

Current checkpoint (OP14-070 through OP14-075, five verified ability cards;
OP14-073 remains in the vanilla catalog batch):

- **Signal:** OP14-071 repeated stale exact-trait definition drift, which the
  audit-first gate localized before behavior work. OP14-070 exposed a distinct
  shared provenance boundary: effect-driven rest events retained the acting
  seat but not the physical Character that originated the effect.
- **Change:** effect-driven Character rest now carries its source instance
  through both rest trigger families, including replacement continuations.
  The OP14-071 audit sentinel and definition now preserve inclusive Leader
  trait matching. No skill change was warranted from these isolated findings.
- **Proof:** all five parser audits and 13 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,432 exact transformations, 135 mismatches, and 1,154
  behavior files.
- **Next-two result:** use OP14-081 and OP14-082 to verify that source-aware
  trigger preflight and audit-first reconciliation avoid another shared repair.

Current checkpoint (OP14-081 through OP14-085, five verified ability cards):

- **Signal:** OP14-082 and OP14-084 both repeated stale inclusive-trait
  expectations in their definitions and narrow audit sentinels, while the
  current parser output already preserved the printed inclusion semantics.
- **Change:** reconciled both definitions and sentinels to current parser
  output. No new helper or skill rule was added because the existing audit-first
  gate localized both mismatches before runtime behavior work.
- **Proof:** all five parser audits and 11 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,434 exact transformations, 133 mismatches, and 1,159
  behavior files.
- **Next-two result:** use OP14-086 and OP14-087 to measure whether audit-first
  reconciliation continues to prevent parser or engine repair cycles.

Current checkpoint (OP14-086 through OP14-090, five verified ability cards):

- **Signal:** OP14-086 through OP14-089 repeated stale exact-trait definitions
  or audit sentinels while current parser output already preserved the printed
  inclusive matching. OP14-090's definition was exact and its only repair cycle
  was a first-player attack-restriction fixture correction.
- **Change:** reconciled the four stale definitions and their narrow sentinels;
  no helper or skill change was needed because audit-first localization and the
  existing attack-legality fixture checklist covered the repeated friction.
- **Proof:** all five parser audits and 12 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,438 exact transformations, 129 mismatches, and 1,164
  behavior files.
- **Next-two result:** use OP14-091 and OP14-092 to measure continued audit-first
  localization and reuse of existing replacement/trigger fixtures.

Current checkpoint (OP14-091 through OP14-100, five verified ability cards;
OP14-095 and OP14-101 remain in the vanilla catalog batch):

- **Signal:** OP14-091, OP14-093, and OP14-100 repeated stale inclusive-trait
  definitions, while OP14-092's definition and sentinel omitted the parser's
  self-target event provenance for its K.O. replacement.
- **Change:** reconciled those four definitions and sentinels to current parser
  output. No new abstraction or skill rule was needed because the existing
  audit-first gate and replacement fixtures localized every mismatch.
- **Proof:** all five parser audits and 11 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,442 exact transformations, 125 mismatches, and 1,169
  behavior files.
- **Next-two result:** use OP14-102 and OP14-103 to measure whether current
  Life Trigger and inclusive-trait fixtures avoid shared repair cycles.

Current checkpoint (OP14-102 through OP14-106, five verified ability cards):

- **Signal:** OP14-102 through OP14-105 repeated stale inclusive-trait,
  Life-position, or self-play definitions. OP14-105 also exposed that the
  parser recognized "Leader and all Characters" but omitted the per-recipient
  DON!! distribution semantics required by `each`.
- **Change:** reconciled all five definitions and audit sentinels, and taught
  the shared leader-and-all DON!! parser branch to emit
  `distribution: "each"`. No skill or harness change was needed.
- **Proof:** all five parser audits and 12 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,447 exact transformations, 120 mismatches, and 1,174
  behavior files.
- **Next-two result:** use OP14-107 and OP14-108 to measure whether the current
  inclusive-Leader and Life Trigger fixtures avoid another shared repair.

Current checkpoint (OP14-107 through OP14-111, five verified ability cards):

- **Signal:** OP14-107 and OP14-109 through OP14-111 repeated stale inclusive
  trait definitions or audit sentinels; OP14-107 also retained the older
  generic self-play Trigger shape. OP14-108 was exact on its first audit.
- **Change:** reconciled the four stale definitions and their sentinels. No new
  parser, engine, harness, or skill abstraction was warranted because the
  existing audit-first gate localized every mismatch before behavior work.
- **Proof:** all five parser audits and 14 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,451 exact transformations, 116 mismatches, and 1,179
  behavior files.
- **Next-two result:** use OP14-112 and OP14-113 to measure whether the existing
  inclusive-trait and self-play fixtures continue to avoid shared repair.

Current checkpoint (OP14-112 through OP14-119, five verified ability cards;
OP14-116 through OP14-118 remain outside the Character ability queue):

- **Signal:** OP14-112 through OP14-115 repeated stale inclusive-trait or
  self-play definitions and sentinels. OP14-114 additionally showed that the
  give-DON parser's explicit `{Trait} type Leader or Character` branch emitted
  exact matching, unlike the other current inclusive-trait branches.
- **Change:** reconciled the four stale definitions and sentinels, and made the
  explicit give-DON type-target parser emit inclusive matching. OP14-119 was
  exact on its first audit; no harness or skill change was needed.
- **Proof:** all five parser audits and 14 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,455 exact transformations, 112 mismatches, and 1,184
  behavior files.
- **Next-two result:** use OP14-120 and P-014 to measure whether current
  conditional follow-up and Life Trigger fixtures avoid shared repair.

Current checkpoint (OP14-120, P-014, P-029, P-044, and P-053; five verified
ability cards):

- **Signal:** P-014 retained the older generic self-play Trigger shape and
  P-029's stored FILM filter was exact instead of inclusive. OP14-120, P-044,
  and P-053 were exact on their first audits; all runtime repair cycles were
  fixture or visible-power expectation corrections.
- **Change:** reconciled the two stale definitions. No parser, engine, harness,
  or skill abstraction was warranted because current audit output and the
  existing fixture checklist localized every mismatch.
- **Proof:** all five parser audits and 12 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,457 exact transformations, 110 mismatches, and 1,189
  behavior files.
- **Next-two result:** use P-055 and P-063 to measure whether the current
  low-hand and filtered On Play fixtures continue without shared repair.

Current checkpoint (P-055, P-063, P-068, P-069, and P-070; five verified
ability cards):

- **Signal:** all five structured definitions were exact on their first audit,
  while all five generated `validateCardAbility(...)` files still lacked real
  command-driven behavior proof. The only repair cycle was one target-fixture
  assumption for P-063.
- **Change:** replaced the five placeholders with focused public-command tests.
  No shared abstraction or skill change was needed because each printed
  interaction reused an established fixture and prompt path.
- **Proof:** all five parser audits and 10 focused command-driven tests pass;
  the parser suite passes 1,204 tests and the configured engine suite passes
  2,631 with 2 skipped. Cards, parser, and engine checks pass. The generated
  inventory records 1,457 exact transformations, 110 mismatches, and 1,194
  behavior files.
- **Next-two result:** use P-073 and P-074 to measure whether established
  Activate Main fixtures continue to eliminate shared repair cycles.

Current checkpoint (P-073, P-074, P-075, P-079, and P-082; five verified
ability cards):

- **Signal:** P-073 and P-074 confirmed that the established Activate Main
  fixtures localize omitted printed costs without shared repair. P-079 and
  P-082 repeated stale exact-trait definitions, while P-075 exposed one parser
  gap for a cost threshold ending in “on your field.”
- **Change:** kept the audit-first preflight and added only the narrow parser
  regression needed to preserve P-075's field condition and ordered draw then
  trash actions. No new harness or workflow abstraction was warranted.
- **Proof:** all five parser audits and 12 focused command-driven tests pass;
  the full parser suite passes 1,206 tests and the configured engine suite
  passes 2,631 with 2 skipped. Cards, parser, and engine checks pass. The
  generated inventory records 1,461 exact transformations, 106 mismatches, and
  1,199 behavior files.
- **Next-two result:** use P-078 and P-081 to measure whether audit-first
  preflight turns their unstructured gap rows into focused card-definition or
  parser repairs without a shared-engine cycle.

Current checkpoint (P-078, P-081, P-083, P-085, and P-088; five verified
ability cards):

- **Signal:** P-081 and P-083 independently exposed narrow grammar gaps before
  behavior authoring: colored typed-character field counts and singular
  category-card hand-trash costs. Audit-first preflight still localized both
  failures before engine work, while P-078, P-085, and P-088 required only
  stale-definition repair.
- **Change:** broadened the two owning parser productions and added focused
  regressions. No harness or workflow abstraction was added because the
  existing public-command fixtures covered all five cards directly.
- **Proof:** all five fresh audits and 14 focused command-driven tests pass.
  The parser regressions cover the full P-081 activation and P-083 attack-cost
  sequences. The generated inventory records 1,466 exact transformations, 101
  mismatches, and 1,204 behavior files.
- **Next-two result:** use PRB02-001 and PRB02-002 to measure whether the two
  broadened grammar paths avoid another parser repair cycle while preserving
  exact trait, color, cost, and post-cost condition semantics.

Current checkpoint (PRB02-001 through PRB02-005; five verified ability cards):

- **Signal:** PRB02-001 and PRB02-002 confirmed that audit-first preflight
  isolated stale definitions before behavior authoring. PRB02-003 and
  PRB02-005 independently exposed unsupported printed grammar: a
  power-filtered Character hand cost and an opponent-next-Main-Phase action.
- **Change:** added narrow parser regressions for both grammar forms and a
  reusable delayed-action phase/seat schedule in the engine. Cost-area rest
  prompts now honor printed choice ownership. No new harness abstraction was
  warranted. A broad-gate-only OP09-105 failure was classified test-only and
  updated for the established automatic payment of unordered exact costs.
- **Proof:** all five parser audits and 17 focused command-driven tests pass;
  the parser suite passes 1,212 tests and the engine suite passes 2,497 with 2
  skipped. Cards, types, parser, and engine checks pass. The generated inventory
  records 1,469 exact transformations, 98 mismatches, and 1,209 behavior files.
- **Next-two result:** use ST01-002 and ST01-004 to measure whether audit-first
  gap work remains confined to card definitions and narrow parser productions
  without another shared-engine repair cycle.

Current checkpoint (ST01-002, ST01-004, ST01-005, ST01-013, and ST16-003; five
verified ability cards):

- **Signal:** all four ST01 cards shared the legacy set-level catalog and could
  not be reached by the standard Character audit command. ST01-005 also exposed
  that the parser recognized “other than this Character” but not the equivalent
  printed “other than this card” source exclusion.
- **Change:** the Character audit now discovers legacy set-level indexes, and
  target parsing accepts both source-exclusion wordings. No engine or harness
  abstraction was needed.
- **Proof:** all five parser audits and 11 focused command-driven tests pass;
  the parser suite passes 1,213 tests and the engine suite passes 2,507 with 2
  skipped. Cards, parser, and engine checks pass. The generated inventory
  records 1,470 exact transformations, 97 mismatches, and 1,210 behavior files.
- **Next-two result:** use ST16-005 and ST20-003 to measure whether legacy-aware
  audit preflight localizes their remaining gaps without manual parser-parity
  commands or a shared-engine repair cycle.

Final checkpoint (ST16-005, ST20-003, ST21-003, and the 200-card vanilla
Character catalog):

- **Signal:** all three final ability gaps were parser-owned. Two cards reused
  established runtime semantics once their printed clauses were preserved;
  ST21-003 mapped naturally to a turn-scoped `unblockable` keyword on the
  selected attacker. The vanilla inventory needed one executable catalog proof
  instead of 200 empty per-card tests.
- **Change:** added narrow parser support for rested named Characters, ordered
  Life inspection before returning the Trigger card to hand, and selected
  attacker Blocker prohibition. Added one parameterized invariant over the
  canonical 200-card vanilla inventory.
- **Proof:** all three final parser audits, 7 focused ability tests, and 201
  vanilla catalog tests pass; the parser suite passes 1,216 tests and the
  engine suite passes 2,712 with 2 skipped. Cards, parser, and engine checks
  pass. The generated inventory records 1,473 exact transformations, 94
  mismatches, and 1,213 behavior files.
- **Next-two result:** none; the canonical queue now has no pending ability,
  unstructured gap, or unverified vanilla Character entry.

## Progress

- Verified canonical cards: 1,983 / 1,983.
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
