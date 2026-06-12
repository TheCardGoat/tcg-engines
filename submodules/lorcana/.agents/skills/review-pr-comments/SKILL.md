---
name: review-pr-comments
description: "Systematically process GitHub pull request review feedback end-to-end: pick a target PR, identify unanswered or unresolved comments, handle each thread sequentially, implement required code updates, run repository verification checks, and post clear responses. Use when asked to review PR comments, resolve review threads, or address reviewer suggestions/questions."
---

# Review PR Comments

Process pull request feedback one thread at a time and finish with verified code plus a clear summary.

## Operating Rules

- Process review comments sequentially, never in parallel.
- Read full file context before changing code.
- Ask the user before making product or architecture decisions.
- Do not commit automatically; ask the user after all work is complete.
- Follow repository standards from `AGENTS.md` and `CLAUDE.md`.
- Use Bun-based validation commands from repo root.

## Workflow

### 1. Select a PR

1. List open PRs.
2. If multiple PRs are open and no PR number is specified, ask the user which PR to process.
3. Confirm the selected PR number, title, and author before continuing.

### 2. Gather Full Review Context

Collect:

- PR metadata (title, description, author, changed files)
- Review state (approvals, change requests, unresolved threads)
- All review comments and existing thread replies

Use GitHub MCP tools when available. If unavailable, use `gh` equivalents.

### 3. Build the Unanswered Queue

Create a numbered list of comments that still need action:

- No author reply yet
- Thread unresolved
- Pending change request
- Contains a concrete code suggestion

Exclude already handled threads.

### 4. Process Each Comment (Strictly One by One)

For each queued comment:

1. Present context:
   - Reviewer, file path, line number, thread text, and relevant code snippet
2. Classify the comment:
   - question, bug, improvement suggestion, style concern, or discussion
3. Decide and execute:
   - question: draft and post clear answer
   - valid code suggestion: implement minimal fix, run targeted checks, post confirmation
   - discussion: explain trade-offs, ask user when judgment is needed, then reply
   - no code change needed: post respectful technical rationale
4. Mark thread/comment as processed in your working checklist.

Use this confirmation style after implemented changes:

```text
Implemented. <brief description of what changed>
```

### 5. Verify After Processing

Run repository checks in this order:

```bash
bun test
bun run check-types
bun run lint
```

Fix any introduced issues before final reporting.

### 6. Deliver Final Summary

Report:

- PR number and title
- Total comments processed
- Counts by type (questions answered, code changes made, discussions resolved)
- Files changed with one-line rationale per file
- Validation results for tests, type-check, and lint
- Remaining follow-ups, if any

Use this template:

```text
PR Review Comments Summary
==========================
PR: #<number> - <title>

Comments Processed: <count>
- Questions answered: <count>
- Code changes implemented: <count>
- Discussions responded to: <count>

Changes Made:
- <file>: <description>

All Tests: <PASSED|FAILED>
Type Check: <PASSED|FAILED>
Lint: <PASSED|FAILED>

Next Steps:
- <remaining action or "None">
```
