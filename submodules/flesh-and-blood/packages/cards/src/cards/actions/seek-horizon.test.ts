import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { seekHorizonRed } from "./seek-horizon.ts";

describe("Seek Horizon (MON251) AAA", () => {
  it("happy: leftover AP after close at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [seekHorizonRed, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(seekHorizonRed, { modeIds: ["pay"] });
    game.helpers.resolveUntilIdle();

    expect(game.combat()).toBeNull();
    expectFabPlayer(game.as(bravo)).toHaveLife(16);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: a miss deals no damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [seekHorizonRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(seekHorizonRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: declining the additional cost leaves 0 AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [seekHorizonRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(seekHorizonRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
