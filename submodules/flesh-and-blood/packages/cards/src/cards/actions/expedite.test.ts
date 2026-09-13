import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { boomGrenadeRed as boomGrenade } from "./boom-grenade.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { expediteRed } from "./expedite.ts";

/**
 * Expedite, Red (EVO198) — Mechanologist Attack, cost 0, 3{p}.
 * Printed: "Boost. When this hits, you may put an item with cost 0 or 1
 * from your hand into the arena."
 */

describe("Expedite family AAA", () => {
  it("happy: a hit may put a cost-0 item from hand into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [expediteRed, boomGrenade],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(expediteRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    Dash.target(boomGrenade);

    expectFabCard(Dash, boomGrenade).toBeIn("arena");
  });

  it("boundary: a miss does not put the item into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [expediteRed, boomGrenade],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue], deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(expediteRed);
    Bravo.defendWith(brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, boomGrenade).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: declining the optional leaves the item in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [expediteRed, boomGrenade],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(expediteRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, boomGrenade).toBeIn("hand");
  });
});
