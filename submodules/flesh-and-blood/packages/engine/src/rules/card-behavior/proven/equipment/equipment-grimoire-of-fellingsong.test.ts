import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { grimoireOfFellingsong } from "../../../../../../cards/src/cards/equipment/grimoire-of-fellingsong.ts";

describe("grimoire-of-fellingsong (PEN092)", () => {
  it("AAA: Instant pays one, destroys itself, and creates a Runechant", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon2: [grimoireOfFellingsong], hand: [], resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(grimoireOfFellingsong);
    game.passBoth();

    expect(Bravo.zone("graveyard")).toContain(grimoireOfFellingsong.canonicalId);
    expect(Bravo.zone("arena")).toContain("token:runechant");
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("boundary: zero resources cannot activate the Instant", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon2: [grimoireOfFellingsong], hand: [], resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(() => Bravo.activate(grimoireOfFellingsong)).toThrow();
    expect(Bravo.zone("weapon2")).toContain(grimoireOfFellingsong.canonicalId);
    expect(Bravo.zone("arena")).not.toContain("token:runechant");
  });
});
