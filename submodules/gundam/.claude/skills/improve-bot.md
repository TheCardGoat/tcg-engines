---
name: improve-bot
description: One-shot kickoff for the bot self-improvement loop. Runs a baseline bench, picks a hypothesis from the report, hands off to the `improve-bot-heuristics` playbook for the implementation, then runs a back-to-back bench + diff and reports the verdict. Use this when the user says "improve the bot", "iterate on bot heuristics", or just types /improve-bot.
user-invocable: true
argument-hint: "[BASELINE=<strategy-id>] [MATCHES=<n>]"
---

# Improve the Bot — One-Shot Loop

This is the kickoff entry point. The deeper, step-by-step playbook lives in `.claude/skills/improve-bot-heuristics.md`; this skill calls into it.

## Arguments

- `BASELINE` — strategy id to beat. Defaults to the current best on `main`, which is `value-ranked` today. Override to `greedy-legal` when you want to challenge the floor.
- `MATCHES` — bench match count. Default 100. Use ≥ 200 if the baseline win-rate is near 0.5 (small samples hide real changes).

## The Loop

1. **Confirm tooling is in place.** Cheap pre-flight checks (skip if all green):
   - `tools/bot-bench/package.json` exists.
   - `vp install` has been run since the last `git pull`.

2. **Bench the baseline.** Run a self-play between two copies of `BASELINE`. Read the report and surface the single most impactful symptom — a one-sentence summary like _"P1 wins 38% and concedes in 40% of matches; `declareBlock` is succeeding but `enterBattle.succeeded` is half of `enterBattle.attempted`."_ Do NOT propose changes yet; the symptom is the input to step 3.

3. **Hand off to the playbook.** Run `improve-bot-heuristics` with the discovered symptom as the hypothesis seed. The playbook covers: forming the hypothesis, encoding it as a `FamilyPolicy`, registering the strategy in three places, and authoring the regression tests.

4. **Diff and report.** After the playbook's Step 5 tests pass, run both seat-arrangement benches against the baseline and pipe both through the diff CLI. Use the verdict rule from the playbook's Step 4 to decide keep / revert. Always present the decision _with_ the per-family deltas — never just "win-rate is up, ship it" — because a 5pp win-rate gain that comes with a 20pp `enterBattle.successRateDelta` regression is masking a real bug somewhere else.

5. **Commit the artifact, not the noise.** Commit:
   - The new strategy file and its tests.
   - The two diff JSONs (small, useful for the PR reviewer).
   - The skill retrospective edit, if any.

   Do not commit:
   - Full match reports (they're large and reproducible from the seed).
   - `tools/bot-bench/reports/` as a directory (add a `.gitignore` line if it doesn't have one).

## When to Stop Looping

A single `/improve-bot` invocation is one iteration of the loop, not the whole loop. Stop after one iteration unless the user explicitly says "keep iterating until X". Continuous improvement is most useful when each iteration's verdict feeds back into the next hypothesis — which the human is in a much better position to judge than the bot.

If the user wants automation, suggest `/loop /improve-bot` — that wraps this skill in the project's `loop` skill and re-runs it on a cadence.
