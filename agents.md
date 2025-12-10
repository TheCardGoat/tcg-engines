# AI Agent Setup Guide

This document provides instructions for AI agents to set up the development environment for the TCG Engines project.

## Overview

This project requires:
- **Node.js 24.x** - JavaScript runtime (managed via fnm)
- **Bun 1.2.18+** - Primary package manager and runtime
- **fnm** - Fast Node Manager for Node.js version management

## Quick Setup

The easiest way to set up the environment is to run the automated setup script:

```bash
chmod +x setup.sh
./setup.sh
```

## Manual Setup Instructions

If you prefer to set up manually or the script doesn't work, follow these steps:

### 1. Install fnm (Fast Node Manager)

fnm is used to manage Node.js versions. Install it with:

```bash
curl -o- https://fnm.vercel.app/install | bash
```

After installation, restart your terminal or source your shell configuration:
- For bash: `source ~/.bashrc`
- For zsh: `source ~/.zshrc`

**Reference**: https://github.com/Schniz/fnm

### 2. Install Node.js 24

Use fnm to install Node.js 24:

```bash
fnm install 24
fnm use 24
```

Verify the installation:
```bash
node -v  # Should print "v24.12.0" or similar v24.x version
npm -v   # Should print "11.6.2" or similar 11.x version
```

**Reference**: https://nodejs.org/en/download

### 3. Install Bun

Bun is the primary package manager and runtime for this project:

```bash
curl -fsSL https://bun.sh/install | bash
```

After installation, restart your terminal or source your shell configuration.

Verify the installation:
```bash
bun -v  # Should print "1.2.18" or later
```

**Reference**: https://bun.com/

### 4. Install Project Dependencies

Once Bun is installed, install the project dependencies:

```bash
bun install
```

## Important Notes for AI Agents

### Package Manager

- **Always use `bun`** for package management commands:
  - `bun install` (not `npm install`)
  - `bun add <package>` (not `npm install <package>`)
  - `bun remove <package>` (not `npm uninstall <package>`)

### Running Scripts

- Use `bun run <script>` to execute package.json scripts
- Use `bunx` for running packages (equivalent to `npx`)
- Example: `bunx turbo run build`

### Node.js Version

- The project uses Node.js 24.x (specified in `.node-version`)
- fnm will automatically switch to the correct version when you enter the project directory (if configured)
- The version is also specified in `package.json` under `volta.node`

### Bun Version

- The project requires Bun 1.2.18 (specified in `package.json` as `packageManager`)
- This is enforced by the package manager field

### Script Execution

- TypeScript scripts can be run directly with Bun: `bun run script.ts`
- Scripts with shebang `#!/usr/bin/env bun` can be executed directly: `./script.ts`
- No compilation step is needed - Bun handles TypeScript natively

## Verification

After setup, verify everything is working:

```bash
# Check Node.js version
node -v  # Should be v24.x

# Check npm version (comes with Node.js)
npm -v   # Should be 11.x

# Check Bun version
bun -v   # Should be 1.2.18 or later

# Check fnm (if using automatic version switching)
fnm --version

# Install dependencies
bun install

# Run a test command
bun run check-types
```

## Troubleshooting

### fnm not found after installation

- Restart your terminal
- Or manually source: `source ~/.bashrc` or `source ~/.zshrc`
- Check that fnm is in your PATH: `echo $PATH | grep fnm`

### Node.js version incorrect

- Ensure fnm is configured in your shell
- Run `fnm use 24` to switch to Node.js 24
- Check `.node-version` file contains `24` or `24.12.0`

### Bun not found after installation

- Restart your terminal
- Or manually add to PATH: `export PATH="$HOME/.bun/bin:$PATH"`
- Verify installation: `which bun`

### Package installation issues

- Ensure you're using `bun install` (not npm/yarn/pnpm)
- Clear cache if needed: `bun pm cache rm`
- Check `package.json` has `"packageManager": "bun@1.2.18"`

## Project Structure

- Root `package.json` defines workspaces and scripts
- Each package in `packages/` has its own `package.json`
- Turborepo is used for monorepo task orchestration
- All commands should be run from the root directory

## Common Commands

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

# Run all checks (format, lint, type check, test)
bun run ci-check

# Build all packages
bun run build
```

## Environment Variables

The project may use environment variables. Check for:
- `.env.local` files (gitignored)
- Environment variable documentation in package READMEs

## Additional Resources

- [Bun Documentation](https://bun.com/docs)
- [fnm Documentation](https://github.com/Schniz/fnm)
- [Node.js Documentation](https://nodejs.org/docs)
- [Project README](./README.md)

