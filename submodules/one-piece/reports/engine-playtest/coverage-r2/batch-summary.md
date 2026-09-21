# Playtest batch: coverage-r2

- Started: 2026-09-19T10:51:41.397Z, seed 52000, duration 11.7s
- Matches: 30, games: 66, natural completions: 66/66 (100%)
- Avg commands/game: 87.8, avg turns: 10.3, illegal commands: 0

## Matches (best of three)

| match | south | north | score | games natural | terminations |
| --- | --- | --- | --- | --- | --- |
| op-fitl-coverage-r2-m01 | heuristic red-aggro | aggressive blue-control | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m02 | aggressive red-aggro | heuristic green-midrange | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r2-m03 | heuristic red-aggro | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m04 | aggressive red-aggro | heuristic black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m05 | heuristic red-aggro | aggressive yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m06 | aggressive blue-control | heuristic green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m07 | heuristic blue-control | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m08 | aggressive blue-control | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m09 | heuristic blue-control | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m10 | aggressive green-midrange | heuristic purple-ramp | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r2-m11 | heuristic green-midrange | aggressive black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m12 | aggressive green-midrange | heuristic yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m13 | heuristic purple-ramp | aggressive black-removal | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r2-m14 | aggressive purple-ramp | heuristic yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m15 | heuristic black-removal | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m16 | aggressive red-aggro | heuristic blue-control | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r2-m17 | heuristic red-aggro | aggressive green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m18 | aggressive red-aggro | heuristic purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m19 | heuristic red-aggro | aggressive black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m20 | aggressive red-aggro | heuristic yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m21 | heuristic blue-control | aggressive green-midrange | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r2-m22 | aggressive blue-control | heuristic purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m23 | heuristic blue-control | aggressive black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m24 | aggressive blue-control | heuristic yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m25 | heuristic green-midrange | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m26 | aggressive green-midrange | heuristic black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m27 | heuristic green-midrange | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m28 | aggressive purple-ramp | heuristic black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-coverage-r2-m29 | heuristic purple-ramp | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-coverage-r2-m30 | aggressive black-removal | heuristic yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |

## Log audit (aggregated by category)

No log findings. Either the logs are clean or the audit needs new rules.

## Rules-invariant violations

None (66 games audited).

## Non-natural terminations

None — every game ended by the rules.

## Prompt coverage (point-and-click surface exercised)

- prompt kinds: choice=2474
- choice kinds: selectCards=1512, confirm=335, selectTargets=215, costPayment=197, chooseOption=171, orderCards=44

