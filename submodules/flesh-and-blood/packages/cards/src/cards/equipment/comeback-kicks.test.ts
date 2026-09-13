import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { heroicPoseBlue } from "../actions/heroic-pose.ts";
import { comebackKicks } from "./comeback-kicks.ts";

describe("Comeback Kicks (PEN288) AAA", () => {
  it("happy: crowd cheers while behind on life may destroy this for 1 AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [comebackKicks],
        hand: [heroicPoseBlue],
        life: 19,
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(heroicPoseBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Bravo, comebackKicks).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(2);
  });

  it("boundary: equal life does not fire the crowd-cheers destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [comebackKicks],
        hand: [heroicPoseBlue],
        life: 20,
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(heroicPoseBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Bravo, comebackKicks).toBeIn("legs");
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("timing: Battleworn stays printed on the seated boots", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, legs: [comebackKicks], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(bravo), comebackKicks).toBeIn("legs");
    expectFabCard(game.as(bravo), comebackKicks).toHaveKeyword("battleworn");
  });
});
