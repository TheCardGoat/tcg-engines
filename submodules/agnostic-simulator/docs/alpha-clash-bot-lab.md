# Alpha Clash bot lab

The lab registers Alpha Clash and stores nine published deck lists: the eight
links from the Season 3 recap and the existing Makati winner. It checks
executable card coverage, schedules paired mirrors and cross matches, and runs
the practice policy through `applyCommand`.
It records termination, actions, turns, illegal proposals, and a deterministic
state hash. The calibration candidate compares the same policy against itself;
it does not claim trained improvement and cannot be promoted.

## Decks

| Lab ID | Contender | Main / side | Result |
| --- | --- | --- | --- |
| `clarity-hyper-aggro` | Clarity, Ready for Trials | 50 / 10 | shane, 1st, Online League Season 3 |
| `absence-makati` | The Absence, Voice of the Void | 60 / 15 | Edison Curameng, 1st, Clashground Makati |

Clarity: [published list](https://www.deckplanet.net/alpha_clash/deck/0162d182-517c-4bdf-97a2-69c8e3520301),
[official result](https://alphaclashtcg.com/news/alpha-clash-online-league-season3-recap).
Absence: [published list](https://www.deckplanet.net/alpha_clash/deck/45fd8407-7912-4fbc-b900-6bb2dbb06216),
[official result](https://alphaclashtcg.com/news/tvg476vnbr9u595ldw7z0y1vfr63px).

### Season 3 import, 11 October 2026

The [official recap](https://alphaclashtcg.com/news/alpha-clash-online-league-season3-recap)
links eight lists for seven players; silou has two. Shane's link was already
stored as `clarity-hyper-aggro`. The other seven were added without replacing
cards or changing quantities. All decks retain Contender, main, sideboard,
source URL, and article result. Imported lists also record the retrieval date,
source update timestamp when available, and source limits.

| Lab ID | Main / side | Admission at import |
| --- | --- | --- |
| `season3-undefendable-clarity` | 51 / 11 | Ready; recovered from cached page |
| `season3-fexar-clarity` | 50 / 10 | Ready |
| `season3-xiii-war` | 60 / 0 | Blocked: missing or unparsed main cards |
| `season3-sloppy-valen` | 50 / 0 | Blocked: missing Contender and missing or unparsed main cards |
| `season3-silou-death` | 56 / 9 | Blocked: missing or unparsed main cards |
| `season3-silou-clarity` | 54 / 10 | Blocked: missing main cards; sideboard debt also reported |
| `season3-avalogaming-kilimanjaro` | 54 / 15 | Blocked: missing Contender and main cards |

The source pages are mutable. Live lists had updates after the league ended.
XIII's link now shows a War list titled **7th Place Progenitor's Gambit: USA
(R. Acosta)**, updated 10 October 2026. This entry preserves the current linked
page; it is not proof of XIII's original Season 3 submission. The other live
imports are also linked-page snapshots, not verified historical submissions.

Undefendable's original `op-deckplanet.com` host returns
`DEPLOYMENT_NOT_FOUND`. Its deck ID is inaccessible on `www.deckplanet.net`.
The cached page (reported crawl: September 2026) preserves the Clarity
Contender, 51 main cards, and 11 sideboard cards. Its image printing numbers
and quantities were mapped to catalog names, including the explicit Zhao Li
spelling alias. No quantities were inferred or replaced.

The `season3` suite uses all admitted lists from the recap, including Shane's
existing list. At import this gives three decks, six pairs, and 18 games per
paired block. It includes each mirror and each cross match. Blocked lists stay
in the catalog and `doctor` reports their card debt. Practice offers only ready
lists. The existing `meta` and `smoke` suites keep their original three pairs;
no saved evaluation results are extended to the new lists.

To evaluate these lists, use
`tools/bot-lab/examples/alpha-clash-season3-calibration-plan.json` when running
`train`, then pass the generated manifest to `evaluate`. `doctor` reports failure while
catalog entries have main-deck blockers; this does not stop admitted lists
from running. Matches still exclude sideboards.

Import validation: all eight snapshots match the stored Contender and exact
main/side rows. The 13 focused practice-deck tests and 16 focused lab tests pass.
The adapter type check and changed-source checks pass. A native match between
the two newly admitted Clarity lists ends with a rules win and zero rejected
commands. This does not verify blocked lists, hosted matches, or deployment.

These are August 2026 baselines. The September Nexus of Power release and
[LINN errata](https://alphaclashtcg.com/news/nexus-of-power-release-week)
postdate the lists. Preserve the published quantities and implement current
official behavior before interpreting match results. No card replacements,
preview Contender substitutions, or runtime text parsing are allowed.

## Season 3 card support, 12 October 2026

All 19 card behavior blockers in the five imported lists are implemented.
No card quantities or source lists were changed. The implementation includes
both Contenders, Clarity's Suite, Clarity's two Clash cards, Cleansing Whirlwind
Kick, Life From Ashes, Zephyrion, Chains of Dominion, Chaos Ensues, War's
Gauntlets, Modern Bardaga, Bloodlust Commander, The Beginning of the End,
Consuming Fire, Queen of the Dark, Anzudak, Endless Cycle, and Danger Detected.

Printed corrections use the publisher-linked card faces. They fill missing
Harbinger affiliations and Contender health values, fix Vault colored costs,
and classify The Beginning of the End as a Clashground. Zephyrion and Endless
Cycle have supplemental printed records because they are absent from TCGCSV.
Generated identities and the registry were regenerated. Hand-authored behavior
remains in the card modules.

The bounded engine extensions cover per-card draw payments, Draw Step
replacements, additional token creation, named Weapon slots, Wrath, Manifest,
extra turns, and Contender health comparisons. The heuristic now proposes all
four targets for Endless Cycle and its full Manifest payment.

All five formerly blocked lists now run from both seats against Clarity Hyper
Aggro. The exact published Kilimanjaro snapshot has a construction conflict: Endless Cycle is
restricted to a Progenitor or Rogue Contender, and Kilimanjaro is Alpha
(rule 100.2g). Its two copies are preserved. Bot lab and practice check
executable card support and valid data, not constructed deck rules. Engine
creation also supports casual lists. Deck size, copy limits, and Contender
restrictions are checked by `validateDeckForFormat` at format admission.
Unknown cards, missing Contenders, malformed quantities, and unparsed main-deck
behavior still block the appropriate execution boundary.

The `season3` suite now has eight admitted recap lists, 36 pairs, and 128 games
per paired block. The original `meta` and `smoke` pairs remain unchanged.

The [native acceptance records](../tools/bot-lab/reports/alpha-clash/2026-10-12/season3-card-support.json)
record the source revision, catalog hash, deck audits, terminal matches, and
exact replay checks. These are local native-engine checks. They do not prove
hosted transport, browser prompts, persistence, deployment, or tournament
strength. The source snapshot limits above still apply.

Validation: 39 focused Season 3 behavior tests and 54 importer tests pass.
The construction-policy change passes 37 deck/lifecycle adapter tests, 19
bot-lab adapter tests, and four local-practice setup tests. Card catalog, manifest,
authoring, and affected package type checks pass. The full engine run has
6,492 passing tests and the same 33 failures as the pre-change run; comparing
failure names found no new failures. Changed engine source checks report no
errors and two existing spread warnings in defeat handling.

## Engine support, 2026-10-06

The two original lists pass admission, including all sideboard cards. No substitutes
or runtime text parsing are used. The loader has one explicit identity alias:
Zhao Li's published `Reconnaissance` spelling maps to the printed
`Reconaissance` record.

The card work implements the missing Contenders, Clash cards, Actions, Traps,
and Clashgrounds. It also completes the affected existing cards, including
LINN, Morac, Zhao Li, Death, Overseer, Trugg, and Webber's Binoculars. Printed
metadata is separate from behavior. Marcus uses the verified PG-003 card face.
Bombardment is an Action. Colorless cards and cards without an affiliation
symbol now import correctly.

Rules work uses the publisher's
[v8 rulebook](https://alphaclashtcg.com/s/Alpha_Clash_TCG_Comprehensive-Rulebook-80.pdf)
and [official errata](https://alphaclashtcg.com/banerrata). The local
Alpha Clash rules skill now contains v8.0 (refreshed October 8, 2026), including
Appendix B errata and a source review of unresolved rule conflicts.

The engine now handles declared and resolution-time targets, multi-card
choices, Foretell order, Oblivion retrieval with ownership retained, Void
ordering, Banish replacement effects, additional discards, health and
sacrifice payments, compulsory attacks, and the affected static abilities.
Turn-start choices resolve before Ready and Draw. End-of-turn choices resolve
before the next turn starts. Challenge means clash damage to an opposing
Contender. Trigger queues contain serializable data so checkpoints and copied
legality checks do not retain functions bound to another match.

Validation: 1,561 engine tests pass, including 43 focused meta-deck tests.
Printed catalog, card manifest, authoring hygiene, and package type checks pass.
The importer has 21 passing tests; the server adapter has 19; the focused lab
suite has 16. The shared evaluation gate has a regression test for a zero
regression limit: a neutral cell is allowed, and an actual loss is rejected.
These checks establish the tested behavior; they do not prove every interaction
in the full Alpha Clash catalog.

## Lab policies and results

`meta-v1` attacks before playing cards. `meta-v2` first builds its board and
attaches Weapons. Both policies use the public command boundary and copied
state for legality checks. They handle optional choices, declared targets,
Traps, Ambush, health payments, sacrifice payments, and Void replays.
`meta-v3` uses play-first order only with a Contender that has a Void replay
ability. `practice-v1` remains available as the legacy simulator policy.

The supported overrides are `playBeforeAttack`,
`playBeforeAttackWithVoidReplay`, `acceptOptionalTriggers`, and
`keepClashWeight` (0–20). The final plan compares `meta-v3` with `meta-v1`,
using the same resource preference to isolate play order. `train` writes a current manifest; it does not
optimize the policy. These are laboratory policies marked oracle, with no
production promotion target.

The saved calibration compares `meta-v1` with itself on eight games. The
iteration uses separate seeds and 12 paired blocks across both mirrors and
the cross match. Results and replay verification are recorded beside the
manifests in `tools/bot-lab/reports/alpha-clash/2026-10-06/`.

| Run | Games | Candidate wins | Hard failures | Result |
| --- | --- | --- | --- | --- |
| Calibration, meta-v1 vs itself | 8 | 5 | 0 | No improvement claim |
| meta-v2 vs meta-v1 | 16 | 10 | 0 | Rejected: cross matchup fell 12.5 percentage points |
| meta-v3 vs meta-v1 | 32 | 20 | 0 | Rejected: confidence interval includes zero |

All 56 saved games ended with rules wins and zero rejected commands in the
actual match. Every saved record reproduced exactly, including its final state
hash. `replay-verification.json` records the results. The v2 report retains its
historical policy revision; the calibration and v3 reports match the final
revision. Legality probes can fail on copied state; these do not change
the match. The final candidate's mean paired gain was 16.7 percentage points,
with a 95% bootstrap interval of 0–33.3 points. This sample does not prove an
improvement. The default remains `meta-v1`. The rejected candidates and their
reports stay available for further tests. These results apply to the saved
seeds and selected main decks.


The lists are August 2026 event baselines, evaluated with current behavior.
They do not establish the complete October metagame. Sideboards are preserved
and tested, but the lab does not sideboard between games.

## Run and iterate

Run these commands from `submodules/agnostic-simulator/tools/bot-lab`:

```sh
bun src/cli.ts doctor --game alpha-clash
bun src/cli.ts train --game alpha-clash \
  --manifest examples/alpha-clash-iteration-plan.json \
  --out /tmp/alpha-clash-candidate.json
bun src/cli.ts evaluate --game alpha-clash \
  --candidate /tmp/alpha-clash-candidate.json \
  --out /tmp/alpha-clash-report.json
bun src/cli.ts replay --game alpha-clash \
  --report reports/alpha-clash/2026-10-06/iteration-report.json \
  --match clarity-mirror/block-0/a-seat-1
```

Use new seeds after tuning. Compare each matchup, command failures, and replay
hashes. A `promote` report verdict means the lab's statistical gate passed.
It does not deploy the candidate or change the simulator bot.

## Log audit, 7 October 2026

Run `pnpm audit:alpha-clash` from the bot-lab directory to record two seeded
Clarity–Absence games with swapped seats. The script saves each accepted
command, state before the next command, new logs, and effective board stats.
It then replays and compares every frame and the final result. Cost and damage
checks use a separate bounded calculation rather than engine evaluators.

The [audit review](../tools/bot-lab/reports/alpha-clash/2026-10-07/log-audit/review.md)
records the repairs, rule references, coverage, and limits. This audit fixed
Damage-Step cleanup, Defeat zone timing, simultaneous trigger order, a Clarity
health-threshold check, and repeated log events.

Full rules readiness remains unconfirmed. General triggered-effect response
priority and player-selected ordering within same-player trigger batches still
need engine work. Two main-deck games do not cover all effects or sideboards.
Older benchmark reports remain historical; regenerate candidates after these
engine changes.

## Expert oracle, 12 October 2026

`expert-oracle` is an engine-owned turn planner shared by local practice and bot
lab. Both it and the unchanged `meta-v1` comparison policy receive full native
private state by design. Player and spectator projections remain filtered.

Expert simulates native commands on isolated copies, keeps a beam of promising
lines, estimates opposing replies, and commits one command before planning again.
The default limits are 768 command attempts, five beam lines, twelve decision
layers, and four final reply lines. Forced actions do not consume a decision
layer. Each state probes up to 96 proposals and keeps up to 24 distinct accepted
outcomes. Target combinations, ordering, allocations, and payment variants are
bounded; the search does not enumerate every possible line.

The evaluator scores health and lethal risk, Clash material and readiness,
resources and hand colors, hand quality, known upcoming draws, and board presence.
It uses the native engine for effects, combat, restrictions and payment. Candidate
generation includes resource choices, attack order, multiple obstructors, responses,
Clash Buff windows, modes, X payments, Manifest, alternative costs, activated
abilities, target groups, and explicit resource payment variants. Opening hands
retain the keep policy. Per-turn live history prevents activation/decline loops.

Adapter revision 4 pairs native shuffles: it removes the final `-seat-1` or
`-seat-2` suffix from a scheduled seed before shuffling. The journal keeps the
original leg identity. This compares swapped policies with the same physical
decks and shuffle; cross matches also reverse deck assignments. Earlier adapter
reports retain their recorded revision and seed behavior.

The full comparison uses all eight Season 3 decks, all 36 matchup pairs, and
three fresh seed blocks: 384 games. Exact lists, construction-invalid casual
admission, and no sideboarding are retained. Run and review artifacts are in
[`season3-expert`](../tools/bot-lab/reports/alpha-clash/2026-10-12/season3-expert/).
The final [review](../tools/bot-lab/reports/alpha-clash/2026-10-12/season3-expert/review.md)
records outcomes, per-deck results, uncertainty, diagnostics and replay checks.
The recommended practice strategy remains `meta-v1`; adding this selectable bot
and running a comparison does not change the default.

## Expert v2 mirror repair, 12 October 2026

War and Valen loss traces exposed incomplete combat evaluation, repeated legality
probes, uneven attacker coverage, skipped early resources, and next-turn replies
that paid costs without resolving their effects. Expert strategy version 2 filters
proposals by timing and source zone, resumes partial probe lists, gives each
attacker a place in the search, resolves forced replies on their simulated turn,
and values the early resource curve. The 768-node budget is unchanged.

The [investigation](../tools/bot-lab/reports/alpha-clash/2026-10-12/season3-expert-v2/investigation/review.md)
includes exact native traces and three regression positions rebuilt through
accepted commands from setup. On the original diagnostic seeds, War improved
from 2/6 to 5/6 mirror wins and Valen from 3/6 to 4/6. Those seeds were used for
development and are excluded from the fresh evaluation.

The v2 [comparison report](../tools/bot-lab/reports/alpha-clash/2026-10-12/season3-expert-v2/review.md)
uses 384 games with a fresh seed base and adds 48 archived v1 mirror controls on
the same shuffles. The frozen v1 policy is retained with the investigation; two
original match records verify it before the controls run. The v1 report remains
historical. Neither version changes the recommended practice strategy.

The fresh v2 suite finished at 347/384 wins (90.4%) against `meta-v1`. On the
same 48 fresh mirrors, v2 won 39 and archived v1 won 36; that difference remains
uncertain. A separate, fixed ten-block check for each target deck gave War
18/20 versus v1's 15/20 and Valen 13/20 versus v1's 11/20. All 512 evaluation,
control, and supplemental games ended normally, with no rejected committed
commands. Ten sampled fresh records replayed exactly. The report keeps these
samples separate and records the remaining search and validation limits.
