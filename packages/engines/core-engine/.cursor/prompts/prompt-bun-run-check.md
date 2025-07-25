## Task: Ensure all checks pass via `bun run check`

**Goal:**  
Run `bun run check` (which executes formatting, linting, type-checking, and all tests) on the current codebase. If any check fails, analyze errors and update the code to resolve ALL issues so that `bun run check` passes cleanly. Do **not** skip any step.

**Rules and Process:**

- **Checks:**  
  - Run:  
    - `bun run lint`  
    - `bun run format`  
    - `bun run check-types`  
    - `AGENT=1 bun test`  AGENT=1 is used to disable the logger.
  - All must pass with no errors, warning are allowed.
  - If errors appear, fix code until all checks succeed.

- **Test Requirements:**  
  - Code changes must be covered by tests that specify expected behavior, not implementation details.
  - Use TDD: Add failing tests before any production code.
  - No mocking/stubbing—use real objects.
  - Use schemas from shared locations (never redefine).

- **Development Flow:**  
  1. Run `bun run check`.
  2. For each failure:
     - Describe the error.
     - Show how you fixed it (test-first if fixing code).
     - Re-run `bun run check` after each fix.
     - Repeat until all checks pass.
  3. **Do not commit unless `bun run check` passes.**

- **Documentation:**  
  - Update `IMPLEMENTATION-LOGS.md` before/after the task with progress, decisions, and learnings.
  - Summarize progress and fixes at the end.

- **Coding Standards:**  
  - Follow architecture/design patterns from `/docs/**/*.md`.
  - Use logger.log for logging (never console.log).
  - Use immutable data and functional style.
  - TypeScript strict mode—no `any`, no type assertions.
  - Prefer `type` over `interface`.
  - No comments—use clear names and structure.
  - Use options objects for function parameters.

**Summary:**  
Your task is only complete when `bun run check` passes without errors. Fix all issues—formatting, linting, types, and tests—following TDD and the documented architecture and style guides. Document your process in `IMPLEMENTATION-LOGS.md`.