# Playtest batch: coverage-r3

- Started: 2026-09-19T11:20:31.116Z, seed 63000, duration 25.2s
- Matches: 30, games: 75, natural completions: 75/75 (100%)
- Avg commands/game: 89.2, avg turns: 10.3, illegal commands: 0

## Matches (best of three)

| match | south | north | score | games natural | terminations |
| --- | --- | --- | --- | --- | --- |
| op-fitl-coverage-r3-m01 | heuristic red-aggro | aggressive blue-control | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m02 | aggressive red-aggro | heuristic green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m03 | heuristic red-aggro | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m04 | aggressive red-aggro | heuristic black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m05 | heuristic red-aggro | aggressive yellow-trigger | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m06 | aggressive blue-control | heuristic green-midrange | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m07 | heuristic blue-control | aggressive purple-ramp | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m08 | aggressive blue-control | heuristic black-removal | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m09 | heuristic blue-control | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m10 | aggressive green-midrange | heuristic purple-ramp | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m11 | heuristic green-midrange | aggressive black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m12 | aggressive green-midrange | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m13 | heuristic purple-ramp | aggressive black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m14 | aggressive purple-ramp | heuristic yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m15 | heuristic black-removal | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m16 | aggressive red-aggro | heuristic blue-control | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m17 | heuristic red-aggro | aggressive green-midrange | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m18 | aggressive red-aggro | heuristic purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m19 | heuristic red-aggro | aggressive black-removal | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m20 | aggressive red-aggro | heuristic yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m21 | heuristic blue-control | aggressive green-midrange | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m22 | aggressive blue-control | heuristic purple-ramp | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m23 | heuristic blue-control | aggressive black-removal | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m24 | aggressive blue-control | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m25 | heuristic green-midrange | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m26 | aggressive green-midrange | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m27 | heuristic green-midrange | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m28 | aggressive purple-ramp | heuristic black-removal | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r3-m29 | heuristic purple-ramp | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r3-m30 | aggressive black-removal | heuristic yellow-trigger | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |

## Log audit (aggregated by category)

| category | severity | total | first seen in | example |
| --- | --- | --- | --- | --- |
| consecutive-duplicate | defect | 1 | op-fitl-coverage-r3-m20-g1 | "South red-aggro takes 1 damage." |

## Rules-invariant violations

None (75 games audited).

## Non-natural terminations

None — every game ended by the rules.

## Prompt coverage (point-and-click surface exercised)

- prompt kinds: choice=2902
- choice kinds: selectCards=1750, confirm=392, selectTargets=256, costPayment=222, chooseOption=206, orderCards=76

