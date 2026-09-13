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
- [x] Screen hypothesis 7, sustained direct pressure, against the canonical
      policy from both seats.
- [x] Screen hypothesis 8, sustained direct pressure plus Blocker bait, on the
      same paired schedule.
- [x] Screen hypothesis 9, Base-window pressure, as the bounded follow-up if
      unconditional direct pressure trades too much board value.
- [x] Screen hypothesis 10, board-aware pressure windows and Base/Shield attack
      sequencing derived from current play guidance.
- [x] Screen hypotheses 11/12, turn-8 and turn-10 late-pressure clocks, as the
      available deck-agnostic approximation of build-then-attack strategy.
- [x] Screen hypothesis 13, Blocker-tax attacks that predict the defender's
      material decision before choosing direct pressure.
- [x] Screen hypothesis 14, defender look-ahead that reserves scarce Blockers
      for the best remaining attack in the current turn.
- [x] Screen hypotheses 15–17: a public-information race clock, a turn-level
      pressure-versus-control plan, and replay-deterministic regret-bounded
      mixing between near-equal plans.
- [x] Confirm the sole screen survivor, hypothesis 16, on fresh seeds; reject
      promotion because the confirmation gain stayed below the predeclared
      threshold.
- [ ] Implement and screen hypotheses 2, 3, and 5 one at a time.
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

### Hypotheses 7/8 — sustained direct pressure (rejected)

- `iter-27-direct-assault` puts every legal direct attack ahead of optional
  Unit combat while retaining canonical attacker ordering and every noncombat
  policy.
- `iter-28-direct-assault-bait` adds the rejected hypothesis 4 attacker-order
  rule to that direct-first target policy. This separately tests whether the
  ordering rule only lacked actuation because favorable Unit attacks still
  preceded the direct-attack window.
- Predeclared screen: 48 common seeds x three equal-deck cells x both candidate
  seats, seed `next-direct-pressure-screen-v1`, with strict rules-win and
  planner-error gates.
- Both candidates materially shortened games, but at unacceptable win cost.
  Across 288 candidate games, direct assault was -10.42 percentage points and
  1.26 turns; adding Blocker bait was -13.19 points and 1.22 turns.
- Direct assault regressed every non-neutral cell, including -25 points in the
  GD01 player-one cell. The bait composition was equal or worse in every cell.
- All 720 games in the shared-baseline screen ended through normal rules wins
  with no planner error codes. Reject both policies: the speedup comes from
  surrendering too much favorable Unit combat, not from correcting illegality.

### Hypothesis 9 — Base-window pressure (rejected)

- `iter-29-base-assault` prioritizes direct attacks only while an opposing Base
  remains. Once the Base is destroyed, it returns to canonical target scoring.
- This is the predeclared bounded follow-up to an unconditional-pressure
  regression: it tests persistent Base damage without changing later
  Shield-versus-Unit decisions.
- Across 288 candidate games it was -3.13 percentage points and only 0.18 turns
  faster. The GD01 player-one cell was -6.25 points, crossing the predeclared
  rejection threshold; no cell improved.
- The Base-only policy produced 15 more direct selections and 70 fewer Unit
  selections across candidate seats than the shared canonical baseline. It
  actuated, but the small speed gain does not compensate for the loss in match
  quality. Do not promote it.

### Hypothesis 10 — pressure windows and attack sequencing (rejected)

- `iter-30-pressure-window` requires board parity, at least two attacks that
  still connect after all visible active Blockers, and—while a Base remains—a
  guaranteed one-attack Base break plus an immediate follow-up connection.
- It leads with the smallest sufficient Base breaker, then the smallest direct
  attacker. This preserves larger AP against a possible Burst-deployed Base
  while avoiding wasted AP against 1-HP Shields.
- The policy is derived from rules 8-3 and 8-5 plus current player guidance:
  do not clear a Base without a follow-up, count attackers rather than AP into
  Shields, use expendable attackers before hidden Burst information resolves,
  and preserve Unit control when behind on board.
- Predeclared screen: 48 common seeds x three equal-deck cells x both candidate
  seats, seed `pressure-window-screen-v1`, with strict rules-win and planner
  error gates.
- Across 288 candidate games it was -2.43 percentage points and 0.27 turns
  faster. The EF player-one cell was -6.25 points, crossing the rejection gate.
  It produced 13 more direct and 152 fewer Unit selections; the window
  actuated, but still surrendered too much board control.

### Hypotheses 11/12 — late-pressure clocks (rejected)

- The production strategy context has no deck or archetype tag, so a true
  aggro/midrange/control policy cannot be selected without a separate protocol
  change. Turn number is available and gives a deterministic approximation of
  the community recommendation to develop first, then apply pressure.
- `iter-31-turn-8-pressure` and `iter-32-turn-10-pressure` keep canonical combat
  before their clock, then prioritize direct attacks. Against Shields they use
  the smallest attacker first; against a Base they use the smallest one-shot
  breaker, or the highest AP attacker if no one-shot break is available.
- Predeclared screen: 48 common seeds x three equal-deck cells x both candidate
  seats, seed `late-pressure-screen-v1`, with strict rules-win and planner error
  gates.
- Turn 8 was -7.99 percentage points and 0.85 turns faster; turn 10 was -3.82
  points and 0.45 turns faster. Both materially actuated and both regressed
  multiple deck cells beyond five points. A fixed clock is not a safe substitute
  for an archetype/strategy profile.

### Hypothesis 13 — predicted Blocker tax (inconclusive)

- `iter-33-block-tax` mirrors the canonical defender's Base/Shield and combat
  loss model. With multiple attackers available, it leads with the least
  valuable direct attacker that is still predicted to make blocking preferable
  to taking the direct hit.
- This tests actual forced defense rather than unconditional or cheap-attacker
  bait. The strategy returns to canonical targeting immediately after the
  Blocker is consumed or the defender declines.
- Predeclared screen: 48 common seeds x three equal-deck cells x both candidate
  seats, seed `block-tax-screen-v1`, with strict rules-win and planner error
  gates.
- It was +1.04 percentage points but 0.09 turns slower. It added 34 direct
  selections in EF/SEED and did not actuate at all in GD01. Retain it as an
  experimental tactical reference, but do not promote it for the pace goal or
  claim a statistically supported quality gain.

### Hypothesis 14 — Blocker reservation (rejected)

- The canonical defender evaluates only the current attack. When several enemy
  Units remain active, `iter-34-blocker-reserve` compares the current modeled
  block improvement with every remaining legal attacker and declines the
  current block when the same scarce Blocker has a strictly better later use.
- Immediate lethal defense and positions with enough Blockers for all remaining
  threats retain the canonical decision.
- Predeclared screen: 48 common seeds x three equal-deck cells x both candidate
  seats, seed `blocker-reserve-screen-v1`, with strict rules-win and planner
  error gates.
- It selected 39 fewer blocks, but was only 0.08 turns faster and lost 0.69
  percentage points. It did not actuate in GD01. The current defender is not the
  primary source of long games in these representative cells.

### Hypothesis 15 — dynamic race clock (rejected)

- `iter-35-race-clock` estimates both players' public turns-to-defeat. It
  models persistent Base damage, one connection per Shield, the final direct
  hit, active Blockers consuming the largest blockable attackers, and
  <High-Maneuver> bypassing them. It prioritizes direct attacks only when its
  visible clock is tied or faster.
- Predeclared screen: 48 common seeds x three equal-deck cells x both candidate
  seats, seed `race-clock-screen-v1`, with strict rules-win and planner-error
  gates.
- Across 288 candidate games it was -0.35 percentage points and 0.16 turns
  faster. It added 11 direct selections and removed 97 Unit selections, but
  the EF player-one cell lost 6.25 points and crossed the rejection gate.
  Dynamic role selection is safer than a fixed aggression clock, but this
  one-turn public projection still gives up too much material in some races.

### Hypothesis 16 — turn-level pressure versus control plan (not promoted)

- `iter-36-turn-plan` scores the complete visible attack step as two macro
  plans. Pressure values guaranteed connections, relative race clocks, and
  immediate lethal; control values unique favorable Unit combats, future AP
  removed, and attacker losses. The chosen pressure line uses the smallest
  sufficient Base breaker and small-first Shield sequencing.
- Screen: 48 common seeds x three equal-deck cells x both candidate seats,
  seed `turn-plan-screen-v1`. It gained 1.39 percentage points and shortened
  games by 0.11 turns, with no cell regression and 24 more direct selections.
- Fresh confirmation: 96 common seeds x three cells x both seats, seed
  `turn-plan-confirm-v1`. It gained only 0.87 percentage points and shortened
  games by 0.09 turns. Cells were 0/0 points in EF, +1.04/-2.08 in SEED, and
  +3.13/+3.13 in GD01. All 864 confirmation games including baselines ended
  through normal rules wins with no planner error codes.
- The confirmation result misses the predeclared +2-point promotion threshold
  and does not justify spending the untouched holdout. Retain this candidate
  in BotLab as the strongest structural reference, but do not change the
  production strategy.

### Hypothesis 17 — regret-bounded deterministic mixture (inconclusive)

- `iter-37-regret-mix` takes the higher-scoring macro plan outside an 18-point
  regret band. Inside the band it chooses a deterministic 25–75% pressure mix
  keyed by replay state, turn, player, and legal attack signature. Immediate
  lethal is never mixed.
- Predeclared screen: 48 common seeds x three equal-deck cells x both candidate
  seats, seed `regret-mix-screen-v1`, with the same strict gates.
- It gained 0.35 percentage points and shortened games by 0.11 turns, but only
  added three direct selections across 288 candidate games. This validates the
  replay-safe variation mechanism, not a meaningful reduction in policy
  predictability. A future revisit needs decision-level plan telemetry and a
  scenario distribution rich in near-equal choices before confirmation.

## Current research conclusion

- Official rules and FAQ confirm that direct attacks remain legal while enemy
  Units exist, a Blocker is optional and used once per attack, damage reaches a
  Base before Shields, and excess AP does not spill from one Shield to another.
- Current player guidance consistently treats the decision as archetype- and
  state-dependent: aggro races; control removes Units; wide boards convert to
  Shield pressure; Base breaks should have follow-up; and expendable attackers
  should reveal hidden Burst information before key attackers commit.
- The production strategy context exposes board state and turn number but no
  deck/archetype or desired pace profile. The screens show that a universal
  aggression increase creates a direct win-rate versus duration tradeoff. The
  turn-plan screen and confirmation suggest that macro-plan evaluation is the
  best direction tested, but its current gain is too small for promotion. The
  next structural improvement should add decision-level plan telemetry and an
  explicit strategy profile (for example `competitive`, `tempo`, or `fast`)
  rather than weakening the sole canonical policy.
