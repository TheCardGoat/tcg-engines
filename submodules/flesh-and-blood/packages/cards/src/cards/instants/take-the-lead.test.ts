import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectFabPlayer,
  seedResourcePoints,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { takeTheLeadRed } from "./take-the-lead.ts";

/**
 * Take the Lead (MPW073) — Warrior Instant.
 * Printed: "The next time you would be dealt damage this turn, prevent 2 of
 * that damage. If you prevent damage this way, create a Blade Dance token."
 */
describe("Take the Lead (MPW073) AAA", () => {
  it("happy: the next damage is reduced by 2 and a Blade Dance token is created", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, hand: [takeTheLeadRed], deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.endTurn();
    seedResourcePoints(game, 6, Dash);
    game.helpers.untilIdle({ optionals: "decline" });

    // Dash hands priority over; Dorinthea answers with the instant, then the
    // attack comes in.
    Dash.pass();
    Dori.play(takeTheLeadRed);
    Dash.playAttack(brutalAssaultBlue);
    Dori.defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4 damage inbound, 2 prevented, 2 dealt — and one Blade Dance.
    expectFabPlayer(Dori).toHaveLife(18);
    expectFabPlayer(Dori).toHaveTokenCount("blade-dance", 1);
  });

  it("boundary: without the instant, the same attack deals full damage and creates no token", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, hand: [], deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.endTurn();
    seedResourcePoints(game, 6, Dash);
    game.helpers.untilIdle({ optionals: "decline" });
    Dash.playAttack(brutalAssaultBlue);
    Dori.defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dori).toHaveLife(16);
    expectFabPlayer(Dori).toHaveTokenCount("blade-dance", 0);
  });
});
