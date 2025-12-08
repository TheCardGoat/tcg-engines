# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Svelte 5 component library using modern SvelteKit patterns with TypeScript, TailwindCSS v4, Storybook for component documentation, and internationalization support via Paraglide.js. The package is designed to be published as an npm library with proper TypeScript definitions.

## Key Development Commands

### Building and Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the library and demo app for production
- `npm run preview` - Preview the production build locally
- `npm run check` - Run Svelte type checking
- `npm run check:watch` - Run Svelte type checking in watch mode

### Testing
- `npm test` or `npm run test:unit` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright
- Tests are configured for both client-side (browser) and server-side environments

### Component Documentation
- `npm run storybook` - Start Storybook development server (port 6006)
- `npm run build-storybook` - Build Storybook for production

### Package Management
- `npm pack` - Create a local package for testing
- `npm publish` - Publish to npm
- `npm run prepack` - Build and prepare package for publishing (runs automatically)

## Architecture

### Project Structure
- `src/lib/` - Library components and utilities (published as npm package)
- `src/routes/` - Demo/showcase application (not published)
- `src/stories/` - Storybook stories and component examples
- `src/lib/paraglide/` - Internationalization messages and runtime

### Key Technologies
- **Svelte 5** with modern `$props()`, `$derived()` runes syntax
- **TypeScript** with strict type checking
- **TailwindCSS v4** for styling
- **Storybook v10** with SvelteKit integration for component documentation
- **Vitest** for unit testing with browser and node environments
- **Playwright** for E2E testing
- **Paraglide.js** for internationalization (supports en, de, fr, it, pt, zh, ja)

### Component Patterns
Components use Svelte 5's modern runes syntax:
```svelte
<script lang="ts">
  interface Props {
    primary?: boolean;
    label: string;
  }
  const { primary = false, label, ...props }: Props = $props();
  let mode = $derived(primary ? 'primary' : 'secondary');
</script>
```

### Library Structure
The library exports from `src/lib/index.ts` which currently reexports components. When adding new components, remember to:
1. Export them from `src/lib/index.ts`
2. Create corresponding Storybook stories in `src/stories/`
3. Add appropriate unit tests

### Internationalization
Paraglide.js is configured with project settings in `project.inlang` and generates:
- Runtime utilities in `src/lib/paraglide/runtime.js`
- Message files for each supported locale in `src/lib/paraglide/messages/`

### Testing Configuration
- Client tests: Svelte component tests with browser environment support
- Server tests: Node.js environment for non-UI code
- E2E tests: Playwright configured to build and test the preview application

## Development Workflow

When adding new components:
1. Create the component in `src/lib/components/`
2. Export from `src/lib/index.ts`
3. Add Storybook stories in `src/stories/`
4. Write unit tests alongside the component
5. Run `npm run check` and `npm test` before committing
6. Use Storybook to visually verify components

## MCP Integration

The project includes an MCP server configuration for Svelte development tools, available at `https://mcp.svelte.dev/mcp`.