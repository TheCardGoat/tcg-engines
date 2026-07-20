# Gundam Card Audit Wave 001

**Status**: released
**Branch**: `codex/gundam-card-audit-waves`
**Base HEAD**: `ec0a16a304858f9b9565cff17399dd5736316883`
**Cards before wave**: 117 unverified canonical ability cards
**Wave size**: 50
**Next card after wave**: ST04-015 Archangel

## Exclusive Assignments

| Implementer | Canonical cards                                  |
| ----------- | ------------------------------------------------ |
| 01          | ST01-001, ST01-002, ST01-004, ST01-006, ST01-008 |
| 02          | ST01-009, ST01-010, ST01-011, ST01-012, ST01-013 |
| 03          | ST01-014, ST01-015, ST01-016, ST02-001, ST02-002 |
| 04          | ST02-003, ST02-006, ST02-008, ST02-009, ST02-010 |
| 05          | ST02-011, ST02-012, ST02-013, ST02-014, ST02-015 |
| 06          | ST02-016, ST03-001, ST03-002, ST03-004, ST03-006 |
| 07          | ST03-008, ST03-009, ST03-010, ST03-011, ST03-012 |
| 08          | ST03-013, ST03-014, ST03-015, ST03-016, ST04-001 |
| 09          | ST04-002, ST04-004, ST04-006, ST04-007, ST04-009 |
| 10          | ST04-010, ST04-011, ST04-012, ST04-013, ST04-014 |

Each assignment owns only the five matching definition files and five sibling
test files. No shared-file lease is granted.

## Freeze Ledger

| Implementer | State  | Changed files                                                    | Focused validation                                               | Shared defects                                                                 |
| ----------- | ------ | ---------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 01          | FROZEN | five assigned ST01 Unit tests                                    | 5 files / 43 tests PASS; diff check clean                        | parser turn-gate defect reproduced; coordinator repair PASS                    |
| 02          | FROZEN | five assigned ST01 Unit/Pilot/Command tests                      | 5 files / 48 tests PASS; format and diff checks clean            | none                                                                           |
| 03          | FROZEN | five assigned ST01/ST02 tests plus ST01-016 definition           | 5 files / 49 tests PASS; changed-file check and diff check clean | White Base branching and Wing self-target parser repairs PASS                  |
| 04          | FROZEN | five assigned ST02 tests plus ST02-006 definition                | 5 files / 26 tests PASS; coordinator rerun clean                 | Heavyarms trigger, Tallgeese self-target, and keyword-only export repairs PASS |
| 05          | FROZEN | five assigned ST02 Pilot/Command/Base tests                      | 5 files / 43 tests PASS; coordinator rerun and diff check clean  | none; fresh parser output matches authored effects                             |
| 06          | FROZEN | five assigned ST02/ST03 tests                                    | 5 files / 47 tests PASS; coordinator rerun and diff check clean  | Sinanju segmentation, Support-only, and tutor parser repairs PASS              |
| 07          | FROZEN | five assigned ST03 tests                                         | 5 files / 51 tests PASS; coordinator rerun and diff check clean  | optional deploy and Link-only keyword parser repairs PASS                      |
| 08          | FROZEN | five assigned ST03/ST04 tests plus ST03-014/ST03-016 definitions | 5 files / 56 tests PASS; coordinator rerun and diff check clean  | command target/filter parser repair PASS                                       |
| 09          | FROZEN | five assigned ST04 Unit tests                                    | 5 files / 46 tests PASS; coordinator rerun and diff check clean  | draw-discard and Attack-condition parser repairs PASS                          |
| 10          | FROZEN | five assigned ST04 Pilot/Command tests                           | 5 files / 53 tests PASS; coordinator rerun clean                 | Striker Pack condition and curly-apostrophe parser repairs PASS                |

## Coordinator Validation

- Full wave: 50 files / 462 tests PASS.
- Card package: 745 files / 2,967 tests PASS; format, lint, and types PASS.
- Engine package: 101 files / 621 tests PASS; format, lint, and types PASS.
- Parser: 8 files / 283 tests PASS; package check PASS; structured snapshot regenerated for all 848 definitions.
- Vanilla catalog: 93 canonical non-token no-ability Units PASS through 187
  parameterized tests.
- Strict preview and final `pnpm run check:harness`: 617 fixture cards PASS, including all 50 wave IDs.
- Workspace `vp check` and local `pnpm run ci-check`: PASS; 8 / 8 Turbo test tasks successful.
- Inventory: 505 / 572 canonical ability cards verified; 67 remain.
- GitHub automation: intentionally excluded by campaign policy.

## Improvement Record

Signal: the same three routing problems recurred across assignments: stale parser
snapshots, manual canonical-versus-BETA ownership, and duplicated one-assertion
vanilla tests.

Change 1: added a deterministic canonical queue backed by an explicit inventory
state; BETA duplicates defer to their non-BETA owner and verified IDs opt into
the strict fixture policy before an entire set is complete.

Change 2: replaced per-file vanilla smoke tests with one parameterized canonical
Unit catalog invariant while keeping ability-card files clause-focused.

Proof: the queue reports 848 definitions, 788 canonical cards, 572 canonical
ability cards, 505 verified ability cards, and 67 remaining; the catalog proves
93 vanilla Units through 187 tests; the strict harness passes all 50 newly
verified IDs.

Next-two result: ST04-015 Archangel and ST04-016 Vesalius are selected
deterministically with canonical definition and sibling-test paths, and both
will inherit verified-ID fixture enforcement at the next release gate.
