# Close-gap decision tree

Classify from printed text and the member modules, not from the family id.

```
Printed phrase
 ├─ true CR object status (frozen, dominating, …)
 │    → extend-existing-primitive (has-status / set-status)
 ├─ history / this-turn / this-way / N-or-more
 │    → stamp-at-producer + compare-amount / fact-count
 │      grandfather handler only as a delegate to that amount
 ├─ “if X, instead Y” on the same layer
 │    → re-encode as self-replacement (CR 6.4.7 Class B)
 ├─ “would … instead …” future event
 │    → re-encode as replacement / prevention (Class C)
 ├─ later step says it / them / that card
 │    → stamp-at-producer (outputBinding) + AAA trio on the follow-up
 ├─ target-controller / allies of the targeted player
 │    → extend-existing-primitive (target / filter)
 ├─ next attack / next attack-action latch
 │    → extend-existing-primitive (appliesTo.next identity)
 ├─ unplayable: unmigrated cost, unresolved target, 0 candidates
 │    → extend-existing-primitive (owning proposal)
 ├─ test cannot name the intent
 │    → harness-verb
 └─ 1v1 / party / event-deck / specialization
      → out-of-scope
```

## Strategy enum

| Strategy                    | When                                                                                        | What lands                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `re-encode`                 | Module uses a boolean/slug the types already replaced                                       | Rewrite every member onto the canonical IR. Prove with AAA trios, not JSON.stringify guards. Engine only if that IR is unimplemented. |
| `stamp-at-producer`         | Follow-up reads `it` / `them` / this-way / target-controller the earlier step never stamped | Stamp on the producing proposal. Evaluator reads the stamp. Ice fusion / Levia 6-power pattern.                                       |
| `extend-existing-primitive` | CR already names the kind; switch is incomplete                                             | Exhaustive switch in the owning file.                                                                                                 |
| `new-cr-kind`               | Comprehensive Rules name a kind with no discriminant                                        | Last resort. New union member, no string escape hatch, no `as unknown as`.                                                            |
| `harness-verb`              | Engine is right; the test cannot express the intent                                         | Intent verb / drain policy only.                                                                                                      |
| `out-of-scope`              | Multiplayer / party / event-deck / specialization                                           | Resolve the family. Do not implement.                                                                                                 |

`typesChange` is `none`, `widen existing amount/condition/binding`, or `new CR kind`.

## Skeptic rejects (any one is enough)

- New `FAB_STATUS_MARKERS` slug matching `*-this-way`, `*-this-turn`, `N-or-more-*`, `less-*-than-*`, `power-greater-than-*`, unless it is a true CR object status **and** the design explains why `compare-amount` cannot express it.
- Engine special-case for `conditional.instead`.
- Fail-close of an unknown marker.
- One-card module tweak that leaves RGB siblings on the old encoding.
- Silent no-op at `play()` treated as success (Icebind class).
- `new-cr-kind` when amount/filter/binding/window already compose the phrase.
- Workaround: `CONDITION_STATUS_HANDLERS['this-slug'] = () => …` while modules keep the slug.

## Cluster, do not ticket

`card-coverage.ts --next-cluster` groups by member overlap, small prefixes
(`instead`, `binding`, `wager`, `amount`, `targeting`), specific primitive
paths, and N-or-more status stems. It does **not** merge every `has-status.ts`
row. Classify may split a cluster after reading the modules.
