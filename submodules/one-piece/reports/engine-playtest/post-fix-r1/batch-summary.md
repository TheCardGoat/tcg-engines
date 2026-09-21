# Playtest batch: post-fix-r1

- Started: 2026-09-19T10:41:19.132Z, seed 41000, duration 6.8s
- Matches: 15, games: 37, natural completions: 37/37 (100%)
- Avg commands/game: 86.4, avg turns: 10.1, illegal commands: 0

## Matches (best of three)

| match | south | north | score | games natural | terminations |
| --- | --- | --- | --- | --- | --- |
| op-fitl-post-fix-r1-m01 | heuristic red-aggro | aggressive blue-control | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-post-fix-r1-m02 | aggressive red-aggro | heuristic green-midrange | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-post-fix-r1-m03 | heuristic red-aggro | aggressive purple-ramp | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-post-fix-r1-m04 | aggressive red-aggro | heuristic black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-r1-m05 | heuristic red-aggro | aggressive yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-r1-m06 | aggressive blue-control | heuristic green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-r1-m07 | heuristic blue-control | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-r1-m08 | aggressive blue-control | heuristic black-removal | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-post-fix-r1-m09 | heuristic blue-control | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-r1-m10 | aggressive green-midrange | heuristic purple-ramp | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-post-fix-r1-m11 | heuristic green-midrange | aggressive black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-r1-m12 | aggressive green-midrange | heuristic yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-post-fix-r1-m13 | heuristic purple-ramp | aggressive black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-r1-m14 | aggressive purple-ramp | heuristic yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-r1-m15 | heuristic black-removal | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |

## Log audit (aggregated by category)

| category | severity | total | first seen in | example |
| --- | --- | --- | --- | --- |
| consecutive-duplicate | defect | 5 | op-fitl-post-fix-r1-m01-g2 | "South red-aggro plays Marco." |

## Rules-invariant violations

None (37 games audited).

## Non-natural terminations

None — every game ended by the rules.

## Prompt coverage (point-and-click surface exercised)

- prompt kinds: choice=1395
- choice kinds: selectCards=782, confirm=208, selectTargets=126, costPayment=119, chooseOption=116, orderCards=44

