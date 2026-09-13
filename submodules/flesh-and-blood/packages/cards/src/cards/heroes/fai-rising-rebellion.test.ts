import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { snatchRed } from "../actions/snatch.ts";
import { faiRisingRebellion } from "./fai-rising-rebellion.ts";

describe("Fai, Rising Rebellion (UPR044) AAA", () => {
  it("happy: start-game seats Phoenix Flame into graveyard then Instant returns it", () => {
    const game = FabTestEngine.start(
      {
        hero: faiRisingRebellion,
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, phoenixFlameRed],
        startGame: [phoenixFlameRed],
        resourcePoints: 3,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(faiRisingRebellion);

    expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
    Fai.activate(faiRisingRebellion);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabCard(Fai, phoenixFlameRed).toBeIn("hand");
  });

  it("boundary: without 3 resources and no Draconic links the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: faiRisingRebellion,
        hand: [],
        graveyard: [phoenixFlameRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(faiRisingRebellion);

    Fai.expectActivationRejected(faiRisingRebellion);
    expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
    expectFabPlayer(Fai).toHaveResourceCount(2);
  });
});
