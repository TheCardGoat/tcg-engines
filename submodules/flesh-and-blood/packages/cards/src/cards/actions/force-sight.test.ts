import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { forceSightRed } from "./force-sight.ts";

describe("Force Sight Red (ARC206) AAA", () => {
  it("happy: the next attack gets +3 power and playing Force Sight has go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [forceSightRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(forceSightRed);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [forceSightRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(forceSightRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
