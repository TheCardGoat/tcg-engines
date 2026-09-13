import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { aurora } from "../heroes/aurora.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { arcLightningYellow } from "./arc-lightning.ts";

describe("Arc Lightning (ROS010) AAA", () => {
  it("happy: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      { hero: aurora, hand: [arcLightningYellow], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(aurora);

    expect(Aurora.actionPoints()).toBe(1);
    Aurora.play(arcLightningYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Aurora).toHaveAP(1);
  });

  it("boundary: the next action card you play this turn gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        hand: [arcLightningYellow, autumnSTouchBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(aurora);

    Aurora.play(arcLightningYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Aurora.attackWith(autumnSTouchBlue);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Aurora).toHaveAP(1);
  });

  it("timing: whenever you go again this turn, deal 1 arcane damage to any target", () => {
    const game = FabTestEngine.start(
      { hero: aurora, hand: [arcLightningYellow], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(aurora);
    const Dash = game.as(dash);

    Aurora.play(arcLightningYellow);
    // Arc Lightning's own go again arms the delayed layer; choose Dash as any-target.
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: dash.canonicalId });

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Aurora).toHaveLife(20);
    expectFabPlayer(Aurora).toHaveAP(1);
  });

  it("boundary: specialization is deckbuilding-only — Dash can still play it in-match", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [arcLightningYellow], actionPoints: 1, deck: 6 },
      { hero: aurora, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(arcLightningYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
