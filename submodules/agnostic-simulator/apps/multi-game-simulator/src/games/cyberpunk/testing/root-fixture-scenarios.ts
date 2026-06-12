import { listScenarios, type ScenarioGroup, type ScenarioId } from "../engine/fixtures/scenarios";

export interface RootFixtureScenarioCase {
  readonly id: ScenarioId;
  readonly group: ScenarioGroup;
  readonly label: string;
  readonly name: string;
}

export const ROOT_FIXTURE_SCENARIO_CASES: readonly RootFixtureScenarioCase[] = listScenarios().map(
  ({ id, group, label }) => ({
    id,
    group,
    label,
    name: `${group}/${id}`,
  }),
);

export const ROOT_FIXTURE_SCENARIO_IDS: readonly ScenarioId[] = ROOT_FIXTURE_SCENARIO_CASES.map(
  ({ id }) => id,
);
