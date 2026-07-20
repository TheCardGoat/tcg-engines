# Gundam Card Audit Wave 002

**Status**: released
**Branch**: `codex/gundam-card-audit-waves`
**Base HEAD**: `103c69feb`
**Cards before wave**: 67 unverified canonical ability cards
**Wave size**: 50
**Next card after wave**: ST08-015 Davao

## Exclusive Assignments

| Implementer | Canonical cards                                     |
| ----------- | --------------------------------------------------- |
| 01          | ST04-015, ST04-016, ST01-014-p4, ST05-001, ST05-002 |
| 02          | ST05-003, ST05-005, ST05-007, ST05-008, ST05-010    |
| 03          | ST05-011, ST05-012, ST05-013, ST05-014, ST05-015    |
| 04          | ST03-013-p3, ST06-001, ST06-002, ST06-003, ST06-005 |
| 05          | ST06-007, ST06-009, ST06-010, ST06-011, ST06-012    |
| 06          | ST06-013, ST06-014, ST06-015, ST07-001, ST07-004    |
| 07          | ST07-005, ST07-007, ST07-009, ST07-010, ST07-011    |
| 08          | ST07-012, ST07-013, ST07-014, ST07-015, ST08-001    |
| 09          | ST08-002, ST08-004, ST08-006, ST08-008, ST08-009    |
| 10          | ST08-010, ST08-011, ST08-012, ST08-013, ST08-014    |

Each assignment owns only the five matching canonical definition files and
five sibling test files. No shared-file lease is granted. Historical alternate
print IDs are audited as their own canonical definitions when their card number
is distinct.

## Freeze Ledger

| Implementer | State  | Changed files                                                                  | Focused validation                               | Shared defects                                                                       |
| ----------- | ------ | ------------------------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| 01          | FROZEN | five assigned ST04/ST05 Base/Command/Unit tests                                | 5 files / 60 tests PASS; coordinator rerun clean | same-target, damaged-self, and reminder parser repairs PASS                          |
| 02          | FROZEN | five assigned ST05 Unit/Pilot tests plus ST05-010 definition                   | 5 files / 54 tests PASS; coordinator rerun clean | none; owned Mikazuki friendly-target omission corrected                              |
| 03          | FROZEN | five assigned ST05 Pilot/Command/Base tests                                    | 5 files / 50 tests PASS; coordinator rerun clean | trash recovery, unit-count gate, and same-target parser repairs PASS                 |
| 04          | FROZEN | five assigned ST06 Command/Unit tests plus ST06-002 definition                 | 5 files / 47 tests PASS; coordinator rerun clean | Clan event-gate and self-keyword parser repairs PASS                                 |
| 05          | FROZEN | five assigned ST06 Unit/Pilot/Command tests plus ST06-010/ST06-012 definitions | 5 files / 43 tests PASS; coordinator rerun clean | selected-recipient and atomic deck-look parser repairs PASS                          |
| 06          | FROZEN | five assigned ST06/ST07 tests plus four corrected definitions                  | 5 files / 34 tests PASS; coordinator rerun clean | exact linked-event-card modifier engine/parser path PASS                             |
| 07          | FROZEN | five assigned ST07 Unit/Pilot tests plus ST07-005/ST07-011 definitions         | 5 files / 46 tests PASS; coordinator rerun clean | paired-host, self-recipient, and `instead` parser repairs PASS                       |
| 08          | FROZEN | five assigned ST07/ST08 tests plus ST07-014 definition                         | 5 files / 46 tests PASS; coordinator rerun clean | Link qualifier, tutor, prevention, reduction, and highest-target parser repairs PASS |
| 09          | FROZEN | five assigned ST08 Unit tests                                                  | 5 files / 35 tests PASS; coordinator rerun clean | attack gate, hand-to-bottom cost, and ready-suppression parser repairs PASS          |
| 10          | FROZEN | five assigned ST08 Pilot/Command/Base tests                                    | 5 files / 49 tests PASS; coordinator rerun clean | selected permission, draw observer, and damage-`instead` parser repairs PASS         |

## Coordinator Validation

- Full wave: 50 files / 464 tests PASS.
- Card package: 745 files / 3,304 tests PASS; format, lint, and types PASS.
- Engine package: 102 files / 622 tests PASS; format, lint, and types PASS.
- Types package: format, lint, and types PASS.
- Parser: 8 files / 309 tests PASS; package check PASS; structured snapshot regenerated for all 848 definitions.
- Strict `pnpm run check:harness`: 617 fixture cards PASS, including all 50 wave IDs.
- Inventory: 555 / 572 canonical ability cards verified; 17 remain.
- Gundam workspace and local `pnpm run ci-check`: PASS.
- GitHub automation: intentionally excluded by campaign policy.

## Improvement Record

Signal: exact event-card identity and multi-sentence routing recurred across
link observers, chosen recipients, conditional costs, tutors, and `instead`
branches.

Change 1: added a typed `grantKeywordEventCard` action whose preflight and
executor resolve only the triggering linked card, with automation intent and
fresh-parser support.

Change 2: made parsing card-type-aware and consolidated selected-target,
compound-gate, deck-look, trigger-segmentation, and conditional-continuation
routing so fresh structured output retains executable identity and bounds.

Proof: the exact-event engine regression passes; the parser grew from 292 to
309 passing tests while its structured snapshot now classifies 553 definitions
as parsed, 11 partial, and 6 empty. The full card, engine, strict fixture, and
local CI gates pass with all 50 new verified IDs enabled.

Next-two result: ST08-015 Davao and ST09-001 Impulse Gundam are selected
deterministically with canonical definition and sibling-test paths; both will
inherit verified-ID fixture enforcement in the final 17-card wave.
