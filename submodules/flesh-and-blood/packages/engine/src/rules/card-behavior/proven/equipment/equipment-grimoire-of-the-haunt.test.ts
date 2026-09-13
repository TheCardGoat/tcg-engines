import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { grimoireOfTheHaunt } from "../../../../../../cards/src/cards/equipment/grimoire-of-the-haunt.ts";

describe("grimoire-of-the-haunt (DTD136)", () => {
  it("pays 1 resource, banishes itself, and creates an Eloquence token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon2: [grimoireOfTheHaunt], hand: [], resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(grimoireOfTheHaunt);
    game.passBoth();

    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("weapon2")).not.toContain(grimoireOfTheHaunt.canonicalId);
    expect(Bravo.zone("banished")).toContain(grimoireOfTheHaunt.canonicalId);
    expect(Bravo.zone("arena").some((id) => /eloquence/i.test(id))).toBe(true);
  });

  it("is illegal without the required resource", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon2: [grimoireOfTheHaunt], hand: [], resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );

    expect(() => game.as(bravo).activate(grimoireOfTheHaunt)).toThrow();
  });
});
