---
name: fab-tests
description: Generate or repair high-value AAA tests for a batch of similar Flesh and Blood cards. Prefer fewer real-play proofs over stringify, fail-loud, or presence-only coverage. Args in $ARGUMENTS — [set] [type] [card]; omit all to pick a random set+type with untested cards. Also use to record engine-support gaps surfaced while testing.
user_invokable: true
---

# FAB Card-Test Batch

Drive the self-improving AAA test loop over a cluster of similar Flesh and Blood
cards. **Quality over volume.** Skip or gap-record rather than ship a low-value
green test. Reuses `fab-test-generation` for harness/AAA shape — do not
duplicate that standard here. Quality bar and anti-patterns live in
[`quality.md`](../skills/fab-test-generation/references/quality.md); read it
before writing.

**Arguments** (`$ARGUMENTS`): `[set] [type] [card]`

- `set` — set code (e.g. `ARC`). Omit for random.
- `type` — card type (`actions`, `equipment`, `heroes`, `instants`, …; singular or plural both accepted). Omit for random.
- `card` — a specific `slug` or `collectorNumber` to narrow to one card.
- Omit all three → the script picks a random set + type that has untested cards (weighted toward bigger gaps).

All shell commands run from `submodules/flesh-and-blood`.

Stay in this checkout. Do not `git worktree add`, do not spawn subagents
with `isolation: "worktree"`, and do not copy the tree to dodge a dirty
index. Isolation is claim-scoped pathspec commits on the shared trunk
(`docs/agent-coordination-protocol.md` §2.4).

## 1. Resolve the batch

```bash
# targeted
node packages/cards/scripts/card-coverage.ts --set <set> --type <type> [--card <ref>] [--batch-size 5]
# random set+type
node packages/cards/scripts/card-coverage.ts --random [--batch-size 5]
```

The JSON gives `clusters` (cards sharing an effect signature → one test scaffold)
and pre-chunked `batches`. Each member carries `path` (relative to the cards
dir), `slug`, `collectorNumber`, `signature`. Open each member at
`packages/cards/src/cards/<path>` to read its real definition — the script is a
map, not the territory.

To browse overall coverage, run `node packages/cards/scripts/card-coverage.ts` (writes
`packages/cards/scripts/card-coverage/coverage.json` + a summary).

## 2. Load the test skill

Load [`fab-test-generation`](../skills/fab-test-generation/SKILL.md)
and read `references/quality.md` **first**, then `references/playbook.md` +
`references/harness-cheatsheet.md`. List open families with
`node packages/cards/scripts/card-coverage.ts --gaps` and prefer clusters that
hit an **open** family over a random untested signature. Write every test to
that skill's AAA standard (Arrange/Act/Assert + the trio: printed result,
boundary, and timing/interaction). If an assertion is rules-facing, also load
`fab-rules` (glossary + SKILL.md) per `submodules/flesh-and-blood/AGENTS.md`.

## 3. Write tests, batch by batch

Process one `batch` at a time — same cluster means a shared scaffold:

- Reason once about the cluster's effect signature; are all card definitions properly implemented? Do we have all test harness needed to successfully TDD those cards? Reuse the arrange/act shape across the batch (this is why batching saves reasoning).
- For each untested member: if the printed clause can be played, create sibling `<file>.test.ts`. If it cannot, **record a family and skip** — do not author fail-loud / stringify / presence theater so the file counts as tested.
- One `it(...)` per trio case; name the suite `"<Name> (<CODE>) AAA"`. Happy must be the printed result, not a throw.
- Public fluent verbs only (`attackWith` / `defendWith` / `play` / `activate` / `game.helpers.*`); assert rule-visible state only.
- Run the gate in `quality.md` on every new `it`. Fail the gate → delete the case, do not ship it.

## 4. Validate

- `vp run check-types` — type safety is non-negotiable; green tests ≠ type-safe (vitest-oxc strips types).
- Focused: `vp test run <pattern>` against the new files. **Gate on captured
  output** (`passed` and not `fail`) — `vp test run` can exit 0 on suite-load errors.
- On a clean run, once the cluster is finished, finish with `vp run ci-check` (having as workdir submodules/flesh-and-blood) (per `AGENTS.md`).

## 5. Record gaps + contribute lessons (the loop)

- If a card can't be fully tested because the engine/catalog lacks support, **do
  not** half-fix the definition and **do not** write a fake trio (`toThrow` the
  marker, `JSON.stringify` the AST, or `toHaveKeyword` without the CR effect).
  Record a **family** (reuse an open family id from `--gaps` when it is the same
  primitive). Closing a family is [`/fab-close-gaps`](fab-close-gaps.md), not a
  pin in the card test:
  ```bash
  node packages/cards/scripts/card-coverage.ts --record-gap <slug|collector> \
    --family status/<marker-or-primitive> \
    --kind engine-primitive \
    --reason "what's missing"
  ```
  `--kind` is `engine-primitive` | `definition` | `out-of-scope` | `harness`.
- Harness/AAA surprises stay one line in
  `.agents/skills/fab-test-generation/references/playbook.md`. Do not dump engine
  throws into the playbook.

## 6. Summary

Report: cards with high-value trios, cards skipped because they failed the
quality bar, families recorded or extended (`--gaps`), and playbook lessons
added. A run that records a family and writes **zero** junk tests is success.
Do not commit unless asked.
