import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { nebulaDualityRed } from "./nebula-duality.ts";

describe("Nebula Duality (OMN121) AAA", () => {
  it("happy: Instant discard deals 1 arcane to the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [nebulaDualityRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.activate(nebulaDualityRed);
    game.untilIdle({ entityTargets: "pause" });
    Kano.target(Dash);
    game.untilIdle();

    expectFabCard(Kano, nebulaDualityRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: with 0 resources the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [nebulaDualityRed],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(kano).expectActivationRejected(nebulaDualityRed);
    expectFabCard(game.as(kano), nebulaDualityRed).toBeIn("hand");
  });
});
