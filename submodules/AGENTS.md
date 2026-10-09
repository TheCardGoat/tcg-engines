# Public Workspace Map

These are tracked source directories, not Git submodules.

- `agnostic-simulator`: shared protocol, contracts, UI, agents, and game adapters.
- Game workspaces: native rules, cards, engines, and import tools. Lorcana
  also owns its dedicated simulator and replay CLI.

Read each owner's guide for local paths and rules skills. Shared concepts live
in agnostic-simulator; adapters map game-specific state and actions into them.
Production platform services remain private.

Use `workspace:*` within a workspace and `link:` across workspaces; follow
existing workspace configuration. Install games before agnostic-simulator when
bootstrapping linked packages. Run checks from the owning workspace;
`pnpm run ci:public` is the optional broad public check at the repository root.

Install only the workspaces needed for the task. Card and engine changes use
focused local tests and relevant data/type checks without servers. Tests in a
simulator package can also run without its dev server. For UI work, run only
the owning simulator and use local practice or existing fixture pages. Check
affected adapters and consumers for shared contract changes; do not make a
broad workspace check or private platform run a routine final step.
