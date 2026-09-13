import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { barnacleYellow } from "./barnacle.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { giveNoQuarterBlue } from "./give-no-quarter.ts";

describe("Give No Quarter (SEA049) AAA", () => {
  it("happy: the next watery-grave ally costs {r}{r}{r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [giveNoQuarterBlue, barnacleYellow],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(giveNoQuarterBlue);
    game.passBoth();
    Gravy.play(barnacleYellow);
    game.passBoth();

    expectFabCard(Gravy, barnacleYellow).toBeIn("arena");
  });

  it("boundary: a non-ally is not discounted", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [giveNoQuarterBlue, brutalAssaultBlue],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(giveNoQuarterBlue);
    game.passBoth();
    expect(() => Gravy.play(brutalAssaultBlue)).toThrow();
    expectFabCard(Gravy, brutalAssaultBlue).toBeIn("hand");
  });

  it("timing: the discount expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [giveNoQuarterBlue, barnacleYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(giveNoQuarterBlue);
    game.passBoth();
    Gravy.endTurn();
    game.as(dash).endTurn();
    expect(() => Gravy.play(barnacleYellow)).toThrow();
  });
});
