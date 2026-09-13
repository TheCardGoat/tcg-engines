import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { bareDestructionRed } from "./bare-destruction.ts";
import { heraldOfTriumphRed } from "./herald-of-triumph.ts";
import { poundTownRed } from "./pound-town.ts";

/**
 * Pound Town (HVY035) — When this attacks, if you've beaten chest this turn, create a Might token.
 */

describe("Pound Town (HVY035) AAA", () => {
  it("happy: after beating chest this turn, attacking creates a Might token", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareDestructionRed, heraldOfTriumphRed, poundTownRed],
        resourcePoints: 5,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    const heraldId = Rhinar.findCardInZone("hand", heraldOfTriumphRed);
    Rhinar.play(bareDestructionRed, {
      beatChest: true,
      beatChestInstanceId: heraldId,
      target: Dash.id,
    });
    game.helpers.resolveUntilIdle();

    Rhinar.playAttack(poundTownRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Rhinar).toHaveTokenCount("might", 1);
    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
  });

  it("boundary: without beating chest this turn, attacking creates no Might", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [poundTownRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(poundTownRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Rhinar).toHaveTokenCount("might", 0);
  });

  it("timing: the token exists at on-attack, before the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareDestructionRed, heraldOfTriumphRed, poundTownRed],
        resourcePoints: 5,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    const heraldId = Rhinar.findCardInZone("hand", heraldOfTriumphRed);
    Rhinar.play(bareDestructionRed, {
      beatChest: true,
      beatChestInstanceId: heraldId,
      target: Dash.id,
    });
    game.helpers.resolveUntilIdle();

    Rhinar.playAttack(poundTownRed, { stopAt: "on-attack" });
    expectFabPlayer(Rhinar).toHaveTokenCount("might", 1);
  });
});
