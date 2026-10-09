# Public TCG Repository

Contains game engines, simulators, and shared tooling. Production platform
services and deployment configuration live in the private repository.

- Start with [submodules/AGENTS.md](submodules/AGENTS.md) and the nearest owner
  guide when editing product code.
- Preserve unrelated work; other agents can share the checkout.
- Keep game rules in game workspaces and shared code game-agnostic.
- Use the game's rules skill for rules-facing changes.
- Follow local patterns, keep types accurate, and fix the cause of the problem.
- Keep private platform code, credentials, and service topology out of this export.
- Use the smallest validation scope: focused local tests for cards and engines,
  and only the owning simulator with local practice or fixtures for UI changes.
  Check affected consumers for shared contract changes. Browser inspection does
  not require platform services. Documentation changes need only diff and link
  review; no application runtime or automated tests are required.
- Stop when focused checks cover the change. Expand only for a specific missing
  check or relevant failure. Full-platform validation belongs to end-to-end
  service integration work in the private repository.
- Make routine decisions without asking; ask when a material scope decision
  needs the user. Report changes, validation, and remaining limits.

Keep guides short; detailed procedures belong in skills or local documentation.
