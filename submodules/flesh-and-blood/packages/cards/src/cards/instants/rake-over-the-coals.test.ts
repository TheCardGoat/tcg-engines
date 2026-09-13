import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rakeOverTheCoalsRed } from "./rake-over-the-coals.ts";

/**
 * Rake Over the Coals (HNT156) — Draconic Instant, cost 0.
 *
 * Printed: "Draconic attacks get +1{p} this turn."
 */

describe("Rake Over the Coals (HNT156) AAA", () => {
  it("happy: Draconic attacks get +1{p} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [rakeOverTheCoalsRed, phoenixFlameRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(rakeOverTheCoalsRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Fai, rakeOverTheCoalsRed).toBeIn("graveyard");

    Fai.attackWith(phoenixFlameRed);
    // Phoenix Flame 0 + 1 = 1.
    expectCombat(game).toHaveAttackPower(1);
  });

  it("boundary: a Generic attack is not Draconic and stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [rakeOverTheCoalsRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Fai.play(rakeOverTheCoalsRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +1{p} expires at the end of the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [rakeOverTheCoalsRed, phoenixFlameRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.play(rakeOverTheCoalsRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Fai, rakeOverTheCoalsRed).toBeIn("graveyard");

    Fai.endTurn();
    Dash.endTurn();
    game.helpers.untilIdle();

    Fai.attackWith(phoenixFlameRed);
    expectCombat(game).toHaveAttackPower(0);
  });
});
