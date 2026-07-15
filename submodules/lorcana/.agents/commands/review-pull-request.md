---
name: review-pull-request
description: Review a pull request without modifying code or external state, prioritizing bugs, regressions, risk, and missing tests.
user_invokable: true
---

# Review Pull Request

Identify the explicit PR or the PR for the current branch. Read its metadata,
complete diff, relevant instructions, tests, and unresolved review threads.

- Lead with actionable findings ordered by severity.
- Ground each finding in a tight file and line reference.
- Prioritize correctness, security, regressions, boundaries, and coverage over
  style preferences.
- Distinguish pre-existing issues from PR regressions.

Do not edit files, post comments, resolve threads, approve, or merge unless the
user separately requests that action. If no findings exist, say so and state
remaining test gaps or residual risk.
