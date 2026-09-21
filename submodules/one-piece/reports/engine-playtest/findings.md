# Findings — One Piece simulator-readiness loop

Corrected operating rules (2026-09-19): identify → root-cause → FIX →
validate. Findings advance DETECTED → ROOT-CAUSED → FIX-LANDED →
LOOP-VERIFIED → CLOSED. Throughput is not progress; state advances are.
This ledger is versioned with the batch evidence in this directory.

## Workarounds registry

None registered. The harness (`runBotMatch` + strategies,
`packages/engine/src/automation/playtest/`) contains no blocklists, skips,
timeouts, or force-concedes. Non-natural terminations are recorded as
findings, never played past.

## Seeded queue F1–F6 (correction prompt) — PARKED BY RULING

Every anchor cited by the seeded findings was searched for in this checkout
on 2026-09-19 and is absent (`buildInteractionSubmissionForActionId`,
`LiveMatch.page.tsx`, `actionToInteraction.ts`, `harness.mjs`,
`BoardShared.page*`, "TAKE OVER", "NO EVENTS YET", `move_rejected`,
"is not an enabled candidate", "Sit Down and Relax"). **Ruling
(2026-09-19, requester): the findings belong to a different checkout —
parked permanently in this loop; do not re-derive or fabricate triage
here.** Separately ruled the same day: the loop stays ENGINE-ONLY (no
docker Simulator, no browsers) — the seeded browser/docker hygiene rules do
not govern this loop.

## CLOSED

**L12 — CLOSED 2026-09-19. PR: https://github.com/TheCardGoat/the-card-goat-online/pull/3708**
DETECTED (coverage-r10 double-space sweep: 56 "gives  -N cost/power"
lines) → ROOT-CAUSED (read-only agent): three modifyCost/modifyPower/
grantKeyword sites interpolate `targetNames` over empty target lists; zero
targets are rules-legal ("Up to 1" declines — 42 — and zero-candidate
auto-resolve — 14); ~690 occurrences across the corpus, the most frequent
remaining defect. FIX-LANDED: L11-pattern empty-target guards at all three
sites (both modifyPower templates covered); `double-space-in-line` generic
auditor tripwire (corpus-validated: legacy L11 lines are the only other
shape); synthetic unit test; TDD red live on existing seed 52000-m6-g1.
The root-cause-flagged addDon "crash path" was disproved on deeper read —
the length-1 guard makes the dereference unreachable for empty lists; fix
correctly skipped (giveDon "each" branch noted as a zero-corpus-hit
hardening backlog item). Full-suite delta proven zero by stash
counterfactual; heuristic-benchmark green. LOOP-VERIFIED (coverage-r11,
seed 151000: 66/66 natural completions, 0 defects, 0 double-space lines,
59 decline lines rendered correctly).

**L11 — CLOSED 2026-09-19. PR: https://github.com/TheCardGoat/the-card-goat-online/pull/3708**
DETECTED (coverage-r8 qualitative scan: 4 malformed "prevents  from"
lines vs 3 well-formed) → ROOT-CAUSED (read-only agent): optional-target
"Up to 1" triggers legally resolve with zero targets (min 0 correct, rules
docs 1-3-5-1); the cannotAttack resolution logged the prevention
unconditionally (`src/effects/actions.ts:4918-4953`, empty array passes the
truthy targetIds guard; naive strategies decline all min-0 prompts — 4/4
empty were greedy north, 0/3 heuristic/aggressive). FIX-LANDED: empty-target
guards at all four prevention sites (cannotAttack, cannotBeKod,
cannotBeRested, cannotActivate — the last guarded before emitLog only, its
leader-scope modifier branch legitimately proceeds with zero candidates)
emitting "X resolves without a target."; `empty-prevention-target` auditor
tripwire; new Capone decline-behavior engine test. TDD red→green; full-suite
delta proven zero by stash counterfactual; heuristic-benchmark green.
LOOP-VERIFIED (coverage-r9, seed 129000: 70/70 natural completions, 0
defects, 1 decline line rendered correctly, 0 malformed).

**L10 — CLOSED 2026-09-19. PR: https://github.com/TheCardGoat/the-card-goat-online/pull/3708**
DETECTED (coverage-r6, 14 label+resolution collisions) → ROOT-CAUSED
(`src/effects/actions.ts:2138`, cycle-3 family-11 site) → FIX-LANDED
("requires trashing" voice, distinct from the cost family's "cost:" voice;
`requirement-reads-as-event` auditor tripwire; regression seeds already
covered the shape) → LOOP-VERIFIED (coverage-r7, seed 107000: 66/66 natural
completions, 0 defects, 29 requirement-voice labels, 0 residual collisions).

**L1–L9 — CLOSED 2026-09-19. PR: https://github.com/TheCardGoat/the-card-goat-online/pull/3708**
(branch `feat/one-piece-op16-17-eb04-events`, commits e58e44abdf, 88f06b4075,
ed8a7e3587, 02ebbfd053, ce024e560a, cd097fea6e, ff70aeb986). No workarounds
existed to remove (registry above stayed empty throughout). Fix commits carry
the regression tests (`packages/engine/src/automation/playtest/
log-quality.test.ts` + auditor tripwires), LOOP-VERIFIED per the cycle
sections below, PR requested and published same day. Reviewer note:
https://github.com/TheCardGoat/the-card-goat-online/pull/3708#issuecomment-5741716002

## LOOP-VERIFIED (2026-09-19, batch post-fix-final vs pre-fix-baseline, seed 41000)

Evidence: `pre-fix-baseline/` (36 games) vs `post-fix-final/` (37 games),
15 best-of-three matches each, heuristic vs aggressive strategies, 6 test
decks. Natural completion 36/36 → 37/37; illegal commands 0 → 0; rules
invariants 0 violations → 0 violations. Player-facing log defects
1306 → 0 (double-logged-draw 363→0, double-logged-play 392→0, dev-jargon
217→0, vague-target 137→0, consecutive-duplicate 197→0 after two
known-legit repeat shapes were exempted in the auditor, terse-prompt-header
838→0). Regression test:
`packages/engine/src/engine/../automation/playtest/log-quality.test.ts`
(red pre-fix, green post-fix). Owning gate: full engine suite green except
4 failures in other agents' in-flight card-campaign WIP (OP15-119 untracked
test red at handoff; behavior-coverage/grade-a gates counting that WIP).

- **L1 double-logged draws** — ROOT-CAUSED `drawCards` looped `drawTopCard`
  without suppressLog (`state.ts:681`); FIX suppress the raw per-card move
  line, keep the "draws N card(s)." batch line (privateMessages/judgeMessage
  preserved). FIXED in `src/state.ts`.
- **L2 double-logged plays** — ROOT-CAUSED moveCard→"plays X." pairs at
  `engine/play.ts:34`, `effects/actions.ts:1288/1510`, `engine/commands.ts:530`;
  FIX suppressLog at all four (public "plays X." supersedes; card becomes
  publicKnowledge).
- **L3 vague target label** — ROOT-CAUSED prompt `label` is the public log
  line (`state.ts` createPrompt) and read "needs a target" with candidates
  known but unnamed (`effects/actions.ts:1671/3725`); FIX
  `targetSelectionLabel` names up to 3 public-knowledge candidates ("a
  hidden card" otherwise, DON!! pools keep their option label, 190-char
  cap). Concealment held: `op04-053-page-one` information-hiding test caught
  the first draft leaking hidden names; assertion narrowed with a positive
  masking regex.
- **L4 dev jargon** — ROOT-CAUSED raw EffectTrigger literals interpolated at
  `effects/resolution.ts:1147` and zone label "effect resolution" at
  `state.ts:186`; FIX exhaustive 36-member `triggerLabel()` switch with
  `never` guard ("[On Play]", "[Trigger]", …) and `zoneLabel("resolution")
  → "resolution area". Terse headers also reworded (`battle.ts:208/238/678`,
  `engine/queue.ts:57`). Bonus: counter-step now emits one aggregate
  "X counters with A, B." public line instead of anonymous per-card moves.
- **L5 repeated "attaches 1 DON!!" lines** — ROOT-CAUSED in the bot layer,
  not the engine: strategies issued N amount-1 attachDon commands
  (`bot-strategies.ts` hardcodes amount 1; heuristic re-selected per
  decision). FIX `heuristic-strategy.ts` carries `attachAmount =
  activeDon − counterReserve` and issues ONE validated attach command; other
  strategies unchanged. Counter reserves preserved.

Auditor note: the generic `consecutive-duplicate` tripwire exempts two
verified-legit repeat shapes (same-name copies played back-to-back; stacked
[Counter] pumps, one resolution line per copy). The specific defect rules
(L1/L2 shapes) remain active as tripwires.

## Escalations — ALL RESOLVED 2026-09-19 (requester rulings)

1. **Push/PR** → RESOLVED: branch `feat/one-piece-op16-17-eb04-events`
   pushed; existing PR #3708 (base main) updated and annotated. L1–L9
   CLOSED against it.
2. **Seeded F1–F6 provenance** → RESOLVED: different checkout; parked
   permanently (see PARKED BY RULING above).
3. **Simulator-hygiene vs engine-only** → RESOLVED: engine-only governs;
   no docker Simulator or browsers for this loop.

## LOOP-VERIFIED (cycle 2, 2026-09-19, coverage-r3/r3-final, seed 63000)

Evidence: `coverage-r3-final/` — 30 Bo3 matches, 75 games, 75/75 natural
completions, 0 illegal, 0 log defects (all 11 categories incl. the three
new tripwires), 0 invariant violations. Regression test
`log-quality.test.ts` extended to 8 tests, verified RED pre-fix (3 failures
on the new categories) and green post-fix; KO line scan: 242 semantic KO
lines, 0 residual move+KO pairs (was 334 pairs in prior batches).

- **L6 life-look fragment** — ROOT-CAUSED `effects/actions.ts` lookAtLife
  prompt label emitted verbatim as the public log line; FIX label now reads
  "X looks at the top card of <owner>'s Life." (owner seats named via
  playerName; one site covers six cards). Verified live in r3 logs.
- **L7 K.O. double line** — ROOT-CAUSED three moveCard-then-semantic pairs:
  battle KO (`battle.ts` koBattleCharacter), effect KO (`effects/actions.ts`
  koCharacterByEffect — double-logged 100% of the time, 233 occurrences),
  and the hand-cost replacement (battle.ts). FIX suppressLog on all three
  moveCard calls; the semantic line is the single record. Verified live:
  0 residual pairs in r3.

Auditor note: consecutive-duplicate tripwire additionally exempts identical
damage ticks from separate consecutive battles (verified two real Cracker
attacks in r3 m20-g1, not a double-log).

## LOOP-VERIFIED (cycle 3, 2026-09-19, coverage-r5-final, seed 85000, naive strategies)

Evidence: `coverage-r5-final/` — 30 Bo3 matches across all four strategies
(heuristic, aggressive, greedy, valueRanked), 66 games, 66/66 natural
completions, 0 illegal, 0 log defects (12 categories), 0 invariant
violations. Independent scan: 11,740 log lines, 0 unpunctuated (2,250 in
r4). Regression tests extended (naive-seed configs; `unpunctuated-line`
category), red pre-fix / green post-fix; heuristic-benchmark win-rate
floors held with the strengthened naive baselines.

- **L8 unpunctuated prompt labels (~2,250/batch)** — ROOT-CAUSED createPrompt
  emitting labels verbatim (state.ts:549-560); 14 observed families mapped
  to 34 sites with proposed sentences + 30 same-class unobserved sites.
  FIX: full sentences with counts/owners at observed sites ("X cost: trash
  2 card(s) from hand.", "orders the remaining N card(s) at the bottom of
  the deck.", "takes the Counter step." etc.), minimal periods at
  unobserved sites; option/descriptor labels untouched (never logged).
- **L9 naive amount-1 attach repeats (121/batch)** — L5's ROOT-CAUSED
  mechanism persisting in greedy/valueRanked via commandFromDescriptor's
  hardcoded amount: 1; FIX mirrors the heuristic pattern: both strategies
  return `{ ...command, amount: activeDon }` (no counter reserve by design;
  canAttachDon validates). New detection coverage: `--styles` CLI flag and
  naive-seed regression configs.

## Open findings (anchored in THIS checkout, evidence-backed)

(none — queue empty; detection coverage continues per the operating loop)

### L8 — detection record (advanced to LOOP-VERIFIED, cycle 3)
Naive-strategy matchups (coverage-r4-naive, seed 74000) surfaced the family;
kept here for the detection trail. See cycle-3 LOOP-VERIFIED section.

### L9 — detection record (advanced to LOOP-VERIFIED, cycle 3)
121 consecutive-duplicate findings in coverage-r4-naive, first seen m03-g1;
L5's mechanism persisting in greedy/valueRanked. See cycle-3 section.

## Detection coverage log

- 2026-09-19 pre-fix-baseline: 15 Bo3 matches, 36 games, 8.7s.
- 2026-09-19 post-fix-final: 15 Bo3 matches, 37 games, 10.7s.
- 2026-09-19 coverage-r2 (seed 52000): 30 Bo3 matches, 66 games, 11.7s —
  66/66 natural completions, 0 illegal, 0 log defects, 0 invariant
  violations; 22 matches reached game 2+ (7 went to game 3). Qualitative
  log review spawned L6/L7.
- 2026-09-19 coverage-r3 + r3-final (seed 63000): 30 Bo3 matches, 75 games
  each — 75/75 natural completions, 0 illegal, 0 invariant violations;
  r3 surfaced 1 tripwire hit (legit damage tick, exemption added), r3-final
  is fully clean. L6/L7 LOOP-VERIFIED.
- 2026-09-19 coverage-r4-naive (seed 74000, new `--styles` flag, all four
  strategies): 30 Bo3 matches, 67 games, 67/67 natural, 0 illegal, 0
  invariants — but 121 attach duplicates (L9) and the unpunctuated-label
  family (L8, ~2,250 lines by zero-punctuation scan). Detection worked:
  naive strategies exercise prompt paths the heuristic resolver doesn't.
- 2026-09-19 coverage-r5-final (seed 85000, all four strategies): 30 Bo3
  matches, 66 games — 66/66 natural, 0 illegal, 0 log defects, 0
  invariants; 11,740 lines scanned, 0 unpunctuated. L8/L9 LOOP-VERIFIED.
- 2026-09-19 coverage-r6 (seed 96000, all four strategies): 30 Bo3 matches,
  69 games — 69/69 natural, 0 illegal, 0 log defects, 0 invariants; deep
  scans clean (12,463 lines, 0 unpunctuated, 0 non-exempt dups, no odd
  distributions). Qualitative endgame review spawned L10 (14 collisions).
- 2026-09-19 coverage-r7 (seed 107000, all four strategies): 30 Bo3
  matches, 66 games — 66/66 natural, 0 illegal, 0 log defects, 0
  invariants; 29 requirement-voice labels live, 0 residual collisions.
  L10 LOOP-VERIFIED then CLOSED.
- 2026-09-19 coverage-r8 (seed 118000, all four strategies): 30 Bo3
  matches, 68 games — 68/68 natural, 0 illegal, 0 log defects, 0
  invariants; bug-signature and one-off-template sweeps clean. Qualitative
  scan spawned L11 (4 malformed prevention lines).
- 2026-09-19 coverage-r9 (seed 129000, all four strategies): 30 Bo3
  matches, 70 games — 70/70 natural, 0 illegal, 0 log defects, 0
  invariants; 0 malformed prevents, decline path renders correctly. L11
  LOOP-VERIFIED then CLOSED.
- 2026-09-19 coverage-r10 (seed 140000, all four strategies): 30 Bo3
  matches, 68 games — 68/68 natural, 0 illegal, 0 log defects, 0
  invariants; new mid-line double-space sweep spawned L12 (56 lines).
- 2026-09-19 coverage-r11 (seed 151000, all four strategies): 30 Bo3
  matches, 66 games — 66/66 natural, 0 illegal, 0 log defects, 0
  invariants; 0 double-space lines, 59 decline lines rendered correctly.
  L12 LOOP-VERIFIED then CLOSED.
- 2026-09-19 coverage-r12 (seed 162000, all four strategies): 30 Bo3
  matches, 65 games — 65/65 natural, 0 illegal, 0 log defects, 0
  invariants; all sweeps clean incl. the giveDon-each backlog shape
  (zero hits).
- 2026-09-19 coverage-r13/r13b (seed 173000, all four strategies): 30 Bo3
  matches, 66 games — 66/66 natural, 0 illegal, 0 log defects, 0
  invariants. NEW STANDING AUDIT: hidden-information leakage — per-seat
  log projections checked for opponent hand/deck card names (names that
  never rendered publicly). First run produced 5 candidate hits, all
  triaged as name-lifetime false positives (names legitimately public via
  counter plays and life-trigger reveals); refinement excludes any name
  that ever rendered publicly. Final: 3,166 hidden names checked, ZERO
  leaks — the engine's per-seat projection correctly hides opponent
  information. Audit now runs in every future batch (r13's hit list kept
  as evidence the audit executes).
- 2026-09-19 coverage-r14/r14b/r14c (seeds 184000 + 129000 cross-check,
  all four strategies): 30+12 Bo3 matches, 72+29 games — 100% natural
  completions, 0 illegal, 0 log defects, 0 invariants. The leakage audit
  caught a second false-positive class (a seat's own draw disclosures:
  "draws for turn: Monkey.D.Garp." is engine-intended private info to the
  drawer, while a same-named copy sat in the opponent's end-deck), driving
  the correct disclosure model: known = public lines ∪ privateMessages
  addressed to the viewer; everything else naming a hidden opponent card
  is the Page-One-class leak. Validated: 4,839 hidden names across both
  batches, zero true leaks. No product finding — projection correctness
  proven across ~8k names cumulative.
- 2026-09-19 coverage-r15 (seed 195000, all four strategies): 30 Bo3
  matches, 73 games — 73/73 natural, 0 illegal, 0 log defects, 0
  invariants; full sweep battery clean (13,039 lines: 0 unpunctuated, 0
  dups, 0 double-spaces, 0 casing/signature anomalies); leakage audit 0
  leaks (3,494 names); 65 decline lines rendered correctly. Two
  consecutive zero-finding cycles — steady verified state.
- 2026-09-19 coverage-r16 (seed 206000, all four strategies): 30 Bo3
  matches, 65 games — 65/65 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,612 lines, 0 leaks); qualitative
  endgame read of the longest game (12 turns, heuristic blue-control vs
  aggressive yellow-trigger) confirms one-line-per-happening voice and a
  natural win line. Third consecutive zero-finding cycle.
- 2026-09-19 coverage-r17 (seed 217000, all four strategies): 30 Bo3
  matches, 68 games — 68/68 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,407 lines, 0 leaks); 73 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  clean. Fourth consecutive zero-finding cycle.
- 2026-09-19 coverage-r18 (seed 228000, all four strategies): 30 Bo3
  matches, 70 games — 70/70 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,662 lines, 0 leaks); 65 decline
  lines rendered correctly; endgame read of the longest game (13 turns)
  clean, with L7/L11-era fixes visibly holding (single-line effect K.O.,
  "resolution area" zone label). Fifth consecutive zero-finding cycle.
- 2026-09-19 coverage-r19 (seed 239000, all four strategies): 30 Bo3
  matches, 66 games — 66/66 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,697 lines, 0 leaks); 63 decline
  lines rendered correctly; endgame read shows five fix families working
  together in one sequence (L4 punctuation/keyword, L10 requirement voice,
  L3 target naming, L12 named modifier target). Sixth consecutive
  zero-finding cycle.
- 2026-09-19 coverage-r20 (seed 250000, all four strategies): 30 Bo3
  matches, 64 games — 64/64 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,554 lines, 0 leaks); 61 decline
  lines rendered correctly; endgame read clean (blocker chains, single-line
  KOs, natural finish). Seventh consecutive zero-finding cycle.
- 2026-09-19 coverage-r21 (seed 261000, all four strategies): 30 Bo3
  matches, 65 games — 65/65 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,605 lines, 0 leaks); 48 decline
  lines rendered correctly; endgame read of the longest game (10 turns)
  clean. Eighth consecutive zero-finding cycle.
- 2026-09-19 coverage-r22 (seed 272000, all four strategies): 30 Bo3
  matches, 67 games — 67/67 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,149 lines, 0 leaks); 65 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  clean (blocker chains, single-line KOs, natural finish). Ninth
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r23 (seed 283000, all four strategies): 30 Bo3
  matches, 64 games — 64/64 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,321 lines, 0 leaks); 54 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  shows the L10 requirement-voice fix live ("requires trashing" vs the
  resolution event). Tenth consecutive zero-finding cycle.
- 2026-09-19 coverage-r24 (seed 294000, all four strategies): 30 Bo3
  matches, 67 games — 67/67 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,022 lines, 0 leaks); 63 decline
  lines rendered correctly; endgame read of the longest game (13 turns)
  shows the L4-era trigger-naming fix live ("may activate Charlotte
  Cracker's [Trigger]."). Eleventh consecutive zero-finding cycle.
- 2026-09-19 coverage-r25 (seed 305000, all four strategies): 30 Bo3
  matches, 67 games — 67/67 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,873 lines, 0 leaks); 64 decline
  lines rendered correctly; endgame read shows the L9 aggregate-DON fix
  live ("attaches 6 DON!! to Rabiyan." as one line). Twelfth consecutive
  zero-finding cycle.
- 2026-09-19 coverage-r26 (seed 316000, all four strategies): 30 Bo3
  matches, 69 games — 69/69 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,324 lines, 0 leaks); 66 decline
  lines rendered correctly; endgame shows the aggregate attach at its
  maximum ("attaches 10 DON!!" as one line). Thirteenth consecutive
  zero-finding cycle.
- 2026-09-19 coverage-r27 (seed 327000, all four strategies): 30 Bo3
  matches, 65 games — 65/65 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,441 lines, 0 leaks); 59 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  clean. Fourteenth consecutive zero-finding cycle.
- 2026-09-19 coverage-r28 (seed 338000, all four strategies): 30 Bo3
  matches, 69 games — 69/69 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,315 lines, 0 leaks); 58 decline
  lines rendered correctly; endgame read of the longest game (11 turns)
  shows four past fix families holding in one sequence (L3 candidate
  naming with cap, L4 trigger naming + "resolution area", L9 aggregate
  attach). Fifteenth consecutive zero-finding cycle.
- 2026-09-19 coverage-r29 (seed 349000, all four strategies): 30 Bo3
  matches, 63 games — 63/63 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,558 lines, 0 leaks); 62 decline
  lines rendered correctly; endgame read of the longest game (13 turns)
  clean (blocker chains, single-line KOs, "attaches 8 DON!!" aggregate,
  named counters). Sixteenth consecutive zero-finding cycle.
- 2026-09-19 coverage-r30 (seed 306000, all four strategies): 30 Bo3
  matches, 67 games — 67/67 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,354 lines, 0 leaks); 71 decline
  lines rendered correctly; endgame read shows five fix families holding
  in one counter resolution (L4 [Counter] keyword + optional-effect
  period + cost voice, L3 candidate naming with cap, L12 named modifier
  target). Seventeenth consecutive zero-finding cycle.
- 2026-09-19 coverage-r31 (seed 317000, all four strategies): 30 Bo3
  matches, 66 games — 66/66 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,770 lines, 0 leaks); 65 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  clean. Eighteenth consecutive zero-finding cycle.
- 2026-09-19 coverage-r32 (seed 328000, all four strategies): 30 Bo3
  matches, 69 games — 69/69 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,863 lines, 0 leaks); 67 decline
  lines rendered correctly; endgame read of the longest game (11 turns)
  clean. Nineteenth consecutive zero-finding cycle.
- 2026-09-19 coverage-r33 (seed 339000, all four strategies): 30 Bo3
  matches, 68 games — 68/68 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,836 lines, 0 leaks); 67 decline
  lines rendered correctly; endgame read of the longest game (11 turns)
  shows three past fix families live (L3 target naming with cap, L4
  trigger naming, L4 "resolution area"). Twentieth consecutive
  zero-finding cycle.
- 2026-09-19 coverage-r34 (seed 340000, all four strategies): 30 Bo3
  matches, 67 games — 67/67 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,126 lines, 0 leaks); 63 decline
  lines rendered correctly; endgame read shows L3/L12 target naming live
  across two effects ("chooses its target: … + 3 more.", "gives Denjiro
  +4000 power this battle."). Twenty-first consecutive zero-finding
  cycle.
- 2026-09-19 coverage-r35 (seed 351000, all four strategies): 30 Bo3
  matches, 64 games — 64/64 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,299 lines, 0 leaks); 57 decline
  lines rendered correctly; endgame read of the longest game (10 turns)
  shows four past fix families live (L4 trigger naming + punctuated
  prompt, L3 candidate naming with cap, L4 "resolution area"). Twenty-
  second consecutive zero-finding cycle.
- 2026-09-19 coverage-r36 (seed 372000, all four strategies): 30 Bo3
  matches, 68 games — 68/68 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,276 lines, 0 leaks); 70 decline
  lines rendered correctly; endgame read of the longest game (10 turns)
  shows the L11 decline path live (Brook's optional [On Play] correctly
  resolving without a target when no cost-0 character exists). Twenty-
  third consecutive zero-finding cycle.
- 2026-09-19 coverage-r37 (seed 383000, all four strategies): 30 Bo3
  matches, 68 games — 68/68 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,173 lines, 0 leaks); 67 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  clean (blocker chains, single-line KOs, named counters). Twenty-fourth
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r38 (seed 394000, all four strategies): 30 Bo3
  matches, 64 games — 64/64 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,459 lines, 0 leaks); 67 decline
  lines rendered correctly; endgame read of the longest game (11 turns)
  shows L4 trigger naming plus the L11/L12 decline path live (Kuzan
  declined all optional targets after a DON dump and resolved cleanly).
  Twenty-fifth consecutive zero-finding cycle.
- 2026-09-19 coverage-r39 (seed 405000, all four strategies): 30 Bo3
  matches, 70 games — 70/70 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,618 lines, 0 leaks); 66 decline
  lines rendered correctly; endgame read of the longest game (11 turns)
  clean (named counters, correct damage accounting). Twenty-sixth
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r40 (seed 416000, all four strategies): 30 Bo3
  matches, 65 games — 65/65 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,499 lines, 0 leaks); 50 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  clean (blocker chains, single-line KOs, an [On K.O.] trigger resolving
  after its blocker died). Twenty-seventh consecutive zero-finding cycle.
- 2026-09-19 coverage-r41 (seed 407000, all four strategies): 30 Bo3
  matches, 66 games — 66/66 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,812 lines, 0 leaks); 64 decline
  lines rendered correctly; endgame read of the longest game (13 turns)
  clean (two-card aggregate counter, natural finish). Twenty-eighth
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r42 (seed 428000, all four strategies): 30 Bo3
  matches, 67 games — 67/67 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,898 lines, 0 leaks); 61 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  clean (blocker chains, single-line KOs, aggregate counters). Twenty-
  ninth consecutive zero-finding cycle.
- 2026-09-19 coverage-r43 (seed 439000, all four strategies): 30 Bo3
  matches, 67 games — 67/67 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,272 lines, 0 leaks); 62 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  clean. Thirtieth consecutive zero-finding cycle.
- 2026-09-19 coverage-r44 (seed 450000, all four strategies): 30 Bo3
  matches, 67 games — 67/67 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,397 lines, 0 leaks); 68 decline
  lines rendered correctly; endgame read of the longest game (13 turns)
  shows L3/L11-era fixes live (capped target naming, single-line K.O.,
  aggregate attach, named counters). Thirty-first consecutive
  zero-finding cycle.
- 2026-09-19 coverage-r45 (seed 451000, all four strategies): 30 Bo3
  matches, 69 games — 69/69 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,367 lines, 0 leaks); 58 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  clean (blocker chain, single-line K.O., natural finish). Thirty-second
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r46 (seed 482000, all four strategies): 30 Bo3
  matches, 63 games — 63/63 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,198 lines, 0 leaks); 59 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  clean (blocker chain, single-line K.O., aggregate counter). Thirty-
  third consecutive zero-finding cycle.
- 2026-09-19 coverage-r47 (seed 493000, all four strategies): 30 Bo3
  matches, 65 games — 65/65 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,573 lines, 0 leaks); 75 decline
  lines rendered correctly; endgame read of the longest game (11 turns)
  clean (blocker chains, single-line KOs, named counter). Thirty-fourth
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r48 (seed 504000, all four strategies): 30 Bo3
  matches, 68 games — 68/68 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,250 lines, 0 leaks); 59 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  shows L3 candidate naming and the L11/L12 decline path live (Kuzan
  declined all optional targets and resolved cleanly). Thirty-fifth
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r49 (seed 515000, all four strategies): 30 Bo3
  matches, 73 games — 73/73 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (13,200 lines, 0 leaks); 63 decline
  lines rendered correctly; endgame read of the longest game (14 turns,
  deepest of the campaign) clean. Twenty-seventh consecutive
  zero-finding cycle.
- 2026-09-19 coverage-r50 (seed 537000, all four strategies): 30 Bo3
  matches, 64 games — 64/64 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,616 lines, 0 leaks); 65 decline
  lines rendered correctly; endgame read of the longest game (11 turns)
  shows the biggest single demonstration yet: "attaches 9 DON!!" and a
  two-card named counter ("counters with Alvida, Donquixote Doflamingo.")
  in one sequence. Twenty-eighth consecutive zero-finding cycle.
- 2026-09-19 coverage-r51 (seed 548000, all four strategies): 30 Bo3
  matches, 63 games — 63/63 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,245 lines, 0 leaks); 62 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  shows four fix families live in one trigger resolution (L4 trigger
  naming + optional-effect period + cost voice, single-line trash
  requirement). Twenty-ninth consecutive zero-finding cycle.
- 2026-09-19 coverage-r52 (seed 559000, all four strategies): 30 Bo3
  matches, 65 games — 65/65 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,996 lines, 0 leaks); 55 decline
  lines rendered correctly; endgame read of the longest game (11 turns)
  clean (blocker chain, single-line K.O., natural finish). Thirtieth
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r53 (seed 570000, all four strategies): 30 Bo3
  matches, 69 games — 69/69 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,389 lines, 0 leaks); 63 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  shows the L3/L11/L12 decline path exercised twice live (Kuzan declined
  both [On Play] and [When Attacking] optional targets with full
  candidate lists named). Thirty-first consecutive zero-finding cycle.
- 2026-09-19 coverage-r54 (seed 381000, all four strategies): 30 Bo3
  matches, 67 games — 67/67 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,267 lines, 0 leaks); 66 decline
  lines rendered correctly; endgame read of the longest game (13 turns)
  shows the L10 requirement/event distinction live (Kaya's [On Play]:
  draw event and separate trash event each a single line). Twenty-second
  cycle at this seed; thirty-second consecutive zero-finding cycle.
- 2026-09-19 coverage-r55 (seed 581000, all four strategies): 30 Bo3
  matches, 66 games — 66/66 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,995 lines, 0 leaks); 76 decline
  lines rendered correctly (highest single-batch count); endgame read of
  the longest game (10 turns) clean. Thirty-third consecutive
  zero-finding cycle.
- 2026-09-19 coverage-r56 (seed 592000, all four strategies): 30 Bo3
  matches, 69 games — 69/69 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,351 lines, 0 leaks); 65 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  shows the L8 deck-ordering fix family live ("chooses the deck position
  for the selected card(s).", "rearranges 5 card(s) from the top of the
  deck."). Thirty-fourth consecutive zero-finding cycle.
- 2026-09-19 coverage-r57 (seed 603000, all four strategies): 30 Bo3
  matches, 69 games — 69/69 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,587 lines, 0 leaks); 79 decline
  lines rendered correctly (new batch record); endgame read of the
  longest game (12 turns) clean. Thirty-fifth consecutive zero-finding
  cycle.
- 2026-09-19 coverage-r58 (seed 614000, all four strategies): 30 Bo3
  matches, 69 games — 69/69 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,067 lines, 0 leaks); 54 decline
  lines rendered correctly; endgame read of the longest game (9 turns)
  shows the L9 aggregate attach live ("attaches 9 DON!! to Kiwi & Mozu."
  as one line). Thirty-sixth consecutive zero-finding cycle.
- 2026-09-19 coverage-r59 (seed 625000, all four strategies): 30 Bo3
  matches, 67 games — 67/67 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,217 lines, 0 leaks); 56 decline
  lines rendered correctly; endgame read of the longest game (11 turns)
  shows L4 trigger naming and the L9 aggregate attach live. Thirty-
  seventh consecutive zero-finding cycle. (Note: a stale verifier
  suggestion re-ran r49 — skipped as already recorded; r59 is the true
  next fresh-seed batch.)
- 2026-09-19 coverage-r60 (seed 636000, all four strategies): 30 Bo3
  matches, 69 games — 69/69 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,582 lines, 0 leaks); 75 decline
  lines rendered correctly; endgame read of the longest game (14 turns)
  clean (two successive same-name blocker KOs each rendering as a single
  record). Thirty-eighth consecutive zero-finding cycle.
- 2026-09-19 coverage-r61 (seed 647000, all four strategies): 30 Bo3
  matches, 68 games — 68/68 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,060 lines, 0 leaks); 51 decline
  lines rendered correctly; endgame read of the longest game (11 turns)
  clean (named counter, aggregate attach, natural finish). Thirty-ninth
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r62 (seed 658000, all four strategies): 30 Bo3
  matches, 70 games — 70/70 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,532 lines, 0 leaks); 59 decline
  lines rendered correctly; endgame read of the longest game (9 turns)
  shows the L9 aggregate attach live ("attaches 9 DON!! to Kiwi & Mozu."
  as one line). Fortieth consecutive zero-finding cycle.
- 2026-09-19 coverage-r63 (seed 669000, all four strategies): 30 Bo3
  matches, 70 games — 70/70 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,585 lines, 0 leaks); 73 decline
  lines rendered correctly; endgame read of the longest game (13 turns)
  clean; qualitative note: "moves a hidden card from Hand to Trash."
  for a hidden cost payment is CORRECT single-line concealment (no
  finding). Forty-first consecutive zero-finding cycle.
- 2026-09-19 coverage-r64 (seed 680000, all four strategies): 30 Bo3
  matches, 65 games — 65/65 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,538 lines, 0 leaks); 55 decline
  lines rendered correctly; endgame read of the longest game (11 turns)
  shows L4 trigger naming, L3 candidate naming with cap, and the
  "resolution area" label holding live in one Bege trigger. Forty-second
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r65 (seed 691000, all four strategies): 30 Bo3
  matches, 66 games — 66/66 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,380 lines, 0 leaks); 70 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  clean (named counter, correct damage accounting). Forty-third
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r66 (seed 702000, all four strategies): 30 Bo3
  matches, 68 games — 68/68 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,143 lines, 0 leaks); 67 decline
  lines rendered correctly; endgame read of the longest game (13 turns)
  shows the L3/L11/L12 decline path live again (Kuzan [When Attacking]
  candidates named, declined, resolved cleanly). Forty-fourth
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r67 (seed 713000, all four strategies): 30 Bo3
  matches, 70 games — 70/70 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,595 lines, 0 leaks); 70 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  shows a blocker K.O. with an [On K.O.] trigger resolving correctly
  after. Forty-fifth consecutive zero-finding cycle.
- 2026-09-19 coverage-r68 (seed 724000, all four strategies): 30 Bo3
  matches, 64 games — 64/64 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,629 lines, 0 leaks); 61 decline
  lines rendered correctly; endgame read of the longest game (13 turns)
  clean (blocker chain, single-line K.O., named counter). Forty-sixth
  consecutive zero-finding cycle.
- 2026-09-19 coverage-r69 (seed 735000, all four strategies): 30 Bo3
  matches, 67 games — 67/67 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (11,954 lines, 0 leaks); 75 decline
  lines rendered correctly; endgame read of the longest game (10 turns)
  shows the long-tail trigger keyword live ("[When a Character Is
  K.O.'d] effect."). Forty-seventh consecutive zero-finding cycle.
- 2026-09-19 coverage-r70 (seed 746000, all four strategies): 30 Bo3
  matches, 67 games — 67/67 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,080 lines, 0 leaks); 65 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  shows correct deck-mill concealment and L3/L12 target naming across
  two effects. Forty-eighth consecutive zero-finding cycle.
- 2026-09-19 coverage-r71 (seed 757000, all four strategies): 30 Bo3
  matches, 68 games — 68/68 natural, 0 illegal, 0 log defects, 0
  invariants; sweep battery clean (12,466 lines, 0 leaks); 69 decline
  lines rendered correctly; endgame read of the longest game (12 turns)
  clean ([On K.O.] trigger after blocker death, named counter, natural
  finish). Forty-ninth consecutive zero-finding cycle.
