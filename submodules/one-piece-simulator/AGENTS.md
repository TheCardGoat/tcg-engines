# One Piece Simulator Submodule

This submodule is a copied One Piece simulator snapshot with engine, cards,
types, utils, and a browser simulator.

Production entry point:

- Simulator path: `https://tcg.online/one-piece/simulator`, `https://one-piece.tcg.online/`

Slug warning: platform web content/deck code currently uses `onepiece`, while
runtime protocol and game-server code use `one-piece`. Check the layer you are
editing before changing slugs.

Before rules-facing work, read
`.agents/skills/op-rules/comprehensive-rules.md` and keep the relevant game
terms in context.

Platform runtime or shared simulator exposure should map One Piece concepts
through `../agnostic-simulator` contracts/adapters. Keep One Piece rules, cards,
engine semantics, and glossary-native wording inside this submodule.

## Where To Look

- `packages/engine/src` - One Piece rules engine, moves, phases, battle, DON,
  prompts, and tests.
- `packages/cards/src` - card definitions and generated card data.
- `packages/types/src` - shared card/game types.
- `packages/utils/src` - utility helpers shared by the simulator packages.
- `apps/simulator/src` - browser simulator UI and interaction flows.
- `tools/op-card-parser` - parser/import tooling for One Piece card data.

## Bug Triage

- Browser interaction bugs start in `apps/simulator/src`; engine legality bugs
  start in `packages/engine/src`.
- Card data/implementation bugs start in `packages/cards/src`, then trace into
  engine resolution if the card definition is correct.
- Production route failures may involve `../platform/apps/reverse-proxy` before
  this simulator receives the request.

## Agent Backpressure Gates

Use the root `/backpressured` command for long-running One Piece work. Read the
comprehensive rules reference before rules-facing edits.

- Card behavior: use interaction-style engine tests that drive real commands
  such as play, attack, activate, and prompt resolution instead of mutating
  state directly.
- Engine legality: focused engine test first, then broader package checks.
- Browser interaction: simulator route/browser proof before broad CI.
- Production route issue: validate reverse-proxy ownership before changing the
  simulator.

When the report concerns a single card, the completion gate is not card text
alone; it must execute the behavior through the test harness.

## Validation

- From this submodule: `vp check`, `vp test`, focused package tests, or
  `pnpm run ci-check`.
- From repo root: `bun run ci:one-piece:check`.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ built-in commands (`vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool, not any `package.json` script of the same name. To run a custom script that shares a name with a built-in command, use `vp run <script>`. For example, if you have a custom `dev` script that runs multiple services concurrently, run it with `vp run dev`, not `vp dev` (which always starts Vite's dev server).
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## CI Integration

For GitHub Actions, consider using [`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) to replace separate `actions/setup-node`, package-manager setup, cache, and install steps with a single action.

```yaml
- uses: voidzero-dev/setup-vp@v1
  with:
    cache: true
- run: vp check
- run: vp test
```

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->
