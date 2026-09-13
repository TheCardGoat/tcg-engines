/** ARC112 Runechant — Errata Bulletin #5 attack-action and weapon triggers. */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../rules/fixtures.ts";

import { runechant } from "../../../../cards/src/cards/tokens/runechant.ts";

describe("Runechant token (ARC112)", () => {
  it("AAA: an attack action consumes Runechant and deals one arcane damage to the opponent", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], arena: [runechant], deck: 6, actionPoints: 1 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Bravo.attackWith(snatchRed);

    expect(Bravo.zone("arena")).not.toContain(runechant.canonicalId);
    expect(Dash.life()).toBe(lifeBefore - 1);
  });

  it("AAA: a weapon attack consumes Runechant and deals one arcane damage to the opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        arena: [runechant],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Bravo.activate(dawnblade);
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(runechant.canonicalId);
    expect(Dash.life()).toBe(lifeBefore - 1);
  });
});
