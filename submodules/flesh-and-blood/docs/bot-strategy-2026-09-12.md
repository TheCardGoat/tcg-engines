# FAB bot strategy review and validation

Local investigation and implementation, 12 September 2026. These are engine and
automation changes; nothing was published or deployed.

## What changed

The default `hero-profile` policy dispatches to hero-specific score adjustments
over a shared line compiler. It previously ranked mostly individual commands.
Several basic evaluation errors could therefore outweigh a good hero plan.

| Area               | Change                                                                                                                                                  | Direct evidence                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Survival           | A partial block that leaves positive life outranks retaining a hand and dying. Hero bonuses cannot override that ordering.                              | At 5 life against 7 power, the bot blocks 3 and survives at 1.                                                                                  |
| Defense candidates | The default includes blocks of more than three cards. Ordinary sets are exhaustive; oversized hands receive a bounded selection including large blocks. | Four cards survive a 13-power attack at 2 life. A separate 16-card-hand case preserves a full-block option within the candidate budget.         |
| On-hit value       | Read the current triggered-ability resolution, including modal resolutions.                                                                             | The bot uses armor to deny Snatch's draw-on-hit.                                                                                                |
| Hand planning      | Compare attack orders and payment bundles, retain surplus resources, and keep hand and arsenal separate.                                                | The bot opens a go-again chain, pitches one blue, and the line deals 11 damage across three attacks. An arsenal blue cannot fund a hand attack. |
| Payment            | Value the retained line when choosing a pitch for an announced attack; exclude cards already pitched in the staged payment.                             | The attack-line test submits the bot's actual opening and payment commands. Unsupported estimates fall back to the existing scorer.             |
| Activations        | Reuse the authoritative activation quote rather than the permanent's printed play cost.                                                                 | Anka's attack costs 1 even though summoning the card costs 2; the bot activates it with 1 resource and deals 5.                                 |
| Arsenal            | Give unplayable Resource cards no arsenal value.                                                                                                        | The shared reserve and end-turn scorers stop treating pitch-only cards as future attacks.                                                       |
| Choices            | Expose alternatives for numeric, option, target, ordering, partition and group-choice decisions before scoring.                                         | Blaze can choose 3 energy to enable a 3-cost banished card, rather than receiving only the minimum candidate.                                   |
| Evaluation         | Record the actual policy ranking, allow complete frozen-policy overrides, and compare identical deals with the policies exchanging seats.               | The benchmark no longer invents value-extract scores for a policy that did not score its move.                                                  |

Source entrypoints:

- [Defense valuation](../packages/engine/src/automation/heuristic/defend.ts)
- [Hand planning](../packages/engine/src/automation/heuristic/hand-value.ts)
- [Command scoring](../packages/engine/src/automation/heuristic/line-compiler.ts)
- [Decision candidates](../packages/engine/src/rules/legal-commands/decision.ts)
- [Paired evaluation](../packages/engine/src/automation/bench/paired-evaluation.ts)

The hand estimator has a 2,048-state/transition budget. Combinatorial decision
alternatives are capped at 256, and defense combinations at 1,024. Explicit
effect-option lists, including card-name choices, remain complete. Large searches retain
deterministic alternatives rather than claiming exhaustive coverage. The
estimator does not simulate non-attack buffs, future draws, conditional go-again,
weapons, or every discard choice. It averages required discard alternatives.
Native rules still determine whether an action is legal.

## Evaluation method

The baseline is a frozen copy of the checkout taken before these edits, including
the unrelated changes already present on `feat/fab-ust-card-authoring` at
`65836e5947bdbfdc0fb60e0c6a530101ef76e5e9`. Both policies use the same current
engine and card library. The frozen policy keeps its own chooser, profile code,
and candidate generation.

Development mirror games were mixed. They are not combined with the final
comparison or presented as proof of a win-rate gain. The final comparison uses
two new seeds across four deck matchups, with the policies exchanging seats on
each identical deal: 16 games total. The starting seat and the deck assigned to
each seat stay fixed. Every accepted recorded command is checked for snapshot
serialization. Action caps, stalls and failures are unfinished results, never
counted as wins or draws.

Raw transcripts, the frozen source, runner and validation logs are retained
locally under `/tmp/fab-strategy-20260912`. That temporary snapshot is not a
committed release baseline. `runPairedFabEvaluation` is the reusable typed API
for subsequent comparisons against an explicitly supplied baseline policy.

## Results and validation

The paired comparison finished **8 candidate wins, 7 baseline wins, and 1
unfinished game**. This is a small, essentially even result; it does not establish
an overall win-rate improvement or stronger play against humans.

| Deck matchup         | Candidate wins | Baseline wins | Unfinished |
| -------------------- | -------------: | ------------: | ---------: |
| Rhinar / Aurora      |              1 |             2 |          1 |
| Gravy Bones / Kassai |              3 |             1 |          0 |
| Rhinar / Gravy Bones |              2 |             2 |          0 |
| Aurora / Kassai      |              2 |             2 |          0 |

All 15 completed games ended through life loss. No run ended in an illegal
command, engine exception or snapshot refusal. The unfinished game reached the
700-action cap because the frozen Aurora policy repeatedly activated and canceled
Lightning Greaves. Consulting the actual policy before auto-passing utility
windows exposed that old loop; it is not counted as a candidate win.

Observed chooser timing was 2.38 ms median / 13.05 ms p95 for the candidate and
2.78 ms / 13.92 ms for the baseline. These are local mixed-workload measurements,
not production latency guarantees. The seeds were `strategy-validation-503` and
`strategy-validation-816`.

The run preceded the last enumeration hardening: the oversized-hand defense
budget and preservation of explicit effect-option lists. The observed defending
hands required at most 10 candidates including all four armor slots and arsenal,
within the exhaustive defense range. Separate tests cover a 16-card hand and
card-name effects. This is a development comparison, not an exact release gate.

Validation:

- Engine type-check: passed, including the final decision changes.
- Complete engine suite: 4,186 passed, 4 expected failures, 1 skipped.
- Focused strategy/benchmark checks: 160 passed; subsequent oversized-hand and
  decision checks also passed.
- Final decision/stack/intent checks: 65 passed. Card-name interaction checks:
  21 passed across three suites.
- Submodule `vp run ci-check`: type checks passed; card tests reported 10,071
  passes and four failures. Those same four failures reproduced on the frozen
  pre-change source and in isolated current-source runs: Runechant of Lust,
  Runechant of Pride, Runechant of Wrath, and Shattering Grasp. The full workspace
  gate is therefore not green. The owning engine suite was run independently
  because the recursive gate stops when the cards package fails.

Local evidence is copied into
[`packages/engine/reports/bot-strategy-2026-09-12`](../packages/engine/reports/bot-strategy-2026-09-12/)
(an ignored report directory), including the paired results and baseline-failure
logs. Raw transcripts and the frozen baseline remain in the temporary directory
above. No browser or hosted validation was performed for these engine-only changes.

## Remaining strategy work

1. **Use bounded native-engine lookahead for complete lines.** Expand play,
   pitch, remaining attacks, reactions and arsenal together. Use hero profiles
   as preferences inside that search. Stop at unknown draws/random outcomes
   and evaluate expectations without inspecting hidden information. The current
   hand estimator is a useful intermediate step, not a complete turn simulator.
2. **Score the meaning of prompts.** More legal choices are now available, but
   many numeric, modal, ordering and target alternatives still tie under generic
   scoring. Evaluate the selected effect, its target and its cost; avoid a
   universal preference for the first option or a single target.
3. **Model the opponent using observable information.** Life, hand count,
   equipment, public graveyard/banished cards and previous plays should inform
   defense, race versus fatigue decisions, and when to preserve reactions.
   Opponent hidden cards and future deck order must stay unavailable to scoring.
4. **Measure practical mistakes alongside wins.** Track canceled/repeated
   actions, stranded arsenal cards, unused resources, missed survival blocks,
   preventable on-hits and damage converted per hand. These are useful indicators
   of human-like competence even when a small matchup sample is noisy.
5. **Promote changes through a larger opponent league.** Include multiple
   archetypes and policy styles, preserve held-out seeds, exchange seats/deals,
   and report unfinished games and uncertainty. A small win-rate difference in
   this prototype is insufficient evidence of stronger play against humans.
