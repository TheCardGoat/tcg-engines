/**
 * PEN179 Solforge Gauntlet — Light Arms d1.
 *
 * Printed a1: "When the combat chain closes, if this defended, put it into
 * your soul."
 *
 * CR 5.4.6: a functional triggered-static creates its triggered effect.
 * CR 7.7: closing the combat chain ends the combat interaction that supplied
 * the defend fact.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { solforgeGauntlet } from "../../../../../../cards/src/cards/equipment/solforge-gauntlet.ts";

describe("solforge-gauntlet (PEN179)", () => {
  it("a1: a public defend moves it to the controller's soul when the combat chain closes", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, arms: [solforgeGauntlet], life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    Attacker.attackWith(snatchRed);
    Defender.defendWith(solforgeGauntlet);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle();

    expect(Defender.zone("arms")).not.toContain(solforgeGauntlet.canonicalId);
    expect(Defender.zone("soul")).toContain(solforgeGauntlet.canonicalId);
    expect(Defender.zone("graveyard")).not.toContain(solforgeGauntlet.canonicalId);
  });

  it("boundary: without defending, it stays equipped and is not put into soul", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, arms: [solforgeGauntlet], life: 20, deck: 6 },
      { autoPassPriority: false },
    );

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle();

    expect(game.as(dash).zone("arms")).toContain(solforgeGauntlet.canonicalId);
    expect(game.as(dash).zone("soul")).not.toContain(solforgeGauntlet.canonicalId);
  });
});
