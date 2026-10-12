# Alpha Clash native interaction review

## Required browser path

Use board controls, card inspection and dedicated choice controls for gameplay. Do not use **Match actions & log / More** to activate actions, submit choices, pass, undo or otherwise advance the game. It is an escape hatch, not the acceptance path. If a needed action is absent from the board, stop that case and record a UI reachability failure; native tests can still establish engine/adapter behavior separately.

Earlier runs that used this escape hatch are retained only as diagnostic evidence. They do **not** establish accepted real-board completion, even if their final board state is correct. This affects the recorded Death and Trugg ability flows, Rizlac recovery, T-Bone response, reveal fallback selection, and any other run whose steps use that panel. Revalidate those cases through board controls after the missing controls are addressed. Do not use the log as a substitute for visible board feedback.


Review date: 2026-10-10. Scope: local Alpha Clash engine, adapter, and production simulator board. Desktop first; landscape mobile uses the scaled desktop arrangement.

This package separates executable coverage from design acceptance. A native fixture proves only the paths exercised by its tests. The target UX below is a specification, not a claim that it has shipped.

- [Coverage matrix and source audit](coverage.md)
- [Reference study](references.md)
- [Shared interaction, motion, and sound specification](presentation.md)
- [Detailed interaction specifications](interactions.md)
- [Annotated interaction storyboards](storyboards.html)
- [Validation evidence and limits](validation.md)
- [Ordered implementation backlog](backlog.md)
- [Instant public reveal data proposal](instant-reveal-proposal.md)

## Review workflow

Open `/alpha-clash/simulator/tests`. Choose a family, then a named board variant. Read the steps, open the board, and perform the action with its normal controls. Fixtures default to manual control of both seats. Reload or Reset returns to the deterministic starting board. Use the other viewer to inspect privacy boundaries; never infer opponent visibility from the acting player's screen.

The catalog reuses existing boards across coverage cases. Old fixture IDs remain valid. `prompt-number` and `prompt-targets` share one factory; search/retrieve share one factory; simultaneous ordering shares one factory. Only distinct starting arrangements require another board.

## Proof contract

Factories arrange state only. They must not play cards, pass priority, create pending choices, or submit answers. The native test drivers perform those actions through `submitInteraction`. Ordinary adapter dispatch is used only where the shipped UI does so, such as undo.

All instantiated cards belong to the official catalog. `nativeFixtureState` replaces harness fillers, completes each ledger to at least 50 cards, and replaces excess background resource copies with official basic Actions of the same colors. It preserves foreground interaction cards. The crowded board uses a smaller deck to stay within 60 cards. No `acx-*` preview definitions are permitted.

All 56 fixture ledgers pass the native construction validator. The catalog displays this result separately from engine support and UX quality. This verifies card counts, copy limits, restrictions, and the native deck rules. It does not prove a complete historical path to every initial counter, resource count, or zone position. Counter-transfer fixtures now create their counters through native play. Crowding and other arranged board states still need historical reachability review before final acceptance. The opening fixture uses native validated decks and a seeded deal.

Factories start before the action: no Standby entries, active clash, response window, or pending choice. Tests create and resolve those states through native adapter submissions.

The adapter and opening lifecycle repairs use existing native commands and an exported native target collector. No engine rule implementation or gameplay protocol changed. Remaining gaps are documented; a fixture that hits a gap is a failure specimen, not passing coverage. The former `inspection-arrangement` route aliases `arena-crowded`, without a duplicate catalog board.

The [evidence index](evidence-index.md) lists native test sources, screenshots, recordings and measurement files separately for every case. Missing files are explicit; listed files do not imply complete acceptance.

## Keep coverage reports current

The fixture catalog is the single metadata source. From `apps/multi-game-simulator`, run:

```sh
node scripts/alpha-clash-coverage-report.mjs
node scripts/alpha-clash-coverage-report.mjs --check
```

The first command updates only the marked matrix table and the evidence index. It preserves authored audit prose and specifications. The check validates unique coverage IDs, specification anchors, every referenced evidence file and report freshness. It does not execute native scenarios or turn file availability into acceptance. Update per-case limits in `interaction-coverage.ts` when adding evidence. The former temporary evidence-index script is superseded.
