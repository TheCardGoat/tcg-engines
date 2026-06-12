import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";

export interface LorcanaFixtureRegistry {
  list: readonly LorcanaSimulatorFixture[];
  byId: ReadonlyMap<string, LorcanaSimulatorFixture>;
  record: Record<string, LorcanaSimulatorFixture>;
}

export function createFixtureRegistry(
  fixtures: readonly LorcanaSimulatorFixture[],
  registryName: string,
): LorcanaFixtureRegistry {
  const byId = new Map<string, LorcanaSimulatorFixture>();
  const record: Record<string, LorcanaSimulatorFixture> = {};

  for (const fixture of fixtures) {
    const existingFixture = byId.get(fixture.id);
    if (existingFixture) {
      throw new Error(
        `Duplicate fixture id "${fixture.id}" found in ${registryName}: "${existingFixture.name}" and "${fixture.name}"`,
      );
    }

    byId.set(fixture.id, fixture);
    record[fixture.id] = fixture;
  }

  return {
    list: fixtures,
    byId,
    record,
  };
}
