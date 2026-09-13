import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { swingBigRed } from "./swing-big.ts";
import { rouseTheAncientsBlue } from "./rouse-the-ancients.ts";

describe("Rouse the Ancients (MON247) AAA", () => {
  it("happy: declining the additional cost leaves this at 0{p} with printed go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rouseTheAncientsBlue, wreckerRompBlue, swingBigRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(rouseTheAncientsBlue);
    expectCombat(game).toHaveAttackPower(0);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: 0{p} does not deal combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rouseTheAncientsBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(rouseTheAncientsBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: revealing 13+{p} of attack actions grants +7{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rouseTheAncientsBlue, wreckerRompBlue, swingBigRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(rouseTheAncientsBlue, { modeIds: ["pay"] });
    game.passBoth();
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
