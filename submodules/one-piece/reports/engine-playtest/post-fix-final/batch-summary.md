# Playtest batch: post-fix-final

- Started: 2026-09-19T10:44:11.203Z, seed 41000, duration 10.7s
- Matches: 15, games: 37, natural completions: 37/37 (100%)
- Avg commands/game: 86.4, avg turns: 10.1, illegal commands: 0

## Matches (best of three)

| match | south | north | score | games natural | terminations |
| --- | --- | --- | --- | --- | --- |
| op-fitl-post-fix-final-m01 | heuristic red-aggro | aggressive blue-control | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-post-fix-final-m02 | aggressive red-aggro | heuristic green-midrange | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-post-fix-final-m03 | heuristic red-aggro | aggressive purple-ramp | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-post-fix-final-m04 | aggressive red-aggro | heuristic black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-final-m05 | heuristic red-aggro | aggressive yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-final-m06 | aggressive blue-control | heuristic green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-final-m07 | heuristic blue-control | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-final-m08 | aggressive blue-control | heuristic black-removal | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-post-fix-final-m09 | heuristic blue-control | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-final-m10 | aggressive green-midrange | heuristic purple-ramp | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-post-fix-final-m11 | heuristic green-midrange | aggressive black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-final-m12 | aggressive green-midrange | heuristic yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-post-fix-final-m13 | heuristic purple-ramp | aggressive black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-final-m14 | aggressive purple-ramp | heuristic yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-post-fix-final-m15 | heuristic black-removal | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |

## Log audit (aggregated by category)

No log findings. Either the logs are clean or the audit needs new rules.

## Rules-invariant violations

None (37 games audited).

## Non-natural terminations

None — every game ended by the rules.

## Prompt coverage (point-and-click surface exercised)

- prompt kinds: choice=1395
- choice kinds: selectCards=782, confirm=208, selectTargets=126, costPayment=119, chooseOption=116, orderCards=44

