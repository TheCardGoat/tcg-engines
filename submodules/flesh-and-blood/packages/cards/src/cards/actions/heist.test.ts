import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { boomGrenadeRed as boomGrenade } from "./boom-grenade.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { heistRed } from "./heist.ts";

/**
 * Heist, Red (EVO138) — Mechanologist Attack, cost 2, 5{p}.
 * Printed: "Boost. When this hits a hero, you may put an item with cost 0
 * or 1 from any banished zone into the arena under your control."
 */

describe("Heist (EVO138) AAA", () => {
  it("happy: a hero hit may put a cost-0 item from banished into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [heistRed],
        banished: [boomGrenade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(heistRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    Dash.target(boomGrenade);

    expectFabCard(Dash, boomGrenade).toBeIn("arena");
  });

  it("boundary: a miss does not pull the banished item", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [heistRed],
        banished: [boomGrenade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue, brutalAssaultBlue], deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(heistRed);
    Bravo.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, boomGrenade).toBeBanished();
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: declining the optional leaves the item banished", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [heistRed],
        banished: [boomGrenade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(heistRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, boomGrenade).toBeBanished();
  });
});
