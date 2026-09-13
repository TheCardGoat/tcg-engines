/** ARA028 Frailty — continuous -1 power + end-phase destroy. */
import { describe, expect, it } from "vitest";

import { frailty } from "../../../../cards/src/cards/tokens/frailty.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, dawnblade } from "../../rules/fixtures.ts";

const LIFE = 40;

describe("Frailty token (ARA028)", () => {
  it("a2: destroyed at controller's end phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [frailty], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(frailty.canonicalId);
  });

  it("a1: weapon attack gets -1 power while Frailty is in play", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        arena: [frailty],
        deck: 4,
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, life: LIFE, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Bravo.activate(dawnblade);
    game.passBoth(); // activation layer
    game.helpers.resolveRestOfCombat();

    // Dawnblade base 3 − Frailty 1 = 2 damage.
    expect(Dash.life()).toBe(lifeBefore - 2);
    expect(Bravo.zone("arena")).toContain(frailty.canonicalId);
  });

  it("a1 boundary: weapon power is normal without Frailty", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon1: [dawnblade], deck: 4, actionPoints: 1, resourcePoints: 1 },
      { hero: dash, life: LIFE, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(dawnblade);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(LIFE - 3);
  });
});
