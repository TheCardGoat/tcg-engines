import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { deepBlue } from "./deep-blue.ts";

describe("Deep Blue (ELE234) AAA", () => {
  it("happy: bottom a hand card and destroy this to gain 3 resources with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [deepBlue],
        hand: [nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(deepBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, deepBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(3);
    expectFabPlayer(Bravo).toHaveAP(1);
    expect(Bravo.zone("deck")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Bravo).toHaveHandCount(0);
  });

  it("boundary: cannot activate with an empty hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [deepBlue],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).expectActivationRejected(deepBlue);
    expectFabCard(game.as(bravo), deepBlue).toBeIn("chest");
  });

  it("timing: an Action activation is illegal at 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [deepBlue],
        hand: [nimblismBlue],
        actionPoints: 0,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).expectActivationRejected(deepBlue);
    expectFabCard(game.as(bravo), deepBlue).toBeIn("chest");
  });
});
