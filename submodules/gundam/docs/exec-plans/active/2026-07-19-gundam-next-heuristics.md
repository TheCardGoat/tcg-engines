# Gundam Next Heuristics Experiment Program

## Goal

Validate the next strategic decisions for the canonical `combat-aware` bot:
attack target selection, context-sensitive chump blocks, early-turn curve,
multi-attacker ordering, and tactical Pilot/ability timing. Promote only a
small, independently proven improvement; retain all other ideas as documented
experimental controls.

## Rules constraints

- An attack may target the opponent or a rested enemy Unit (8-2-1); Direct
  attacks resolve against the Base before Shields and can immediately defeat a
  player with neither (8-5-2).
- A <Blocker> is optional, redirects one attack, cannot be activated by the
  original target, and cannot answer <High-Maneuver> (8-3; 13-1-4).
- Unit combat is simultaneous except for <First Strike> (8-5-3; 13-1-5).
- <Breach> and <Suppression> change the value of combat/direct pressure and
  must be modeled only where the available card metadata supports it
  (13-1-2; 13-1-7).
- Development and Command decisions remain subject to the completed Command
  heuristic gates; no card rules or legality behavior may change for a bot
  experiment.

## Evaluation design

- Parent: engine-exported `combat-aware`; experimental policies stay in
  `tools/bot-bench` until promotion.
- Deck cells: `ef-starter`, `seed-aggro`, and `gd01-mixed`, played as equal
  decks in both seats for each seed block.
- Screen: 48 common seeds per oriented deck cell (288 games per candidate),
  using a fixed candidate-specific seed label. Confirmation: a fresh 96 common
  seeds per oriented cell (576 games). Holdout: untouched 120 common seeds per
  oriented cell (720 games).
- Compare each candidate to baseline from both player perspectives. Record
  win delta, termination reasons, rejected moves/error codes, family
  attempt/success deltas, action count, turn count, and behavioral actuation
  counts for the altered family.
- A candidate advances only if it changes the intended behavior, has no hard
  failures, has no screen deck-cell regression of 5 percentage points or more,
  and has a plausible aggregate gain. Promotion requires a positive 95% paired
  confidence interval, at least +2 percentage points mean on confirmation and
  no holdout deck-cell regression of 5 points or more.

## Hypothesis queue

1. **Threat-aware target selection.** Compare direct/Base pressure against
   removing an enemy Unit using next-turn opposing damage, Unit value, kill
   certainty, Base lethal, and shield count.
2. **Board-state-aware chump blocks.** Extend the current material model with
   lethal prevention, Base damage state, shield window, and whether preserving
   a Unit retains a meaningful next-turn attack/block.
3. **Two-turn early curve.** Prefer playable early Units only when that
   spending plan leaves a credible next-turn deployment; separately test
   mulligan and deployment ordering. Do not repeat the rejected unconditional
   cheap-card rule.
4. **Multi-attacker ordering.** Select which attack to submit first based on
   blocker exposure, First Strike, Breach/Suppression, and removing blockers
   before valuable direct attackers attack.
5. **Tactical Pilot/ability timing.** Compare immediate pairing/activation
   benefit with holding Resources for Command or Unit development. Target only
   card effects whose value can be observed in the current state.
6. **Safe composition.** Combine only confirmed independent winners and
   re-run the complete confirmation/holdout sequence.

## Implementation and validation gates

- Add isolated candidate strategies and deterministic focused tests before a
  screen. Add a regression test for every invalid move, engine exception, or
  missing actuation signal discovered by the bench.
- Add or use telemetry that proves a policy was actually selected; a neutral
  win delta without policy actuation is inconclusive, not a rejection.
- After each bounded batch, inspect cost, repeated failures, and telemetry;
  update the remaining queue only when evidence supports it.
- Before any promotion: focused engine automation tests, BotLab check/tests,
  deterministic replay, strict bench run, and a complete built-in-browser
  simulation proof. Browser validation must use the built-in browser only.

## Stop conditions

- Stop after the six queued coherent hypotheses, or earlier if none can be
  actuated reliably with the available candidate surface.
- Stop and diagnose before continuing on rules illegality, nondeterminism,
  hard-failure regressions, or a benchmark-integrity problem.
- Do not tune thresholds after observing holdout results; create a new
  hypothesis and reserve a new holdout instead.

## Progress

- [x] Read the rules, benchmark procedure, current canonical policy, and
      preceding combat/Command experiment evidence.
- [x] Establish a fresh baseline telemetry report and verify the paired-report
      analysis path.
- [x] Screen hypothesis 1; reject the unconditional next-turn-threat bonus.
- [x] Screen hypothesis 4; reject the Blocker-bait ordering rule as
      insufficiently actuated/beneficial in the representative deck cells.
- [ ] Implement and screen hypotheses 2, 3, and 5 one at a time.
- [ ] Confirm any survivor on fresh seeds, then run untouched holdout.
- [ ] Promote at most one composed policy and complete replay/BotLab/browser
      validation.

## Results

### Hypothesis 1 — threat-aware target selection (rejected)

- Candidate: `iter-25-threat-aware-target`, which adds a bounded future-damage
  value only to favorable enemy-Unit kills and leaves direct/Base lethal scoring
  unchanged.
- Screen: 48 common seeds × three equal-deck cells × both candidate seats
  (432 total games including baselines), seed `next-threat-screen-v1`.
- All games ended through normal rules wins with no planner error codes.
- It materially actuated: compared with baseline, Unit attack selections rose
  by 30–57 per 48-game candidate cell (and direct attacks fell by 9–24).
- Result: 0 points (EF P1), then -4.17, -4.17, -4.17, -6.25, and -4.17
  percentage points across EF P2, SEED P1/P2, GD01 P1/P2 respectively.
  The GD01 regression crosses the screen rejection threshold. Do not tune this
  bonus from the same seeds; reserve a new hypothesis if future state features
  justify it.

### Hypothesis 4 — multi-attacker Blocker bait (rejected)

- Candidate: `iter-26-blocker-bait-order`, which leads with the least valuable
  blockable direct attacker while an opposing active <Blocker> remains, but
  preserves canonical favorable-Unit-combat priority.
- Screen: the same seat-swapped 48-seed / three-deck schedule and strict
  termination/error policy as hypothesis 1.
- No hard failures occurred. The result was 0 points in EF P1 and both GD01
  seats, and -2.08 points in EF P2 and both SEED seats.
- Coarse selection telemetry changed only 0–7 attack choices per cell; this
  benchmark suite rarely presents the exact multi-attacker plus active-Blocker
  situation. Treat the result as insufficiently actuated rather than evidence
  for threshold tuning. A later revisit needs scenario-targeted fixtures and
  a decision trace that records the first attacker choice in that state.
