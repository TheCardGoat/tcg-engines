# @tcg/bot-lab

One deterministic interface for bot training, paired evaluation, replay, and promotion across
Lorcana, Cyberpunk, Gundam, and One Piece.

```sh
pnpm bot-lab doctor --game gundam
pnpm bot-lab train --game cyberpunk \
  --manifest submodules/agnostic-simulator/tools/bot-lab/examples/cyberpunk-train.json \
  --out /tmp/cyberpunk-candidate.json
pnpm bot-lab evaluate --game cyberpunk \
  --candidate /tmp/cyberpunk-candidate.json \
  --out /tmp/cyberpunk-report.json
pnpm bot-lab replay --game cyberpunk \
  --report /tmp/cyberpunk-report.json \
  --match 'test-mirror/block-0/a-seat-1'
pnpm bot-lab promote --game cyberpunk --report /tmp/cyberpunk-report.json --dry-run
```

`evaluate` always runs baseline and candidate together on strategy-independent seeds. It swaps
seats, applies the shared hard-failure taxonomy, and expands an inconclusive run in batches up to
the manifest cap. Public and oracle strategies cannot be compared for promotion.

`promote` refuses stale, internally inconsistent, test-only, or non-promotable reports. Production
promotion requires at least 200 paired blocks. Without `--dry-run`, it updates the game's canonical
`automation/promotions/current.json`; it never commits or pushes.

Full reports and replays belong in temporary or ignored artifact directories. The compact current
promotion record is the committed source of truth used by production registries.
