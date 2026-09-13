import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo } from "../../../fixtures.ts";
import { marlynnTreasureHunter } from "../../../../../../cards/src/cards/heroes/marlynn-treasure-hunter.ts";
import { goldenGauntlets } from "../../../../../../cards/src/cards/equipment/golden-gauntlets.ts";

describe("golden-gauntlets (SUP249)", () => {
  it("AAA: counts as Gold and is consumed by Marlynn's Gold-destroying action", () => {
    const game = FabTestEngine.start(
      { hero: marlynnTreasureHunter, arms: [goldenGauntlets], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false },
    );
    const Marlynn = game.as(marlynnTreasureHunter);
    Marlynn.activate(marlynnTreasureHunter);
    game.passBoth();

    expect(Marlynn.zone("arms")).not.toContain(goldenGauntlets.canonicalId);
    expect(Marlynn.zone("graveyard")).toContain(goldenGauntlets.canonicalId);
    expect(Marlynn.zone("hand").some((id) => /goldfin.?harpoon/i.test(id))).toBe(true);
  });

  it("boundary: without a Gold permanent, Marlynn's action is illegal", () => {
    const game = FabTestEngine.start(
      { hero: marlynnTreasureHunter, actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(marlynnTreasureHunter).activate(marlynnTreasureHunter)).toThrow();
  });
});
