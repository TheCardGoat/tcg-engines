import { describe, expect, it } from "vitest";
import { expectCombat, expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { uzuri } from "../heroes/uzuri.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { isolateRed } from "./isolate.ts";

/**
 * Isolate (ARA009) — Assassin Action-Attack, cost 0, 3{p}/3{d}.
 *
 * Printed: "Stealth / Dominate"
 */

describe("Isolate (ARA009) AAA", () => {
  it("happy: dominate attack hits for printed 3{p} when undefended", () => {
    const game = FabTestEngine.start(
      { hero: uzuri, hand: [isolateRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    Uzuri.playAttack(isolateRed);

    expectCombat(game).toBeAtStep("defend").toHaveKeyword("dominate").toHaveAttackPower(3);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: dominate rejects a two-card hand defense and allows a single block", () => {
    const game = FabTestEngine.start(
      { hero: uzuri, hand: [isolateRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    Uzuri.playAttack(isolateRed);

    expectCombat(game).toBeAtStep("defend").toHaveKeyword("dominate");
    expect(Dash.expectBlockRejected([snatchRed, nimblismBlue]).errorCode).toBe("dominate");
    Dash.defendWith(snatchRed);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: stealth is present on Isolate and absent on Snatch", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [isolateRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Uzuri = game.as(uzuri);

    Uzuri.playAttack(isolateRed);
    expectCombat(game).toHaveKeyword("stealth").toHaveKeyword("dominate");
    game.closeCombat();

    Uzuri.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("stealth").notToHaveKeyword("dominate");
  });
});
