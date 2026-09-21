# Playtest batch: pre-fix-baseline

- Started: 2026-09-19T09:37:22.101Z, seed 41000, duration 8.7s
- Matches: 15, games: 36, natural completions: 36/36 (100%)
- Avg commands/game: 93.7, avg turns: 10.2, illegal commands: 0

## Matches (best of three)

| match | south | north | score | games natural | terminations |
| --- | --- | --- | --- | --- | --- |
| op-fitl-pre-fix-baseline-m01 | heuristic red-aggro | aggressive blue-control | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-pre-fix-baseline-m02 | aggressive red-aggro | heuristic green-midrange | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-pre-fix-baseline-m03 | heuristic red-aggro | aggressive purple-ramp | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-pre-fix-baseline-m04 | aggressive red-aggro | heuristic black-removal | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-pre-fix-baseline-m05 | heuristic red-aggro | aggressive yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-pre-fix-baseline-m06 | aggressive blue-control | heuristic green-midrange | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-pre-fix-baseline-m07 | heuristic blue-control | aggressive purple-ramp | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-pre-fix-baseline-m08 | aggressive blue-control | heuristic black-removal | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-pre-fix-baseline-m09 | heuristic blue-control | aggressive yellow-trigger | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-pre-fix-baseline-m10 | aggressive green-midrange | heuristic purple-ramp | 2-1 (south) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-pre-fix-baseline-m11 | heuristic green-midrange | aggressive black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-pre-fix-baseline-m12 | aggressive green-midrange | heuristic yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |
| op-fitl-pre-fix-baseline-m13 | heuristic purple-ramp | aggressive black-removal | 0-2 (north) | 2/2 | rules-win, rules-win |
| op-fitl-pre-fix-baseline-m14 | aggressive purple-ramp | heuristic yellow-trigger | 2-0 (south) | 2/2 | rules-win, rules-win |
| op-fitl-pre-fix-baseline-m15 | heuristic black-removal | aggressive yellow-trigger | 1-2 (north) | 3/3 | rules-win, rules-win, rules-win |

## Log audit (aggregated by category)

| category | severity | total | first seen in | example |
| --- | --- | --- | --- | --- |
| terse-prompt-header | style | 838 | op-fitl-pre-fix-baseline-m01-g1 | "South red-aggro counter step" |
| double-logged-play | defect | 392 | op-fitl-pre-fix-baseline-m01-g1 | "North blue-control moves a hidden card from Hand to Character area." |
| double-logged-draw | defect | 363 | op-fitl-pre-fix-baseline-m01-g1 | "South red-aggro moves a hidden card from Deck to Hand." |
| dev-jargon | defect | 217 | op-fitl-pre-fix-baseline-m01-g1 | "Perona resolves its onPlay effect." |
| consecutive-duplicate | defect | 197 | op-fitl-pre-fix-baseline-m01-g1 | "North blue-control attaches 1 DON!! to Perona." |
| vague-target | defect | 137 | op-fitl-pre-fix-baseline-m01-g1 | "Radical Beam!! needs a target" |

## Rules-invariant violations

None (36 games audited).

## Non-natural terminations

None — every game ended by the rules.

## Prompt coverage (point-and-click surface exercised)

- prompt kinds: choice=1407
- choice kinds: selectCards=783, confirm=204, selectTargets=137, chooseOption=121, costPayment=116, orderCards=46

