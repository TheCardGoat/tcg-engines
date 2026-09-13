# Grand Archive Engine Documentation

This directory contains maintained documentation for the Grand Archive engine. Historical audit
transcripts do not belong here; Git history is the record of completed investigations.

## Documents

- [Rules coverage](grand-archive-rules-coverage.md) explains what the machine-readable rules audit
  measures, its current result, and the limits of that result.
- [Next steps](next-steps.md) is the prioritized roadmap from an executable rules engine to a
  production simulator integration.
- [`../src/README.md`](../src/README.md) maps the source directories to their architectural owners.

## Sources of Truth

- Official rules text:
  `../../../.agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules`
- Per-rule audit state: `../reports/comprehensive-rules-audit-status.json`
- Current engine behavior: `../src`
- Current card behavior graph: `../../cards/src/cards` and `../../cards/src/generated`
- Required workspace gate: `pnpm run ci-check`

Generated diagnostics, such as snapshot-fuzz failures, remain under `../reports`. They are evidence
artifacts rather than maintained documentation.
