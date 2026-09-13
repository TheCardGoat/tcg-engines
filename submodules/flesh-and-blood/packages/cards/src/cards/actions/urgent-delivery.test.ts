import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { boomGrenadeRed as boomGrenade } from "./boom-grenade.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { urgentDeliveryRed } from "./urgent-delivery.ts";

/**
 * Urgent Delivery, Red (DYN107) — Mechanologist Attack, cost 0, 4{p}.
 * Printed: "When this hits, you may put a Mechanologist item from your hand
 * into the arena with cost less than or equal to the number of times you've
 * boosted this combat chain."
 */

describe("Urgent Delivery (DYN107) AAA", () => {
  it("happy: a hit with 0 boosts may put a cost-0 Mechanologist item into arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [urgentDeliveryRed, boomGrenade],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(urgentDeliveryRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    Dash.target(boomGrenade);

    expectFabCard(Dash, boomGrenade).toBeIn("arena");
  });

  it("boundary: a miss does not put the item into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [urgentDeliveryRed, boomGrenade],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue, brutalAssaultBlue], deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(urgentDeliveryRed);
    Bravo.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, boomGrenade).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: declining the optional leaves the item in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [urgentDeliveryRed, boomGrenade],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(urgentDeliveryRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, boomGrenade).toBeIn("hand");
  });
});
