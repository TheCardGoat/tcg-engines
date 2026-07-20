# Gundam Card Audit Wave 003

**Status**: released
**Branch**: `codex/gundam-card-audit-waves`
**Base HEAD**: `dacc6b924`
**Cards before wave**: 17 unverified canonical ability cards
**Wave size**: 17 (final partial wave)
**Next card after wave**: none

## Exclusive Assignments

| Implementer | Canonical cards    |
| ----------- | ------------------ |
| 01          | ST08-015, ST09-001 |
| 02          | ST09-002, ST09-003 |
| 03          | ST09-004, ST09-006 |
| 04          | ST09-007, ST09-008 |
| 05          | ST09-009, ST09-010 |
| 06          | T-008, T-009       |
| 07          | T-010, T-011       |
| 08          | T-014              |
| 09          | T-021              |
| 10          | T-022              |

Each assignment owns only the matching canonical definition files and sibling
test files. No shared-file lease is granted. The final deterministic queue has
17 cards, so the ten established implementer identities receive one or two
cards each rather than inventing non-canonical work to pad the wave.

## Freeze Ledger

| Implementer | State  | Changed files                                   | Focused validation                               | Shared defects                                                      |
| ----------- | ------ | ----------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| 01          | FROZEN | Davao/Impulse tests                             | 2 files / 26 tests PASS; coordinator rerun clean | return-self-to-deck activation-cost types/engine/parser repair PASS |
| 02          | FROZEN | Force Impulse/Saviour tests                     | 2 files / 19 tests PASS; coordinator rerun clean | name-exclusion and color-count parser repairs PASS                  |
| 03          | FROZEN | Freedom/Sword Impulse tests                     | 2 files / 20 tests PASS; coordinator rerun clean | Base gate and deploy-source parser repairs PASS                     |
| 04          | FROZEN | Blast Impulse/Shinn tests plus Shinn definition | 2 files / 17 tests PASS; coordinator rerun clean | none; owned Resource state filter corrected                         |
| 05          | FROZEN | Giant Killing/Minerva tests                     | 2 files / 19 tests PASS; coordinator rerun clean | atomic Minerva deck-look parser repair PASS                         |
| 06          | FROZEN | Aile/Launcher token tests                       | 2 files / 15 tests PASS; coordinator rerun clean | runtime token-color invariant repair PASS                           |
| 07          | FROZEN | Sword Strike/Fatum token tests                  | 2 files / 16 tests PASS; coordinator rerun clean | none; intrinsic Blocker split exact                                 |
| 08          | FROZEN | Ad Balloon test                                 | 1 file / 8 tests PASS; coordinator rerun clean   | none; authored restrictions exact                                   |
| 09          | FROZEN | Parts test                                      | 1 file / 6 tests PASS; coordinator rerun clean   | none; authored attack-target restriction exact                      |
| 10          | FROZEN | Wire-Guided Arm test                            | 1 file / 8 tests PASS; coordinator rerun clean   | none; authored pairing restriction exact                            |

## Coordinator Validation

- Final wave: 17 card files / 154 focused tests PASS.
- Cards package: 749 files / 3,407 tests PASS; package check PASS.
- Engine package: 103 files / 624 tests PASS; package check PASS.
- Token-data and types package checks PASS.
- Parser: 8 files / 315 tests PASS; parser check PASS; structured snapshot
  regenerated for 848 scanned cards (553 parsed, 11 partial, 6 empty).
- Strict verified-ID fixture harness: 617 card fixtures PASS; document drift
  and inventory invariants clean.
- Final inventory: 572 / 572 canonical ability cards verified; 0 remain.
- Gundam workspace check PASS; local CI graph 8 / 8 tasks PASS.
- GitHub automation: intentionally excluded by campaign policy.

## Improvement Record

Signal: the final wave exposed two repeated, rules-facing gaps that could not be
proved honestly in card-local tests: activation costs that return their source
to deck, and token definitions incorrectly carrying a color.

Change 1: added a typed `returnSelfToDeck` activation cost, paid by the engine
before target selection, taught the parser the compound cost header, and
authored ST09-001 against that exact sequence.

Change 2: enforced the rules invariant that runtime token definitions have no
color and corrected the T-008 and T-009 presentation data.

Proof: focused engine and token-definition regressions PASS, parser regressions
for the final ST09 cards PASS, and all broad package gates above PASS.

Final inventory result: 572 / 572 verified; deterministic queue empty.
