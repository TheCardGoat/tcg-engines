import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo } from "../../../fixtures.ts";

import { aurumAegis } from "../../../../../../cards/src/cards/equipment/aurum-aegis.ts";
import { marlynnTreasureHunter } from "../../../../../../cards/src/cards/heroes/marlynn-treasure-hunter.ts";

describe("aurum-aegis (HVY051)", () => {
  it("counts as Gold for a real Gold-destroying action", () => {
    const game = FabTestEngine.start(
      { hero: marlynnTreasureHunter, arms: [aurumAegis], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false },
    );
    const Marlynn = game.as(marlynnTreasureHunter);

    Marlynn.activate(marlynnTreasureHunter);
    game.passBoth();

    // Aurum Aegis satisfies "destroy a Gold you control" and is consumed.
    expect(Marlynn.zone("arms")).not.toContain(aurumAegis.canonicalId);
    expect(Marlynn.zone("graveyard")).toContain(aurumAegis.canonicalId);
    expect(Marlynn.zone("hand").some((id) => /goldfin.?harpoon/i.test(id))).toBe(true);
  });

  it("does not make the Gold-destroying action legal when absent", () => {
    const game = FabTestEngine.start(
      { hero: marlynnTreasureHunter, actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false },
    );

    expect(() => game.as(marlynnTreasureHunter).activate(marlynnTreasureHunter)).toThrow();
  });
});
