# Most-played cards → AAA test plan

Source: play-rate boards + win-rate boards + decklist copy counts from the
user data dump (aggregated 2026-07-31).

Goal: prioritize **behavior sensors** for cards that appear in real ladders,
not coverage theater. Prefer public `GundamTestEngine` moves and player-visible
asserts (`getHand`, `getDamage`, `getVisibleCard`, zones, winner).

## How the list was ranked

Combined signal (higher = test first):

1. **Play-rate top 5** (appears in >50% of decks) — weight high
2. **Win-rate top 5** (cards correlated with wins) — weight high
3. **Decklist copy counts** (`4 × card` across many lists) — weight medium
4. Deduped across blue/white/G-Gundam/Barbatos/Victory/SEED shells

**99 unique card numbers** appeared; below is the actionable top tier.

---

## Tier A — Test first (meta staples + high win correlation)

| #   | Card                                   | Type          | Cost | Why it matters                      | Printed behavior (summary)                                                                                                                                | Existing sibling test? | Meaningful AAA focus                                                                                                                                                               |
| --- | -------------------------------------- | ------------- | ---- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **GD05-081 Kira Yamato**               | Pilot         | 1    | #1 overall signal; SEED link engine | Burst → hand; **When Linked** if host is Orb/Triple Ship Alliance → draw 1                                                                                | yes                    | Pair/link onto Strike Freedom / Strike Rouge with Orb trait → hand +1; negative: wrong-trait host no draw; Burst optional from shield                                              |
| 2   | **GD05-002 Strike Freedom Gundam**     | Unit          | 6    | Win-rate + every SEED list          | **Deploy** choose 1–2 Units → this turn when they battle-destroy → draw 1; **During Pair / Attack** may discard 2 → return lowest-Lv enemy to deck bottom | yes                    | (1) Deploy, choose ally, destroy via combat, assert draw; (2) Attack while paired, accept discard, assert lowest-Lv bounce; decline optional no bounce; multi-ally choice boundary |
| 3   | **GD01-100 A Show of Resolve**         | Command       | 3    | Universal draw staple               | **Main** Draw 2                                                                                                                                           | yes (gold standard)    | Hand +2, deck −2, command → trash; insufficient resources; wrong timing (Action)                                                                                                   |
| 4   | **GD01-118 Overflowing Affection**     | Command       | 1    | Universal filter                    | **Main** Draw 2 then discard 1                                                                                                                            | yes                    | Draw then **post-draw** discard prompt; discard identity from new hand; cost gate                                                                                                  |
| 5   | **ST01-001 Gundam**                    | Unit          | 3    | White Base core + Repair/link       | Repair 2; **During Pair** your turn all Units AP+1; link [Amuro Ray]                                                                                      | yes                    | Repair end-turn; pair Amuro → board-wide AP+1; link attack-on-deploy; non-link no attack same turn                                                                                 |
| 6   | **ST01-010 Amuro Ray**                 | Pilot         | 1    | Pair engine for Gundam              | Burst hand; **When Paired** rest enemy ≤5 HP                                                                                                              | yes                    | Pair → rest filter (HP≤5 yes, HP6 no); Burst                                                                                                                                       |
| 7   | **GD01-086 Gundam Lfrith**             | Unit          | 2    | White blocker body                  | **Blocker**                                                                                                                                               | yes                    | Block redirect; rest self; cannot block High-Maneuver                                                                                                                              |
| 8   | **GD05-014 Javelin**                   | Unit          | 1    | #1 play-rate body (~57%)            | Vanilla (`-`)                                                                                                                                             | **no**                 | Deploy smoke + **combat role**: 1-cost chump blocks/attacks; cost/level gate only — no ability branch                                                                              |
| 9   | **ST05-004 Graze Custom**              | Unit          | 1    | Barbatos shell body                 | Vanilla                                                                                                                                                   | yes                    | Same as other vanillas; keep minimal deploy/attack sensor                                                                                                                          |
| 10  | **GD05-104 At the Risk of One's Life** | Command+Pilot | 1    | #1 win-rate (~64%)                  | **Action** grant Shrike Team unit this-turn: **During Link Destroyed** → set League Militaire active; also Helen Jackson pilot                            | yes                    | Action timing only; grant path: destroy linked Shrike Team → setActive League Militaire; negatives: non-Shrike, non-linked, Main timing fail; pilot pair path separate             |
| 11  | **GD04-014 Shokew**                    | Unit          | 2    | High play-rate body                 | Vanilla                                                                                                                                                   | yes                    | Minimal deploy                                                                                                                                                                     |
| 12  | **ST01-005 GM**                        | Unit          | 1    | Ubiquitous blue 1-drop              | Vanilla                                                                                                                                                   | **no**                 | Deploy/cost only (use as fodder elsewhere)                                                                                                                                         |
| 13  | **GD02-013 Hizack**                    | Unit          | 1    | Blue 1-drop                         | Vanilla                                                                                                                                                   | yes                    | Deploy only                                                                                                                                                                        |
| 14  | **GD03-077 Justice Gundam (METEOR)**   | Unit          | 7    | High win-rate finisher              | **When Linked** return 1–3 enemy Units with HP≤3 to hand                                                                                                  | yes                    | Link with Athrun; multi-target min/max 1–3; HP=3 in / HP=4 out; no-legal-target                                                                                                    |

### Tier A implementation order (recommended)

1. **GD05-002 Strike Freedom** — highest rules surface, wins games
2. **GD05-081 Kira** + **GD05-104 Helen/Action** — SEED package
3. **GD01-118 / GD01-100** — audit existing tests still adversarial
4. **ST01-001 + ST01-010** — already strong via rules suites; fill gaps only
5. **GD03-077 Justice METEOR** — multi-target return
6. **GD01-086 Lfrith** — Blocker sensor if thin
7. Vanillas (Javelin, GM, …) — only if missing deploy smoke; **do not pad**

---

## Tier B — Shell staples (by archetype)

### SEED / Freedom shell

| Card                           | Behavior summary                             | AAA angle                                                         |
| ------------------------------ | -------------------------------------------- | ----------------------------------------------------------------- |
| GD05-010 Kira's Strike Rouge   | Vanilla mid                                  | Link host for Kira; deploy only                                   |
| GD05-005 Strike Rouge (Ootori) | (check def)                                  | Host identity for links                                           |
| ST04-001 Aile Strike Gundam    | Blocker; When Paired Lv.4+ pilot bounce HP≤4 | Pair Kira (Lv.5) → bounce; pair low-Lv pilot → no bounce; Blocker |
| ST04-010 Kira Yamato           | (alt Kira pilot)                             | Compare with GD05-081                                             |
| ST09-004 Freedom Gundam        | (if in lists)                                | Deploy/attack package                                             |

### Victory / League Militaire

| Card                    | Behavior summary                              | AAA angle                                       |
| ----------------------- | --------------------------------------------- | ----------------------------------------------- |
| GD04-003 Victory Gundam | Attack: if ≥3 League Militaire Units → draw 1 | 2 allies no draw / 3 allies draw; Attack timing |
| GD04-011 Victory Gundam | (variant text)                                | Distinct from 003                               |
| GD04-006 V-Dash Gundam  | (check)                                       |                                                 |
| GD04-016 Zoloat         | (check)                                       | Trait fodder count for Victory                  |
| GD04-081 Uso Ewin       | Pilot                                         | Pair/link Victory                               |
| GD04-121 Reineforce Jr. | Base                                          | Base deploy + ability if any                    |

### Barbatos / Tekkadan

| Card                       | Behavior summary            | AAA angle                                       |
| -------------------------- | --------------------------- | ----------------------------------------------- |
| GD02-054 Barbatos 1st Form | Attack: if damaged → draw 1 | Pre-damage then attack draw; undamaged negative |
| GD03-056 Barbatos Adapt    | (check)                     |                                                 |
| ST05-010 Mikazuki Augus    | Pilot link Barbatos         | Pair/link sensors                               |
| ST05-004 Graze Custom      | Vanilla                     | Body                                            |

### Wing

| Card                          | Behavior summary                        | AAA angle                                                              |
| ----------------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| ST02-001 Wing Gundam          | Breach 5 + may attack active enemy Lv≤4 | Attack active Lv4; reject Lv5 active; Breach to base/shield after kill |
| GD01-024 / GD05-067 Wing Zero | High-Maneuver / Breach package          | Blocker denial + breach                                                |
| ST02-010 Heero Yuy            | Link pilot                              |                                                                        |

### G Gundam / Domon package

| Card                        | Behavior summary                                                       | AAA angle                                             |
| --------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| GD05-110 Darkness Finger    | Burst → Main; Main/Action deal 2; if Master Gundam name in play → draw | Damage 2; Master name gate; Action timing; Burst path |
| GD05-111 Airframe Seizure   | (command)                                                              | Read def; target legality                             |
| GD05-033 Master Gundam      | Name enabler for Darkness Finger                                       | Deploy as name-condition                              |
| GD05-042/066 Shining Gundam | (check)                                                                |                                                       |
| GD05-097 Domon Kasshu       | Pilot                                                                  |                                                       |

### Blue midrange / Zeon fodder

| Card                     | Behavior summary     | AAA angle           |
| ------------------------ | -------------------- | ------------------- |
| GD05-017 / 020 Nu Gundam | Breach / effect text | Attack/Breach paths |
| GD01-008 Guntank         | (check)              |                     |
| GD01-018 ReZEL           | Vanilla              |                     |
| ST03-008 Zaku II         | Vanilla              |                     |

---

## AAA design rules for this list

### 1. Classify the card first

| Class                       | What "meaningful" means                                                       | Example                                      |
| --------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------- |
| **Vanilla** (`effect: "-"`) | One deploy (or play) + maybe attack/block as **body role**; no ability matrix | Javelin, GM, Shokew, Hizack, Graze Custom    |
| **Keyword-only**            | Keyword suite pattern (Blocker/Breach/Repair) + one combat sequence           | Lfrith Blocker                               |
| **Single command**          | Happy path + cost + wrong timing + trash destination                          | A Show of Resolve                            |
| **Multi-step command**      | Staged prompts (draw-then-discard)                                            | Overflowing Affection                        |
| **Triggered unit**          | Reach timing via legal moves; positive + negative gate                        | Barbatos damaged-attack; Victory trait count |
| **Pilot**                   | Pair + Burst + link gates                                                     | Kira, Amuro                                  |
| **Complex package**         | Separate `describe` per printed clause                                        | Strike Freedom Deploy vs Attack              |

### 2. Vanilla cards are not free points

A passing test for Javelin that only checks `deployUnit` succeeds proves almost nothing about the meta. Prefer:

- Using vanillas as **opposing rested targets**, **shield fodder**, or **resource bodies** inside **non-vanilla** tests
- Or a single shared `expectUnitCanDeploy` batch for all vanilla 1-drops

### 3. Always include an adversarial negative

If the ability never fired, the test must fail. Examples:

- Kira When Linked on non-Orb host → no draw
- Strike Freedom Attack without discard → no bounce
- Victory Attack with 2 League Militaire → no draw
- Barbatos Attack undamaged → no draw
- Justice bounce HP 4 enemy → illegal target

### 4. Prefer real published partners over mocks

For link/pilot packages use the actual meta partner when possible:

- Strike Freedom + GD05-081 Kira
- Gundam + ST01-010 Amuro
- Barbatos + Mikazuki
- Aile Strike + Kira

Mocks only for anonymous HP/AP fodder.

### 5. File layout (house style)

```ts
// packages/cards/src/cards/<set>/<type>/<num>-<slug>.test.ts
describe("Strike Freedom Gundam (GD05-002)", () => {
  describe("【Deploy】Choose 1 to 2 of your Units. ... draw 1.", () => {
    it("draws when a chosen Unit destroys an enemy with battle damage", () => {
      /* AAA */
    });
    it("does not draw when a non-chosen Unit destroys", () => {
      /* AAA */
    });
  });
  describe("【During Pair】【Attack】You may discard 2. If you do, ...", () => {
    it("returns the lowest-Lv enemy Unit after discarding 2", () => {
      /* AAA */
    });
    it("skips the bounce when the discard is declined", () => {
      /* AAA */
    });
  });
});
```

---

## Suggested first implementation batch (8 cards)

Highest ROI for production confidence:

| Priority | Card                               | Effort | Why                                  |
| -------- | ---------------------------------- | ------ | ------------------------------------ |
| P0       | GD05-002 Strike Freedom            | High   | Finisher; multi-clause               |
| P0       | GD05-081 Kira Yamato               | Medium | Enables SF package                   |
| P0       | GD05-104 At the Risk of One's Life | High   | #1 win-rate; delayed destroy trigger |
| P1       | GD01-118 Overflowing Affection     | Low    | Audit/extend existing                |
| P1       | GD01-100 A Show of Resolve         | Low    | Audit existing gold standard         |
| P1       | GD03-077 Justice METEOR            | Medium | Multi-target return                  |
| P1       | ST04-001 Aile Strike               | Medium | Blocker + pair bounce                |
| P1       | ST02-001 Wing Gundam               | Medium | Breach + active-target exception     |
| P2       | GD04-003 Victory                   | Medium | Trait-count gate                     |
| P2       | GD02-054 Barbatos 1st              | Low    | Damaged attack draw                  |
| P2       | GD05-110 Darkness Finger           | Medium | Name-gate draw                       |
| P3       | Vanillas batch                     | Low    | Shared deploy sensor only            |

---

## Explicit non-goals for this plan

- Exhaustive combinatorial matrices for every leaf clause of every list card
- Section 12 multiplayer
- Testing art/rarity fields
- Replacing engine rules suites (those stay separate; card tests own **printed** behavior)

---

## Implementation status (2026-07-31)

- **99/99** listed most-played cards have sibling `.test.ts` files (≥2 `it`s each).
- **New vanillas:** Javelin, GM, Kira's Strike Rouge, Shining Gundam (GD05-042), Jegan (+ upgraded Graze Custom, ReZEL, Hyakuren, Zaku).
- **Expanded thin ability tests:** Lfrith, Helen/Action (GD05-104), Justice METEOR, Strike Rouge Ootori, Victory 003/011, Zoloat, Barbatos Adapt, Wing Zero, Wing Zero EW, Master Gundam, Rising Gundam, GD05 Amuro, AGE-2 SP, Kayra Re-GZ, Ra Cailum, Re-GZ, Rick Dom, Flat, Heero Yuy, Sword Strike, Barbatos Lupus, Banshee Norn DM.
- **Burst helper:** `expectPilotBurstAddsToHand` now accepts optional Burst prompts (fixes auto-decline → trash).
- **P0 packages** (Strike Freedom, Kira, Helen, Resolve, Overflowing Affection, Gundam, Amuro) already had strong coverage; left or lightly fixed.

### Verify changed siblings

```bash
vp test packages/cards/src/cards/gd05/unit/014-javelin.test.ts \
  packages/cards/src/cards/gd05/command/104-at-the-risk-of-one-s-life.test.ts \
  packages/cards/src/cards/gd05/pilot/081-kira-yamato.test.ts \
  # …plus other edited paths
  --run
```

Note: some **pre-existing** command Burst fixtures (e.g. Close Combat, Graceful Demeanor) still fail when Burst optional is not published — separate from this batch.
