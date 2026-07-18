# Character Parser Audit Loop

Audit Characters in collector-number order within one set. The current pilot is
`OP14-EB04`, stored locally as `OP14EB04`.

For each card:

1. Compare the local `effect` text with the official English card list.
2. Run `vp run audit:character -- <CARD_ID>` from this package.
   A `PASS` means the checked-in structure matches the current parser; manually
   review the action semantics too. Independent invariants in the audit script
   guard semantic false positives discovered by this loop.
3. If the structures differ, add the smallest parser regression test and fix
   reusable parser logic.
4. Run the focused parser test, then regenerate only that card with
   `vp run audit:character -- <CARD_ID> --write`.
5. Review the card diff and rerun the audit without `--write`.
6. Add a real `OnePieceTestEngine` behavior test under
   `packages/engine/tests/cards/<SET>/`. The generated `src/cards/**` inventory
   placeholders are not an execution surface. A card is not complete until the
   configured test executes its printed behavior.

Do not use the full-catalog generator for this loop. It still depends on a
network source that can differ from official text and can rewrite unrelated
card identity and printing metadata.

Current OP14 pilot:

- `OP14-002` Urouge: complete; official text, generated structure, and executed
  draw/K.O. behavior agree.
- `OP14-003` Capone"Gang"Bege: structured representation fixed; behavior is
  executed for both protected and unprotected Character-effect K.O. sources.
- `OP14-004` Cavendish: structured representation fixed by plain-statement
  parsing; conditional permanent Rush is executed above and below its threshold.
- `OP14-005` Killer: structured representation and executed rested-DON!!
  behavior agree.
- `OP14-006` Shachi & Penguin: official Unicode minus restored, parser accepts
  it, generated value is `-2000`, and executed power modification agrees.
- `OP14-007` Jewelry Bonney and `OP14-008` Scratchmen Apoo: confirmed vanilla.
- `OP14-009` Trafalgar Law: replaced the zero-value `setPower` sentinel with a
  typed `swapBasePower` action; opponent-attack triggering, cost payment,
  Leader/Character selection constraints, battle duration, and damage outcome
  execute in the engine.
- `OP14-010` through `OP14-014`: local printed text and generated structures
  reviewed with no parser discrepancy found. Official card-list comparison and
  behavior tests remain before calling the non-vanilla cards complete.
- `OP14-015` Roronoa Zoro: official Unicode minus restored; structure remains
  the correct `-1000` power modification.
- `OP14-016` X.Drake: restored two official Unicode minus signs and regenerated
  both the replacement cost and attacking effect from incorrect `+2000` values
  to `-2000`; the attacking penalty executes in the engine. Replacement-effect
  execution remains pending.
- `OP14-021` Issho: corrected `whenBecomesRested`, preserved the dependent
  `If you do` freeze, and executed both the successful Life-to-hand path and
  the no-Life path through the next Refresh Phase.
- `OP14-022` Usopp: official text and structure agree; end-of-turn timing and
  setting 2 rested DON!! active execute with a matching Leader type.
- `OP14-023` Kikunojo: official text and structure agree; its end-of-turn
  self-activation executes before the next turn begins.
- `OP14-024` Kin'emon: official text and generated structure agree. Its On Play
  DON!! activation and turn-scoped Character play restriction execute, and its
  [On K.O.] rest effect executes after both effect and battle K.O.s.
- `OP14-025` Kuro: official text and generated structure agree. Its filtered,
  cost-free play from hand executes with the required Leader name and does not
  execute with another Leader.
- `OP14-026` Kouzuki Oden: official text and generated structure agree. Its
  rested opponent-turn +2000 permanent power executes in battle.
- `OP14-027` Shanks: restored the official Unicode minus sign and regenerated
  the opponent-turn field effect from incorrect `+1000` to `-1000`; both its
  when-rested target effect and field-wide continuous power reduction execute.
- `OP14-028` Johnny: official text and generated structure agree. Its
  when-rested K.O. executes only during its controller's turn, respects rested
  and cost constraints, and uses current cost after cost-changing effects
  rather than incorrectly comparing printed base cost.
- `OP14-029` Tashigi: official text and generated structure agree. Its optional
  removal replacement can be applied or declined, pays by resting a selected
  card, and its [Activate: Main] rests 2 selected cards, enforces [Once Per
  Turn], grants +2000 through the opponent's next End Phase, then expires.
  This proof also corrected equal-power battle resolution and disallowed
  selecting already-rested cards for rest effects.
- `OP14-030` Chaka & Pell: official text confirms a vanilla Character; playing
  it spends 6 DON!! and creates no effect work, prompts, or capability issues.
- `OP14-031` Nami: preserved “at the end of this turn” as a reusable typed
  delayed action instead of activating DON!! immediately. Its On Play rests
  both eligible opposing Characters, the scheduled action sets up to 5 DON!!
  active in the End Phase, and its `[Blocker]` redirects an opponent's attack.
- `OP14-032` Humandrill: official text and generated structure agree. Becoming
  rested while attacking during its controller's turn offers only opposing
  Characters with a current cost of 4 or less, while an opponent resting it
  outside its controller's turn does not activate the effect.
- `OP14-033` Perona: corrected the parser's collapsed next-End-Phase duration
  and regenerated `untilEndOfOpponentNextEndPhase`. The engine now enforces
  `cannotBeRested` for rest effects, attacks, Blocker eligibility, and rest
  costs until expiry. Her optional `[On K.O.]` pays by resting 1 selected card
  and plays an eligible green cost-5-or-less Character from hand.
- `OP14-034` Monkey.D.Luffy: normalized the official `FILM`, `Supernovas`, and
  `Straw Hat Crew` types (and OP14-031 Nami's corresponding types). The parser
  now preserves a non-self replacement's eligible target and event source, and
  the engine discovers replacements owned by another card on the field. The
  turn-scoped +1000 power filter executes, while Luffy's once-per-turn
  replacement protects only a Straw Hat Crew Character from an opponent's
  effect and does not replace battle K.O.s or non-matching Characters.
- `OP14-035` Yosaku: official text and generated structure agree. The audit now
  independently verifies next-Refresh-Phase freeze actions and their optional,
  opponent, rested, Character, and cost-filter target semantics. Becoming
  rested during Yosaku's turn freezes one selected eligible Character through
  exactly the opponent's next Refresh Phase, excludes cost-7 Characters, and
  does not trigger when an opponent rests Yosaku outside his controller's turn.
- `OP14-042` Arlong: normalized Arlong's official `Fish-Man` and `The Sun
Pirates` types and OP14-040 Jinbe's corresponding split types. The parser's
  condition, top-4 search, optional cost-2-or-more filter, hand destination,
  and ordered bottom-deck remainder agree with official text and are guarded by
  an independent audit invariant. The engine now executes reusable deck-search
  prompts with controller-private looked-card information, legal filtered
  choices, public reveal, and explicit remainder ordering. Arlong executes the
  full search with a Fish-Man Leader and does nothing with a nonmatching Leader.
- `OP14-043` Aladine: normalized the official `Merfolk` and `The Sun Pirates`
  types. Replaced the parser's false conjunctive representation of `{Fish-Man}
or {Merfolk}` with a typed recursive `anyOf` target filter shared by play,
  search, DON!!, and general target parsing. Runtime targeting, continuous
  effects, and projected constraints now preserve the same OR semantics. The
  engine also preserves the choice inherent in every numeric “up to” target,
  including when only one card is eligible. Aladine can play either a
  Fish-Man-only or Merfolk-only cost-3-or-less Character, may choose none, and
  draws 1 card after being K.O.'d in battle.
- `OP14-044` Edward.Newgate: normalized the official `The Four Emperors` and
  `Whitebeard Pirates` types. Replaced the false standalone deck-rearrange and
  unconditional hand-trash representation with a reusable top-card reveal
  action whose trait-matching branch draws 2 and then prompts its controller to
  choose 1 card to trash. The engine keeps a nonmatching card on top, conceals
  it again when resolution ends, and executes Newgate's `[Blocker]` keyword.
- `OP14-045` Kuroobi: normalized the official `Fish-Man` and `The Sun Pirates`
  types. Added a typed trigger for cards trashed from the controller's hand by
  an effect, plus field-wide runtime dispatch after effect-based hand trash.
  Kuroobi gains turn-scoped `[Rush]` from Edward.Newgate's effect, does not
  trigger when a card is trashed as an activation cost, and draws 1 after being
  K.O.'d in battle.
- `OP14-046` Koala: official metadata already agrees. Regeneration now reuses
  the typed `anyOf` filter for its Fish-Man-or-Merfolk Leader/Character target
  instead of requiring both types. Command-driven proof covers paying the
  self-trash activation cost before target selection, either trait qualifying,
  declining the optional activation without paying, and choosing zero targets
  after paying the cost.
- `OP14-047` Shirahoshi: normalized the official `Merfolk` and `Fish-Man
Island` types and regenerated its Fish-Man-or-Merfolk hand target with the
  shared `anyOf` filter. The engine resolves draw before target selection, so a
  newly drawn eligible Character can be played; the player may choose none,
  and Shirahoshi executes `[Blocker]` during an opposing attack.
- `OP14-048` Shiryu: replaced the parser's silent omission of “trash all cards
  from your hand” with an explicit typed `amount: "all"` hand-trash action.
  The audit now rejects whole-hand text that generation fails to preserve. The
  engine returns an optional opposing Character first, then automatically
  trashes every card remaining in Shiryu's controller's hand; declining the
  up-to-1 return does not skip the mandatory hand trash.
- `OP14-049` Jinbe: normalized the official name, slug, and `Fish-Man`, `The
Seven Warlords of the Sea`, and `The Sun Pirates` types. The parser now
  preserves prose-form optional DON!! rest costs and represents an unqualified
  Character target as either player's card instead of silently narrowing it to
  the opponent. Runtime targeting combines both Character areas, and optional
  effects that cannot pay their activation cost are no longer offered. Jinbe
  can rest 2 DON!!, draw 2, then return an eligible Character owned by either
  player; declining or being unable to pay resolves nothing, while a card
  trashed from hand by an effect grants Jinbe turn-scoped `[Rush]`.
- `OP14-050` Chew: normalized the official `Fish-Man` and `The Sun Pirates`
  types. The existing parser structure already agreed with the printed effect;
  an independent audit invariant now verifies the exact Leader trait and draw
  amount instead of relying only on generated-versus-checked-in equality.
  Command-driven proof confirms Chew draws 1 with a Fish-Man Leader and does
  not draw with a nonmatching Leader.
- `OP14-051` Hatchan: normalized the official `Fish-Man` and `The Sun Pirates`
  types. Added exact parser coverage and an independent audit invariant for
  DON!!-conditioned On K.O. draws. The command repro exposed that attached
  DON!! was returned before the queued effect rechecked its condition; trigger
  resolution now carries the source's attached-DON!! snapshot from activation
  timing through optional and cost prompts. Hatchan draws after being K.O.'d
  with 2 DON!! attached at that timing and does not draw with only 1.
- `OP14-052` Hannyabal: official metadata and generated structure already
  agree. Added exact parser coverage and an independent audit invariant for the
  optional three-card hand cost plus the complete Impel Down, Character, and
  cost-6-or-less play filter. Command-driven proof covers choosing and trashing
  exactly 3 cards before playing the sole eligible target, declining the cost,
  suppressing the offer when the cost cannot be paid, and redirecting an
  opposing attack with `[Blocker]`.
- `OP14-053` Vista: replaced the parser's `setPower: 0` copy sentinel with a
  typed `setBasePowerFrom` action that names the source Leader and preserves
  permanent duration. Continuous power evaluation now copies the source's
  printed base power while retaining attached DON!! and ordinary power
  modifiers, and reusable one-shot resolution supports the same action shape.
  An independent audit invariant and command-driven proof cover the opponent's
  turn boundary, the seven-or-fewer hand condition, surviving a 4000-power
  attack as a 5000-power `[Blocker]`, and remaining 4000 with eight cards in
  hand before being K.O.'d by an equal-power attack.
- `OP14-054` Fisher Tiger: corrected official metadata from cost 4 to 6 and
  split the merged `Fish-Man/The Sun Pirates` types. Replaced the parser's
  fixed `trashFromHand: 5` approximation with a typed `trashFromHandUntil`
  action, so runtime selection is the current excess above five rather than a
  constant amount. The independent audit now checks both the hand-limit
  semantics and this card's official metadata. Command-driven proof covers
  paying 6 DON!! and drawing 3 with a Fish-Man Leader, choosing exactly two
  cards from a seven-card hand at end of turn, and leaving a hand of four
  untouched without a prompt.
- `OP14-055` The Macro Gang: confirmed the official card is vanilla, corrected
  the merged `Fish-Man/The Sun Pirates` types, and normalized its canonical
  card-specific slug. The audit now verifies the complete official metadata
  before taking its vanilla early exit, preventing an ability-free card from
  receiving an unearned PASS. Replaced the generated placeholder with a real
  command test that pays 5 DON!!, plays the 6000-power Character, and proves no
  prompts, delayed actions, or capability issues are created.
- `OP14-056` Wadatsumi: split the official `Fish-Man/The Sun Pirates` types and
  corrected an unqualified self attack prohibition from turn-scoped to a
  permanent restriction. The hand-trash audit invariant now validates the
  shared trigger independently before checking each card's distinct action,
  avoiding the former Kuroobi-specific false rejection. Runtime effect
  invalidity is now duration-aware and suppresses printed permanent, keyword,
  and future triggered effects while preserving effects gained afterward.
  Command-driven proof confirms Wadatsumi cannot normally attack, can attack
  during the turn an effect trashes a hand card, regains its restriction next
  turn, and does not trigger when three hand cards are trashed as Hannyabal's
  activation cost.
- `OP14-061` Vergo: restored both official Unicode minus signs, correcting the
  missing DON!! −1 cost and the inverted +2000/−2000 power modifier, and split
  `Punk Hazard/Navy/Donquixote Pirates` into three traits. Unicode minus is now
  accepted in the shared DON!! cost tokenizer. Replaced the misleading
  opponent-only DON!! return action with a player-explicit `returnDon` action
  used by both self and opponent effects. Runtime cost and action resolution
  can select active, rested, or attached DON!! and return it from the correct
  controller; removal replacements are offered only when their cost can be
  fulfilled. Command-driven proof covers the −2000 attack effect, insufficient
  DON!!, choosing Vergo's attached DON!! for its once-per-turn replacement,
  and suppressing that replacement when no DON!! is available.
- `OP14-062` Gladius: restored the official Unicode minus in its DON!! −1
  On K.O. cost and added exact parser/audit proof for both complete choice
  branches, including the opposing Character, base-power-6000-or-less, and
  up-to-1 constraints. Added a native `chooseOption` prompt and reusable nested
  action sequencing so structured `choice` actions execute instead of falling
  back to judge review. The specialized rest executor now preserves “up to”
  even when exactly one card is eligible. Command-driven proof covers paying
  the cost after a battle K.O. to K.O. the 6000-power attacker, choosing the
  rest branch while excluding a 7000-base-power Character, and skipping the
  entire effect cleanly when no DON!! can pay its activation cost.
- `OP14-063` Sugar: official text, metadata, and generated structure already
  agreed, so exact parser and independent audit invariants now lock both
  abilities in place. Runtime review found two reusable semantic gaps: “add up
  to” DON!! now prompts for the amount instead of forcing the maximum, and
  DON!!-on-field conditions now include DON!! attached to Leaders, Characters,
  and Stages. Command-driven proof covers choosing zero or one active DON!!,
  satisfying the six-DON boundary with five active plus one attached DON!!,
  complete cost/trait/category filtering for the hand play, and failing the
  condition at five DON!!.
- `OP14-064` Giolla: official text, metadata, and generated structure already
  agreed. Exact parser and independent audit invariants preserve the ordered
  On K.O. actions: optionally add one rested DON!!, then independently K.O. up
  to one opposing base-power-0 Character. Command-driven proof covers choosing
  zero or one DON!!, continuing to the K.O. after either choice, excluding a
  nonzero-base-power Character, and recognizing base power rather than current
  power when the zero-power target has attached DON!!.
- `OP14-065` Senor Pink: exact parser and independent audit proof preserve that
  the opponent, not Senor Pink's controller, returns one DON!! from their
  field. Command-driven proof covers giving the affected opponent the choice,
  selecting attached DON!! while leaving active DON!! untouched, and resolving
  cleanly when that opponent has no DON!! available.
- `OP14-066` Diamante: confirmed the official card is vanilla and added an
  official-metadata invariant before the audit's vanilla early exit. Replaced
  the generated placeholder with a real command test that pays 6 DON!!, plays
  the 8000-power Character, and proves no prompts, delayed actions, or
  capability issues are created.
- `OP14-067` Dellinger: exact parser and independent audit invariants preserve
  both ordered On K.O. actions: optional rested DON!! addition followed by a
  filtered top-five Donquixote Pirates search with player-ordered bottom
  placement. Command-driven proof covers the transition between both prompts,
  trait filtering, revealing one eligible card, and the exact chosen order of
  all unrevealed cards.
- `OP14-068` Trebol: fixed nested event-condition parsing so the printed
  Donquixote Pirates Leader requirement is no longer discarded after the
  DON-return trigger. The central DON-return mutation now dispatches
  `whenDonReturned` to field effects. Exact parser/audit and command-driven
  proof cover opponent-turn timing, Leader-trait gating, once-per-turn usage,
  returning active field DON!!, and optionally replacing it as rested DON!!.
- `OP14-069` Donquixote Doflamingo: restored the official name, card-specific
  slug, Unicode DON!! −3, and separate Seven Warlords/Donquixote Pirates
  traits. Choice parsing now attaches inline conditions to the actions inside
  that branch, and runtime action resolution evaluates those conditions. The
  duration is corrected to the opponent's next End Phase. Command-driven proof
  covers cost payment, conditional cost-8 K.O., the same branch doing nothing
  under the wrong Leader, cost filtering for the second branch, and preventing
  selected Characters from attacking on their next turn.
- `OP14-070` Buffalo: added source-qualified transition triggers so “becomes
  rested by your opponent's Character's effect” is not reduced to any rest.
  Self DON!! return actions now carry dependent `thenActions`, preserving “If
  you do” before setting Buffalo active. Exact parser/audit and command-driven
  proof cover the opposing Character source, accepting or declining the
  optional return, the dependent activation, and suppressing the trigger when
  Buffalo merely rests to attack.
- `OP14-071` Pica: official text, metadata, and generated structure already
  agreed. Exact parser and independent audit invariants now lock its
  Donquixote Pirates Leader condition and optional active-DON!! end-turn
  action. Command-driven proof covers both the matching- and wrong-Leader
  paths.
- `OP14-072` Baby 5: restored the official Unicode DON!! −1 and added exact
  parser/metadata invariants for both effects. `addToLife` now supports a
  hidden-information-safe amount prompt for moving cards from the top of a
  deck to the top of Life; the move is judge-visible internally while its
  public log exposes only the count. Command-driven proof covers optional
  active DON!! on play, paying DON!! −1 after battle K.O., placing the exact
  top deck card above existing Life, opponent prompt privacy, and suppressing
  the effect when the cost cannot be paid.
- `OP14-073` Machvise: confirmed the official card is vanilla and added an
  official-metadata invariant before the audit's vanilla early exit. A real
  command test pays 6 DON!!, plays the 7000-power Character, and proves no
  prompts, delayed actions, or capability issues are created.
- `OP14-074` Monet: corrected its combined trait string into separate Punk
  Hazard and Donquixote Pirates traits. Exact parser and independent audit
  invariants preserve the Leader-gated active DON!! ramp and the ordered On
  K.O. draw, hand trash, and optional rested-DON!! ramp sequence.
- `OP14-075` Lao.G: restored the official Unicode −2000; the missing sign had
  made the generated action buff an opposing Character. Exact parser and audit
  invariants now preserve the negative modifier after the optional rested-DON!!
  action.
- `OP14-081` Spider Mice: corrected the card-specific slug and added exact
  parser/audit invariants for trashing the top 3 deck cards and K.O.'ing up to
  one opposing Character with base cost exactly 1. `trashFromDeck` now has a
  native engine path that moves and publicly reveals the exact top cards;
  command-driven proof covers both effects and excludes cost-2 targets.
- `OP14-082` Oinkchuck: restored the omitted printed Trigger and corrected the
  card-specific slug. `[Trigger]` text is now first-class parser input for
  character and event/stage generation instead of being stripped. Life-trigger
  activation now reveals the card, resolves its effect, and trashes it unless
  the effect moved it elsewhere; skipping still adds it privately to hand.
- `OP14-083` Ms. Wednesday: restored the official Unicode −3000; the missing
  sign had made the generated action buff its target. Exact parser/audit and
  command-driven proof cover the optional self-trash cost, current-cost-0
  target filtering, negative modifier, and declined activation.
- `OP14-084` Ms. All Sunday: compound play parsing now recognizes suffix
  `with a type including` wording and `and a cost` filters. Regeneration adds
  distinct Baroque Works cost ≤4 and cost =1 filters to the two trash-play
  actions. The OP14 Crocodile prerequisite now has separate Seven Warlords and
  Baroque Works traits; command proof covers ordered prompts, exclusions, and
  Leader gating.
- `OP14-085` Miss.Goldenweek(Marianne): official text and generated actions
  already agreed. Exact parser/audit and battle-driven proof lock the ordered
  draw-2 then choose-and-trash-2 sequence against the post-draw hand.
- `OP14-086` Miss Doublefinger(Zala): fixed plain conditional permanent parsing
  by splitting comma-and `all of` actions and recognizing suffix type-including
  targets. Continuous cost modifiers now contribute to effective current cost.
  Proof covers both modifiers above and below the seven-trash threshold.
- `OP14-087` Miss.Valentine(Mikita): normalized the rules name and slug so its
  self-name exclusion matches at runtime. Search parsing now recognizes suffix
  `card with a type including` filters; regeneration requires Baroque Works,
  excludes another Miss.Valentine, and trashes the other looked-at cards.
- `OP14-088` Miss.MerryChristmas(Drophy): official text and generated actions
  already agreed. Exact audit/parser invariants and battle-driven proof preserve
  the Leader gate, draw-before-choice ordering, and current-cost-1 Stage filter.
- `OP14-089` Ryuma: split the merged Land of Wano and Thriller Bark Pirates
  traits, then regenerated the previously omitted printed Trigger. Proof covers
  ordered On K.O. hand replacement and rested eligible trash play from Life.
- `OP14-090` Mr.1(Daz.Bonez): natural conditional Rush: Character wording now
  parses as a permanent self keyword behind the cost-0-or-8+ field condition.
  `existsOnField` now checks both fields and guarded permanent evaluation avoids
  current-cost recursion. Runtime targeting distinguishes Rush: Character from
  full Rush, so it cannot attack the opposing Leader on the turn it is played;
  On Play cost-0 rest is also covered.
- `OP14-091` Mr.2.Bon.Kurei(Bentham): normalized the official rules name and
  self-exclusion punctuation, then regenerated the missing cost, trait, and
  Character filters. Battle-driven proof covers the combined hand/trash pool,
  optional selection, self-name exclusion, wrong-trait rejection, and cost-7
  rejection.
- `OP14-092` Mr.3(Galdino): official text and generated replacement structure
  already agreed. Exact-count replacement feasibility now prevents offering the
  effect with fewer than 3 trash cards; battle proof covers chosen bottom-deck
  order, survival, opponent-turn timing, and once-per-turn exhaustion.
- `OP14-093` Mr.4(Babe): recursive target filtering now composes suffix
  type-including wording with `and a cost` in trash-to-hand actions.
  Regeneration restores Baroque Works and cost ≤8 filters; battle-driven proof
  covers Blocker, On K.O., self-in-trash eligibility, off-trait rejection, and
  rejection after current cost rises above 8.
- `OP14-094` Mr.5(Gem): the shared cost-0-or-8+ field condition generalized
  without another parser repair. Exact invariants and command proof cover
  Blocker, either-player current-cost qualification, draw-before-trash ordering,
  and selection from the post-draw hand.
- `OP14-095` Mr.9: confirmed as a vanilla Character. The audit locks official
  black, cost 5, power 6000, counter 2000, Strike, and Baroque Works metadata;
  the generated placeholder ability test was removed because there is no
  executable card-text behavior to assert.
- `OP14-100` Absalom: the On K.O. search was already structured correctly, but
  the stored effects omitted its printed life Trigger. Regeneration restores
  the optional cost-4-or-less Thriller Bark Pirates Character play from trash
  rested. Exact parser/audit invariants and battle-driven proof cover search
  filtering, chosen bottom-deck order, life activation, trait and cost
  exclusions, and the rested play state.
- `OP14-101` Oars: corrected the official power from 1000 to 10000 and split
  the collapsed Giant/Thriller Bark Pirates trait string. The vanilla audit
  now locks every official metadata field, while command proof confirms that
  paying 8 DON!! plays the 10000-power Character without effect work.
- `OP14-102` Kumacy: regenerated the previously missing structured life
  Trigger. The Absalom Trigger parser path generalizes unchanged, preserving
  optional count, trash source, cost/trait/Character filters, and rested play;
  command proof covers both filter exclusions and the final rested state.
- `OP14-103` Gloriosa (Grandma Nyon): structural equality hid an omitted On
  Play cost. Colon-cost parsing now emits `addLifeToHand`, and the engine asks
  for the top or bottom Life card before resolving the optional hand-to-top-
  Life action. `Play this card` now carries a self-only constraint so a life
  Trigger cannot play another hand card. Command proof covers both paths.
- `OP14-104` Gecko Moria: normalized the official name, slug, and separate
  Seven Warlords/Thriller Bark Pirates traits, then regenerated the omitted
  Trigger. The select-play-or-Life parser now reuses common target parsing so
  both destination branches preserve trait, cost, and Character filters.
  Command proof covers both On Play destinations and the broader Trigger.
- `OP14-105` Gorgon Sisters: the card was entirely absent from the local
  catalog. Added its official dual Slash/Special attributes and extended the
  shared attribute model, alternative-trait reveal-cost parsing/payment, and
  multi-target rested-DON!! distribution. Exact audit and command proof cover
  reveal eligibility, unchanged hand contents, per-card attachment, once-per-
  turn use, and the Kuja Pirates-gated self-play Trigger.
- `OP14-106` Salome: split the collapsed Animal/Amazon Lily traits and
  regenerated the omitted self-only life Trigger. Exact audit and battle proof
  cover both actual Blocker redirection and playing Salome—not another hand
  card—from Life.
- `OP14-107` Shakuyaku: regenerated the omitted Kuja Pirates Leader-gated,
  self-only Trigger. Exact parser/audit and command proof also lock the
  opponent-Life threshold and draw-before-exact-trash ordering.
- `OP14-108` Silvers Rayleigh: regenerated the omitted Trigger that activates
  the card's On Play effect. Exact audit and command proof cover the
  multicolored-Leader and opposing-Life conjunction, base-power filtering,
  both On Play and life-triggered resolution, and final Trigger disposal.
- `OP14-109` Victoria Cindry: regenerated the omitted filtered life Trigger
  alongside Blocker. Exact parser/audit and battle-driven command proof cover
  attack redirection plus cost, trait, category, and rested-play semantics.
- `OP14-110` Dr. Hogback: corrected the audit's Trigger-heading detection so
  a `[Trigger]` filter inside On K.O. text cannot hide the separate life
  Trigger. Regeneration and command proof cover non-self Trigger-card filters
  and the distinct rested Thriller Bark trash-play path.
- `OP14-111` Perona: normalized the official name and slug and regenerated the
  omitted life Trigger. Exact parser/audit and command proof cover both shared
  On Play/On K.O. attack restrictions, cost filtering, duration expiry, and
  the filtered rested trash-play Trigger.
- `OP14-112` Boa Hancock: normalized the official name, slug, and separate
  Seven Warlords/Kuja Pirates traits, then regenerated the omitted life
  Trigger. Optional opponent-Life removal now prompts for zero or one instead
  of always taking a card; command proof covers the Life exchange and Trigger
  power/keyword/category filters.
- `OP14-113` Marguerite: regenerated the alternative-trait search as one
  `anyOf` filter and restored the omitted Leader-gated self-play Trigger.
  Command proof covers both eligible traits, chosen bottom-deck ordering,
  mandatory trash from the post-search hand, and self-only Trigger play.
- `OP14-114` Ran: normalized the set-specific slug and regenerated the omitted
  Leader-gated self-play Trigger. Exact parser/audit and command proof cover
  Kuja-only target eligibility, rested-DON movement, optional single target,
  once-per-turn enforcement, and self-only Trigger play.
- `OP14-115` Rindo: taught damage parsing to preserve `you take N damage` and
  implemented effect-driven Life damage with normal Trigger interruption.
  Regeneration also restores the omitted Leader-gated self-play Trigger;
  command proof covers opponent-turn On K.O. timing, optional Life addition,
  subsequent damage, and self-only Trigger play.
- `OP14-119` Dracule Mihawk: normalized the official name, slug, and missing
  effect separator, then corrected `next Turn` to the printed `next End Phase`
  duration. Command proof covers cost filtering, attack-driven rest timing,
  expiry, optional hand-trash payment, battle-only power, and once-per-turn use.
- `OP14-120` Crocodile: repaired corrupted official text, normalized the name,
  slug, and separate Seven Warlords/Baroque Works traits, and generalized
  `Then, if ...` follow-up parsing. The cost-0-or-8+ condition now scopes to the
  opponent; command proof covers both draw outcomes, restriction expiry, and
  self-only optional On K.O. replay.
