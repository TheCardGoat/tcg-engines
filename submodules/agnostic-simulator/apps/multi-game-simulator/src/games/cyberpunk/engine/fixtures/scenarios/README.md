# Simulator Scenarios

These fixtures feed the dev scenario picker at `http://localhost:5174/tests`, the visual AI harness, and focused simulator tests. Each scenario builds a deterministic `CyberpunkTestEngine` state that exercises one visual or interaction condition.

## File layout

- `index.ts` owns the public registry, `getScenario`, `listScenarios`, group labels, and the default scenario.
- `shared.ts` owns reusable players, helper functions, deterministic seeds, and scenario-only mock cards.
- `core.ts` contains broad board-state and turn-flow fixtures.
- `programs.ts`, `gears.ts`, `legends.ts`, and `units.ts` contain card-family fixtures.
- `../scenarios.ts` is a compatibility barrel. Existing imports should continue to use that path unless they are editing this registry directly.

## Adding a scenario

1. Add the new id to `ScenarioId` in `src/types/e2e.ts`. If it introduces a new section, add the group to `ScenarioGroup` too.
2. Add a seed for that id in `shared.ts` using the `scenario:<id>` pattern. The `Record<ScenarioId, string>` type intentionally catches missing seeds.
3. Add one `Scenario` entry to the category file that best matches the behavior being covered.
4. Use a short label and a description that says what the harness should verify visually or interactively.
5. Build the engine with `CyberpunkTestEngine.createWithFixture` and pass `seed: scenarioSeed("yourId")`.
6. If the scenario needs card definitions, import them through the shared `c` namespace, for example `c.alphaSwordwiseHuscle`.
7. Run a focused simulator check from `submodules/cyberpunk`, then open `http://localhost:5174/tests` when changing visible playground behavior.

Keep each scenario deterministic and narrowly scoped. These fixtures are not decklists or gameplay docs; they are reproducible UI and engine states for tests, screenshots, and AI review.
