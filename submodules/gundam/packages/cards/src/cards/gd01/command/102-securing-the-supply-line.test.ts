import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd01SecuringTheSupplyLine102 } from "./102-securing-the-supply-line.ts";

describe("Securing the Supply Line (GD01-102)", () => {
  describe("【Main】All friendly Units that are Lv.4 or lower recover 2 HP.", () => {
    it("recovers 2 HP from every friendly Lv.4-or-lower unit, skipping Lv.5+", () => {
      const lowUnit = createMockUnit({ level: 3, ap: 2, hp: 5 });
      const mid = createMockUnit({ level: 4, ap: 2, hp: 5 });
      const big = createMockUnit({ level: 5, ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [gd01SecuringTheSupplyLine102],
        play: [lowUnit, mid, big],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [lowId, midId, bigId] = p1.getCardsInZone("battleArea");
      // Seed damage: 3 each
      engine.getG().damage[lowId!] = 3;
      engine.getG().damage[midId!] = 3;
      engine.getG().damage[bigId!] = 3;
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01SecuringTheSupplyLine102));

      expect(getDamageCounter(engine, lowId!)).toBe(1);
      expect(getDamageCounter(engine, midId!)).toBe(1);
      // Lv.5 unit is unaffected
      expect(getDamageCounter(engine, bigId!)).toBe(3);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
