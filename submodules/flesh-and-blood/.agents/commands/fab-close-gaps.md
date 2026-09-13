---
name: fab-close-gaps
description: Close one Flesh and Blood gap cluster by extending the owning primitive (stamp, re-encode, or exhaustive switch), converting pinned AAA trios, and recording a primitive-owner lesson. Args in $ARGUMENTS — optional family id; omit to take --next-cluster.
user_invokable: true
---

# FAB Close Gaps

Drive one cluster iteration of
[`fab-close-gap`](../skills/fab-close-gap/SKILL.md). Do not duplicate that
skill here. This closes families; `/fab-tests` only records them.

**Arguments** (`$ARGUMENTS`): optional `[family-id]`

- Omit → `node packages/cards/scripts/card-coverage.ts --next-cluster`
- `family-id` → `--next-cluster --cluster <family-id>`

All shell commands run from `submodules/flesh-and-blood`.

Stay in this checkout. Do not `git worktree add` or spawn
`isolation: "worktree"` children. Share the dirty tree; isolate with
claim-scoped pathspec commits (`docs/agent-coordination-protocol.md` §2.4).

## 1. Load the skill

Read `../skills/fab-close-gap/SKILL.md`,
`../skills/fab-close-gap/references/decision-tree.md`, and
`../skills/fab-close-gap/references/primitive-owners.md`.
Load `fab-rules` before a rules-facing change. Load `fab-test-generation` only
for AAA / harness verbs.

## 2. One cluster

Classify → skeptic → implement the primitive → rewrite every member → convert
pins to printed AAA trios (real cards, public moves, rule-visible state) →
resolve families → one primitive-owner lesson. Do not add `JSON.stringify` /
`it("encodes …")` catalog guards.

Do not add a one-off `has-status` handler for a this-way / this-turn /
N-or-more slug. Do not fold `conditional.instead`. Do not touch unrelated dirty
files. Do not open a sibling git worktree for the cluster.

## 3. Summary

Report the cluster ids, strategy, owning primitive, converted collectors,
resolved families, and the playbook/owner lesson. Do not commit unless asked.

## Repeated runs

`/fab-close-gaps` in chat closes **one recorded gap cluster**. Run it again for
the next cluster after reviewing the prior diff and focused evidence. When the
ledger is dry, `/fab-tests` can discover new pins.
