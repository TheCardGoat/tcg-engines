import { describe, expect, it } from "bun:test";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";
import { createFixtureRegistry } from "./registry.js";

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
});
