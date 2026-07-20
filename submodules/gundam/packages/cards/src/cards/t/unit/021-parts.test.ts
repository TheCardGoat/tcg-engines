import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { tParts021 } from "./021-parts.ts";

describe("Parts (T-021)", () => {
  describe("This Unit can't choose the enemy player as its attack target.", () => {
    it("rejects a direct attack without resting Parts or starting combat", () => {
      const engine = GundamTestEngine.create(
        { play: [tParts021], deck: 5 },
        { shieldArea: [createMockUnit({ name: "Shield" })], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const partsId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.enterBattle(partsId, "direct"), "CANNOT_TARGET_PLAYER");

      expect(p1.isExhausted(partsId)).toBe(false);
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });

    it("still allows Parts to attack a rested enemy Unit", () => {
      const enemy = createMockUnit({ name: "Rested Enemy", ap: 0, hp: 3 });
      const engine = GundamTestEngine.create(
        { play: [tParts021], deck: 5 },
        { play: [{ card: enemy, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const partsId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(partsId, enemyId));

      expect(p1.isExhausted(partsId)).toBe(true);
      expect(p1.getBoardView().pendingCombat).toMatchObject({
        attackerId: partsId,
        target: enemyId,
      });
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getDamage(enemyId)).toBe(1);
    });

    it("does not prevent another friendly Unit from attacking the enemy player", () => {
      const ordinaryUnit = createMockUnit({ name: "Ordinary Unit", ap: 1, hp: 3 });
      const engine = GundamTestEngine.create(
        { play: [tParts021, ordinaryUnit], deck: 5 },
        { shieldArea: [createMockUnit({ name: "Shield" })], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [partsId, ordinaryUnitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(ordinaryUnitId!, "direct"));

      expect(p1.isExhausted(ordinaryUnitId!)).toBe(true);
      expect(p1.isExhausted(partsId!)).toBe(false);
      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: ordinaryUnitId });
    });

    it("uses the same restriction for Parts controlled by the other player", () => {
      const engine = GundamTestEngine.create(
        { shieldArea: [createMockUnit({ name: "Player One Shield" })], deck: 5 },
        { play: [tParts021], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p2 = engine.asPlayer(PLAYER_TWO);
      const partsId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p2.enterBattle(partsId, "direct"), "CANNOT_TARGET_PLAYER");

      expect(p2.isExhausted(partsId)).toBe(false);
      expect(p2.getBoardView().pendingCombat).toBeUndefined();
    });

    it("allows Parts controlled by the other player to attack a rested opposing Unit", () => {
      const enemy = createMockUnit({ name: "Player One Rested Unit", ap: 0, hp: 3 });
      const engine = GundamTestEngine.create(
        { play: [{ card: enemy, exhausted: true }], deck: 5 },
        { play: [tParts021], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p1.getCardsInZone("battleArea")[0]!;
      const partsId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(partsId, enemyId));

      expect(p2.isExhausted(partsId)).toBe(true);
      expect(p2.getBoardView().pendingCombat).toMatchObject({
        attackerId: partsId,
        target: enemyId,
      });
    });

    it("continues to reject direct attacks on a later turn", () => {
      const engine = GundamTestEngine.create(
        { play: [tParts021], deck: 5 },
        { shieldArea: [createMockUnit({ name: "Shield" })], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const partsId = p1.getCardsInZone("battleArea")[0]!;

      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectFailure(p1.enterBattle(partsId, "direct"), "CANNOT_TARGET_PLAYER");

      expect(p1.isExhausted(partsId)).toBe(false);
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });
});
