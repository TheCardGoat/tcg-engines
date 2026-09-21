# Playtest batch: coverage-r5-final

- Started: 2026-09-19T12:00:20.679Z, seed 85000, duration 12.8s
- Matches: 30, games: 66, natural completions: 66/66 (100%)
- Avg commands/game: 77.7, avg turns: 8.8, illegal commands: 0

## Matches (best of three)

| match | south | north | score | games natural | terminations |
| --- | --- | --- | --- | --- | --- |
| op-fitl-coverage-r5-final-m01 | heuristic red-aggro | aggressive blue-control | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m02 | aggressive red-aggro | greedy green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m03 | greedy red-aggro | valueRanked purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m04 | valueRanked red-aggro | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m05 | heuristic red-aggro | aggressive yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m06 | aggressive blue-control | greedy green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m07 | greedy blue-control | valueRanked purple-ramp | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r5-final-m08 | valueRanked blue-control | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m09 | heuristic blue-control | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m10 | aggressive green-midrange | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m11 | greedy green-midrange | valueRanked black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m12 | valueRanked green-midrange | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m13 | heuristic purple-ramp | aggressive black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m14 | aggressive purple-ramp | greedy yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m15 | greedy black-removal | valueRanked yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r5-final-m16 | valueRanked red-aggro | heuristic blue-control | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m17 | heuristic red-aggro | aggressive green-midrange | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r5-final-m18 | aggressive red-aggro | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m19 | greedy red-aggro | valueRanked black-removal | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r5-final-m20 | valueRanked red-aggro | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m21 | heuristic blue-control | aggressive green-midrange | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m22 | aggressive blue-control | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m23 | greedy blue-control | valueRanked black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m24 | valueRanked blue-control | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m25 | heuristic green-midrange | aggressive purple-ramp | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r5-final-m26 | aggressive green-midrange | greedy black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m27 | greedy green-midrange | valueRanked yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m28 | valueRanked purple-ramp | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r5-final-m29 | heuristic purple-ramp | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r5-final-m30 | aggressive black-removal | greedy yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |

## Log audit (aggregated by category)

No log findings. Either the logs are clean or the audit needs new rules.

## Rules-invariant violations

None (66 games audited).

## Non-natural terminations

None — every game ended by the rules.

## Prompt coverage (point-and-click surface exercised)

- prompt kinds: choice=1206
- choice kinds: selectCards=749, confirm=140, selectTargets=105, chooseOption=92, costPayment=92, orderCards=28

