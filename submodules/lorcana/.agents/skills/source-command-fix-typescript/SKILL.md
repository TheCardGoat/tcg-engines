---
name: source-command-fix-typescript
description: Diagnose and fix TypeScript errors within a specified Lorcana package using that package's current scripts and ownership boundary.
---

# Fix Package TypeScript Errors

1. Resolve the target package path and read its `package.json` plus nearest
   `AGENTS.md`.
2. Run the package's declared `check-types`, `typecheck`, or `check` script.
   Prefer `bun run --cwd <package> <script>` or the workspace's documented
   `vp` command; do not assume a Turbo task exists.
3. Group errors by root cause and fix the smallest group first.
4. Preserve discriminated unions and exhaustiveness. Do not use `any`, broad
   assertions, or ignore directives to silence failures.
5. Re-run the exact focused command after each patch.
6. If the correct fix belongs to another package, report that ownership issue
   instead of adding a local compatibility cast.

Completion requires zero target-package TypeScript errors from the declared
package check, with any unrelated baseline failures recorded separately.
