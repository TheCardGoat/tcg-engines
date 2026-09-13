import { describe, expect, it } from "bun:test";
import { isKnownLorcanaFixtureId } from "../index.js";
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
    expect(isKnownLorcanaFixtureId(regressionFixture.id)).toBe(false);
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

  it("registers the Darkwing's Chair Set ampersand-heal visual board", () => {
    const regressionFixture = getLorcanaRegressionFixture("darkwings-chair-set-ampersand-heal");

    expect(regressionFixture.name).toBe(
      "Darkwing's Chair Set - Ampersand name heal (team + solos)",
    );
    expect(regressionFixture.skipPreGame).toBe(true);
    // 4 Chair Sets + Scimitar + 6 Darkwing variants + 3 Launchpads + Goofy + 2 Aladdins
    expect(
      Array.isArray(regressionFixture.playerOne.play) && regressionFixture.playerOne.play.length,
    ).toBeGreaterThanOrEqual(15);
    expect(
      Array.isArray(regressionFixture.playerOne.hand) && regressionFixture.playerOne.hand.length,
    ).toBeGreaterThanOrEqual(4);
  });

  it("registers the Look What You've Done single-replay visual regression", () => {
    const regressionFixture = getLorcanaRegressionFixture("look-what-youve-done-single-replay");

    expect(regressionFixture.name).toBe("Look What You've Done - Single Discard Replay");
    expect(regressionFixture.skipPreGame).toBe(true);
    expect(regressionFixture.playerOne.hand).toHaveLength(2);
    expect(regressionFixture.playerOne.inkwell).toBe(5);
    expect(regressionFixture.playerTwo.play).toHaveLength(1);
  });

  it("registers the Mulan self-trigger regression", () => {
    const regressionFixture = getLorcanaRegressionFixture(
      "mulan-created-by-the-vine-self-trigger",
    );

    expect(regressionFixture.name).toBe("Mulan - Created by the Vine self trigger");
    expect(regressionFixture.skipPreGame).toBe(true);
    expect(regressionFixture.playerOne.hand).toHaveLength(1);
    expect(regressionFixture.playerOne.inkwell).toBe(4);
    expect(regressionFixture.playerTwo.play).toHaveLength(1);
  });
});
