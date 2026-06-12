import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { st08Gundam002 } from "./002-gundam.ts";

describe("Ξ Gundam (ST08-002)", () => {
  describe("【Deploy】Choose 1 enemy Unit. Deal 1 damage to it.", () => {
    it("data encodes a deploy-triggered 1 damage effect against an enemy Unit", () => {
      const effect = st08Gundam002.effects?.[0];

      expect(effect?.type).toBe("triggered");
      expect(effect?.activation.timing).toEqual(["deploy"]);
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ]);
    });

    it("deals 1 damage to the chosen enemy Unit when deployed", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st08Gundam002], resourceArea: activeResources(5) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(st08Gundam002, { targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(1);
    });

    it("rejects deploy when the only chosen target is friendly", () => {
      const friendly = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st08Gundam002],
        play: [friendly],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      expectFailure(p1.deployUnit(st08Gundam002, { targets: [friendlyId!] }), "INVALID_TARGET");
    });
  });
});
