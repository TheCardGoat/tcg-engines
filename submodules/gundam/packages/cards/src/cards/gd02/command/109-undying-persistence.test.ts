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
import { gd02UndyingPersistence109 } from "./109-undying-persistence.ts";

describe("Undying Persistence (GD02-109)", () => {
  describe("【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it.", () => {
    it("deals 1 damage to the chosen enemy unit", () => {
      const enemyUnit = createMockUnit({ ap: 2, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [gd02UndyingPersistence109], resourceArea: activeResources(4) },
        { play: [enemyUnit] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd02UndyingPersistence109, { targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(1);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target a friendly unit", () => {
      const friendly = createMockUnit({ ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [gd02UndyingPersistence109],
        play: [friendly],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd02UndyingPersistence109, { targets: [friendlyId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
