---
name: fab-close-gap
description: Close a Flesh and Blood engine/definition gap cluster by extending the owning primitive, not by minting a one-off has-status handler. Use when running /fab-close-gaps or when a /fab-tests pin must be converted to a printed AAA trio.
---

# FAB Close Gap

Closes **families** in `packages/cards/scripts/card-coverage/gaps.json`. `/fab-tests`
discovers debt; this skill is the only closer.

Long-term maintainability beats a minimal per-card workaround. Composition
(amount + filter + binding + window) beats a new discriminant. Status is a small
CR set (`docs/architecture/foundation-types.md` principles 2, 5, 9, 12).

## Required loading

1. `references/decision-tree.md` — strategy enum and skeptic rejects.
2. `references/primitive-owners.md` — stamp sites and learned discriminants
   (guard citations were re-pointed to sibling AAA when the guards were deleted
   2026-08-23).
3. `fab-rules` (glossary + SKILL.md) before any rules-facing change.
4. `fab-test-generation` for AAA / harness verbs only. Engine throws stay in
   the family ledger, not the test playbook.

Stay in this checkout. Do not `git worktree add` or spawn
`isolation: "worktree"` children.

## Preconditions

From `submodules/flesh-and-blood`:

```bash
node packages/cards/scripts/card-coverage.ts --next-cluster [--cluster <family>]
```

## One cluster

### 1. Classify

Read every member module, pinned test, i18n, CR citations, the named primitive,
foundation types, and `primitive-owners.md`. Re-kind the ledger if it is wrong
(`status/*` is often a missing amount/binding).

Emit:

```json
{
  "cluster": ["binding/unstamped-it"],
  "kind": "definition",
  "strategy": "stamp-at-producer",
  "owningPrimitive": "packages/engine/src/rules/proposals/…",
  "typesChange": "none",
  "catalogRewrite": true,
  "grandfatheredStatusSlug": false,
  "proofs": [{ "collector": "UPR119", "from": "silent-noop", "to": "printed-trio" }],
  "forbidden": ["new FAB_STATUS_MARKERS entry"]
}
```

`strategy` is the closed enum in `references/decision-tree.md`.

### 2. Skeptic (fail-closed)

Independent pass against that tree. A rejected design is no-progress. Do not
“just add the handler.” Two consecutive rejects on the same cluster stop for a
human.

### 3. Implement — primitive first, then every member

1. Types only if the closed union is missing a CR kind.
2. Owning engine primitive (stamp and/or exhaustive switch). Principle 9: a new
   discriminant breaks types + evaluator + proposal + semantics map.
3. Catalog rewrite of **every** member onto that primitive. No RGB leftover.
4. Proof is the AAA trio on real cards through public moves — **not**
   `JSON.stringify(card)` / `it("encodes …")` / a new `*-guard.test.ts`.
   Optionally add the dead slug to the catalog-wide inventory in
   `has-status-coverage.test.ts` (`DEAD_MARKERS`); do not mint per-card encode tests.
5. Convert every pinned member suite from `toThrow` / silent-no-op into the AAA
   trio. Public fluent verbs; real authored cards only.
6. Grandfather `has-status` handlers only as delegates to the new amount/binding.
   Prefer deleting the slug from modules so `has-status-coverage.test.ts.snap`
   shrinks because the catalog no longer reads it.

### 4. Evidence

- `vp run check-types`
- Focused tests on the primitive and converted AAA members. Gate on
  captured output (`passed` and not `fail`); `vp test run` can exit 0 on
  suite-load errors.
- Resolve each family:

```bash
node packages/cards/scripts/card-coverage.ts --resolve-family <id> \
  --resolved-by "primitive path + AAA trio"
```

- One playbook line **only** for a harness/AAA surprise.
- Submodule `vp run ci-check` at the end of a multi-cluster run or when asked to
  finish — not after every cluster on a dirty snapshot-persistence branch.

### 5. Lesson

Append one line to `references/primitive-owners.md` (merge duplicates):

```
- [theme] owning primitive → stamp site → AAA trio — path (YYYY-MM-DD)
```

## Do not

- Add a `CONDITION_STATUS_HANDLERS` entry and leave modules on a this-way /
  this-turn / N-or-more slug.
- Fold `conditional.instead` in the engine (`docs/fab-instead-migration-ledger.md`).
- Fail-close unknown `has-status` markers.
- Half-fix one card so a throw goes away.
- Invent a card-text parser or a trainer card.
- Implement party / multiplayer / event-deck (`out-of-scope`).
- Fan out families that share engine files in parallel.
- Open a sibling git worktree or copy the checkout to isolate the cluster.
- Add a `JSON.stringify` / `toContain` / `it("encodes …")` catalog guard as
  proof the rewrite landed. Proof is play.
