import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04UnicornGundam02BansheeNornDestroyMode065 } from "./065-unicorn-gundam-02-banshee-norn-destroy-mode.ts";

describe("Unicorn Gundam 02 Banshee Norn (Destroy Mode) (GD04-065)", () => {
  describe("【Attack】All enemy Units get AP-1 during this turn.", () => {
    it("shows AP-1 on every enemy Unit and receives the reduced battle damage", () => {
      const defender = createMockUnit({ ap: 4, hp: 6 });
      const otherEnemy = createMockUnit({ ap: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [gd04UnicornGundam02BansheeNornDestroyMode065] },
        { play: [{ card: defender, exhausted: true }, otherEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [defenderId, otherEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, defenderId!));

      expect(p1.getVisibleCard(defenderId!)?.effectiveAp).toBe(3);
      expect(p1.getVisibleCard(otherEnemyId!)?.effectiveAp).toBe(4);

      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(attackerId)).toBe(3);
    });
  });

  describe("【During Link】【Activate･Main】Exile 3 blue cards from your trash：Set this Unit as active. It can't choose the enemy player as its attack target during this turn.", () => {
    it("offers only blue trash cards for the cost, exiles the chosen three, and applies both results", () => {
      const riddhe = createMockPilot({ name: "Riddhe Marcenas", level: 4, cost: 1 });
      const blueA = createMockUnit({ name: "Blue A", color: "blue" });
      const blueB = createMockUnit({ name: "Blue B", color: "blue" });
      const blueC = createMockUnit({ name: "Blue C", color: "blue" });
      const blueD = createMockUnit({ name: "Blue D", color: "blue" });
      const whiteCard = createMockUnit({ name: "White Card", color: "white" });
      const engine = GundamTestEngine.create({
        hand: [riddhe],
        play: [{ card: gd04UnicornGundam02BansheeNornDestroyMode065, exhausted: true }],
        trash: [blueA, blueB, blueC, blueD, whiteCard],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const bansheeId = p1.getCardsInZone("battleArea")[0]!;
      const [blueAId, blueBId, blueCId, blueDId, whiteCardId] = p1.getCardsInZone("trash");

      expectSuccess(p1.assignPilot(riddhe, bansheeId));
      const [costStep] = p1.getMoveProcedure("activateAbility", {
        cardId: bansheeId,
        effectIndex: 0,
      });
      expect(costStep).toMatchObject({
        kind: "selectTarget",
        role: "cost",
        candidateIds: [blueAId, blueBId, blueCId, blueDId],
        minTargets: 3,
        maxTargets: 3,
      });

      expectFailure(
        p1.activateAbility(bansheeId, 0, { targets: [blueAId!, blueAId!, blueCId!] }),
        "DUPLICATE_TARGETS",
      );
      expect(p1.getCardZone(blueAId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.isExhausted(bansheeId)).toBe(true);

      expectSuccess(p1.activateAbility(bansheeId, 0, { targets: [blueAId!, blueCId!, blueDId!] }));

      expect(p1.getCardZone(blueAId!)).toBe("removalArea");
      expect(p1.getCardZone(blueCId!)).toBe("removalArea");
      expect(p1.getCardZone(blueDId!)).toBe("removalArea");
      expect(p1.getCardZone(blueBId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(whiteCardId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.isExhausted(bansheeId)).toBe(false);
      expect(p1.getLegalAttackTargets(bansheeId)).not.toContain("direct");
      expectFailure(p1.enterBattle(bansheeId, "direct"), "CANNOT_TARGET_PLAYER");
    });
  });
});
