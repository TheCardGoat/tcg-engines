---
name: review-pr-comments
description: Inspect unresolved pull-request review threads, implement actionable fixes, validate them, and update thread state only after proof.
user_invokable: true
---

# Address PR Review Comments

Identify the explicit PR or the PR for the current branch. Fetch review threads
with inline context and resolution state; flat comments are insufficient.

1. Separate actionable requests from stale, resolved, duplicate, optional, or
   incorrect comments.
2. Inspect current code and the PR diff before accepting a suggestion.
3. Apply one coherent fix at a time and run the smallest relevant check.
4. Review the complete diff for scope and regressions.
5. Reply to or resolve a thread only after the fix is proven.

Do not merge or broaden the PR unless requested. Report addressed, declined,
and unresolved blocking threads plus checks run.
