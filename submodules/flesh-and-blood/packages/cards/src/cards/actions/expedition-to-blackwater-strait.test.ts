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
import { expeditionToBlackwaterStraitRed } from "./expedition-to-blackwater-strait.ts";

/**
 * Expedition to Blackwater Strait (SEA156) — Pirate Action - Attack, cost 1, 5{p}.
 *
 * Printed: When this attacks, you may put a gold counter on Treasure Island.
 */

describe("Expedition to Blackwater Strait (SEA156) AAA", () => {
  it("happy: attacking may put a gold counter on Treasure Island", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        macros: [treasureIsland],
        hand: [expeditionToBlackwaterStraitRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(expeditionToBlackwaterStraitRed, { stopAt: "on-attack" });
    game.advanceUntil({
      stopAt: "defend",
      ordering: "listed",
      optionals: "accept",
      entityTargets: "minimum",
    });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
    expectFabCard(Gravy, treasureIsland).toHaveCounters(2, "gold");
  });

  it("boundary: without Treasure Island this still attacks at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [expeditionToBlackwaterStraitRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(expeditionToBlackwaterStraitRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
  });

  it("timing: declining leaves Treasure Island with no gold counter", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        macros: [treasureIsland],
        hand: [expeditionToBlackwaterStraitRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(expeditionToBlackwaterStraitRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed", optionals: "decline" });
    game.closeCombat();
    expectFabCard(Gravy, treasureIsland).toHaveCounters(1, "gold");
  });
});
