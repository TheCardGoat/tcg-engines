import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04CoreFighter013 } from "./013-core-fighter.ts";

describe("Core Fighter (GD04-013)", () => {
  describe("While this Unit is rested, all your (League Militaire) Unit tokens gain <Blocker>.", () => {
    it("allows a League Militaire Unit token to block while Core Fighter is rested", () => {
      const leagueMilitaireToken = createMockUnit({
        name: "League Militaire Token",
        traits: ["league militaire"],
      });
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          play: [
            { card: gd04CoreFighter013, exhausted: true },
            { card: leagueMilitaireToken, isToken: true },
          ],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [, tokenId] = p1.getCardsInZone("battleArea");
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.declareBlock(tokenId!));

      expect(p1.isExhausted(tokenId!)).toBe(true);
    });

    it("does not grant Blocker while Core Fighter is active", () => {
      const leagueMilitaireToken = createMockUnit({
        name: "League Militaire Token",
        traits: ["league militaire"],
      });
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [gd04CoreFighter013, { card: leagueMilitaireToken, isToken: true }] },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [, tokenId] = p1.getCardsInZone("battleArea");
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p2.enterBattle(attackerId, "direct"));

      expectFailure(p1.declareBlock(tokenId!), "CANNOT_BLOCK_DIRECT");
      expect(p1.isExhausted(tokenId!)).toBe(false);
    });

    it("does not grant Blocker to a non-token or to a token without the League Militaire trait", () => {
      const leagueMilitaireNonToken = createMockUnit({
        name: "League Militaire Non-Token",
        traits: ["league militaire"],
      });
      const zeonToken = createMockUnit({ name: "Zeon Token", traits: ["zeon"] });
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          play: [
            { card: gd04CoreFighter013, exhausted: true },
            leagueMilitaireNonToken,
            { card: zeonToken, isToken: true },
          ],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [, nonTokenId, zeonTokenId] = p1.getCardsInZone("battleArea");
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p2.enterBattle(attackerId, "direct"));

      expectFailure(p1.declareBlock(nonTokenId!), "CANNOT_BLOCK_DIRECT");
      expectFailure(p1.declareBlock(zeonTokenId!), "CANNOT_BLOCK_DIRECT");
    });
  });
});
