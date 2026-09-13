import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";

import { bastionOfUnity } from "../../../../../../cards/src/cards/equipment/bastion-of-unity.ts";
import { bravo } from "../../../../../../cards/src/cards/heroes/bravo.ts";

describe("bastion-of-unity (DTD206)", () => {
  it("gains +1 defense when it defends together with a card from hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, weapon2: [bastionOfUnity], hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Bravo.attackWith(snatchRed);
    Dash.defendWith([bastionOfUnity, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − Bastion (1 + Unity 1) − Nimblism 2 = 0.
    expect(Dash.life()).toBe(lifeBefore);
  });

  it("does not gain the Unity bonus when it defends alone", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, weapon2: [bastionOfUnity], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Bravo.attackWith(snatchRed);
    Dash.defendWith(bastionOfUnity);
    game.helpers.resolveRestOfCombat();

    // Base defense only: 4 − 1 = 3.
    expect(Dash.life()).toBe(lifeBefore - 3);
  });
});
