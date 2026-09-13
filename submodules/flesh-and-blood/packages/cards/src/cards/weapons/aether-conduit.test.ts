import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { aetherConduit } from "./aether-conduit.ts";

describe("Aether Conduit (CRU160) AAA", () => {
  it("happy: Action deals 2 arcane to the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        weapon1: [aetherConduit],
        hand: [],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.activate(aetherConduit);
    game.untilIdle({ entityTargets: "pause" });
    Kano.target(Dash);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: with 1 resource the Action is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        weapon1: [aetherConduit],
        hand: [],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(kano).expectActivationRejected(aetherConduit);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
