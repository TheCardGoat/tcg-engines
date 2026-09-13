import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { edgeOfAutumn } from "../weapons/edge-of-autumn.ts";
import { flurry } from "./flurry.ts";

/**
 * Flurry (AHA027) — Warrior Token - Aura.
 * Printed: "When you activate a weapon attack, destroy this and you may
 * attack with the weapon twice this turn."
 */
describe("Flurry (AHA027) AAA", () => {
  it("happy: the weapon may attack a second time this turn when the Flurry burns", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [flurry],
        weapon1: [edgeOfAutumn],
        hand: [],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    // First weapon attack — the Flurry trigger burns and lifts the limit to 2.
    Bravo.activate(edgeOfAutumn);
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("flurry", 0);
    expect(Bravo.zone("arena")).not.toContain(flurry.canonicalId);

    // Second activation is legal under the raised limit.
    Bravo.activateAttack(edgeOfAutumn);
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // A third activation breaks the printed twice-per-turn limit.
    Bravo.expectActivationRejected(edgeOfAutumn);
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("boundary: declining the may leaves the once-per-turn weapon limit intact", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [flurry],
        weapon1: [edgeOfAutumn],
        hand: [],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(edgeOfAutumn);
    Bravo.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Bravo.zone("arena")).not.toContain(flurry.canonicalId);
    Bravo.expectActivationRejected(edgeOfAutumn);
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });
});
