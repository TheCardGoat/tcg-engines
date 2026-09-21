# Playtest batch: coverage-r9

- Started: 2026-09-19T12:55:17.197Z, seed 129000, duration 12.8s
- Matches: 30, games: 70, natural completions: 70/70 (100%)
- Avg commands/game: 80.2, avg turns: 8.9, illegal commands: 0

## Matches (best of three)

| match | south | north | score | games natural | terminations |
| --- | --- | --- | --- | --- | --- |
| op-fitl-coverage-r9-m01 | heuristic red-aggro | aggressive blue-control | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r9-m02 | aggressive red-aggro | greedy green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m03 | greedy red-aggro | valueRanked purple-ramp | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r9-m04 | valueRanked red-aggro | heuristic black-removal | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r9-m05 | heuristic red-aggro | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r9-m06 | aggressive blue-control | greedy green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m07 | greedy blue-control | valueRanked purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m08 | valueRanked blue-control | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m09 | heuristic blue-control | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r9-m10 | aggressive green-midrange | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m11 | greedy green-midrange | valueRanked black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m12 | valueRanked green-midrange | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m13 | heuristic purple-ramp | aggressive black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m14 | aggressive purple-ramp | greedy yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m15 | greedy black-removal | valueRanked yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m16 | valueRanked red-aggro | heuristic blue-control | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r9-m17 | heuristic red-aggro | aggressive green-midrange | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m18 | aggressive red-aggro | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m19 | greedy red-aggro | valueRanked black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m20 | valueRanked red-aggro | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m21 | heuristic blue-control | aggressive green-midrange | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r9-m22 | aggressive blue-control | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m23 | greedy blue-control | valueRanked black-removal | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r9-m24 | valueRanked blue-control | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m25 | heuristic green-midrange | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m26 | aggressive green-midrange | greedy black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m27 | greedy green-midrange | valueRanked yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m28 | valueRanked purple-ramp | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r9-m29 | heuristic purple-ramp | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r9-m30 | aggressive black-removal | greedy yellow-trigger | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |

## Log audit (aggregated by category)

No log findings. Either the logs are clean or the audit needs new rules.

## Rules-invariant violations

None (70 games audited).

## Non-natural terminations

None — every game ended by the rules.

## Prompt coverage (point-and-click surface exercised)

- prompt kinds: choice=1415
- choice kinds: selectCards=881, confirm=181, selectTargets=119, costPayment=109, chooseOption=97, orderCards=28

