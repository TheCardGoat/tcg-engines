import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { spitfire } from "./spitfire.ts";

/**
 * Spitfire (GEM036) — Mechanologist Weapon - Gun (2H), 2{p}.
 *
 * Printed:
 *   Action - {t}, {t} a cog you control: Attack
 *   When this attacks, you may {t} a cog you control. If you do, the attack
 *   gets +1{p}.
 */

describe("Spitfire (GEM036) AAA", () => {
  it("happy: tapping a second cog on attack pumps the shot to 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [spitfire],
        arena: [goldenCog, goldenCog],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activateAttack(spitfire, { optionals: "accept", entityTargets: "minimum" });
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(17);
  });

  it("boundary: declining the optional cog tap leaves the shot at 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [spitfire],
        arena: [goldenCog, goldenCog],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activateAttack(spitfire, { optionals: "decline", entityTargets: "minimum" });
    expectCombat(game).toHaveAttackPower(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(18);
  });

  it("legality: without a cog to tap the activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [spitfire],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );

    game.as(dash).expectActivationRejected(spitfire);
    expectCombat(game).toBeClosed();
  });
});
