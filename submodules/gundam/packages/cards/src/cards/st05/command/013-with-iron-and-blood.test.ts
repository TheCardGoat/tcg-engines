import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  getDamageCounter,
  findStatModifier,
} from "@tcg/gundam-engine";
import { st05WithIronAndBlood013 } from "./013-with-iron-and-blood.ts";

describe("With Iron and Blood (ST05-013)", () => {
  describe("【Main】/【Action】Choose 1 of your Units. Deal 1 damage to it. It gets AP+3 during this turn.", () => {
    it("deals 1 damage to the chosen friendly unit and gives it AP+3", () => {
      const unit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st05WithIronAndBlood013],
        resourceArea: activeResources(2),
        play: [unit],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st05WithIronAndBlood013, { targets: [unitId!] }));

      expect(getDamageCounter(engine, unitId!)).toBe(1);
      expect(findStatModifier(engine, unitId!, "ap")?.modifier).toBe(3);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
