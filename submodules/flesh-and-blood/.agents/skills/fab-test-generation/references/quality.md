# FAB test quality bar

`/fab-tests` and `fab-test-generation` exist to prove the engine under **real
conditions**: authored cards, legal public moves, rule-visible state. Volume is
not coverage. A green low-value test is worse than no test because it claims the
printed clause is covered while the evaluator may still be wrong.

Read this **before writing**. If a case fails the bar, do not write it.

## Spend time here

1. **Happy** — the printed result happens (life, zones, power, keywords _as
   effects_, tokens, counters, legality).
2. **Boundary** — a contrasting legal setup where the clause does **not** apply
   (wrong class, declined optional, no scrap, cost too low).
3. **Timing/interaction** — only when the text needs it (EOT expiry, this-chain
   vs this-turn, controller/target scope).
4. Drive those with `FabTestEngine` fluent verbs and `expectFab*` /
   `expectCombat` / `expectWait`.

Happy plus a meaningful boundary is the default. Add timing/interaction only
when it proves a distinct behavior.

## Do not write (anti-patterns)

| Anti-pattern                                                                                                                                                 | Why it is not coverage                                                                                          | Instead                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `JSON.stringify(card)` / `toContain('"type"\|"what"\|"op"')` / `it("encodes …")` / `toMatchObject` on abilities / new `*-guard.test.ts` / catalog disk scans | Round-trip of the module or a source walk. Stays green if the evaluator is wrong; under load it also times out. | Play the card. TypeScript owns catalog IR.                                                                   |
| Happy/boundary/timing that `toThrow` an unhandled `has-status` (fail-loud “AAA”)                                                                             | Pins the trapdoor, not the printed Gold / +{d} / steam.                                                         | `--record-gap` one family. Skip the card. `/fab-close-gaps` converts later.                                  |
| `it("pin: …")` copied across RGB                                                                                                                             | Same family, three files, zero play.                                                                            | One family row. At most one representative if you must show the throw.                                       |
| Bare `toThrow()` (no message)                                                                                                                                | Any exception counts as success.                                                                                | `expectFabUnplayable(..., /printed reason/)` for **legal** illegals only.                                    |
| Presence-only: `toHaveKeyword("blade-break")` without defending; “still in chest after `endTurn`”; Young `toHaveLife(20)` as the whole suite                 | Asserts seating / the module keyword array.                                                                     | Prove the CR effect (Blade Break destroys after defending).                                                  |
| `defineFleshAndBloodCard` / `hitTrainer` / `TST` / fake canonical ids in a card test                                                                         | Banned. Invented cards are not product.                                                                         | Import a real module. No real card → record a gap.                                                           |
| `getState()`, `.exec({ move })`, `listLegalCommands`, mid-test snapshot restore on a **card** suite                                                          | Private API; hides harness holes.                                                                               | Fluent verbs. Kernel tests may use these; `/fab-tests` must not.                                             |
| Duplicate card behavior in an engine suite and a card suite                                                                                                  | Two tests claim ownership of one printed clause.                                                                | Keep card behavior beside its canonical authored module; keep primitive behavior in the owning engine suite. |
| `console.log` scratch (`scratch-debug.test.ts`)                                                                                                              | Not a test.                                                                                                     | Delete or do not add.                                                                                        |

## Classify the test before choosing an assertion surface

The filename or package does not decide whether a white-box assertion is valid; the
behavior under test does. Write the ownership sentence in the test or suite when it
is not obvious.

| Test owns                                                                                                                | Assertion surface                                                                                                       | `getState()` / `toMatchObject` policy                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Authored card behavior, deck play line, hero/equipment behavior, or a Comprehensive Rules example expressed through play | Legal fluent moves plus `expectFabPlayer`, `expectFabCard`, `expectCombat`, `expectWait`, and exact rule-visible values | Forbidden for assertions. Do not partially match an ability, active link, decision, event, or raw match object as proof that gameplay works.    |
| Public legality/command contract                                                                                         | The returned quote or command DTO, including exact discriminants and fields owned by that contract                      | Allowed on the returned DTO. Do not add a second raw-state assertion as substitute proof.                                                       |
| Reducer, evaluator, serializer, migration, replay, projection, or test-harness kernel                                    | The exact internal structure that the unit owns                                                                         | Allowed, but keep the test in the owning kernel suite and state the invariant. Do not present it as card coverage or copy it into a card suite. |
| Card authoring factory or generated registry                                                                             | Exact factory output or registry identity when that structure is the product of the unit                                | Allowed only for the factory/registry contract. It never replaces playing a playable card.                                                      |

For gameplay assertions, these are equivalent smells and must be replaced together:

- `expect(game.combat()?.activeLink?.attackPower).toBe(5)` → `expectCombat(game).toHaveAttackPower(5)`
- `expect(game.combat()).toBeNull()` → `expectCombat(game).toBeClosed()`
- `expect(game.getState().decision).toMatchObject({ kind: "numeric" })` → `expectWait(game).toHaveDecision("numeric")` plus the public range assertion when relevant
- `expect(game.getState().players[id]!.marked).toBe(true)` → `expectFabPlayer(handle).toBeMarked()`

Reading `waitState()` or another public view to drive a bounded interaction loop is
not itself an assertion. The final proof must still use the fluent assertion surface.

`expectFabUnplayable` is high value only for a **printed** illegal (wrong zone,
0 AP, Action as Instant) with a matching regex. An unhandled marker throw is a
gap, not a happy path.

## When the engine cannot play the clause

1. Record **one** family (`--record-gap`, reuse `--gaps` ids).
2. **Do not** author a fail-loud trio, stringify guard, or silent-no-op “success.”
3. Prefer the next **playable** member in the batch over manufacturing coverage.
4. If the whole cluster is a trapdoor, stop and report the family. That is a
   successful `/fab-tests` run.

Closing the family is `/fab-close-gaps`, not a pin in the card file.

## Gate (every new `it`)

Answer yes, or delete the case:

- Would this **fail** if the engine ignored the printed clause?
- Does **happy** assert a rule-visible result, not a throw or a JSON substring?
- Are **all** cards in the setup real authored modules?
- Did I use only public intent verbs and `expectFab*` / `expectCombat` / `expectWait`?
- If I used raw state or partial object matching, is this explicitly a kernel/contract
  test whose owned output is that structure (and not a gameplay test)?
- Is the boundary a different game state, not a second way to throw the same marker?
- If I cannot play it, did I record a family and skip instead of writing junk?

Historical deleted-test inventories and set-based source paths belong in
`playbook-archive.md`; they are evidence of past cleanup, not current locations
or templates for new tests.
