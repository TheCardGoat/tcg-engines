# Simulator RTL Tests (vitest + jsdom)

20 specs covering setup, main-phase, end-phase, turn-cycle, and vs-AI.
Each file renders `<SimulatorApp>` directly via the helpers in
`src/test/` and drives the harness the same way the app does in the
browser — minus layout, hover, and real timers.

## Running

```sh
cd submodules/agnostic-simulator/apps/multi-game-simulator
vp test run src/games/gundam                # single run
```

Runs under `vp test` (vitest via vite-plus). Tests are also included
when CI runs `pnpm vp test` at the workspace root.

## Conventions

- Every spec starts with `// @vitest-environment jsdom`. The harness
  also sets `environment: "jsdom"` in `vite.config.ts` for when tests
  run from this package's config, but the pragma makes them work
  under the workspace-root config too.
- Test APIs come from `vite-plus/test`, not `vitest` (see
  `AGENTS.md` — `vp` wraps vitest and direct imports aren't allowed).
- Use `renderSimulator(fixtureFactory)` rather than `render(...)`
  directly. Install order matters: the helper imports
  `../test-setup`'s DOM shims (matchMedia, ResizeObserver, etc.) and
  registers the RTL `cleanup` hook.
- Prefer `{ userEvent }` named import from `@testing-library/
user-event` (not the default) — under `verbatimModuleSyntax` +
  `moduleResolution: nodenext`, the default resolves to the module
  namespace and `.setup()` fails typecheck.

## Patterns worth knowing

**Post-click assertions wrap in `waitFor`.** The engine adapter
defers store notifications via `queueMicrotask`, so asserting
synchronously after a click reads state before React has re-rendered.

```ts
await user.click(confirmButton);
await waitFor(() => {
  expect(screen.queryByRole("region", { name: /mulligan/i })).toBeNull();
});
```

**Finding cards on the battle area uses ids, not text.**
`ArtFallback` only renders card names at scale ≥ 0.75 — battle-area
and hand cards render smaller, so `textContent` doesn't contain the
name in jsdom. Use the helpers in `src/test/queries.ts`:

```ts
const { dev } = renderSimulator(loadPilotPairDemo);
const guncannon = findCardsByName(dev, /Guncannon/i, { excludeWithin: hand })[0];
```

Those helpers filter out `aria-hidden` overlays (CardHoverPreview),
`role="log"` sidebar links (CardLink), and the hand list when given.

**Bot `setTimeout` works in jsdom.** Tests that wait for a bot turn
(`vs-ai/bot-plays-a-turn`, `turn-cycle/multi-turn-exhaust-ready`)
use real timers + a wide `waitFor` timeout (15s). They complete in
~600ms. **Don't use `vi.useFakeTimers()`** — fake timers deadlock
against the engine adapter's `queueMicrotask` subscriber loop via
React state updates.

**Confirm prompts are `<strong>`-wrapped.** `"Confirm <strong>Deploy
Unit</strong>?"` splits across elements. `getByText(/Confirm Deploy
Unit/i)` won't match — assert the Confirm button's presence instead.

**jest-dom matchers don't typecheck under `vite-plus/test`.** Use
plain checks:

- `expect(el).toBeInTheDocument()` → `expect(el).not.toBeNull()`
- `expect(btn).toBeDisabled()` → `expect((btn as HTMLButtonElement).disabled).toBe(true)`
- `expect(el).toBeVisible()` → use `queryBy*` and `null` check, or
  just `findBy*` which throws if missing.

**`queryByRole` for absence uses `{ hidden: true }`.** Without it, a
present-but-`aria-hidden` regression slips past the default
accessibility filter.

## Layout

Tests mirror the e2e directory structure where it was useful:

```
src/__tests__/
├── smoke.test.tsx               boot + console.error assertion
├── setup/                       choose first player, mulligan,
│                                initial hand, shields, ex tokens,
│                                comms log, main-phase landing
├── main-phase/                  deploy-{base,unit},
│                                insufficient-resources,
│                                newly-deployed-cannot-attack,
│                                play-command-action-timing,
│                                submit-error-toast
├── end-phase/                   discard-to-hand-limit
├── turn-cycle/                  multi-turn-exhaust-ready
└── vs-ai/                       bot-plays-a-turn, controls
```

## When to add a Playwright spec instead

See the multi-game simulator e2e docs. Short version: real layout, real
pointer/hover, SSR hydration, or multi-phase chains where nested
`waitFor`s are less readable than a linear browser flow.
