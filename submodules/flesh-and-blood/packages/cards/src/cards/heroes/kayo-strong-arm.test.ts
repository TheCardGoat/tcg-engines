import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { concealedObjectBlue } from "../instants/concealed-object.ts";
import { kayoStrongArm } from "./kayo-strong-arm.ts";

describe("Kayo, Strong-arm (SUP064) AAA", () => {
  it("happy: tapping sets a controlled attack action to 6 base {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [snatchRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.playAttack(snatchRed);
    game.toReaction("attacker");
    expectCombat(game).toHaveAttackPower(4);
    Kayo.activate(kayoStrongArm);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: the tap does not fire before an attack action is on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);
    Kayo.expectActivationRejected(kayoStrongArm);
  });

  it("timing: a crowd boo creates a Vigor token", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [concealedObjectBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.play(concealedObjectBlue);
    game.untilIdle();
    expectFabPlayer(Kayo).toHaveTokenCount("vigor", 1);
  });
});
