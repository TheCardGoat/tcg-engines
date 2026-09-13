import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, hypothermiaBlue, nimblismBlue, snatchRed } from "../../../fixtures.ts";

import { rootBoundTrunks } from "../../../../../../cards/src/cards/equipment/root-bound-trunks.ts";

describe("root-bound-trunks (AJV007)", () => {
  it("core mechanic: defending together with a real Aura creates Embodiment of Earth", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, legs: [rootBoundTrunks], hand: [hypothermiaBlue], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith([rootBoundTrunks, hypothermiaBlue]);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("arena")).toContain("token:embodiment-of-earth");
    expect(Bravo.zone("graveyard")).toContain(rootBoundTrunks.canonicalId);
  });

  it("boundary: defending with a non-Aura card does not create Embodiment", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, legs: [rootBoundTrunks], hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith([rootBoundTrunks, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("arena")).not.toContain("token:embodiment-of-earth");
    expect(Bravo.zone("graveyard")).toContain(rootBoundTrunks.canonicalId);
  });
});
