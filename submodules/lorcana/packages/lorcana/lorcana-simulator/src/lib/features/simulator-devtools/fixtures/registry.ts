import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";

export interface FixtureManifestEntry {
  id: string;
  name: string;
  description: string;
}

export type LorcanaFixtureLoader = () => Promise<LorcanaSimulatorFixture>;

export interface LorcanaFixtureLoaderEntry extends FixtureManifestEntry {
  load: LorcanaFixtureLoader;
}

export interface LorcanaFixtureRegistry {
  list: readonly LorcanaSimulatorFixture[];
  byId: ReadonlyMap<string, LorcanaSimulatorFixture>;
  record: Record<string, LorcanaSimulatorFixture>;
}

export interface LorcanaFixtureLoaderRegistry {
  manifest: readonly FixtureManifestEntry[];
  manifestById: ReadonlyMap<string, FixtureManifestEntry>;
  loaderById: ReadonlyMap<string, LorcanaFixtureLoader>;
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

export function createFixtureLoaderRegistry(
  entries: readonly LorcanaFixtureLoaderEntry[],
  registryName: string,
): LorcanaFixtureLoaderRegistry {
  const manifestById = new Map<string, FixtureManifestEntry>();
  const loaderById = new Map<string, LorcanaFixtureLoader>();
  const manifest: FixtureManifestEntry[] = [];

  for (const entry of entries) {
    const existingEntry = manifestById.get(entry.id);
    if (existingEntry) {
      throw new Error(
        `Duplicate fixture id "${entry.id}" found in ${registryName}: "${existingEntry.name}" and "${entry.name}"`,
      );
    }

    const manifestEntry = {
      id: entry.id,
      name: entry.name,
      description: entry.description,
    };

    manifest.push(manifestEntry);
    manifestById.set(entry.id, manifestEntry);
    loaderById.set(entry.id, entry.load);
  }

  return {
    manifest,
    manifestById,
    loaderById,
  };
}
