import { describe, expect, it } from "bun:test";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";
import {
  isKnownLorcanaFixtureId,
  loadLorcanaFixture,
  LORCANA_SIMULATOR_FIXTURE_LOADERS,
  LORCANA_SIMULATOR_FIXTURE_MANIFEST,
  LORCANA_SIMULATOR_FIXTURE_MANIFEST_BY_ID,
} from "./index.js";
import { createFixtureLoaderRegistry, createFixtureRegistry } from "./registry.js";
import { set13CardGalleryFixture } from "./set13-card-gallery.js";
import { SET13_MANUAL_VALIDATION_FIXTURE_IDS } from "./set13-manual-validation.js";

function buildFixture(id: string, name = id): LorcanaSimulatorFixture {
  return {
    id,
    name,
    description: `${name} description`,
    playerOne: {},
    playerTwo: {},
  };
}

describe("createFixtureRegistry", () => {
  it("preserves fixture order and creates by-id lookups", () => {
    const alpha = buildFixture("alpha", "Alpha");
    const beta = buildFixture("beta", "Beta");

    const registry = createFixtureRegistry([alpha, beta], "test fixtures");

    expect(registry.list).toEqual([alpha, beta]);
    expect(registry.byId.get("alpha")).toBe(alpha);
    expect(registry.record.beta).toBe(beta);
  });

  it("throws when duplicate ids are registered", () => {
    expect(() =>
      createFixtureRegistry(
        [buildFixture("duplicate", "First"), buildFixture("duplicate", "Second")],
        "test fixtures",
      ),
    ).toThrow(/duplicate fixture id/i);
  });

  it("throws when duplicate lazy fixture ids are registered", () => {
    const alpha = buildFixture("duplicate", "First");
    const beta = buildFixture("duplicate", "Second");

    expect(() =>
      createFixtureLoaderRegistry(
        [
          {
            id: alpha.id,
            name: alpha.name,
            description: alpha.description,
            load: async () => alpha,
          },
          {
            id: beta.id,
            name: beta.name,
            description: beta.description,
            load: async () => beta,
          },
        ],
        "test fixture loaders",
      ),
    ).toThrow(/duplicate fixture id/i);
  });

  it("registers every explicit set13 manual validation fixture", async () => {
    expect(SET13_MANUAL_VALIDATION_FIXTURE_IDS).toHaveLength(16);

    for (const fixtureId of SET13_MANUAL_VALIDATION_FIXTURE_IDS) {
      expect(isKnownLorcanaFixtureId(fixtureId)).toBe(true);

      const fixture = await loadLorcanaFixture(fixtureId);
      expect(fixture?.id).toBe(fixtureId);
    }
  });

  it("registers every manifest entry with a lazy loader", () => {
    for (const entry of LORCANA_SIMULATOR_FIXTURE_MANIFEST) {
      expect(LORCANA_SIMULATOR_FIXTURE_MANIFEST_BY_ID[entry.id]).toBe(entry);
      expect(LORCANA_SIMULATOR_FIXTURE_LOADERS.has(entry.id)).toBe(true);
      expect(isKnownLorcanaFixtureId(entry.id)).toBe(true);
    }

    expect(isKnownLorcanaFixtureId("does-not-exist")).toBe(false);
  });

  it("loads the full set13 card gallery fixture lazily", async () => {
    const fixture = await loadLorcanaFixture("set13-card-gallery");

    expect(fixture?.id).toBe(set13CardGalleryFixture.id);
    expect(fixture?.playerOne.hand).toHaveLength(241);
  });

  it("returns undefined for unknown lazy fixture ids", async () => {
    await expect(loadLorcanaFixture("does-not-exist")).resolves.toBeUndefined();
  });
});
