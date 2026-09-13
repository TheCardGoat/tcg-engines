import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { runebloodBarrierYellow } from "./runeblood-barrier.ts";

/**
 * Runeblood Barrier (CRU144) — Runeblade Action Aura, cost 3.
 * Printed: When this enters the arena, create 4 Runechant tokens.
 */

describe("Runeblood Barrier (CRU144) AAA", () => {
  it("happy: entering the arena creates 4 Runechant tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [runebloodBarrierYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(runebloodBarrierYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Viserai, runebloodBarrierYellow).toBeIn("arena");
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 4);
  });

  it("boundary: the opponent receives none of the Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [runebloodBarrierYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(runebloodBarrierYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("runechant", 0);
  });

  it("timing: at the beginning of your next action phase this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [runebloodBarrierYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(runebloodBarrierYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Viserai, runebloodBarrierYellow).toBeIn("arena");

    Viserai.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Viserai, runebloodBarrierYellow).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 4);
  });
});
