/**
 * PEN126 Silken Slippers — Illusionist Legs, Ward 1.
 * Printed: Ward 1; When this is destroyed, create an Agility token.
 * Mirrors proven PEN125 silken-symphony (Ward 1 destroy → create Might).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { silkenSlippers } from "../../../../../../cards/src/cards/equipment/silken-slippers.ts";

const LIFE = 20;
const SNATCH = 4;

describe("silken-slippers (PEN126)", () => {
  it("core: Ward 1 destroys legs on damage → create Agility", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, legs: [silkenSlippers], deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    expect(Dash.zone("legs")).toContain(silkenSlippers.canonicalId);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − ward 1 = 3 damage.
    expect(Dash.life()).toBe(LIFE - (SNATCH - 1));
    // Ward destroys the equipment.
    expect(Dash.zone("legs")).not.toContain(silkenSlippers.canonicalId);
    expect(Dash.zone("graveyard")).toContain(silkenSlippers.canonicalId);
    // Destroy trigger creates Agility under controller.
    expect(Dash.zone("arena")).toContain("token:agility");
  });

  it("boundary: no legs → full damage, no Agility", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Full 4 damage (no ward).
    expect(game.as(dash).life()).toBe(LIFE - SNATCH);
    expect(game.as(dash).zone("arena")).not.toContain("token:agility");
  });
});
