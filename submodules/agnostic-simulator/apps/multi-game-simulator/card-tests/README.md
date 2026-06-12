# Card Test Folders

Card-specific tests live next to each other under the simulator package:

```text
apps/simulator/card-tests/<set>/<card-type>/<card-slug>/
```

Use the same `card-slug` as the card definition and public card test subject. This makes the three card test layers searchable from one folder.

## File Types

```text
unit.test.ts
```

Engine-only card behavior. These tests prove rules, legality, prompts, command results, action logs, and state transitions without rendering the simulator.

```text
integration.test.tsx
```

jsdom simulator POM behavior for the card's main happy path. These tests render the deterministic simulator scenario and drive the visible simulator through the Testing Library POM.

```text
e2e.test.ts
```

Playwright simulator POM behavior for the same main happy path in a real browser through the `/cyberpunk/simulator/tests/<scenarioId>` route.

```text
<case>.integration.test.tsx
<case>.e2e.test.ts
```

Named card-specific variants, such as `high-cred`, `low-cred`, `no-targets`, or `empty-field`. Use these when one card needs more than the single happy path.

## What Stays Outside

Broad simulator flow fixtures that are not owned by one card stay in:

```text
apps/multi-game-simulator/src/games/cyberpunk/testing/fixtures/jsdom/
apps/simulator/e2e/specs/root-fixtures/
```

Examples include game start, turn flow, combat steps, end game, and generic target-selection fixtures.

Scenario definitions still live in:

```text
apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/
```

Those definitions feed the dev `/tests` route and the POM tests. The card folder owns the test files that prove the card across engine, jsdom simulator, and browser simulator layers.
