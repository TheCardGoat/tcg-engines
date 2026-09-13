import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { treasureIsland } from "../macros/treasure-island.ts";
import { expeditionToHorizonSMantleRed } from "./expedition-to-horizon-s-mantle.ts";

/**
 * Expedition to Horizon's Mantle (SEA158) — Pirate Action - Attack, cost 3, 7{p}.
 *
 * Printed: When this attacks, you may put a gold counter on Treasure Island.
 */

describe("Expedition to Horizon's Mantle (SEA158) AAA", () => {
  it("happy: attacking may put a gold counter on Treasure Island", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        macros: [treasureIsland],
        hand: [expeditionToHorizonSMantleRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(expeditionToHorizonSMantleRed, { stopAt: "on-attack" });
    game.advanceUntil({
      stopAt: "defend",
      ordering: "listed",
      optionals: "accept",
      entityTargets: "minimum",
    });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
    expectFabCard(Gravy, treasureIsland).toHaveCounters(2, "gold");
  });

  it("boundary: without Treasure Island this still attacks at printed 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [expeditionToHorizonSMantleRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(expeditionToHorizonSMantleRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
  });

  it("timing: declining leaves Treasure Island with no gold counter", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        macros: [treasureIsland],
        hand: [expeditionToHorizonSMantleRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(expeditionToHorizonSMantleRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed", optionals: "decline" });
    game.closeCombat();
    expectFabCard(Gravy, treasureIsland).toHaveCounters(1, "gold");
  });
});
