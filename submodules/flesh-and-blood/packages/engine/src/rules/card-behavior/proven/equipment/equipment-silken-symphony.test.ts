/**
 * PEN125 Silken Symphony — Illusionist Arms, Ward 1 (no printed defense).
 * Printed: Ward 1; When this is destroyed, create a Might token.
 * Mirrors proven PEN124 silken-shawl (Ward 1 destroy → create Vigor).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { silkenSymphony } from "../../../../../../cards/src/cards/equipment/silken-symphony.ts";

const LIFE = 20;
const SNATCH = 4;

describe("silken-symphony (PEN125)", () => {
  it("core: Ward 1 destroys arms on damage → create Might", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, arms: [silkenSymphony], deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    expect(Dash.zone("arms")).toContain(silkenSymphony.canonicalId);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − ward 1 = 3 damage.
    expect(Dash.life()).toBe(LIFE - (SNATCH - 1));
    // Ward destroys the equipment.
    expect(Dash.zone("arms")).not.toContain(silkenSymphony.canonicalId);
    expect(Dash.zone("graveyard")).toContain(silkenSymphony.canonicalId);
    // Destroy trigger creates Might under controller.
    expect(Dash.zone("arena")).toContain("token:might");
  });

  it("boundary: no arms → full damage, no Might", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Full 4 damage (no ward).
    expect(game.as(dash).life()).toBe(LIFE - SNATCH);
    expect(game.as(dash).zone("arena")).not.toContain("token:might");
  });
});
