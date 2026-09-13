# Gundam Card Fidelity Review Prompt

Use the current repository as the authority. Review every canonical Gundam card under `packages/cards/src/cards` against its official scraped printing in `tools/gundam-card-parser/data/scraped`.

For each canonical card, report its printing IDs, source definition, printed `effect`, parser output, checked-in `effects`, clause-by-clause fidelity status, and behavioral coverage. Treat reprints and alternate art as printings of one canonical behavior definition.

Mark fidelity as `structure_matches`, `printed_text_mismatch`, `parser_unparsed`, `parser_fallback`, or `parser_runtime_mismatch`. Compare executable structure, not `sourceText` formatting, but retain full source text in the report. Flag missing or incorrect timing, conditions, targets, costs, optionality, dependencies, durations, event source filters, and choice ownership.

Mark behavioral coverage only as:

- `no_behavior_required` for vanilla/reminder-only cards;
- `behavioral_test_present` only when public player actions prove every executable clause through projected state, legal choices, zones, resources, AP/HP, logs, or outcomes;
- `partial_behavioral_coverage` when any clause or gate is unproven;
- `behavioral_test_missing` when no suitable public proof exists.

Do not accept parser structure or private state inspection as behavioral proof. For multiplayer-required effects that the public fixture cannot create, list an explicit verified harness blocker with the engine source path and the missing fixture capability.

Generate JSON and Markdown containing printing parity, duplicate/reprint ownership, every card's status, untruncated mismatched clauses, a risk-ordered missing-test queue, verified blockers, exact definition/test paths, and the commands used to validate the result. Run the smallest relevant test for each change, then the parser/package suite. Do not claim completion while any executable clause lacks public proof or an explicit verified blocker.
