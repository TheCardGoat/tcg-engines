# Playtest batch: coverage-r4-naive

- Started: 2026-09-19T11:26:20.236Z, seed 74000, duration 16.2s
- Matches: 30, games: 67, natural completions: 67/67 (100%)
- Avg commands/game: 81.3, avg turns: 8.9, illegal commands: 0

## Matches (best of three)

| match | south | north | score | games natural | terminations |
| --- | --- | --- | --- | --- | --- |
| op-fitl-coverage-r4-naive-m01 | heuristic red-aggro | aggressive blue-control | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m02 | aggressive red-aggro | greedy green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m03 | greedy red-aggro | valueRanked purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m04 | valueRanked red-aggro | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m05 | heuristic red-aggro | aggressive yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m06 | aggressive blue-control | greedy green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m07 | greedy blue-control | valueRanked purple-ramp | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r4-naive-m08 | valueRanked blue-control | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m09 | heuristic blue-control | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m10 | aggressive green-midrange | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m11 | greedy green-midrange | valueRanked black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m12 | valueRanked green-midrange | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m13 | heuristic purple-ramp | aggressive black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m14 | aggressive purple-ramp | greedy yellow-trigger | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r4-naive-m15 | greedy black-removal | valueRanked yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m16 | valueRanked red-aggro | heuristic blue-control | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r4-naive-m17 | heuristic red-aggro | aggressive green-midrange | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r4-naive-m18 | aggressive red-aggro | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m19 | greedy red-aggro | valueRanked black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m20 | valueRanked red-aggro | heuristic yellow-trigger | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r4-naive-m21 | heuristic blue-control | aggressive green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m22 | aggressive blue-control | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m23 | greedy blue-control | valueRanked black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m24 | valueRanked blue-control | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m25 | heuristic green-midrange | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m26 | aggressive green-midrange | greedy black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m27 | greedy green-midrange | valueRanked yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r4-naive-m28 | valueRanked purple-ramp | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r4-naive-m29 | heuristic purple-ramp | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r4-naive-m30 | aggressive black-removal | greedy yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |

## Log audit (aggregated by category)

| category | severity | total | first seen in | example |
| --- | --- | --- | --- | --- |
| consecutive-duplicate | defect | 121 | op-fitl-coverage-r4-naive-m03-g1 | "South red-aggro attaches 1 DON!! to Monkey.D.Luffy." |

## Rules-invariant violations

None (67 games audited).

## Non-natural terminations

None — every game ended by the rules.

## Prompt coverage (point-and-click surface exercised)

- prompt kinds: choice=1273
- choice kinds: selectCards=817, confirm=150, chooseOption=100, costPayment=90, selectTargets=87, orderCards=29

