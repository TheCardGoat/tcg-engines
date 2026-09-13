# Sample-100 Card Test Quality Audit

**Date:** 2026-07-30 (refreshed sample, post Grade-A bulk decline work)  
**Scope:** Stratified sample of **100** command-driven tests under  
`packages/engine/tests/cards/**` (the default suite’s real proof surface).  
**Not graded as quality surface:** `src/cards/**` `validateCardAbility` placeholders.

## Sampling method

| Axis | Target | Actual |
| --- | ---: | ---: |
| Characters | 70 | 70 |
| Events | 15 | 15 |
| Leaders | 10 | 10 |
| Stages | 5 | 5 |
| Distinct set labels | broad | 33 (EB01, EB02, EB03, EB04, OP01, OP02, OP03, OP04, OP05, OP06, OP07, OP08…) |

Seed: `20260730`. Round-robin across set × type from **1,371** candidate
behavior files (excluded coverage gates, FAQ/review harnesses, vanilla catalog).

For each sample:

1. Resolve the card export under `@tcg/op-cards` (printed `effect` + structured `effects`).
2. Read the full test file (or shared factory for one-liner re-exports).
3. Grade on three axes + run the machine `gradeSource` checker.

## Rubric

| Axis | **A** | **A−** | **B** | **C / F** |
| --- | --- | --- | --- | --- |
| **1. Engine setup** | `OnePieceTestEngine` + public commands + `getView` / projected decisions | Same but `getState()`-only for justified privacy/prompt internals | Heavy private APIs without view | No engine / metadata-only |
| **2. Text → DSL** | Printed timings/costs/actions match structured blocks | Keyword-only / minor optional nuance | Missing block or wrong trigger | Invented behavior |
| **3. Behavioral depth** | Happy path proves live board change; second path is **real** decline / negative / second timing with tight asserts | Happy path solid; second path is bulk template (try/catch + DON!! pool equality) that still opens a trigger-matched window | Missing optional decline, wrong subject for decline, or view-assert gap on otherwise good behavior | Smoke only / no outcome |

**Optional decline bar (aligned with `grade-a-checker.ts`):**

- Open the optional with a **trigger-matched** command (`whenAttacking` → `declareAttack`, `activateMain` → `activateEffect`/`activateMain`, `endOfYourTurn` → `endTurn`, etc.).
- Explicit `optionId: "no"` / `decline()` / empty `min:0` selection.
- Strict non-effect asserts (DON!! pool, zones, power, life, rested), not soft `toBeLessThanOrEqual` theater.
- Blocker reminder *“you may rest this card…”* is **not** a free-standing optional ability.

## Aggregate results (n=100)

### Human quality grade (this audit)

| Grade | Count | % | Meaning |
| --- | ---: | ---: | --- |
| **A** | **65** | 65% | Setup + DSL + deep behavioral proof |
| **A−** | **30** | 30% | Happy path Grade A; optional decline is bulk template (try/catch) |
| **B** | **5** | 5% | Real gap: missing decline, wrong decline subject, or setup style issue |
| C / F | **0** | 0% | None in this sample |

If A and A− are both “usable primary proofs”: **95%** pass a practical bar;  
**65%** are solid without template caveats.

### Machine `gradeSource` (static Grade A gate)

| Checker grade | Count |
| --- | ---: |
| A | 96 |
| B | 3 |
| D | 1 |

**Checker pass rate in sample:** 96/100.

**By card type (human overall)**

| Type | n | A | A− | B |
| --- | ---: | ---: | ---: | ---: |
| Characters | 70 | 50 | 16 | 4 |
| Events | 15 | 12 | 3 | 0 |
| Leaders | 10 | 3 | 7 | 0 |
| Stages | 5 | 0 | 4 | 1 |

### Signals across the 100

| Signal | Count |
| --- | ---: |
| Multi-test or shared factory (`n ≥ 2`) | 95 |
| Card needs structured optional decline | 37 |
| Checker: meaningful decline present | 64 |
| Bulk decline title (“may decline the optional…”) | 58 |
| try/catch wrapped decline | 61 |
| Shared factory one-liner re-export | 1 |
| Avg lines / file | 70 |

**Headline:** Happy-path proofs in `tests/cards/**` remain **strong**. The main quality
split is no longer “missing decline” (mostly fixed) but **template decline quality**:
~30 files pass the static meaningful-decline regex with trigger-matched openers and
DON!! pool equality, yet still wrap `optionId: "no"` in try/catch and rarely assert
the specific paid effect (no KO, no draw, no restand, etc.).

---

## Axis 1 — Test-engine setup

### What “good” looks like (majority)

```ts
const engine = OnePieceTestEngine.create(
  { hand: [card], activeDon: card.cost, ... },
  { character: [opponentFodder] },
  { firstPlayer: "north", activeSeat: "south" },
);
engine.playCard(card); // or declareAttack / activateEffect / endTurn
engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
const view = engine.getView("south");
expect(view.players.south...).to...
expect(view.prompts).toHaveLength(0);
```

- Fixtures encode turn order when Rush / attacks / Life Triggers matter.
- Prompt intents match projected decisions.
- Negatives use `expectFailure({ type })`.
- Shared factories (e.g. `defineTopFourCostSearchEventTests`) give thin re-export files
  (Kokoro no Chizu) full multi-path coverage.

### Setup issues in this sample

1. **OP13-109 Jewelry Bonney** — behavior is excellent (replacement + face-up gate) but
   resolves via `engine.exec({ type: "resolvePrompt" })` + `getState()` only. Checker
   marks **D** (missing getView). Human: **B** until migrated to public helpers.
2. **Bulk decline fixtures** still often `try { playCard/activate; optionId no } catch {}`
   so a failed open never fails the test. Static asserts on DON!! pool still pass.
3. **OP04-096 Corrida Coliseum decline** plays a **Character** from hand and tries to
   decline an optional that is not the stage’s continuous Dressrosa attack rule —
   wrong subject. Happy path is Grade A.

---

## Axis 2 — Printed text → ability DSL

Spot-check of all 100 printed `effect` strings against test command paths:

| Pattern | Sample cards | Test path matches? |
| --- | --- | --- |
| Activate: Main optional rest cost | Bingoh, Hina, Tashigi ST06, Sunny | activateEffect + effectOptional |
| On Play DON!! −N optional | Foxy EB04, Queen ST04, Senor Pink | playCard + returnDon |
| When Attacking optional return | EB02-061 Luffy, Uta, Fighting Fish | declareAttack + optionId |
| End of turn optional | Hannyabal | endTurn + optionId |
| On K.O. / Trigger optional | Marco, Poire, Morley Trigger | attack/lifeTrigger + optionId |
| Continuous / permanent | Jango+Fullbody, Corrida, Capone Bege | fixture + attack legality |
| Blocker keyword only | Chimney & Gonbe, ST01 Chopper | battleBlocker path |
| Event Main/Counter/Trigger | Fire Fist, Ragnaraku, Kokoro factory | play / battle / life |

**Verdict:** High confidence. Definitions generally encode the same triggers and costs
the tests exercise. Residual optional-flag inventory issues (if any) are card-data work,
not “tests invent behavior.”

---

## Axis 3 — Do tests catch real regressions?

### Grade A exemplars (would fail on real bugs)

| Card | Why the test catches bugs |
| --- | --- |
| **EB02-061 Monkey.D.Luffy** | Rush gate (opp ≥5 DON!!), dual DON!! return sources, restand + take Life once-per-turn, **surgical decline** (stays rested, no Life, DON!! unchanged) |
| **EB01-016 Bingoh** | Rest cost + candidate filter (only rested cost ≤1); decline via activateMain + optionId no |
| **OP04-096 Corrida Coliseum** (happy) | Dressrosa Leader gate; current-turn Character attack only Characters; non-Dressrosa blocked |
| **OP03-013 Marco** (happy + KO accept) | Power ≤3000 KO filter; On K.O. Event-trash cost filters Events only; same instance replayed rested |
| **ST04-005 Queen** (happy) | DON!! −1, draw 2, trash 1 from hand including draws |
| **OP05-016 Morley** | 7000 power Blocker lock boundary; Trigger multicolor Leader gate |
| **EB02-050 Kokoro no Chizu** | Shared factory: top-4 legality map + remainder order + Life Trigger free Main |
| **OP04-019 Doflamingo** | End turn amount 0/1/2 options; sets exact active/rested DON!! |

### Grade A− pattern (template optional decline)

About **30** files pair a strong happy path with a second test titled
*“may decline the optional … without applying its paid effect”* that:

1. Opens with a trigger-matched command (so the static checker accepts it),
2. Wraps `resolveDecision(..., optionId: "no")` in **try/catch**,
3. Asserts mainly `activeDon+restedDon` and `donDeckCount` equality.

Examples in sample: **ST04-005 Queen** decline, **EB01-016 Bingoh** decline,
many ST-set Activate: Main cards, several leaders/stages.

These would **not** catch a regression that auto-pays the optional and applies the
effect while somehow preserving DON!! pool math (or never opens the window — catch
swallows it). Prefer Luffy-style declines: **no try/catch**, assert the *effect*
did not happen (power, KO, draw, restand, Life).

### Grade B gaps (5 in sample)

| Card | Gap |
| --- | --- |
| **OP13-109 Jewelry Bonney** | Excellent replacement proof; missing `getView` / public resolve helpers |
| **OP05-016 Morley** | Strong attack + Trigger accept paths; **no decline** of Trigger optional trash-to-play |
| **OP03-013 Marco** | Strong On Play + On K.O. **accept**; **no decline** of On K.O. Event cost |
| **OP08-104 Charlotte Poire** | Strong Trigger accept + Rush negative; **no decline** of Trigger trash cost |
| **OP04-096 Corrida Coliseum** | Happy path A; bulk decline plays wrong card (Character, not stage continuous) |

---

## Representative deep dives

### A — EB02-061 Monkey.D.Luffy

- **Text:** Multicolor Leader + opp ≥5 DON!! → Rush; When Attacking once/turn optional
  return 2 DON!! → restand + take top Life.
- **Happy path:** Maps DON!! candidates (active + attached), restand, Life→hand, once/turn.
- **Negative:** Opp 4 DON!! → cannot attack (no Rush).
- **Decline:** `declareAttack` → `optionId: "no"` → stays rested, Life/hand/DON!! unchanged.
- **Grade A** (model decline for the corpus).

### A− — ST04-005 Queen (PRB01 full art id in fixture)

- **Happy:** DON!! −1, draw 2, trash 1 — **A**.
- **Blocker:** combat KO of Queen absorbing attack — good keyword path.
- **Decline:** playCard + try/catch optionId no + DON!! pool only — **template**.
- **File A−**.

### B — OP03-013 Marco

- On Play KO filter and On K.O. Event cost accept are excellent.
- Structured optional On K.O. lacks a named decline (trash Event / stay dead).
- **File B** until decline added.

### B / D checker — OP13-109 Jewelry Bonney

- Replacement: stay on field, top Life face-up; negative when Life already face-up.
- Uses `resolvePrompt` + `getState` — migrate to `resolveDecision` / `getView`.

### A via factory — EB02-050 Kokoro no Chizu

- One-line test re-exports `defineTopFourCostSearchEventTests` — full Main search +
  Trigger free-play paths in the shared module. Correct pattern for mechanical twins.

### A happy / B decline — OP04-096 Corrida Coliseum

- Continuous Dressrosa attack rule fully proved.
- Decline test is theater (plays Cavendish, not exercising stage optional).

---

## Confidence statements

### 1) Are tests set up correctly with the test engine?

**Yes, with high confidence for `tests/cards/**`.**  
99/100 use `OnePieceTestEngine` + public commands (or a shared factory that does).
One file (Bonney OP13) is behavior-correct but prompt-API styled. Residual risk is
try/catch decline fixtures masking open failures.

### 2) Are cards correctly represented in ability DSL from original text?

**Yes, high confidence on this sample.**  
Printed effect text and structured triggers line up with the commands tests fire.
No sampled case looked like “test invents an effect the card does not have.”

### 3) Do non-vanilla tests catch meaningful behavior changes?

**Mostly yes — ~65% solid A, ~30% A− (soft second path), ~5% B.**  
Happy paths almost always assert zones, power, DON!!, candidate filters, and cleared
prompts. Weak spots are template declines and a few missing optional declines on
Trigger / On K.O. paths that already have strong accept tests.

---

## Full sample grade table

Legend: **A** solid primary; **A−** happy path solid + bulk decline template; **B** real gap.  
`Chk` = machine `gradeSource`. `Opt` = needs optional decline. `MD` = meaningful decline present.

| ID | Type | Human | Chk | Opt | MD | #tests | What the tests prove (titles) |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| EB01-016 | character | A- | A | Y | Y | 2 | rests as its cost and maps only a rested opposing 1-cos · may decline the optional Activate: Main… |
| EB01-024 | character | A | A |  | Y | 2 | buffs itself and compound-trait SMILE Characters once h · may decline the optional ability withou… |
| EB01-026 | character | A | A |  | Y | 2 | can return an eligible Character owned by either player · may decline the optional ability withou… |
| EB02-017 | character | A | A |  | Y | 2 | reveals a compound Straw Hat card other than Nami and o · may decline the optional ability withou… |
| EB02-055 | character | A | A |  | Y | 2 | plays its resolving physical card from Life for an incl · may decline the optional ability withou… |
| EB02-061 | character | A | A | Y | Y | 3 | gains conditional Rush, maps DON!! from two sources, re · does not gain Rush below the opponent f… |
| EB03-004 | character | A | A |  |  | 2 | gains power on the opponent · does not gain power when a base-6000 Character is prese |
| EB03-035 | character | A | A |  |  | 2 | adds rested DON!! at the field-count boundary and maps  · does not add DON!! when its field alrea… |
| EB03-041 | character | A- | A | Y | Y | 3 | trashes a Navy card before drawing 2 on play · gives only own cost-6-or-less SWORD Characters +20… |
| EB04-018 | character | A- | A | Y | Y | 2 | optionally rests itself to K.O. only a rested opposing  · may decline the optional ability withou… |
| EB04-026 | character | A | A |  |  | 2 | places only an opposing cost-1-or-less Character at the · draws one and trashes one card from han… |
| EB04-036 | character | A | A | Y | Y | 3 | pays DON!! -1, draws and trashes with the Leader gate,  · still pays DON!! -1 and rests a target … |
| OP01-022 | character | A | A |  |  | 1 | with DON!! attached, gives up to two opposing Character |
| OP01-038 | character | A | A |  |  | 2 | when K.O. · cannot attack with a Character played on the current tu |
| OP01-093 | character | A- | A | Y | Y | 2 | rests 1 DON!! on play to add one rested DON!! from the  · may decline the optional ability withou… |
| OP02-061 | character | A | A |  |  | 3 | at 1 hand, prevents only cost-5-or-less Blockers during · above the hand threshold, permits both … |
| OP02-100 | character | A | A |  |  | 2 | cannot be K.O. · is K.O. |
| OP02-103 | character | A | A |  |  | 3 | with DON!! attached, gives an opposing Character -2 cos · without DON!! attached, does not offer … |
| OP03-013 | character | B | B | Y |  | 2 | on its controller · on K.O., may trash an Event to replay the same physical |
| OP03-032 | character | A | A |  | Y | 2 | survives battle against Slash but can be K.O. · may decline the optional ability without applying… |
| OP03-065 | character | A | A |  | Y | 2 | blocks a Leader attack and becomes the battle target · may decline the optional ability without a… |
| OP04-082 | character | A | A |  | Y | 4 | with Rebecca, K.O. · may rest either its Leader or Corrida Coliseum instead  · may decline its un… |
| OP04-097 | character | A | A |  | Y | 2 | puts an opposing low-cost Animal or SMILE Character on  · may decline the optional ability withou… |
| OP04-110 | character | A | A |  |  | 2 | blocks, then puts an eligible opposing Character in bot · on effect K.O. may choose no opposing C… |
| OP05-016 | character | B | B | Y |  | 4 | has separate Giant and Revolutionary Army types · at 7000 power prevents every opposing Blocker d… |
| OP05-064 | character | A | A |  |  | 2 | finds an included Kid Pirates card other than Killer an · may reveal nothing |
| OP06-026 | character | A | A |  |  | 2 | sets only an effective cost-4-or-less Slash Character a · also stops a Rush Character played afte… |
| OP06-082 | character | A | A |  |  | 2 | on play recognizes a compound Thriller Bark Pirates Lea · on K.O. resolves from trash for a compo… |
| OP07-045 | character | A | A |  | Y | 2 | may play a cost-4 compound Warlords Character other tha · may decline the optional ability withou… |
| OP07-080 | character | A | A | Y | Y | 3 | orders two included CP trash cards, then reduces an opp · does not offer its optional effect with… |
| OP08-088 | character | A | A |  |  | 1 | gives one of your Characters +1 cost through the end of |
| OP08-104 | character | B | B | Y |  | 2 | trashes a physical hand card to play itself from Life,  · cannot attack with a Character played o… |
| OP09-009 | character | A | A |  | Y | 2 | trashes up to 1 opposing Character with 6000 power or l · may decline the optional ability withou… |
| OP09-037 | character | A | A |  |  | 2 | finds an included ODYSSEY card other than Lim and order · at end of turn becomes active with thre… |
| OP10-067 | character | A- | A | Y | Y | 2 | may return one DON!!, recover an eligible purple Event, · may decline the optional ability withou… |
| OP10-069 | character | A- | A | Y | Y | 2 | with DON!! attached may return one DON!! to K.O. a cost · may decline the optional attack-window … |
| OP11-028 | character | A | A |  | Y | 2 | K.O.s a rested cost-3-or-less Character with its Life T · may decline the optional ability withou… |
| OP12-051 | character | A- | A | Y | Y | 2 | rests itself and trashes a hand card before disabling a · may decline the optional Activate: Main… |
| OP13-028 | character | A | A |  |  | 1 | blocks hand plays but still allows an effect to play fr |
| OP13-081 | character | A- | A | Y | Y | 2 | places a chosen trash card at deck bottom before giving · may decline the optional Activate: Main… |
| OP13-109 | character | B | D |  |  | 2 | turns the top Life card face-up instead of being return · cannot replace removal when the top Lif… |
| OP14-003 | character | A | A |  |  | 2 | only blocks opposing low-power Character effect K.O. · cannot attack with a Character played on t… |
| OP14-051 | character | A | A |  | Y | 2 | uses its trigger-time attached DON!! after battle K.O.  · may decline the optional ability withou… |
| PRB02-012 | character | A | A |  | Y | 2 | Life Trigger plays the physical card and searches for a · may decline the optional ability withou… |
| PRB02-015 | character | A | A |  | Y | 2 | with a Blackbeard Pirates Leader gains cost and Blocker · may decline the optional ability withou… |
| ST01-006 | character | A | A |  | Y | 2 | can block an attack on its Leader · may decline the optional ability without applying its p |
| ST01-012 | character | A | A |  |  | 2 | prevents an opposing Leader from activating Blocker dur · keeps Blocker locked when an opposing C… |
| ST02-004 | character | A | A |  | Y | 2 | rests to block an attack aimed at its Leader · may decline the optional ability without applying … |
| ST02-007 | character | A- | A | Y | Y | 2 | rests itself and one DON!! to search five for an includ · may decline the optional Activate: Main… |
| ST03-008 | character | A | A |  | Y | 2 | can block an attack aimed at its Leader · may decline the optional ability without applying its p |
| ST03-009 | character | A | A |  | Y | 2 | may return either player · may decline the optional ability without applying its p |
| ST04-003 | character | A | A | Y | Y | 2 | may decline the entire DON!! return, K.O., and Rush blo · may return five DON!! to K.O. a cost-6-… |
| ST04-005 | character | A- | A | Y | Y | 3 | optionally returns one DON!! before drawing two and tra · can block an attack aimed at its Leader… |
| ST06-006 | character | A- | A | Y | Y | 2 | rests itself to give an opposing Character -2 cost for  · may decline the optional Activate: Main… |
| ST06-010 | character | A | A |  | Y | 2 | on play gives an opponent Character minus 3 cost for th · may decline the optional ability withou… |
| ST07-007 | character | A | A |  |  | 2 | Life Trigger plays the resolving physical card · can block an attack on its Leader |
| ST10-005 | character | A | A |  | Y | 2 | with DON!! x1 reduces an opponent Character · may decline the optional ability without applying i… |
| ST10-010 | character | A- | A | Y | Y | 4 | returns a DON!! and lets its controller choose 2 cards  · may still pay the DON!! cost when the o… |
| ST12-012 | character | A | A |  | Y | 2 | returns itself to its owner · may decline the optional ability without applying its p |
| ST12-014 | character | A | A |  |  | 1 | privately orders the top three cards at a chosen deck e |
| ST13-011 | character | A | A |  | Y | 2 | with two Life gains Rush and attacks on the turn it is  · may decline the optional ability withou… |
| ST13-014 | character | A- | A | Y | Y | 2 | trashes itself, plays a physical cost-5 Luffy from top  · may decline the optional Activate: Main… |
| ST14-003 | character | A | A |  | Y | 2 | with an own cost-6-or-more Character K.O.s only an oppo · may decline the optional ability withou… |
| ST14-007 | character | A | A |  |  | 2 | on play reduces an opposing Character by 5 cost when it · when attacking applies the same cost re… |
| ST16-004 | character | A | A |  | Y | 2 | on play K.O.s only an opposing rested Character · may decline the optional ability without applyi… |
| ST17-002 | character | A- | A | Y | Y | 2 | returns one of its Characters as cost before a composit · may decline the optional ability withou… |
| ST17-005 | character | A- | A | Y | Y | 2 | places a chosen hand card on top of the deck before giv · may decline the optional Activate: Main… |
| ST18-001 | character | A | A |  |  | 2 | with eight DON!! on its field, rests only an opposing c · does not offer a rest target below eigh… |
| ST18-003 | character | A | A |  | Y | 2 | draws when attacking with eight DON!! on its field · may decline the optional ability without app… |
| ST19-002 | character | A- | A | Y | Y | 3 | with an included Navy Leader trashes exactly two black  · may pay the Navy cost with a non-Navy L… |
| EB01-039 | event | A- | A | Y | Y | 3 | pays 5 DON!! and DON!! -1, then K.O.s only a chosen cos · lets the damaged player add up to 1 act… |
| EB02-050 | event | A | A |  |  | 2 | (shared factory multi-test) |
| EB03-011 | event | A | A |  |  | 2 | gates the Counter by Nefeltari Vivi and maps her battle · lets the damaged player give a chosen o… |
| EB04-028 | event | A- | A | Y | Y | 3 | maps the hand cost and prevents up to 2 power-10000-or- · pays the pre-colon hand cost before a n… |
| OP01-055 | event | A- | A | Y | Y | 2 | lets the controller choose exactly 2 active Characters  · may decline the optional Event ability … |
| OP02-022 | event | A | A |  |  | 2 | maps exact and compound Whitebeard Pirates Characters a · activates the Main search from Life wit… |
| OP03-054 | event | A | A |  | Y | 2 | maps Counter power and allows the defender to decline t · Life Trigger draws 1 before the optiona… |
| OP04-075 | event | A | A |  |  | 2 | at two Life, Counter power precedes the optional rested · Life Trigger maps the optional active D… |
| OP05-019 | event | A | A |  |  | 2 | Main applies its reduction before the low-Life effectiv · Life Trigger activates Main without DON… |
| OP06-056 | event | A | A |  | Y | 2 | Main maps the cost-2 then cost-1 choices into controlle · may decline the optional Event ability … |
| OP07-018 | event | A | A |  |  | 2 | Counter includes a compound Revolutionary Army Characte · Life Trigger activates the Counter reci… |
| OP08-097 | event | A | A |  |  | 2 | Main applies the official −2 cost through an included L · Life Trigger K.O.s the printed cost-3 b… |
| OP09-059 | event | A | A |  |  | 2 | Counter trashes the same number from deck that the cont · Life Trigger draws one card without Cou… |
| OP10-020 | event | A | A |  |  | 2 | Main gives an opposing Character −4000 before the low-L · Life Trigger K.O.s the 3000-power bound… |
| OP11-037 | event | A | A |  |  | 2 | Main searches either included type while still requirin · Life Trigger draws one without paying t… |
| EB01-021 | leader | A- | A | Y | Y | 2 | returns an eligible Impel Down Character before adding  · may decline the optional end-of-turn ab… |
| EB02-010 | leader | A- | A | Y | Y | 2 | returns chosen DON, reactivates up to two, and keeps +1 · may decline the optional Activate: Main… |
| EB03-001 | leader | A- | A | Y | Y | 3 | rests herself, grants Rush selectively, and modifies th · replaces a cost-4 battle K.O. by trashi… |
| OP01-002 | leader | A | A |  | Y | 2 | returns one of exactly five Characters, then offers a d · may decline the optional when-attacking… |
| OP02-071 | leader | A | A |  | Y | 2 | gains 1000 power after only the first DON!! return duri · may decline the optional when-attacking… |
| OP03-058 | leader | A- | A | Y | Y | 2 | cannot attack and can rest itself plus return DON!! to  · may decline the optional Activate: Main… |
| OP04-019 | leader | A | A |  |  | 1 | lets its controller choose up to 2 rested DON!! to set  |
| OP05-002 | leader | A- | A | Y | Y | 2 | filters its hand cost and accepts Revolutionary Army or · may decline the optional Activate: Main… |
| OP06-001 | leader | A- | A | Y | Y | 2 | filters its FILM hand cost, maps the power target, and  · may decline the optional when-attacking… |
| OP07-079 | leader | A- | A | Y | Y | 2 | trashes the top two deck cards before mapping the oppos · may decline the optional when-attacking… |
| EB01-030 | stage | A- | A | Y | Y | 3 | lets its controller order the compound bottom-deck cost · lets the defending player use its Life … |
| EB02-009 | stage | A- | A | Y | Y | 2 | moves a chosen given DON!! card to a chosen Straw Hat C · may decline the optional Activate: Main… |
| OP02-070 | stage | A- | A | Y | Y | 3 | without Emporio.Ivankov, skips the conditioned exchange · with Emporio.Ivankov, draws before its … |
| OP03-020 | stage | A- | A | Y | Y | 3 | pays both rest costs but skips its search for a non-Ace · rejects insufficient DON!! and executes… |
| OP04-096 | stage | B | A |  | Y | 2 | lets newly played Dressrosa Characters attack only Char · may decline the optional ability withou… |

---

## Recommendations (quality, not coverage volume)

1. **Upgrade A− declines to Luffy-style** — drop try/catch; assert the paid effect
   did not fire (target still on field, no draw, stayed rested, etc.).
2. **Close the 5 B gaps in sample** — Marco / Poire / Morley optional declines;
   Bonney view API; Corrida remove or rewrite bogus decline.
3. **Keep shared factories** for mechanical twins (search events); they are Grade A.
4. **Do not sample `src/cards` placeholders** for quality metrics — dual corpus remains.
5. **Machine gate ≠ human depth** — 96% checker-A in this sample still hides ~30%
   template declines; consider flagging try/catch-around-decline in the checker.

## Corpus note

| Corpus | Role |
| --- | --- |
| `tests/cards/**` (~1.3k behavior files) | Primary proofs in `vp test run` — **this audit** |
| `src/cards/**` command tests | Additional late-set proofs |
| `src/cards/**` `test.skip` + `validateCardAbility` | Not behavior coverage |

See also: [unit-test-strategy-analysis.md](./unit-test-strategy-analysis.md).

