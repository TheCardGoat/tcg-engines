You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Lorcana package boundary

- `@tcg/lorcana-engine` must not import `@tcg/lorcana-cards`, including in test files, because that creates a cyclic dependency.
- When a test needs both the engine harness and real card definitions, put that test in `packages/lorcana/lorcana-simulator/src/testing/**`.

## Visual regression routes

- In development, use `http://localhost:5174/` as the dark-only dev console for local fixture,
  regression, and live-surface navigation. The production root route must keep redirecting to
  `/matchmaking`.
- Use `http://localhost:5174/tests/regressions` as the index for player-reported visual fixtures.
  Search it before adding a new case, reuse an existing fixture when the board state is materially
  the same, and keep the saved fixture after the fix so future agents can verify the browser state.
- Prefer one reusable fixture plus one focused assertion. Put engine assertions in
  `src/testing/regressions/` with `createRegressionTestEngine`; put browser assertions in
  `e2e/regressions/` and build links with the shared regression-route helpers.

## Use Svelte Shadcn whenever possible

https://www.shadcn-svelte.com/llms.txt

## When using Shadcn is not an option use DaisyUI

https://daisyui.com/llms.txt

## When using DaisyUI is not an option use TailwindCSS

[Tailwind CSS](https://tailwindcss.com/)

## Only then try to write custom CSS if the above options do not meet the requirements of the task.

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
