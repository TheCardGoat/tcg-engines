import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Alvatore080 } from "./080-alvatore.ts";

describe("Alvatore (GD04-080)", () => {
  describe("【Destroyed】If you have another (UN)/(Superpower Bloc) Unit in play, deploy 1 rested [Alvaaron]((UN)･AP4･HP1) Unit token.", () => {
    it("deploys the visible rested Alvaaron token after Alvatore is destroyed in battle", () => {
      const otherUn = createMockUnit({ ap: 1, hp: 3, traits: ["un"] });
      const attacker = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: gd04Alvatore080, exhausted: true }, otherUn],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [alvatoreId, otherUnId] = p1.getCardsInZone("battleArea");
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, alvatoreId!));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      const tokenId = p1.getCardsInZone("battleArea").find((id) => id !== otherUnId);
      expect(p1.getCardZone(alvatoreId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(tokenId).toBeDefined();
      expect(p1.isExhausted(tokenId!)).toBe(true);
      expect(p1.getVisibleCard(tokenId!)?.effectiveAp).toBe(4);
      expect(p1.getVisibleCard(tokenId!)?.effectiveHp).toBe(1);
    });

    it("does not deploy a token when Alvatore was the only matching Unit", () => {
      const attacker = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [{ card: gd04Alvatore080, exhausted: true }] },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const alvatoreId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, alvatoreId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getCardZone(alvatoreId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });
  });
});
