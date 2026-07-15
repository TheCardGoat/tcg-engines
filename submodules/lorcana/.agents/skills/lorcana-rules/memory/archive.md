# Lorcana Rules Memory Archive

Append-only audit trail. Schema: [`schema.md`](./schema.md).

## 2026-04-27 — initial schema migration

Pre-migration entries lived as a flat dated list. Each was either folded into a Promoted Rule (PR-NN) or kept as historical context only. Mapping below; the git history of `bank.md` preserves original prose.

| Date       | Topic                                                 | Folded into                              |
| ---------- | ----------------------------------------------------- | ---------------------------------------- |
| 2026-03-05 | skill-hardening-baseline                              | new schema itself                        |
| 2026-03-09 | section-02 gameplay specs                             | PR-02 evidence                           |
| 2026-03-09 | floating-triggered-abilities-bag-handoff              | PR-01                                    |
| 2026-03-10 | section-04-06 challenge specs                         | runnable section spec; no durable rule   |
| 2026-03-10 | section-03 beginning-phase transitions                | PR-02                                    |
| 2026-03-10 | section-03 pending action completion                  | PR-02 (cross-ref)                        |
| 2026-03-10 | section-05 card-type specs                            | runnable section specs; no durable rule  |
| 2026-03-10 | section-04-03 payment modifier source zones           | PR-04 evidence                           |
| 2026-03-10 | section-06-05 replacement effects                     | PR-03                                    |
| 2026-03-11 | resist static ability handoff                         | PR-05                                    |
| 2026-03-11 | section-06-01 skipped test triage                     | PR-06 evidence                           |
| 2026-03-11 | section-06-01 that-card zone enforcement              | PR-06                                    |
| 2026-03-12 | set 001 item happy-path implementation                | folded to `lorcana-cards`                |
| 2026-03-12 | set 002 item activated abilities                      | folded to `lorcana-cards`                |
| 2026-03-12 | set 003 item activated abilities                      | folded to `lorcana-cards`                |
| 2026-03-12 | set 004 item modal abilities                          | folded to `lorcana-cards`                |
| 2026-03-12 | set 005 item activations                              | folded to `lorcana-cards`                |
| 2026-03-27 | optional triggered abilities with no legal choices    | PR-07 cross-ref + `lorcana-cards` PR-05  |
| 2026-03-27 | sing-trigger-bag-entry-timing                         | C-01                                     |
| 2026-03-27 | that-card trigger identity plus zone lock             | PR-06                                    |
| 2026-03-27 | sing together simulator multi-select flow             | runnable simulator test; no durable rule |
| 2026-03-28 | turn-owner-vs-priority drift                          | PR-08                                    |
| 2026-03-27 | shift alternate-cost payment modifiers                | PR-04                                    |
| 2026-03-30 | optional effect continuation after partial resolution | PR-07                                    |
| 2026-03-30 | fair-information bot gating                           | PR-10                                    |
| 2026-04-01 | vanish vs activated ability targeting                 | PR-09                                    |
| 2026-04-11 | the-958 shift-trigger rules handoff                   | PR-04 cross-ref                          |
