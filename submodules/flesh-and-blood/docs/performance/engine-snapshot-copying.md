# FAB snapshot copying performance

> Evidence limitation: the historical version-1 trajectory digests in this report
> normalized every `timestamp`, including deterministic continuous-effect ordering
> timestamps. They prove equality only after that normalization. The current
> harness uses `trajectoryVersion: 2`, retains all persisted timestamps, and sorts
> dictionary keys while preserving array order. Timing measurements are unaffected.

Baseline: `16056c21b3`. This iteration includes the earlier snapshot-source,
attack-window scan, Flick Knives, and play-permission fixes in both versions.

## Candidate selection

A fresh CPU profile of the production-owned 320-action workload attributed
about 2.6 seconds of inclusive sampled work to rules-view construction, within
about 4.6 seconds sampled under command execution. We tried sharing the inputs
of accepted, desired, and LKI views within one checkpoint. The intermediate
candidate reduced LKI rebuilds (750 to 425), but its full-workload times were
inconsistent (8.63–9.56 seconds versus 9.08–9.16 seconds in the initial baselines).
That cache change and its test edits were discarded; they are not shipped.

The same profile identified roughly 650 ms of self time in snapshot cloning
and 204 ms in recursive freezing. The old copier separately copied shared
ability trees under `base`, `copyable`, and `current`, allocated entry tuples
and arrays for each object, and then traversed the copy again to freeze it.

## Final implementation

`snapshotObject` and synthetic snapshot construction now use one detached,
freezing copy operation. A map scoped to that single call reuses a copied
object when the same source structure appears again. Nested objects are frozen
as they are completed. Nothing is reused between snapshots or event boundaries,
and live objects and authored definitions are never frozen by the copier.

Own enumerable string keys retain their existing order and values, including
`__proto__` as a data property. Sparse-array behavior and undefined-valued
properties retain the previous copier semantics. This change does not alter
serialized content, object-incarnation rules, rule evaluation, or cache lifetime.

The existing real-card trigger-boundary regression now also verifies that a
Tunic snapshot's nested abilities are detached from the live view, frozen, and
not shared with the next event-boundary snapshot after equipment activation.

## Local timing

Node 22.23.2, production mode, Gravy Bones versus Rhinar in both seat orders,
one seed per pairing and 160 actions per game. The final candidate has two
runs; the unchanged baseline has three. Each run has 320 actions and identical
digests covering commands, ordered legal options, viewer outputs, resources,
and post-command persistence snapshots.

| Metric                    | Baseline, three runs | Final candidate, two runs |
| ------------------------- | -------------------: | ------------------------: |
| Whole workload            |          8.94–9.16 s |               8.23–8.43 s |
| Sum of command spans      |          4.89–5.01 s |               4.50–4.67 s |
| Trigger-source scan total |           920–962 ms |                533–538 ms |
| Decision-answer p95       |           135–138 ms |                124–133 ms |
| Pass p95                  |         26.5–27.4 ms |              24.7–25.3 ms |
| End-turn p95              |         49.9–55.3 ms |              46.6–52.9 ms |

Whole-workload time is about 6–10% lower; trigger-source scans use about 41–45%
less time. All runs execute 2,484 trigger-source scans, so this is reduced cost
per scan rather than omitted event processing. End-turn samples overlap and
are not evidence of a reliable end-turn-specific improvement. Each run has
31 decision submissions, 230 passes, and 11 end-turn commands.

Timings are from a shared development host, not production latency estimates.
The final sequence was baseline 2, intermediate allocation experiments,
final 1, baseline 3, final 2; baseline 1 predates the abandoned input-cache
experiment. No own test suite or coverage sweep overlapped the final timing
runs. Nested operation spans must not be summed as independent wall time.

## Reproduce

From `submodules/flesh-and-blood`:

```sh
NODE_ENV=production \
FAB_PERF_DECKS=cc-edinburgh-1st-gravy-bones,cc-guilherme-coutinho-rhinar \
FAB_PERF_SEEDS=1 FAB_PERF_ACTIONS=160 \
node --experimental-transform-types --no-warnings \
  packages/engine/scripts/performance-sweep.ts /tmp/fab-copy-performance.json
```

See the [original harness documentation](engine-source-snapshots.md) for setup,
digest semantics, and ring-pairing limitations. Raw benchmark output is kept
outside Git; the command above reproduces it.

## Validation

- Engine type check passed.
- All 15 focused snapshot, trigger-source, journal, and persistence tests passed.
- Full `VITEST_MAX_WORKERS=2 vp run ci-check` passed: 4,094 engine tests and
  9,855 card tests, retaining the same four expected failures and one existing skip.
- Extended self-play: four natural completions / 1,427 actions; every digest,
  action count, and outcome matches the previous iteration exactly.
- Catalog: 25 pairings / 8,991 actions, all digests, action counts, and outcomes
  identical to the previous iteration. No stalls, illegal commands, or exceptions.
  Seventeen games reached the 400-action cap; four life wins, three concessions,
  and one effect win.
- Optional local runtime check: 120 warm actions in 1.899 seconds (under the
  6-second budget), exactly 120 copy-on-write boundaries and 120 serializations.
  The separate ordinary-pass check still fails: 7.510 ms p95 versus 5 ms.
  No budget changed. This one diagnostic run is not a controlled comparison
  with the prior iteration; the repeated table above is the speedup evidence.

## Remaining work

The diagnostic still builds 827 accepted rules views over 120 actions. A useful
next investigation is the evaluator's eager creation of mutable properties for
every object, including unaffected cards. Profile allocation there before
changing invalidation or introducing a broader cache; the input-cache experiment
in this iteration did not justify its added complexity.
