# Playtest batch: coverage-r11

- Started: 2026-09-19T13:30:03.971Z, seed 151000, duration 12.2s
- Matches: 30, games: 66, natural completions: 66/66 (100%)
- Avg commands/game: 77.9, avg turns: 8.8, illegal commands: 0

## Matches (best of three)

| match | south | north | score | games natural | terminations |
| --- | --- | --- | --- | --- | --- |
| op-fitl-coverage-r11-m01 | heuristic red-aggro | aggressive blue-control | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r11-m02 | aggressive red-aggro | greedy green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m03 | greedy red-aggro | valueRanked purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m04 | valueRanked red-aggro | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m05 | heuristic red-aggro | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r11-m06 | aggressive blue-control | greedy green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m07 | greedy blue-control | valueRanked purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m08 | valueRanked blue-control | heuristic black-removal | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r11-m09 | heuristic blue-control | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m10 | aggressive green-midrange | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m11 | greedy green-midrange | valueRanked black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m12 | valueRanked green-midrange | heuristic yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r11-m13 | heuristic purple-ramp | aggressive black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m14 | aggressive purple-ramp | greedy yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m15 | greedy black-removal | valueRanked yellow-trigger | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r11-m16 | valueRanked red-aggro | heuristic blue-control | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m17 | heuristic red-aggro | aggressive green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m18 | aggressive red-aggro | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m19 | greedy red-aggro | valueRanked black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m20 | valueRanked red-aggro | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m21 | heuristic blue-control | aggressive green-midrange | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r11-m22 | aggressive blue-control | greedy purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m23 | greedy blue-control | valueRanked black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m24 | valueRanked blue-control | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m25 | heuristic green-midrange | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m26 | aggressive green-midrange | greedy black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m27 | greedy green-midrange | valueRanked yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m28 | valueRanked purple-ramp | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m29 | heuristic purple-ramp | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r11-m30 | aggressive black-removal | greedy yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |

## Log audit (aggregated by category)

No log findings. Either the logs are clean or the audit needs new rules.

## Rules-invariant violations

None (66 games audited).

## Non-natural terminations

None — every game ended by the rules.

## Prompt coverage (point-and-click surface exercised)

- prompt kinds: choice=1250
- choice kinds: selectCards=775, confirm=169, costPayment=98, selectTargets=94, chooseOption=85, orderCards=29

