import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { surgentAethertide } from "./surgent-aethertide.ts";

describe("Surgent Aethertide (DYN192) AAA", () => {
  it("happy: Action deals 1 arcane to the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        weapon1: [surgentAethertide],
        hand: [],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.activate(surgentAethertide);
    game.untilIdle();

    expectFabPlayer(game.as(dash)).toHaveLife(19);
    expectFabPlayer(Kano).toHaveAP(1);
  });

  it("boundary: with 1 resource the Action is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        weapon1: [surgentAethertide],
        hand: [],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(kano).expectActivationRejected(surgentAethertide);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
