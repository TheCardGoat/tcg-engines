# FAB attack-window reconciliation performance

> Evidence limitation: the historical version-1 trajectory digests in this report
> normalized every `timestamp`, including deterministic continuous-effect ordering
> timestamps. They prove equality only after that normalization. The current
> harness uses `trajectoryVersion: 2`, retains all persisted timestamps, and sorts
> dictionary keys while preserving array order. Timing measurements are unaffected.

Second iteration, based on `95491c3113` (the source-snapshot optimization and
Flick Knives correction are already included in this baseline).

## Finding and change

A CPU profile of a 320-action real-deck workload found approximately 8.1 seconds
of inclusive sampled execution in `grantedWindowRuleAbilities`, underneath
continuous-effect reconciliation. This was a diagnostic profile on a busy shared
host; its elapsed timings are not the before/after benchmark below.

`proposeStaticSourceEvents` called that helper for every evaluated object. The
helper itself scans every object and its functional abilities for applicable
grants. Only after that nested scan did the caller reject cards outside the
stack/active attack window. Deck and hand objects therefore caused quadratic
source discovery even when there were no relevant grants.

The existing recipient eligibility check now runs before resolution-window
ability discovery. Ordinary static reconciliation still runs for every object;
eligible Action/Attack cards still discover native and granted abilities and
apply the same conditions, timing, target, and expiry checks. No state cache,
card rule, command protocol, or serialization format changed.

The benchmark now also records `command-context:<move>:<decision-or-phase>:<combat-step>`
samples. These are nested within `command:<move>` samples and must not be added
together. Context records the pre-command boundary, not every phase traversed
inside a command.

## Repeated local timing

Node 22.23.2, `NODE_ENV=production`, Gravy Bones and Rhinar in both seat orders,
one deterministic seed per pairing, 160 actions per game (320 total).
Unprofiled run order: candidate 1, baseline 1, candidate 2, baseline 2.
A package type check briefly overlapped candidate 2 startup. No own test suite
or other self-play run overlapped these timing runs; unrelated host jobs were
active. Baseline variability is reported rather than averaged away.

| Metric | Baseline, two runs | Candidate, two runs |
| --- | ---: | ---: |
| Whole harness / 320 actions | 12.42–14.87 s | 8.488–8.493 s |
| Sum of command spans | 8.55–10.11 s | 4.63–4.67 s |
| Decision submission p95 | 287–351 ms | 132–137 ms |
| Pass submission p95 | 42.6–52.7 ms | 27.4–28.5 ms |
| End-turn submission p95 | 80.5–132.1 ms | 49.1–55.4 ms |

This is approximately 32–43% lower whole-harness time and 45–54% lower command
span time relative to the already optimized baseline. All four runs have exactly
the same trajectory digests, ordered legal commands, viewer outputs, and
post-command snapshots. Each run has 31 decision, 230 pass, and 11 end-turn
samples. These are small local workload percentiles, not production or browser
latency estimates. The two games reached their configured action cap.

Raw benchmark output is kept outside Git; use the reproduction commands below.
The first candidate/baseline pair predates context-level instrumentation; it
uses the same gameplay workload and aggregate timing labels.

## Reproduce

From `submodules/flesh-and-blood`:

```sh
NODE_ENV=production \
FAB_PERF_DECKS=cc-edinburgh-1st-gravy-bones,cc-guilherme-coutinho-rhinar \
FAB_PERF_SEEDS=1 FAB_PERF_ACTIONS=160 \
node --experimental-transform-types --no-warnings \
  packages/engine/scripts/performance-sweep.ts /tmp/fab-window-performance.json
```

To obtain a diagnostic CPU profile, add `--cpu-prof --cpu-prof-dir=/tmp` to
Node's options. Do not use a profiled run as the unprofiled timing baseline.
See [the original harness report](engine-source-snapshots.md) for digest
semantics, deck coverage limitations, and bootstrap instructions.

## Validation

- Engine type check passed.
- All 12 existing Dreadbore, Widowmaker, and Snap Shot tests passed on the
  candidate, including granted restrictions and fused/unfused activation windows.
- Full `vp run ci-check` passed: 4,094 engine tests and 9,854 card tests,
  with the same four expected failures and one existing skipped engine test.
- Performance-only catalog comparison: all 25 pairings / 8,991 actions match
  the prior corrected catalog exactly. Seventeen action caps, four life wins,
  three concessions, one effect win; no stalls, illegal commands, or errors.
- Final `VITEST_MAX_WORKERS=2 vp run ci-check` passed after the permission
  correction: 4,094 engine tests and 9,855 card tests, with the same four
  expected failures and one existing skip. The worker limit reduced shared-host
  contention; no assertion or timeout threshold changed.
- Extended self-play: all four games finished naturally (369, 123, 807, and
  128 actions; 1,427 total), with no stalls, illegal commands, or exceptions.
  Coverage jobs overlapped CI and were paused for host contention, so their
  elapsed durations are excluded from timing evidence.
- Final catalog sweep: 25 pairings / 8,991 actions, no stalls, illegal
  commands, or exceptions. Seventeen games reached the 400-action cap; four
  life wins, three concessions, and one effect win. Digests for seeds 9 and
  10 changed after the permission correction; the other 23 remain identical.

The optional local runtime benchmark (`FAB_RUNTIME_BENCHMARK=1`, one worker)
passed the 120-action/6-second budget at 2.472 seconds and retained exactly one
copy-on-write boundary and one serialization per accepted command. Its separate
ordinary-pass check still failed: 10.837 ms p95 versus the existing 5 ms ceiling.
This shared-host diagnostic is not a before/after comparison, and no threshold
was relaxed. It recorded 827 accepted rules-view builds over those 120 actions,
which merits phase-level profiling in the next iteration.

## Extended self-play found a replay-permission loop

Oscilio versus Arakni Crax, seed `performance-0-0`, reached the 1,200-action
cap in 452.6 seconds. Debugger inspection at actions 927 and 1,175 showed
that it was still turn 2; at action 927 the bot was replaying Electrostatic
Discharge from the graveyard using an Astral Bridge play permission. The
baseline sweep was stopped after saving its first two completed reports;
its remaining seat-order runs were not used as evidence.

A public gameplay regression proves the cause: Astral Bridge mills the instant
and grants a valid first play, but after it resolves back to the graveyard,
the old permission incorrectly authorizes another play. The first play works
in both versions; the second-play rejection fails before the fix and passes
after it.

CR 3.0.9 makes a card returning to the graveyard a new object. The same-effect
zone-move exception in CR 3.0.9b allows the original milled object to be granted
permission; it does not grant access to every later incarnation of that physical
card. The generation reducer already anchors subjects after same-journal moves.

Both permission paths now require the captured incarnation: the active
continuous play-rule subjects and the direct origin-permission fallback in
`quoteFabPlay`. When an explicitly captured permission subject disappears, it
stays an empty subject set rather than falling back to unrestricted target
selection. Other continuous effect kinds retain their existing lifecycle.
There is no Astral Bridge-specific engine handler or blanket once-per-card limit.
Only Astral Bridge's three test/review evidence fields were refreshed.
The formerly looping seed now ends by effect at action 369; the second seed
ends at action 123 with its original digest unchanged. These are correctness
results, not comparable elapsed-time measurements under the validation load.

The focused regression set also checks Tear Through the Portal's legitimate
banish-then-play behavior and unrelated duration grants. An initial broader
identity change was rejected by the full suite and is not part of the final
implementation; play permissions are the corrected ownership boundary.

## Next investigation

The context samples expose payment completion and some ordering decisions as
remaining expensive boundaries. Profile these after this change: the initial
profile also showed rules-view construction and state cloning, but removing
the nested source scan changes their relative importance. Inspect candidate
preparation, payment journal reductions, and repeated rules-view construction
before introducing broader caches or changing transaction ownership. Preserve
rollback and event-boundary correctness when reducing that work.
