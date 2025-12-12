---
paths: packages/component-library/**/*.{ts,svelte}
---

# Component Library Rules

## Overview

The component-library package is a Svelte 5 UI component library for TCG interfaces. It uses modern Svelte runes syntax, TailwindCSS v4, Storybook for documentation, and Paraglide.js for internationalization.

## Package Structure

```
packages/component-library/
├── src/
│   ├── lib/
│   │   ├── components/       # Reusable components
│   │   ├── paraglide/       # i18n messages and runtime
│   │   └── index.ts         # Library exports
│   ├── routes/              # Demo application
│   └── stories/             # Storybook stories
├── project.inlang/          # Paraglide configuration
└── package.json
```

## Svelte 5 Runes Syntax

Use modern Svelte 5 runes:

```svelte
<script lang="ts">
  interface Props {
    primary?: boolean;
    label: string;
    onClick?: () => void;
  }

  const { primary = false, label, onClick, ...props }: Props = $props();

  let count = $state(0);
  let doubled = $derived(count * 2);
  let mode = $derived(primary ? "primary" : "secondary");
</script>

<button class="btn btn-{mode}" onclick={onClick} {...props}>
  {label} ({doubled})
</button>
```

### Key Runes

| Rune | Purpose |
|------|---------|
| `$props()` | Receive component props |
| `$state()` | Reactive state |
| `$derived()` | Computed values |
| `$effect()` | Side effects |

## Component Workflow

When adding new components:

1. **Create component** in `src/lib/components/`
2. **Export** from `src/lib/index.ts`
3. **Add Storybook story** in `src/stories/`
4. **Write unit tests** alongside the component
5. **Verify** with `bun run check` and `bun test`

## TailwindCSS v4

Use TailwindCSS utility classes:

```svelte
<div class="flex items-center gap-4 p-4 rounded-lg bg-slate-100">
  <span class="text-lg font-semibold text-slate-900">{label}</span>
</div>
```

## Internationalization

Paraglide.js handles translations:

**Supported locales:** en, de, fr, it, pt, zh, ja

```typescript
import * as m from "$lib/paraglide/messages";

// In component
<p>{m.hello_world()}</p>
```

Message files: `src/lib/paraglide/messages/`

## Storybook

Document components with stories:

```typescript
// src/stories/Button.stories.ts
import type { Meta, StoryObj } from "@storybook/svelte";
import Button from "$lib/components/Button.svelte";

const meta: Meta<Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    primary: { control: "boolean" },
    label: { control: "text" },
  },
};

export default meta;

export const Primary: StoryObj<Button> = {
  args: {
    primary: true,
    label: "Click me",
  },
};
```

## Commands

```bash
# Development
bun run dev          # Start dev server
bun run storybook    # Start Storybook

# Testing
bun test             # Unit tests
bun run test:e2e     # E2E tests with Playwright

# Building
bun run build        # Build library
bun run build-storybook  # Build Storybook
```

## Best Practices

1. **Use TypeScript** - Define Props interface for all components
2. **Runes syntax** - Always use `$props()`, `$state()`, `$derived()`
3. **Export properly** - Add to `src/lib/index.ts`
4. **Write stories** - Every component needs Storybook documentation
5. **Test thoroughly** - Unit tests for logic, E2E for interactions

## Existing CLAUDE.md

This package has its own `CLAUDE.md` with additional context at:
`packages/component-library/CLAUDE.md`
