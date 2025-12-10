# TCG Engines

**A production-ready, declarative game engine framework for building trading card games (TCGs) and turn-based strategy games.**

> [!NOTE]
> This project is currently in **Phase 1: Stabilization & Polish**. See the [Roadmap](agent-os/product/roadmap.md) for details.

## What Is This Project?

TCG Engines is a **monorepo** containing a complete TypeScript framework (`@tcg/core`) for building trading card games, along with reference implementations, development tools, and comprehensive documentation. It empowers developers to build sophisticated card games by focusing on game-specific rules rather than infrastructure concerns.

### Mission

To become the definitive TypeScript framework for TCG development, empowering developers to build sophisticated card games by focusing on game-specific rules rather than infrastructure concerns.

[Read the full Mission Statement](agent-os/product/mission.md) | [Learn about our Design Philosophy](agent-os/product/philosophy.md)

### Target Audience

- **Indie Game Developers** - Building their first or second TCG, want to focus on game design
- **TCG Platform Builders** - Creating platforms to support multiple card games
- **Game Studio Engineers** - Professional developers building commercial TCGs
- **Open Source Contributors** - Interested in game engine architecture
- **Educational Users** - Learning game development or TCG mechanics

## What It Offers

### 🎮 Core Framework (`@tcg/core`)

A production-ready, declarative game engine framework providing:

- **Declarative Game Definitions** - Define your game rules, zones, and cards through configuration, not boilerplate
- **Immutable State Management** - Powered by [Immer](https://immerjs.github.io/immer/), ensuring safe state updates and easy undo/redo
- **Type Safety** - Built with TypeScript 5.8+ for a fully type-safe development experience
- **Deterministic Gameplay** - Seeded RNG ensures replays and validations are always consistent
- **Network Synchronization** - Efficient delta-based state synchronization using Immer patches
- **Time-Travel Debugging** - Built-in support for undo, redo, and history replay
- **Player Views** - Automatic information hiding for multiplayer games
- **Flow Orchestration** - Optional turn/phase/segment management
- **Zone Management** - Comprehensive zone operations for card locations
- **Targeting System** - Complex targeting requirements and validation
- **Card Filtering DSL** - Query cards with a fluent API
- **Logging & Telemetry** - Production-grade logging and event tracking
- **Testing Utilities** - Complete TDD toolkit with assertions and factories
- **Validation System** - Type guards and runtime validators for data integrity

[Read the Core Framework Documentation](packages/core/README.md)

### 🎯 Reference Implementations

Complete, production-ready game engines demonstrating best practices:

- **`@tcg/lorcana`** - Disney Lorcana TCG implementation
  - Complete game rules and mechanics
  - Card definitions and abilities
  - Phase and turn management
  - [Lorcana Engine README](packages/lorcana-engine/README.md)

- **`@tcg/gundam`** - Gundam Card Game implementation
  - Full game rules implementation
  - Card definitions for all sets
  - Tooling for card management (scraper, parser, generator)
  - [Gundam Engine README](packages/gundam-engine/README.md)

- **`@tcg/template`** - Template for creating new engines
  - Minimal working example
  - Follows @tcg/core best practices
  - Fully tested with TDD approach
  - [Template Engine README](packages/template-engine/README.md)

### 🛠️ Development Tools

Supporting packages for building and maintaining game engines:

- **`@tcg/component-library`** - Svelte-based UI component library
  - Reusable components for TCG interfaces
  - Storybook integration
  - Internationalization support

- **`@tcg/shared`** - Shared utilities and types
  - Common utilities across packages
  - Shared type definitions

- **`@tcg/typescript-config`** - Shared TypeScript configurations
  - Consistent TypeScript settings across packages
  - Base, library, Next.js, React, and strict configs

### 📚 Documentation & Standards

Comprehensive documentation and coding standards:

- **Product Documentation** - Mission, roadmap, tech stack
- **Coding Standards** - Frontend, backend, library, and testing guidelines
- **Integration Guides** - How to build game engines with @tcg/core
- **API Documentation** - Complete API reference
- **Examples** - Integration examples and patterns

## Project Structure

This project is organized as a **monorepo** using [Turborepo](https://turbo.build/repo) for efficient task orchestration and caching.

```
tcg-engines/
├── packages/
│   ├── core/                    # Core framework (@tcg/core)
│   │   ├── src/                 # Framework source code
│   │   │   ├── engine/          # RuleEngine - Main orchestration
│   │   │   ├── game-definition/ # GameDefinition types and validation
│   │   │   ├── moves/           # Move system and execution
│   │   │   ├── flow/            # Turn/phase/segment management
│   │   │   ├── zones/           # Zone management system
│   │   │   ├── cards/           # Card instances and modifiers
│   │   │   ├── filtering/      # Card query DSL
│   │   │   ├── targeting/       # Targeting system
│   │   │   ├── rng/             # Seeded random number generation
│   │   │   ├── logging/          # Structured logging system
│   │   │   ├── telemetry/       # Event-based telemetry
│   │   │   ├── testing/         # Testing utilities
│   │   │   ├── validation/      # Type guards and validators
│   │   │   └── types/           # Branded types and utilities
│   │   └── docs/                # Comprehensive documentation
│   │
│   ├── engines/
│   │   └── core-engine/         # Large reference implementation (4443+ files)
│   │
│   ├── gundam-engine/           # Gundam Card Game implementation
│   │   ├── src/
│   │   │   ├── cards/           # Card definitions organized by set
│   │   │   ├── game-definition.ts
│   │   │   ├── moves/           # Move implementations
│   │   │   ├── phases/          # Phase definitions
│   │   │   └── zones/           # Zone configurations
│   │   └── tools/               # Card management tools (scraper, parser, generator)
│   │
│   ├── lorcana-engine/          # Disney Lorcana TCG implementation
│   │   ├── src/
│   │   │   ├── game-definition/ # Game definition and configuration
│   │   │   ├── moves/           # Move handlers
│   │   │   ├── cards/           # Card definitions and abilities
│   │   │   ├── types/           # TypeScript type definitions
│   │   │   └── operations/      # Game operations
│   │
│   ├── template-engine/         # Template for creating new engines
│   │   └── src/                 # Minimal working example
│   │
│   ├── component-library/       # Svelte-based UI components
│   │   └── src/                 # Component library source
│   │
│   ├── shared/                  # Shared utilities and types
│   │   └── src/                 # Common utilities
│   │
│   └── typescript-config/       # Shared TypeScript configurations
│
├── agent-os/                    # Project documentation and standards
│   ├── product/                 # Product documentation
│   │   ├── mission.md           # Product mission statement
│   │   ├── roadmap.md            # Development roadmap
│   │   └── tech-stack.md         # Technical stack details
│   └── standards/               # Coding standards and guidelines
│       ├── frontend/            # Frontend standards
│       ├── backend/             # Backend standards
│       ├── library/             # Library standards
│       ├── testing/             # Testing standards
│       └── global/              # Global standards
│
├── package.json                 # Root package.json with workspace configuration
├── turbo.json                   # Turborepo configuration
└── README.md                    # This file
```

### Package Dependencies

```
┌─────────────────────────────────────────────────────────┐
│                    Game Engines                         │
│  (lorcana-engine, gundam-engine, template-engine)       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ depends on
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    @tcg/core                            │
│              (Core Framework)                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ uses
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Shared & Config Packages                        │
│  (shared, typescript-config, component-library)         │
└─────────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.2.18) - **Primary package manager and JavaScript runtime**
  - This project uses Bun as the package manager (specified in `package.json`)
  - Bun provides fast package installation, testing, and bundling
  - Install: `curl -fsSL https://bun.sh/install | bash`
- [Node.js](https://nodejs.org/) (v24.x) - For compatibility with some tools
- [fnm](https://github.com/Schniz/fnm) (optional) - Fast Node.js version manager
  - This repository includes a `.node-version` file for automatic Node.js version switching
  - If you're using fnm, it will automatically switch to Node.js v24.x when you enter this directory
- Git - Version control

### Installation

**Quick Setup (Recommended for macOS/Linux):**

Run the automated setup script:

```bash
git clone https://github.com/the-card-goat/tcg-engines.git
cd tcg-engines
chmod +x setup.sh
./setup.sh
```

**Manual Setup (macOS/Linux):**

```bash
git clone https://github.com/the-card-goat/tcg-engines.git
cd tcg-engines
bun install
```

**Windows Setup:**

The automated setup script (`setup.sh`) is designed for macOS/Linux. On Windows, please follow these steps:

1. **Install Node.js 24.x**
   - Download from [nodejs.org](https://nodejs.org/) or use a version manager like [fnm for Windows](https://github.com/Schniz/fnm#windows)
   - Verify: `node -v` should show v24.x

2. **Install Bun**
   - Use PowerShell: `powershell -c "irm bun.sh/install.ps1 | iex"`
   - Or download from [bun.sh](https://bun.sh/)
   - Verify: `bun -v` should show 1.2.18 or later

3. **Install Dependencies**
   ```bash
   git clone https://github.com/the-card-goat/tcg-engines.git
   cd tcg-engines
   bun install
   ```

**For AI Agents:** See [agents.md](./agents.md) for detailed setup instructions and environment configuration.

### Troubleshooting

**Common Setup Issues:**

- **fnm not found after installation**: Restart your terminal or manually source your shell config (`source ~/.bashrc` or `source ~/.zshrc`)
- **Node.js version incorrect**: Run `fnm use 24` (if using fnm) or ensure Node.js 24.x is active
- **Bun not found after installation**: Restart your terminal or add to PATH: `export PATH="$HOME/.bun/bin:$PATH"`
- **Package installation fails**: Ensure you're using `bun install` (not npm/yarn/pnpm) and check that `package.json` specifies `"packageManager": "bun@1.2.18"`

For more detailed troubleshooting, see the [Troubleshooting section in agents.md](./agents.md#troubleshooting).

### Quick Start for Framework Users

If you want to **use** `@tcg/core` to build your own game:

1. **Read the Core Documentation**
   ```bash
   # Explore the core framework
   cat packages/core/README.md
   ```

2. **Use the Template Engine**
   ```bash
   # Copy the template as a starting point
   cp -r packages/template-engine packages/my-game-engine
   cd packages/my-game-engine
   # Follow the template README to customize
   ```

3. **Study Reference Implementations**
   - Review `packages/lorcana-engine` for a complex TCG example
   - Review `packages/gundam-engine` for another implementation pattern
   - Review `packages/template-engine` for a minimal example

4. **Read Integration Guides**
   - [Core Framework README](packages/core/README.md)
   - [Engine Integration Guide](packages/core/docs/ENGINE_INTEGRATION.md)
   - [Template Engine README](packages/template-engine/README.md)

### Quick Start for Contributors

If you want to **contribute** to the framework or engines:

1. **Set Up Development Environment**
   ```bash
   # Install dependencies
   bun install
   
   # Run type checking
   bun run check-types
   
   # Run tests
   bun test
   
   # Run linting
   bun run lint
   
   # Format code
   bun run format
   ```

2. **Run All Checks**
   ```bash
   # Run format, lint, type check, and tests
   bun run ci-check
   ```

3. **Work on Specific Packages**
   ```bash
   # Navigate to a package
   cd packages/core
   
   # Run package-specific commands
   bun test
   bun run check-types
   ```

### Common Tasks

**Build all packages:**
```bash
bun run build
```

**Run tests for all packages:**
```bash
bun test
```

**Run tests for a specific package:**
```bash
cd packages/core
bun test
```

**Type check all packages:**
```bash
bun run check-types
```

**Lint all packages:**
```bash
bun run lint
```

**Format all packages:**
```bash
bun run format
```

## Development Workflow

### Monorepo Commands

This project uses [Turborepo](https://turbo.build/repo) for task orchestration. All commands are run from the root:

- `bun run build` - Build all packages
- `bun test` - Run tests for all packages
- `bun run lint` - Lint all packages
- `bun run format` - Format all packages
- `bun run check-types` - Type check all packages
- `bun run ci-check` - Run format, lint, type check, and tests

### Package-Specific Development

Each package can be developed independently:

```bash
# Navigate to package
cd packages/core

# Install dependencies (if needed)
bun install

# Run package scripts
bun test              # Run tests
bun run check-types   # Type check
bun run lint          # Lint
bun run format        # Format
```

### Testing Strategy

- **Test-Driven Development (TDD)** - Write tests first
- **Behavior-Driven Testing** - Test observable behavior, not implementation
- **Real Engine Instances** - Integration tests with actual engine
- **95%+ Coverage Target** - Comprehensive test coverage

### Code Quality

- **Biome** - Fast linting and formatting (replaces ESLint + Prettier)
- **TypeScript Strict Mode** - Full type safety, no `any` types
- **Turborepo Boundaries** - Enforced package dependencies

### Development Standards

All code follows strict standards documented in `agent-os/standards/`:

- **Type Safety** - No `any` types, proper type guards
- **Immutable State** - All state changes via Immer
- **Pure Functions** - Prefer pure, testable functions
- **Comprehensive Documentation** - JSDoc comments for public APIs
- **Test Coverage** - 95%+ coverage requirement

## Documentation

### Core Framework Documentation

- **[Core Framework README](packages/core/README.md)** - Complete framework overview
- **[Engine Integration Guide](packages/core/docs/ENGINE_INTEGRATION.md)** - How to build game engines
- **[Logging Guide](packages/core/docs/LOGGING.md)** - Structured logging system
- **[Telemetry Guide](packages/core/docs/TELEMETRY.md)** - Event-based telemetry
- **[Zone Operations Guide](packages/core/docs/guides/zone-operations.md)** - Zone management utilities
- **[Testing Utilities Guide](packages/core/docs/guides/testing-utilities.md)** - TDD workflow and patterns
- **[Card Tooling Guide](packages/core/docs/guides/card-tooling.md)** - Building card management pipelines
- **[Validation Guide](packages/core/docs/guides/validation.md)** - Type guards and runtime validation
- **[Move Enumeration Guide](packages/core/docs/guides/move-enumeration.md)** - AI and UI move discovery

### Product Documentation

- **[Product Mission](agent-os/product/mission.md)** - Full mission statement and vision
- **[Design Philosophy](agent-os/product/philosophy.md)** - Core design principles and philosophy
- **[Development Process](agent-os/product/development-process.md)** - Development approach and implementation strategy for contributors
- **[Technical Stack](agent-os/product/tech-stack.md)** - Complete technical stack details
- **[Roadmap](agent-os/product/roadmap.md)** - Development roadmap and phases

### Coding Standards

- **[Global Coding Style](agent-os/standards/global/coding-style.md)** - General coding guidelines
- **[Frontend Standards](agent-os/standards/frontend/)** - Frontend-specific standards
- **[Backend Standards](agent-os/standards/backend/)** - Backend-specific standards
- **[Library Standards](agent-os/standards/library/)** - Library development standards
- **[Testing Standards](agent-os/standards/testing/)** - Testing guidelines

### Reference Implementation Documentation

- **[Lorcana Engine README](packages/lorcana-engine/README.md)** - Disney Lorcana implementation
- **[Gundam Engine README](packages/gundam-engine/README.md)** - Gundam Card Game implementation
- **[Template Engine README](packages/template-engine/README.md)** - Template for new engines

### Examples

- **[Integration Examples](packages/core/docs/examples/)** - Complete integration examples
  - Zone management examples
  - Test patterns examples
  - Card parser extensions
  - Custom validators
  - Move enumeration demos

## Tech Stack

- **Language**: TypeScript 5.8+
- **Package Manager & Runtime**: [Bun](https://bun.sh/) 1.2.18
  - Fast package installation (30x faster than npm)
  - Built-in test runner (Jest-compatible)
  - Built-in bundler
  - Node.js-compatible runtime
- **State Management**: Immer 10.0.0+
- **Validation**: Zod 3.22.0+
- **RNG**: seedrandom 3.0.5+
- **IDs**: nanoid 5.0.0+
- **Build System**: Turborepo
- **Code Quality**: Biome 2.0.4
- **Testing**: Bun Test (Jest-compatible)

[View the full Tech Stack Documentation](agent-os/product/tech-stack.md)

## Roadmap

### Phase 1: Stabilization & Polish (Current)

- Performance optimization
- Enhanced error messages
- Tutorial documentation
- Test utilities enhancement
- Reference implementation completion

### Phase 2: Ecosystem Expansion (Planned)

- Plugin system
- React/Vue/Svelte integrations
- WebSocket transport layer
- AI move enumeration
- VSCode extension

### Phase 3: Production Features (Future)

- Horizontal scaling support
- Tournament system
- Analytics dashboard
- Enterprise features

[View the complete Roadmap](agent-os/product/roadmap.md)

## Contributing

We welcome contributions! Here's how to get started:

1. **Read the Documentation**
   - Understand our [Development Process](agent-os/product/development-process.md) and approach
   - Review [Coding Standards](agent-os/standards/global/coding-style.md)
   - Understand [Testing Standards](agent-os/standards/testing/)
   - Check the [Roadmap](agent-os/product/roadmap.md) for priorities

2. **Set Up Development Environment**
   ```bash
   bun install
   bun run ci-check  # Ensure everything passes
   ```

3. **Make Changes**
   - Follow TDD approach (write tests first)
   - Maintain 95%+ test coverage
   - Follow coding standards
   - Update documentation as needed

4. **Submit Changes**
   - Create a pull request
   - Ensure all checks pass
   - Request review

### Contribution Guidelines

- **Type Safety** - No `any` types, use proper TypeScript types
- **Test Coverage** - 95%+ coverage required
- **Documentation** - Update docs for public API changes
- **Code Style** - Follow Biome formatting and linting rules
- **Commit Messages** - Use conventional commits format

## License

[MIT](LICENSE) © The Card Goat Team

---

**Built with ❤️ for trading card game developers**
