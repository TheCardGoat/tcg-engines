import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { evoBetaBaseArmsBlue } from "./evo-beta-base-arms.ts";
import { snatchRed } from "./snatch.ts";
import { evoSteelSoulControllerBlue } from "./evo-steel-soul-controller.ts";

describe("Evo Steel Soul Controller (EVO028) AAA", () => {
  it("happy: play with base arms equipped transforms and equips this", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [evoBetaBaseArmsBlue],
        hand: [evoSteelSoulControllerBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(evoSteelSoulControllerBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, evoSteelSoulControllerBlue).toBeIn("arms");
  });

  it("boundary: without base arms equipped it does not transform into the arms slot", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [evoSteelSoulControllerBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(evoSteelSoulControllerBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Dash.zone("arms")).not.toContain(evoSteelSoulControllerBlue.canonicalId);
  });

  it("timing: Temper d3 first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arms: [evoSteelSoulControllerBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, evoSteelSoulControllerBlue).toHaveDefense(3);
    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(evoSteelSoulControllerBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, evoSteelSoulControllerBlue).toBeIn("arms");
    expectFabCard(Dash, evoSteelSoulControllerBlue).toHaveDefense(2);
    expectFabPlayer(Dash).toHaveLife(19);
  });
});
