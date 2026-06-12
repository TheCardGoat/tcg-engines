import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectAttackRedirectedTo,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st04AileStrikeGundam001 } from "./001-aile-strike-gundam.ts";

describe("Aile Strike Gundam (ST04-001)", () => {
  describe("<Blocker> and 【When Paired･Lv.4 or Higher Pilot】return enemy HP<=4", () => {
    it("data declares Blocker and a Lv.4-or-higher pilot-qualified return effect", () => {
      const effect = st04AileStrikeGundam001.effects?.[0];

      expect(st04AileStrikeGundam001.keywordEffects).toEqual([{ keyword: "Blocker" }]);
      expect(effect?.type).toBe("triggered");
      expect(effect?.activation).toEqual({
        timing: ["whenPaired"],
        qualification: { attribute: "level", comparison: "gte", value: 4 },
      });
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 4 }],
            },
          },
        },
      ]);
    });

    it("returns the only enemy HP<=4 Unit when paired with a Lv.4 pilot", () => {
      const kira = createMockPilot({ name: "Kira Yamato", level: 4, cost: 1 });
      const enemy = createMockUnit({ ap: 3, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [kira],
          play: [st04AileStrikeGundam001],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(kira, st04AileStrikeGundam001));

      expect(p2.getCardsInZone("hand")).toContain(enemyId);
      expect(p2.getCardsInZone("battleArea")).not.toContain(enemyId);
    });

    it("does not return an enemy Unit when paired with a Lv.3 pilot", () => {
      const lowPilot = createMockPilot({ name: "Kira Yamato", level: 3, cost: 1 });
      const enemy = createMockUnit({ ap: 3, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [lowPilot],
          play: [st04AileStrikeGundam001],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(lowPilot, st04AileStrikeGundam001));

      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
    });

    it("uses Blocker to intercept an attack", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [defender, st04AileStrikeGundam001] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expectSuccess(p2.declareBlock(blockerId));

      expectAttackRedirectedTo(engine, blockerId);
    });
  });
});
