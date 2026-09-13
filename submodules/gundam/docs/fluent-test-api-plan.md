# Fluent Gundam test API plan

Goal: Act/Assert in card and rules tests should read like a play log, not
command-result plumbing or nested board dumps — while staying on **public
player-visible** paths (no `getG()`, `effects[]`, ordered Deck, or face-down
Shield identity).

## Non-negotiables

- Drive play through legal public moves (`deploy` / `play` / `pair` / `attack` /
  `pass` / `resolve` / block / action).
- Assert what a player can see: zones, counts, damage, exhausted, keywords,
  prompts, winner.
- Fail loudly on illegal moves and on **ambiguous card references**.
- Never auto-drain prompts in a loop that can pass without an explicit answer.

---

## Card references (core rule)

### Rule

| Situation                                               | What the test passes                                                  | Meaning                                                  |
| ------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------- |
| **Exactly one** matching instance in the relevant scope | **Card definition** (e.g. `st01Gundam001`)                            | “This printed card as it appears on the board / in hand” |
| **Zero** matches                                        | —                                                                     | Throw: card not found                                    |
| **Two or more** matches                                 | **Instance reference** (from deploy return, zone query, or prior act) | Must not guess `[0]`                                     |

This matches how humans write tests: most fixtures put one copy of the card under
test in play; multiples are intentional and need explicit handles.

### Resolution scope

When resolving a definition to an instance, search in this order unless the API
names a zone:

1. **Explicit zone** if the call names one (`inHand`, `inBattle`, `inTrash`, …)
2. Else **all public + own private zones** for that player:
   hand → battleArea → baseSection → resourceArea → trash → removalArea  
   (not opponent hand; not ordered deck; shield only as **count** or after reveal)

For opponent-targeted acts (`attack into`, damage targets), scope is the
**controller named by the API** (e.g. `p2.unit(defenderDef)`).

### Instance references

An instance ref is a small branded/handle type, not a raw string in call sites
when avoidable:

```ts
type CardRef = Card | CardInstanceRef;

// CardInstanceRef is returned by fluent acts / queries
interface CardInstanceRef {
  readonly instanceId: string;
  readonly definitionId: string; // cardNumber
  readonly ownerId: GundamPlayerId;
}
```

**How you get a ref when multiples exist:**

```ts
// Capture from the act that created/moved the card
const firstJavelin = p1.must.deployUnit(javelin); // returns CardInstanceRef
const secondJavelin = p1.must.deployUnit(javelin);

// Or query when already on the board
const units = p1.units(javelin); // CardInstanceRef[]
const rested = p1.unit(javelin, { exhausted: true }); // unique under filter, else throw
const any = p1.unitsIn("battleArea"); // all units in zone
```

**How you use defs when unique:**

```ts
p1.must.deployUnit(st01Gundam001);
p1.must.assignPilot(st01AmuroRay010, st01Gundam001); // one Gundam in battle
p1.must.attack(st01Gundam001).into(enemyGm); // one GM for p2
expect(st01Gundam001).via(p1).toBeRested();
expect(st01Gundam001).via(p1).toBeIn("battleArea");
```

**Ambiguity must fail:**

```ts
// Two Javelins in battleArea, no filter
p1.must.attack(javelin); // throws: AmbiguousCardRef "GD05-014" (2 in battleArea)
// Fix:
p1.must.attack(firstJavelin);
// or
p1.must.attack(p1.unit(javelin, { exhausted: false }));
```

### Why this shape

- **Easy happy-path writing** — one card in fixture ⇒ pass the export constant.
- **Real usage when multiples matter** — Support “other Unit”, dual deploy,
  two copies in hand, Breach fodder vs the card under test.
- **Discourages** silent `getCardsInZone("battleArea")[0]!` which hides which
  card the test meant.

### API surface for references

| API                                                 | Behavior                                                    |
| --------------------------------------------------- | ----------------------------------------------------------- |
| `p1.ref(cardOrRef)`                                 | Resolve to `CardInstanceRef` or throw                       |
| `p1.unit(card, filter?)`                            | Unique Unit in battleArea (+ filter) or throw               |
| `p1.cardIn(zone, card, filter?)`                    | Unique in named zone or throw                               |
| `p1.units(card, filter?)`                           | All matches (may be empty array)                            |
| `p1.must.deployUnit(card)`                          | Returns `CardInstanceRef` of the deployed instance          |
| `p1.must.playCommand(card)`                         | Accepts def if unique in hand; returns source ref if useful |
| `p1.must.assignPilot(pilot, unit)`                  | Both args are `CardRef`                                     |
| `p1.must.enterBattle(attacker, target \| "direct")` | Attacker/target are `CardRef`                               |
| `expect(card).via(p1).toBeIn("trash")`              | Resolves def via `p1` then asserts                          |

Filters (optional, for disambiguation without raw ids):

```ts
type CardFilter = {
  exhausted?: boolean;
  damaged?: boolean; // damage > 0
  hasPilot?: boolean;
  instanceId?: string; // escape hatch
};
```

---

## Fluent Act

### `must` / orThrow moves

```ts
p1.must
  .deployUnit(st01Gundam001)
  .assignPilot(st01AmuroRay010, st01Gundam001)
  .attack(st01Gundam001)
  .into("direct");
```

- Every move throws on `!success` with `errorCode` in the message.
- Chain returns a small act context (player + last card ref) so `.into` can bind
  attack target without re-stating the attacker.
- Prefer **not** wrapping every line in `expectSuccess(...)`.

### Multi-step scripts (shared engine + cards)

| Script                                                                  | Meaning                                             |
| ----------------------------------------------------------------------- | --------------------------------------------------- |
| `engine.battle.resolve({ attacker, target, block?: false \| CardRef })` | enterBattle + block/pass + both battle actions      |
| `engine.turn.end()`                                                     | End turn through public passes                      |
| `engine.turn.passIntoAction()`                                          | Main → end-phase Action Step                        |
| `p2.prompts.acceptBurst()` / `declineBurst()`                           | Optional Burst answer                               |
| `p1.prompts.chooseTargets(...refs)`                                     | Target selection                                    |
| `p1.prompts.expectTargetChoice({ min, max, includes })`                 | Assert prompt shape without raw pendingChoice dumps |

Prompts stay **explicit** (no silent drain loops).

---

## Fluent Assert

Promote matchers (many already exist; underused):

| Matcher                                          | Replaces                               |
| ------------------------------------------------ | -------------------------------------- |
| `expect(p1).toBeExhausted(cardRef)`              | `isExhausted` + `toBe(true)`           |
| `expect(p1).toHaveDamage({ card, value })`       | raw `getDamage`                        |
| `expect(p1).toBeInZone({ card, zone: "trash" })` | `` `trash:${PLAYER_ONE}` ``            |
| `expect(p1).toHaveHandCount(n)`                  | `getBoardView().players[id].handCount` |
| `expect(p1).toHaveDeckCount(n)`                  | nested deckCount                       |
| `expect(p1).toHaveShieldCount(n)`                | nested shieldCount                     |
| `expect(engine).toHaveWinner(PLAYER_ONE)`        | `getBoardView().winner`                |
| `expect(p1).toShowKeywords(card, "Blocker")`     | `getVisibleCard()?.keywords`           |
| `expect(p1).toHavePendingTargetChoice(...)`      | deep `pendingChoice` matchObject       |

Optional sugar:

```ts
expect(st01Gundam001).via(p1).toBeRested();
expect(st01Gundam001).via(p1).toBeIn("battleArea");
expect(firstJavelin).via(p1).toBeIn("trash");
```

`.via(player)` binds the controller used for definition resolution.

---

## Example: before → after

### Before

```ts
const engine = GundamTestEngine.create(
  { hand: [st01Gundam001, st01AmuroRay010], resourceArea: activeResources(8) },
  { play: [{ card: defender, exhausted: true }] },
);
const p1 = engine.asPlayer(PLAYER_ONE);
const p2 = engine.asPlayer(PLAYER_TWO);
expectSuccess(p1.deployUnit(st01Gundam001));
const unitId = p1.getCardsInZone("battleArea")[0]!;
expectSuccess(p1.assignPilot(st01AmuroRay010, unitId));
const defenderId = p2.getCardsInZone("battleArea")[0]!;
expectSuccess(p1.enterBattle(unitId, defenderId));
expectSuccess(p2.passBlock());
expectSuccess(p2.passBattleAction());
expectSuccess(p1.passBattleAction());
expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
```

### After (unique defs)

```ts
const engine = GundamTestEngine.create(
  { hand: [st01Gundam001, st01AmuroRay010], resourceArea: activeResources(8) },
  { play: [{ card: defender, exhausted: true }] },
);
const p1 = engine.asPlayer(PLAYER_ONE);
const p2 = engine.asPlayer(PLAYER_TWO);

p1.must.deployUnit(st01Gundam001);
p1.must.assignPilot(st01AmuroRay010, st01Gundam001);
engine.battle.resolve({
  attacker: st01Gundam001,
  target: p2.unit(defender), // or defender def if unique
});

expect(defender).via(p2).toBeIn("trash");
// or: expect(p2).toBeInZone({ card: defender, zone: "trash" });
```

### After (two copies of the same card)

```ts
const a = p1.must.deployUnit(javelin);
const b = p1.must.deployUnit(javelin);

p1.must.useSupport(a, b); // cannot pass javelin alone — ambiguous
expect(a).via(p1).toBeRested();
expect(b)
  .via(p1)
  .toHaveAp(javelin.ap + 2);
```

---

## Implementation phases

### Phase 1 — References + must-act + count/zone matchers

1. Add `CardInstanceRef` + `resolveCardRef(player, cardRef, opts)` in engine testing.
2. Teach existing player moves to accept `Card | string | CardInstanceRef` via one
   resolve helper (or wrap at fluent layer only first).
3. Add `p1.must.*` that resolves refs and throws on failure; `deployUnit` returns ref.
4. Add `toHaveHandCount` / `toHaveDeckCount` / `toHaveShieldCount` / winner matchers.
5. Migrate **rules suites** as the first consumers.

### Phase 2 — Prompts + unified battle/turn scripts

1. `p1.prompts.*` for optional / target / ordering.
2. Single `engine.battle.resolve` / `engine.turn.end` in `@tcg/gundam-engine`.
3. Collapse `rules-aaa.ts` vs `legal-gameplay-test-helpers.ts` duplication.

### Phase 3 — Migrate most-played card tests

1. Rewrite high-traffic card tests to defs-when-unique + refs-when-multiple.
2. Prefer returning refs from `must.deployUnit` over zone indexing.
3. Lint or helper: ban `getCardsInZone(...)[0]!` in new tests where a def would resolve.

---

## Explicit non-goals

- Auto-picking “first” instance when ambiguous.
- Reading continuous-effect storage or raw `G` for fluency.
- Full Playwright/e2e as a substitute for engine fluency.
- Forcing every vanilla deploy to capture a ref when the def stays unique.

---

## Success criteria

A new rules or card test can:

1. Pass **card definitions** for every unique fixture piece.
2. Capture **instance refs** only when the scenario has multiples or needs
   stable identity across a sequence.
3. Act without `expectSuccess` on every line.
4. Assert without `` `trash:${PLAYER_ONE}` `` and without
   `getBoardView().players[id].handCount`.
5. Throw a clear `AmbiguousCardRef` / `CardRefNotFound` when resolution fails.

---

## Next implementation step

Implement Phase 1 in `packages/engine/src/gundam/testing/`:

- `card-ref.ts` — resolve + types + errors
- `player-fluent.ts` or methods on `GundamPlayerActions` — `must`, `unit`, `cardIn`
- matcher extensions for counts/zones/winner
- migrate one rules suite + one multi-copy card scenario as the gold sample
