import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  hasKeywordGrant,
} from "@tcg/gundam-engine";
import { betaSimultaneousFire012 } from "./012-simultaneous-fire.ts";

describe("Simultaneous Fire (ST02-012, beta reprint)", () => {
  describe("【Main】Choose 1 of your Units. It gains <Breach 3> during this turn.", () => {
    it("grants <Breach> to a chosen friendly unit", () => {
      const unit = createMockUnit({ ap: 3, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [betaSimultaneousFire012],
        play: [unit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(betaSimultaneousFire012, { targets: [unitId!] }));

      expect(hasKeywordGrant(engine, unitId!, "Breach")).toBe(true);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
