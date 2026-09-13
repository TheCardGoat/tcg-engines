import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsuTheWanderer as katsu } from "../heroes/katsu-the-wanderer.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { feignVengeanceBlue } from "./feign-vengeance.ts";

/**
 * Feign Vengeance, Blue (PEN036) — Ninja Action - Attack, cost 0, 0{p}. Go
 * again.
 * Printed: "When this chain link resolves, if there is a card defending this,
 * draw a card."
 * The condition is the card-defending-this combat fact (CR 7.0.5a: a card
 * defends from the moment it joins the chain link), evaluated on the active
 * attack at chain-link resolve — it holds on blocked links and not on
 * unblocked ones regardless of damage dealt (status/card-defending-this).
 */

describe("Feign Vengeance, Blue (PEN036) AAA", () => {
  it("happy: a blocked chain link resolves and draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [feignVengeanceBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 3,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.playAttack(feignVengeanceBlue);
    game.advanceCombatTo("defend");
    Dash.blockWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Katsu).toHaveHandCount(1); // the printed draw
  });

  it("boundary: an unblocked chain link resolves with no draw", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [feignVengeanceBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 3,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(feignVengeanceBlue);
    game.advanceCombatTo("defend");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Katsu).toHaveHandCount(0); // nothing defended it
  });
});
