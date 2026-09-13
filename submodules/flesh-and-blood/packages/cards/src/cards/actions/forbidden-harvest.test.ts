import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { satiateBloodthirstRed } from "./satiate-bloodthirst.ts";
import { cleaveTheHeavensRed } from "./cleave-the-heavens.ts";
import { forbiddenHarvestYellow } from "./forbidden-harvest.ts";

/**
 * Forbidden Harvest — Shadow Runeblade Action, cost 1, 2{d}.
 *
 * Printed: Turn up to 3 cards in your banished zone face-down, then create a
 * Runechant token for each Shadow card turned face-down this way. Go again
 */

describe("Forbidden Harvest AAA", () => {
  it("happy: turning two Shadow cards and one generic face-down creates 2 Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [forbiddenHarvestYellow],
        banished: [
          { card: satiateBloodthirstRed, state: { faceDown: false } },
          { card: cleaveTheHeavensRed, state: { faceDown: false } },
          { card: nimblismBlue, state: { faceDown: false } },
        ],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(forbiddenHarvestYellow);
    game.untilIdle({ entityTargets: "maximum" });

    expectFabCard(Viserai, satiateBloodthirstRed).toBeFaceDown();
    expectFabCard(Viserai, cleaveTheHeavensRed).toBeFaceDown();
    expectFabCard(Viserai, nimblismBlue).toBeFaceDown();
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 2).toHaveAP(1);
    expectFabCard(Viserai, forbiddenHarvestYellow).toBeIn("graveyard");
  });

  it("boundary: turning no cards creates no Runechants and still refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [forbiddenHarvestYellow],
        banished: [{ card: satiateBloodthirstRed, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(forbiddenHarvestYellow);
    game.untilIdle({ entityTargets: "pause" });
    Viserai.target();
    game.untilIdle();

    expectFabCard(Viserai, satiateBloodthirstRed).toBeBanished();
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0).toHaveAP(1);
  });
});
