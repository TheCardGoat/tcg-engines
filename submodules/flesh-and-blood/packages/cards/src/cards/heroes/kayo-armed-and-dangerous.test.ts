import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { pulpingRed } from "../actions/pulping.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { kayoArmedAndDangerous } from "./kayo-armed-and-dangerous.ts";

describe("Kayo, Armed and Dangerous (HVY001) AAA", () => {
  it("happy: owned attack actions have +1{p} in hand, not on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoArmedAndDangerous,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoArmedAndDangerous);

    expectFabCard(Kayo, snatchRed).toHavePower(5);
    Kayo.playAttack(snatchRed, { stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: a defending non-attack card is not given +1{p} from this", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kayoArmedAndDangerous,
        hand: [nimblismBlue],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kayo = game.as(kayoArmedAndDangerous);

    Dash.playAttack(snatchRed);
    Kayo.defendWith(nimblismBlue);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Kayo).toHaveLife(38);
  });

  it("timing: first action-phase discard of 6+{p} creates Might; a second does not", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoArmedAndDangerous,
        hand: [pulpingRed, pulpingRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: [pulpingRed, pulpingRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoArmedAndDangerous);

    Kayo.playAttack(pulpingRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Kayo).toHaveTokenCount("might", 1);

    Kayo.playAttack(pulpingRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Kayo).toHaveTokenCount("might", 1);
  });
});
