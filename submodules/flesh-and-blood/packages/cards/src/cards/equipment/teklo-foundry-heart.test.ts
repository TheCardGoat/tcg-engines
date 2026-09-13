import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { throttleRed } from "../actions/throttle.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tekloFoundryHeart } from "./teklo-foundry-heart.ts";

describe("Teklo Foundry Heart (ARC004) AAA", () => {
  it("happy: after boosting, banish top 2 Mechanologist cards and gain {r} each", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [tekloFoundryHeart],
        hand: [throttleRed, nimblismBlue, nimblismBlue],
        deck: [snatchRed, hyperDriverRed, hyperDriverRed, snatchRed],
        actionPoints: 2,
        resourcePoints: 1,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(throttleRed, {
      boost: true,
      pitch: [nimblismBlue, nimblismBlue],
    });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    const rpBefore = Dash.resourcePoints();
    Dash.activate(tekloFoundryHeart);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveResourceCount(rpBefore + 1);
    expect(Dash.zone("banished").filter((id) => id === hyperDriverRed.canonicalId)).toHaveLength(2);
  });

  it("boundary: without boosting this turn the Action is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [tekloFoundryHeart],
        hand: [],
        deck: [hyperDriverRed, hyperDriverRed, snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(tekloFoundryHeart);
    expectFabCard(Dash, tekloFoundryHeart).toBeIn("chest");
  });

  it("timing: Battleworn d2 stays seated after defending", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [tekloFoundryHeart], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(tekloFoundryHeart);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, tekloFoundryHeart).toBeIn("chest");
    expectFabCard(Dash, tekloFoundryHeart).toHaveDefenseCounters(-1);
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
