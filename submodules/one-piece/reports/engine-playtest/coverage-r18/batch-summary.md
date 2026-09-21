# Playtest batch: coverage-r18

- Started: 2026-09-19T13:57:21.021Z, seed 228000, duration 9.7s
- Matches: 30, games: 70, natural completions: 70/70 (100%)
- Avg commands/game: 79.3, avg turns: 8.9, illegal commands: 0

## Matches (best of three)

| match | south | north | score | games natural | terminations |
| --- | --- | --- | --- | --- | --- |
| op-fitl-coverage-r18-m01 | heuristic red-aggro | aggressive blue-control | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m02 | aggressive red-aggro | greedy green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m03 | greedy red-aggro | valueRanked purple-ramp | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r18-m04 | valueRanked red-aggro | heuristic black-removal | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r18-m05 | heuristic red-aggro | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r18-m06 | aggressive blue-control | greedy green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m07 | greedy blue-control | valueRanked purple-ramp | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r18-m08 | valueRanked blue-control | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m09 | heuristic blue-control | aggressive yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m10 | aggressive green-midrange | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m11 | greedy green-midrange | valueRanked black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m12 | valueRanked green-midrange | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m13 | heuristic purple-ramp | aggressive black-removal | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r18-m14 | aggressive purple-ramp | greedy yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m15 | greedy black-removal | valueRanked yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m16 | valueRanked red-aggro | heuristic blue-control | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r18-m17 | heuristic red-aggro | aggressive green-midrange | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r18-m18 | aggressive red-aggro | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m19 | greedy red-aggro | valueRanked black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m20 | valueRanked red-aggro | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m21 | heuristic blue-control | aggressive green-midrange | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r18-m22 | aggressive blue-control | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m23 | greedy blue-control | valueRanked black-removal | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r18-m24 | valueRanked blue-control | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m25 | heuristic green-midrange | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m26 | aggressive green-midrange | greedy black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m27 | greedy green-midrange | valueRanked yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m28 | valueRanked purple-ramp | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r18-m29 | heuristic purple-ramp | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r18-m30 | aggressive black-removal | greedy yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |

## Log audit (aggregated by category)

No log findings. Either the logs are clean or the audit needs new rules.

## Rules-invariant violations

None (70 games audited).

## Non-natural terminations

None — every game ended by the rules.

## Hidden-information leakage (per-seat projections)

None (70 games, 3336 hidden names checked against both seat projections).

## Prompt coverage (point-and-click surface exercised)

- prompt kinds: choice=1383
- choice kinds: selectCards=872, confirm=170, selectTargets=111, chooseOption=102, costPayment=101, orderCards=27

