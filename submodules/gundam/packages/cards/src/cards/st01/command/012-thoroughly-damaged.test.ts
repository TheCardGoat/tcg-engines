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
import { st01ThoroughlyDamaged012 } from "./012-thoroughly-damaged.ts";

describe("Thoroughly Damaged (ST01-012)", () => {
  describe("【Main】Choose 1 rested enemy Unit. Deal 1 damage to it.", () => {
    it("deals 1 damage to a rested enemy unit", () => {
      const enemyUnit = createMockUnit({ ap: 2, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [st01ThoroughlyDamaged012], resourceArea: activeResources(4) },
        { play: [{ card: enemyUnit, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st01ThoroughlyDamaged012, { targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(1);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target an active (un-rested) enemy unit", () => {
      const enemyUnit = createMockUnit({ ap: 2, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [st01ThoroughlyDamaged012], resourceArea: activeResources(4) },
        { play: [enemyUnit] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(st01ThoroughlyDamaged012, { targets: [enemyId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
