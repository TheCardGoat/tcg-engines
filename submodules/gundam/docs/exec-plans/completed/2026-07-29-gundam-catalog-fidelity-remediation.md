# Gundam Catalog Fidelity Remediation

**Status**: complete
**Owner**: Codex coordinator
**Started**: 2026-07-29
**Baseline source**: `docs/card-audit/remediation-baseline.json`

## Goal

Systematically prove that every officially catalogued Gundam card is represented
by correct runtime behavior. The frozen starting denominator is **144
parser/runtime mismatches** and **272 behavioral-review entries**, while
printing parity remains **1,777/1,777**. A card may leave either queue only
through an explicit, reviewable card-level record—not because of a set-level
classification, a parser exception, or a setup-only test.

## Scope

- In scope: official-source normalization, general parser grammar, card runtime
  definitions, Gundam engine primitives, public `GundamTestEngine` behavior
  fixtures, audit logic, and per-card remediation ledger records.
- In scope: the 144 fidelity cards and all 272 behavioral records frozen in the
  baseline, including their overlap.
- Out of scope: treating alternate printing aliases as new canonical runtime
  cards; compatibility shims that preserve an incorrect effect; certification by
  `verifiedSets`, exact card-number/text parser overrides, or an allowlist.
- Out of scope: unrelated card refactors, simulator redesign, and publishing a
  PR before the requested final verification.

## Invariants and evidence model

1. `remediation-baseline.json` is immutable for this effort. It supplies the
   original denominators and card lists; current audit results are progress,
   never a replacement baseline.
2. `remediation-ledger.json` has exactly one entry per card number. Each entry
   records its queue membership, disposition, implementation/test paths,
   focused evidence, and a concise explanation of why the printed behavior is
   now covered.
3. Permitted fidelity dispositions are `parser-bug`, `runtime-bug`,
   `audit-normalization`, and `needs-rules-engine-decision`. The last remains
   open until a rules/engine decision produces public behavior proof.
4. Every card with an ability receives one public `GundamTestEngine` sequence
   for each printed timing or clause. It must cover its observable resolution
   plus one meaningful negative applicable to its contract (timing, cost,
   choice, target, owner, condition, or no-legal-target gate).
5. Tests use only public player moves, public prompts, and player-visible
   queries. They do not inspect raw runtime state, ordered Deck identities, or
   face-down Shield identities.
6. Parser grammar tests state the reusable language pattern. A test may use a
   representative card phrase, but implementation may not branch by card
   number, name, or full printed-text lookup.
7. Preserve staged resolution (for example `resolveThenQueue`) until public
   proof establishes that no later candidate set or controller handoff changes.

## Workstreams

### 0. Ledger integrity preflight

Before any queue reduction, reconcile the current duplicate ledger records.
The initial inspection found 265 entries for 261 distinct card numbers. Merge
each duplicate into one card-level record without dropping evidence, reject
future duplicates in the audit, and confirm every one of the 144/272 baseline
cards has the required fields before starting A1 or B1. This is a correctness
repair, not a queue closure.

### A. Fidelity: 144 parser/runtime mismatches

Process the frozen mismatch list in semantic waves, not by convenient file
order. For every card, write a brief printed contract before editing: timing,
activation condition, cost, deciding player, target/filter, effect, duration,
and source destination.

| Wave | Family                              | Baseline cards | Execution rule                                                                                                                                             |
| ---- | ----------------------------------- | -------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1   | Target and filter structure         |             25 | Repair trait, owner, zone, type, state, count, and relational filters through shared parser/runtime vocabulary.                                            |
| A2   | Metadata, duration, and optionality |              2 | Make explicit/default semantics visible in behavior; do not normalize away a meaningful option or duration.                                                |
| A3   | Activation timing and qualification |             20 | Separate activation gates from resolution conditions; verify Pair/Link identity, event identity, and once restrictions.                                    |
| A4   | Conditional placement and branches  |             32 | Model `if`/`then` at the correct stage, with both true and false paths where printed text makes them observable.                                           |
| A5   | Specialized action primitives       |             39 | Decide parser-versus-runtime ownership after proving whether the engine can perform the printed action. Add the smallest general primitive when it cannot. |
| A6   | Staged sequencing                   |             18 | Test changing candidate sets and choice ownership before simplifying queues; batch size is one to four cards.                                              |
| A7   | Clause segmentation                 |              8 | Add a general grammar rule for omitted, combined, or extra clauses and pair it with behavior proof.                                                        |

For every wave:

1. Select five to twelve cards (one to four for A6), record the named batch in
   the ledger, and inspect source record → normalized text → parser output →
   runtime definition → existing fixture.
2. Add a failing public behavior sensor and a generic parser test when grammar
   changes. Deliberately mutate one representative value and condition to prove
   the test fails for the right behavioral reason, then restore it.
3. Repair the narrowest correct owner: parser, runtime definition, engine, or
   a general audit normalization. Never close a card merely because parser and
   runtime agree on the same omission.
4. Run focused parser/card tests and the catalog audit. Update the ledger only
   after the named card leaves the expected queue for the stated disposition.
5. At a wave boundary, run the package/engine checks affected by the shared
   change; reserve the full suite for the final gate unless a shared primitive
   demands earlier broad validation.

### B. Behavioral certification: 272 entries

The 144 fidelity cards are certified in their corresponding A-wave. The
remaining 128 structurally matching cards are handled by set and card type so
fixtures and engine capabilities can be reused without weakening the proof:

| Order | Group | Baseline cards | Focus                                                                            |
| ----- | ----- | -------------: | -------------------------------------------------------------------------------- |
| B1    | ST10  |             11 | Establish the ledger/test process with the small, varied starter set.            |
| B2    | GD05  |             55 | Group Units, Commands, Pilots, and Bases by shared timing/choice mechanics.      |
| B3    | EB01  |             62 | Finish by card type and then by special mechanics, retaining explicit negatives. |

For each card, create or strengthen a sibling test with one inner `describe`
per printed ability. It must reach the timing through legal moves, resolve all
visible prompts with the right player, assert exact observable results and
source destination, and include an adversarial case that would fail if the
ability did not activate. A deploy/pair/play smoke test is sufficient only
when that move itself resolves the printed ability being asserted.

## Audit and reporting loop

After every completed batch, run:

```bash
vp exec node --experimental-strip-types tools/audit-gundam-catalog.ts
```

Record a compact scoreboard in the ledger/audit notes:

| Metric                       | Frozen baseline | Current | Report requirement                                     |
| ---------------------------- | --------------: | ------: | ------------------------------------------------------ |
| Official printings           |           1,777 | current | Must remain 1,777/1,777.                               |
| Parser/runtime mismatches    |             144 | current | List the exact cards that left and their dispositions. |
| Behavioral review            |             272 | current | List the exact cards certified and their test paths.   |
| Printed-text mismatches      |               0 | current | Investigate any non-zero result immediately.           |
| Meaningful runtime fallbacks |               0 | current | Investigate any non-zero result immediately.           |

The audit must reject `verifiedSets`, exact-card parser overrides, duplicate
ledger IDs, entries without a disposition/proof, and an attempted behavioral
close without a public fixture. Keep printing-ID and canonical-card counts
separate because alternate printings may intentionally collapse at runtime.

## Verification and final acceptance

Focused validation happens after each batch; no card is marked complete on an
unrun test. Once both queues are expected to reach zero, run the final gates
from `submodules/gundam`:

```bash
vp test
vp check
pnpm check:harness
vp exec node --experimental-strip-types tools/audit-gundam-catalog.ts
git diff --check
```

Completion requires all of the following:

1. Official printings remain 1,777/1,777.
2. Parser/runtime mismatches are zero through general grammar, correct runtime
   behavior, or a justified general normalization.
3. Behavioral review is zero with one explicit behavioral proof per card.
4. Printed-text mismatches and meaningful runtime fallbacks are zero.
5. No exact-card parser override, `verifiedSets` shortcut, or unverifiable
   ledger disposition remains.
6. The final test, type, harness, audit, and diff checks pass.

## Stop conditions and decision log

- Stop a batch when an engine primitive cannot safely express the printed
  contract, then log the smallest needed rules/engine decision and keep every
  affected card open.
- Stop a card when a public behavior fixture reveals a rules ambiguity; consult
  the relevant comprehensive-rule section before implementation.
- 2026-07-29 — Kept fidelity and behavior as independent queues because
  structural agreement cannot prove a runtime implements every printed clause.
- 2026-07-29 — Chose per-card ledger certification over set-wide completion to
  make every numerical reduction attributable and reviewable.
