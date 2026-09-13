import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { brutalAssaultBlue as iraBrutalBlue } from "./brutal-assault.ts";
import { pedalToTheMetalRed } from "./pedal-to-the-metal.ts";

/**
 * Pedal to the Metal, Red (ARC011) — Mechanologist Attack, cost 2, 5{p}.
 * Printed: If this hits, your next attack this turn gains dominate. Boost.
 */

describe("Pedal to the Metal (ARC011) AAA", () => {
  it("happy: a hit grants dominate to the next attack this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [pedalToTheMetalRed, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(pedalToTheMetalRed);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(bravo)).toHaveLife(15);

    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveKeyword("dominate").toHaveAttackPower(4);
  });

  it("boundary: a miss does not grant dominate to the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [pedalToTheMetalRed, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [iraBrutalBlue, iraBrutalBlue],
        life: 20,
        deck: 6,
      },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(pedalToTheMetalRed);
    Bravo.defendWith(iraBrutalBlue, iraBrutalBlue);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Bravo).toHaveLife(20);

    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("timing: dominate latches only the next attack, not the one after", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [pedalToTheMetalRed, brutalAssaultBlue, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 3,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 40, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(pedalToTheMetalRed);
    game.closeCombat({ optionals: "decline" });
    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline" });
    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).notToHaveKeyword("dominate");
  });
});
