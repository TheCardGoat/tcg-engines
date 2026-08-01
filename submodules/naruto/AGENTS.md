# AGENTS.md — submodules/naruto

## Package map

```
submodules/naruto/
  packages/
    cards/    @tcg-engines/naruto-cards  — typed card DB (no logic beyond accessors)
      src/types.ts       CardDefinition, CardType, Color, Rarity, Skill, Support
      src/cards.ts       GENERATED data: all 35 cards (camelCase). Regenerate from
                         the source card dump; don't hand-edit values.
      src/repository.ts  getCardById / getAllCards / getCardsByColor / search
    engine/   @tcg-engines/naruto-engine — pure rules engine (zero runtime deps)
      src/rules.ts       OFFICIAL_RULES / PROVISIONAL_RULES constants + GameRules
      src/types.ts       GameState, PlayerState, instances, PendingChoice, ...
      src/actions.ts     12-action discriminated union
      src/rng.ts         seeded mulberry32 + Fisher-Yates (deterministic)
      src/log.ts         i18n-key log entries
      src/setup.ts       deck validation/building, prebuilt decks, createInitialState
      src/queries.ts     PURE UI-facing queries + *Block legality checks (no mutation)
      src/state-ops.ts   INTERNAL mutating primitives (reducer copies only)
      src/effects.ts     choice system, regex-parsed support effects, per-card-id
                         CHARACTER_EFFECTS / LEADER_EFFECTS registries
      src/reducer.ts     applyAction, turn flow, combat, chain resolution
      src/ai.ts          greedy policy: chooseAiAction(state, playerId)
      test/              vitest suites (unit + 20-game AI simulation)
```

## Boundaries

- The engine is a **pure logic library**: no UI, no I/O, no networking, no
  runtime dependencies (only `@tcg-engines/naruto-cards` via `workspace:*`).
  Dev deps: typescript + vitest only.
- **Type safety is non-negotiable**: strict TS, no `any`, no `unknown` escape
  hatches, no non-null assertions unless provably safe. Prefer discriminated
  unions, `as const`, exhaustive switches.
- `applyAction` must stay a pure function and must return the **same state
  reference** for illegal actions (callers detect no-ops by identity).
- Keep determinism: all randomness flows through `state.seed` and `rng.ts`.
- New cards with effects: add an entry to `CHARACTER_EFFECTS` or
  `LEADER_EFFECTS` in `effects.ts`; new support texts should be handled by the
  existing regex parser in `runSupportEffect` (extend
  `SUPPORT_TEXT_PATTERNS` only when the reference rules require it).
- `queries.ts` stays pure; anything that mutates belongs in `state-ops.ts`,
  `effects.ts`, or `reducer.ts`.
- Log/choice keys (`log.*`, `choice.*`) are the UI message catalog — keep the
  strings stable.

## Validation commands

```sh
cd submodules/naruto
pnpm install
pnpm run ci-check        # typecheck + unit tests (fast gate)
pnpm run ci-check-full   # + build
# or directly:
npx tsc --noEmit -p packages/engine && npx vitest run --root packages/engine
```

The simulation test (`packages/engine/test/simulation.test.ts`) plays 20
seeded AI-vs-AI games to completion and asserts determinism — run it after any
engine change.
