import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  expectCardInHand,
} from "@tcg/gundam-engine";
import { betaHawkOfEndymion013 } from "./013-hawk-of-endymion.ts";

describe("Hawk of Endymion (ST04-013, beta reprint)", () => {
  describe("【Main】/【Action】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.", () => {
    it("bounces an enemy unit with HP ≤ 3 back to its owner's hand", () => {
      const fragile = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [betaHawkOfEndymion013], resourceArea: activeResources(3) },
        { play: [fragile] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [fragileId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(betaHawkOfEndymion013, { targets: [fragileId!] }));

      expectCardInHand(engine, fragileId!, p2.playerId);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target an enemy unit with more than 3 HP", () => {
      const tough = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [betaHawkOfEndymion013], resourceArea: activeResources(3) },
        { play: [tough] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [toughId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(betaHawkOfEndymion013, { targets: [toughId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
