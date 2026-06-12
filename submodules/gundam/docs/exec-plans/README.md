# Execution Plans

First-class artifacts for non-trivial changes. Inspired by
[OpenAI Codex's exec-plans pattern](https://cookbook.openai.com/articles/codex_exec_plans).

## Layout

- `active/` — plans for in-flight work. Commit the plan **before** the implementation.
- `completed/` — plans for shipped work, kept as a decision log.

## When to write one

Write a plan when **any** of these are true:

- The change touches more than one package.
- The change adds, removes, or alters a public engine export.
- The change touches an invariant in [`../design-docs/core-beliefs.md`](../design-docs/core-beliefs.md).
- The change spans more than a single working session.
- A previous attempt at the same change failed and you want to record what didn't work.

For one-file bugfixes or card implementations, skip the plan — a good PR description is enough.

## Template

```md
# <Title>

**Status**: draft | in-progress | shipped | abandoned
**Owner**: <human or agent>
**Started**: YYYY-MM-DD

## Goal

One paragraph. Why this change exists.

## Scope

- In scope: …
- Out of scope: …

## Approach

Bullet points. The shape of the change. Not a code dump.

## Verification

How we'll know it worked. Specific tests / Playwright flows / manual checks.

## Open questions

Things you don't know yet. Resolve before merging.

## Decision log

- YYYY-MM-DD — Decided X instead of Y because …
```

Move the file from `active/` to `completed/` when the PR merges. Don't delete plans — they are the project's memory.
