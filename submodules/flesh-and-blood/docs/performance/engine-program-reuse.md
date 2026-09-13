# FAB ordinary priority pass: compiled program reuse

Baseline: `e028cc18d4`. The source-snapshot, attack-window, incarnation-permission,
and single-pass snapshot-copy changes are present in both versions.

## Finding

The existing local <5 ms p95 benchmark constructs a fresh match for each sample
outside the timer, then times its first ordinary priority handoff. Profiling
that command found card-program compilation, stable JSON fingerprinting, cloning,
and freezing dominating the result. It was not predominantly priority or rules
view work. This is a first-command benchmark, not a representative percentile
for every action during a game.

Snapshot serialization already cached a fingerprint after its first use, but
runtime admission did not retain a compiled program. Restoring a persisted match
also spread and then cloned the context's immutable definition registry, losing
its identity and causing another compilation on first serialization.

## Change

- Compile the immutable program when the runtime admits a match. Compiler-owned
  frozen definitions and public identities retain the program's fingerprint.
- Restore the same immutable context and clone only mutable match data. External
  callers cannot mutate the runtime's player/object state through their input.
- Reuse only compiler-owned, deeply frozen registries and complete output pairs.
  Borrowed input dictionaries can change between compilations; caching them by
  identity returned stale definitions in existing kernel fixtures.
- Test-only late card registration replaces its program instead of mutating a
  compiled registry. No gameplay assertions were relaxed.

All commands still use the normal handler, automation, rollback, state-version,
and snapshot-validation boundaries. This does not add a special pass shortcut or
skip reconciliation. Compilation still has a cost when admitting fresh mutable
inputs; retaining a previously compiled context avoids repeating it on restore.

## Reproduction

From `submodules/flesh-and-blood`, run the unchanged budget tests:

```sh
FAB_RUNTIME_BENCHMARK=1 VITEST_MAX_WORKERS=2 \
  pnpm --dir packages/engine exec vp test run \
  src/performance/runtime-benchmark.local-only.test.ts \
  --reporter=verbose --disableConsoleIntercept
```

For gameplay equivalence, run `packages/engine/scripts/performance-sweep.ts` with
`FAB_PERF_SEEDS=1 FAB_PERF_ACTIONS=400 NODE_ENV=production` on both revisions.
Use the same current harness on each revision. Its `trajectoryVersion: 2` retains
all persisted timestamps, sorts dictionary keys, and preserves array order.
The compiled registry sorts resource dictionary keys, so historical version-1
byte digests cannot be compared directly to this change. A first-state deep
comparison confirmed identical viewer, resource, legal-command, and snapshot
values; only resource dictionary key order differed.

Raw local diagnostic output is kept outside the source tree. The measurements
and final validation results below describe local execution, not deployed
latency or browser click-to-visible-feedback time.

## Measurements

Paired standalone runs used Node 22.23.2, `NODE_ENV=production`, the native
practice fixture, 20 warm-up commands, and 120 measured first priority passes.
Fixtures were prepared outside the timed command loop. Baseline and candidate
ran sequentially in alternating order after the gameplay sweeps finished.

| First-pass metric | Baseline, two runs | Candidate, two runs |
| --- | --- | --- |
| Median | 6.04–6.82 ms | 1.36–1.41 ms |
| p95 | 6.65–9.05 ms | 3.40–3.45 ms |
| Total, 120 commands | 716–832 ms | 215–219 ms |

A separate 120-sample run timed `restoreFabMatchSnapshot`, runtime admission,
and the first priority pass together, using an already prepared match context
and snapshot. Its total p95 improved from 12.57 ms to 5.54 ms (median 10.60 ms to
2.99 ms). Initial creation of the context itself is excluded in both versions.
This shows that the restoration path avoids repeated compilation rather than
merely moving it from the command to runtime admission. Fresh mutable input
still needs its initial compilation.

The unmodified local benchmark suite passed both budgets:

- Ordinary priority handoff: 120 samples, **2.746 ms p95**, budget <5 ms.
- Warm heuristic sequence: 120 accepted actions, 1,630.92 ms, budget <6,000 ms.
- Exactly 120 command copy-on-write boundaries and 120 snapshot serializations.

These workloads differ; do not compare their percentiles as interchangeable.
The warm mixed-action diagnostic still has 36.39 ms p95 overall and 49.41 ms p95
for decision answers. The <5 ms result applies to an ordinary priority handoff,
not all commands, a full two-player pass cycle, or network/browser latency.

## Validation

- `VITEST_MAX_WORKERS=2 vp run ci-check` passed: 4,096 engine tests and 9,855
  card tests, plus type checks, presentation generation, and card audits.
  The existing four expected failures and one skipped test remain unchanged.
- New real-card runtime-boundary regressions prove immutable program reuse,
  input-state detachment, persistence fingerprints, priority handoff, old
  snapshot retention, rejected-command atomicity, and recompilation after a
  borrowed registry changes.
- Existing kernel resolution, snapshot admission/roundtrip, and Imperial Ledger
  physical-token tests passed with their gameplay assertions unchanged.
- Strict version-2 gameplay comparison against `e028cc18d4`: all 25 catalog
  pairings and all **8,991 actions** had identical digests, action counts, and
  terminations. This compares ordered legal commands/choices, both player views,
  spectator views, resources, and complete persistence snapshots including
  deterministic rules timestamps.
- No illegal commands, runtime errors, or stalls. Seventeen games reached the
  configured 400-action cap; four ended by life, three by concession, and one
  by an effect. Capped games are bounded stress evidence, not natural completions.

No runtime/card implementation changes were made in shared protocol or simulator
packages. No deployment was performed. This iteration is included in the same performance PR as the earlier changes.
