# FAB engine source snapshot performance

> Evidence limitation: the historical version-1 trajectory digests in this report
> normalized every `timestamp`, including deterministic continuous-effect ordering
> timestamps. They prove equality only after that normalization. The current
> harness uses `trajectoryVersion: 2`, retains all persisted timestamps, and sorts
> dictionary keys while preserving array order. Timing measurements are unaffected.

The engine's trigger-source scan used to detach and recursively freeze every
object with any functional ability before checking whether it had a triggered
ability. This included ordinary activated and resolution abilities. The scan
runs at engine event boundaries and when viewer projection discovers optional
trigger controls, so the wasted work affected both command execution and board
projection.

`snapshotFunctionalTriggerSources` now creates the source snapshot only after
finding a triggered ability with a functional zone and a resolution. Multiple
triggers on the same object still share one immutable boundary snapshot. The
rules evaluator continues to supply the functional abilities, including granted
abilities; delayed triggers and keyword triggers keep their existing paths.

Replacement-source discovery had a second eager scan that detached every card
in every zone. It now reserves each object's position in the source map but
materializes a snapshot only for evaluated static replacement/prevention
abilities. The existing damage-specific scans still materialize keyword
prevention sources. Event-affected snapshots override those reserved positions
exactly as before, preserving candidate ordering and last-known information.

There is no cross-version cache, protocol change, or client information change.

## Reproduce

From the `submodules/flesh-and-blood` workspace:

```sh
vp install --frozen-lockfile
(cd packages/types && vp run build)
FAB_PERF_SEEDS=1 pnpm --dir packages/engine run bench:performance /tmp/fab-performance.json
```

The default sweep pairs each of the 25 catalog decks with the next entry,
wrapping at the end, and runs two deterministic seeds per pairing. Each match
has a 400-action cap. Override `FAB_PERF_DECKS` with comma-separated catalog ids,
`FAB_PERF_SEEDS` with a positive seed count, or `FAB_PERF_ACTIONS` with a positive
action cap. Use the same ordered deck list, seed count, action cap, Node version,
and `NODE_ENV` for before/after comparisons.

For a smaller production-mode timing run:

```sh
NODE_ENV=production \
FAB_PERF_DECKS=cc-edinburgh-1st-gravy-bones,cc-guilherme-coutinho-rhinar \
FAB_PERF_SEEDS=2 FAB_PERF_ACTIONS=80 \
pnpm --dir packages/engine run bench:performance /tmp/fab-performance-pilot.json
```

The harness uses FAB's existing practice-deck setup and bot strategy, then
restores a production-owned `FabMatchRuntime` so the mutable test harness does
not invalidate caches on every state read. It submits legal bot actions and
validates a persistence snapshot after every accepted command. Both players and
a spectator are projected twice at each boundary to exercise repeated host
queries. This is a local engine workload, not a measurement of the platform's
exact request pipeline. The shared cross-game Bot Lab registry does not yet
register FAB; this entrypoint uses FAB's native self-play implementation.

The report separates legal enumeration, bot decision time, command submission by
move, viewer projection (payment/settled and first/repeated query), resources,
and snapshot serialization. Operation totals are nested profiling spans and
must not be added together as independent wall-clock costs. Whole-match time
also includes initialization, output serialization, and equivalence hashing.

Each match digest covers ordered legal commands, chosen commands, all queried
viewer states and resources, and every serialized post-command snapshot.
Timestamp metadata is normalized. Compare digests, action counts, and
termination reasons before interpreting timing changes. A digest match proves
equivalence for that deterministic trajectory; it is not complete rules
coverage. Errors, illegal submissions, and stalls cause a nonzero exit after
the report is saved. `max-actions` is a bounded incomplete game, not a completed
match or evidence of a stall.

Run broad sweeps for behavior coverage. Run before/after timing jobs sequentially
without other benchmarks or test suites, and use more than one run before
claiming a latency improvement. Browser/network delivery, persistence I/O,
animation locks, and synchronization recovery are outside this benchmark.

## Measured results — 2026-09-07

Baseline: `822b70068d`. Production-mode runs used Gravy Bones and Rhinar in both
seat orders, two seeds, and 80 actions per game (320 actions per run). Run order
was baseline, candidate, candidate, baseline. The longer coverage sweeps were
paused and the full test suites had finished during these timing runs. This is
a shared development machine, not controlled production hardware.

| Metric                           | Baseline, two runs | Candidate, two runs |
| -------------------------------- | -----------------: | ------------------: |
| Whole harness time / 320 actions |        35.4–36.1 s |       12.87–12.88 s |
| Sum of command-submission spans  |        22.4–22.8 s |           8.6–8.7 s |
| Settled viewer query p95         |         7.4–7.5 ms |        0.62–0.65 ms |
| Payment viewer query p95         |         8.4–9.7 ms |          3.2–3.7 ms |
| Pass submission p95              |         133–140 ms |            51–52 ms |
| Decision-answer submission p95   |         608–718 ms |          273–282 ms |
| End-turn submission p95          |         344–346 ms |            92–99 ms |

The p95 columns are ranges across runs, not pooled percentiles. Viewer rows
measure one viewer request, combining both seats and the spectator. Decision
answers combine different decision kinds. Each run has 243 pass submissions,
27 decision answers, and 10 end-turn submissions; those smaller samples should
not be generalized into production-wide percentiles. Whole harness time fell
63.7–64.3%; command-submission time fell 61.2–62.3%. Every trajectory digest
matched in both repetitions. Snapshot serialization remained roughly unchanged.

Raw benchmark output is kept outside Git; the commands above reproduce it.

The full `vp run ci-check` gate passed: 4,094 engine tests and 9,853 card tests.
The engine suite retains its existing four expected failures and one skipped
test. The focused source/replacement/prevention set passed all 40 tests.

This reduces server-side work without needing a client projection migration.
It does not fix the previously reported subscription recovery issue, commit
ordering, browser acknowledgement, or animation input locks. Expensive decision
answers still merit profiling; these measurements do not establish end-to-end
click latency or production queue capacity.

The optional `FAB_RUNTIME_BENCHMARK=1` local benchmark is separate from CI.
The candidate passed its 120-action/6-second check, including the one-COW and
one-serialization-per-command invariants, but missed the ordinary-pass 5 ms
p95 ceiling at 8.832 ms. The same baseline test missed both checks (11.537 s
for 120 actions, 34.654 ms ordinary-pass p95). Those diagnostic runs experienced
variable shared-host load and are not used for the before/after table above.
The 5 ms target was unmet in this iteration; no benchmark threshold was relaxed.
The subsequent [program-reuse iteration](engine-program-reuse.md) meets it.

## Self-play defect found and corrected

The initial catalog comparison covered all 25 decks and 8,861 actions per
version; all 25 digests, action counts, and outcomes matched. Outcomes were
16 action caps, four life endings, three concessions, one effect ending, and
one stall. Both sweep commands correctly exited nonzero for that stall.

Seed `performance-16-0` (Konrad Weiss Oscilio versus Mexico Nationals Arakni
Crax) stalled at action 270 on turn 6. Flick Knives could target the attacking
Graphene Chelicera token despite its printed restriction. Destroying that token
left the game in the Close Step with no priority, decision, or rules process.

The authored source filter now includes `not-on-active-chain-link`. The shared
filter checks the active attack source and defenders by object reference,
rather than physical zone: a weapon attacks through a proxy while its source
stays in the arena. This follows CR 7.0.3's chain-link membership and also
corrects the same predicate used by Dyed Silk Sleeves. The new card regression
fails on the baseline and passes after the fix; the existing unused-dagger
happy path remains valid. Only Flick Knives' four review-evidence fields changed.

The previously stalled seed now reaches a natural effect ending at action 547
under a 1,200-action cap. This corrects the illegal target that led into the
stall; it does not implement a general forced-close lifecycle rewrite.
The local reproduction captured the final commands and the old boundary state.

The native FAB bot bench can run the same seed:

```sh
node --experimental-transform-types --no-warnings packages/engine/scripts/bot-bench.ts bench \
  --p1 value-extract --p2 value-extract \
  --p1-deck cc-konrad-weiss-oscilio \
  --p2-deck cc-mexico-nats-2025-1st-arakni-crax \
  --seed-base performance-16 --matches 1 --max-actions 1200 \
  --out /tmp/fab-stall-regression.json
```

Final validation after the targeting fix:

- `vp run ci-check`: 4,094 engine tests and 9,854 card tests passed, with the
  same pre-existing expected failures/skips. All card/type/evidence checks passed.
- Corrected catalog sweep: 25 pairings,
  8,991 actions, zero stalls, illegal submissions, or engine exceptions. Seventeen
  games reached the 400-action cap; four ended by life, three by concession,
  and one by effect. The sweep exited successfully.
- Only seeds 16, 17, and 18 changed trajectory after the targeting correction;
  the other 22 still match the performance-only digests.
- Native bot bench: the formerly
  stalled seed completed at action 547, turn 15, with player 1 winning by effect.
  The native report groups non-concession wins under `termination: "life"`;
  its `winReason: "effect"` retains the exact engine result.

The ring sweep is an engine stress workload and includes format-boundary
pairings in catalog order; it is not a tournament win-rate evaluation.
