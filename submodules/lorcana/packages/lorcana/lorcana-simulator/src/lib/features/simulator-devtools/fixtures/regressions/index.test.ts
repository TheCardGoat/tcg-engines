import { describe, expect, it } from "bun:test";
import { LORCANA_SIMULATOR_FIXTURES } from "../index.js";
import {
  getLorcanaRegressionFixture,
  LORCANA_REGRESSION_FIXTURES,
  LORCANA_REGRESSION_FIXTURE_LIST,
} from "./index.js";

describe("regression fixture registry", () => {
  it("keeps regression fixtures separate from general fixtures", () => {
    const regressionFixture = getLorcanaRegressionFixture("ward-hidden-zone-selection");

    expect(LORCANA_REGRESSION_FIXTURES[regressionFixture.id]).toBe(regressionFixture);
    expect(LORCANA_REGRESSION_FIXTURE_LIST).toContain(regressionFixture);
    expect(LORCANA_SIMULATOR_FIXTURES[regressionFixture.id]).toBeUndefined();
  });

  it("throws for unknown regression fixture ids", () => {
    expect(() => getLorcanaRegressionFixture("missing-regression")).toThrow(/not found/i);
  });

  it("registers the Leviathan's Lair hand-vs-play visual regression", () => {
    const regressionFixture = getLorcanaRegressionFixture("leviathans-lair-hand-vs-play");

    expect(regressionFixture.name).toBe("Leviathan's Lair - Hand vs Play Targeting");
    expect(regressionFixture.playerOne.play).toHaveLength(1);
    expect(regressionFixture.playerTwo.hand).toHaveLength(1);
    expect(regressionFixture.playerTwo.play).toHaveLength(1);
  });

  it("registers the Merida plus Mosquito Bite put-damage visual regression", () => {
    const regressionFixture = getLorcanaRegressionFixture("merida-mosquito-bite-put-damage");

    expect(regressionFixture.name).toBe("Merida + Mosquito Bite - Put Damage Is Not Deal Damage");
    expect(regressionFixture.playerOne.hand).toHaveLength(1);
    expect(regressionFixture.playerOne.play).toHaveLength(1);
    expect(regressionFixture.playerTwo.play).toHaveLength(1);
  });
});
