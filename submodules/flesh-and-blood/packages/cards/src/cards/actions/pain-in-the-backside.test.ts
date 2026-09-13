import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { hunterSKlaive } from "../weapons/hunter-s-klaive.ts";
import { nimblismBlue } from "./nimblism.ts";
import { painInTheBacksideRed } from "./pain-in-the-backside.ts";

describe("Pain in the Backside (HNT174) AAA", () => {
  it("happy: hit deals printed 3 with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [painInTheBacksideRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(painInTheBacksideRed);
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Arakni).toHaveAP(1);
  });

  it("boundary: a miss does not ping from the dagger", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [hunterSKlaive],
        hand: [painInTheBacksideRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(painInTheBacksideRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: without a dagger the hit only deals printed combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [painInTheBacksideRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(painInTheBacksideRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(17);
  });
});
