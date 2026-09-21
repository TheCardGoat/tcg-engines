# Playtest batch: coverage-r54

- Started: 2026-09-19T18:42:11.268Z, seed 381000, duration 10.2s
- Matches: 30, games: 68, natural completions: 68/68 (100%)
- Avg commands/game: 78.6, avg turns: 8.9, illegal commands: 0

## Matches (best of three)

| match | south | north | score | games natural | terminations |
| --- | --- | --- | --- | --- | --- |
| op-fitl-coverage-r54-m01 | heuristic red-aggro | aggressive blue-control | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m02 | aggressive red-aggro | greedy green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m03 | greedy red-aggro | valueRanked purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m04 | valueRanked red-aggro | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m05 | heuristic red-aggro | aggressive yellow-trigger | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r54-m06 | aggressive blue-control | greedy green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m07 | greedy blue-control | valueRanked purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m08 | valueRanked blue-control | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m09 | heuristic blue-control | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r54-m10 | aggressive green-midrange | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m11 | greedy green-midrange | valueRanked black-removal | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r54-m12 | valueRanked green-midrange | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m13 | heuristic purple-ramp | aggressive black-removal | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r54-m14 | aggressive purple-ramp | greedy yellow-trigger | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r54-m15 | greedy black-removal | valueRanked yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m16 | valueRanked red-aggro | heuristic blue-control | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m17 | heuristic red-aggro | aggressive green-midrange | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r54-m18 | aggressive red-aggro | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m19 | greedy red-aggro | valueRanked black-removal | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r54-m20 | valueRanked red-aggro | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m21 | heuristic blue-control | aggressive green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m22 | aggressive blue-control | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m23 | greedy blue-control | valueRanked black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m24 | valueRanked blue-control | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m25 | heuristic green-midrange | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m26 | aggressive green-midrange | greedy black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m27 | greedy green-midrange | valueRanked yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m28 | valueRanked purple-ramp | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r54-m29 | heuristic purple-ramp | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r54-m30 | aggressive black-removal | greedy yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |

## Log audit (aggregated by category)

No log findings. Either the logs are clean or the audit needs new rules.

## Rules-invariant violations

None (68 games audited).

## Non-natural terminations

None — every game ended by the rules.

## Hidden-information leakage (per-seat projections)

None (68 games, 3171 hidden names checked against both seat projections).

## Prompt coverage (point-and-click surface exercised)

- prompt kinds: choice=1272
- choice kinds: selectCards=798, confirm=180, costPayment=101, selectTargets=93, chooseOption=80, orderCards=20

