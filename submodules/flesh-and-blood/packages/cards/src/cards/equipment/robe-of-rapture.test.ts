import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { robeOfRapture } from "./robe-of-rapture.ts";

describe("Robe of Rapture (ARC117) AAA", () => {
  it("happy: Action destroy this to gain 3 resources", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        chest: [robeOfRapture],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.activate(robeOfRapture);
    game.untilIdle();

    expectFabCard(Kano, robeOfRapture).toBeIn("graveyard");
    expectFabPlayer(Kano).toHaveResourceCount(3);
  });

  it("boundary: with 0 action points the Action is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        chest: [robeOfRapture],
        hand: [],
        actionPoints: 0,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.expectActivationRejected(robeOfRapture);
    expectFabCard(Kano, robeOfRapture).toBeIn("chest");
    expectFabPlayer(Kano).toHaveResourceCount(0);
  });
});
