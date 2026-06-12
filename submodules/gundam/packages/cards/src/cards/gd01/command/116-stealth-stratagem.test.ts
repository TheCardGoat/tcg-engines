import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd01StealthStratagem116 } from "./116-stealth-stratagem.ts";

describe("Stealth Stratagem (GD01-116)", () => {
  describe("【Main】/【Action】Choose 1 enemy Unit with 2 or less AP. Deal 2 damage to it.", () => {
    it("deals 2 damage to a qualifying enemy unit (AP ≤ 2)", () => {
      const enemyUnit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd01StealthStratagem116], resourceArea: activeResources(4) },
        { play: [enemyUnit] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01StealthStratagem116, { targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(2);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target an enemy unit with AP > 2", () => {
      const bigEnemy = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd01StealthStratagem116], resourceArea: activeResources(4) },
        { play: [bigEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01StealthStratagem116, { targets: [enemyId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
