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
import { gd05GundamThroneEinsGnHighMegaLauncher038 } from "./038-gundam-throne-eins-gn-high-mega-launcher.ts";

function cbUnit(name: string) {
  return createMockUnit({ name, traits: ["cb"], hp: 5 });
}

describe("Gundam Throne Eins (GN High Mega Launcher) (GD05-038)", () => {
  /** @behavioral-proof complete: linked Suppression and activated timing/cost/target/damage/limit are public. */
  describe("【During Link】This Unit gains <Suppression>.", () => {
    it("destroys the first two Shields simultaneously while linked to a Trinity Pilot", () => {
      const trinityPilot = createMockPilot({
        name: "Trinity Pilot",
        traits: ["trinity"],
        level: 1,
        cost: 1,
      });
      const engine = GundamTestEngine.create(
        {
          hand: [trinityPilot],
          play: [gd05GundamThroneEinsGnHighMegaLauncher038],
          resourceArea: activeResources(7),
        },
        {
          shieldArea: [
            createMockUnit({ name: "First Shield" }),
            createMockUnit({ name: "Second Shield" }),
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const throneId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(trinityPilot, throneId));
      expect(p1.getVisibleCard(throneId)?.keywords).toContain("Suppression");
      expectSuccess(p1.enterBattle(throneId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p2.getCardsInZone("trash")).toHaveLength(2);
    });

    it("destroys only one Shield when the paired Pilot does not satisfy Link", () => {
      const wrongPilot = createMockPilot({
        name: "Wrong Pilot",
        traits: ["cb"],
        level: 1,
        cost: 1,
      });
      const engine = GundamTestEngine.create(
        {
          hand: [wrongPilot],
          play: [gd05GundamThroneEinsGnHighMegaLauncher038],
          resourceArea: activeResources(7),
        },
        {
          shieldArea: [
            createMockUnit({ name: "First Shield" }),
            createMockUnit({ name: "Second Shield" }),
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const throneId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(wrongPilot, throneId));
      expect(p1.getVisibleCard(throneId)?.keywords).not.toContain("Suppression");
      expectSuccess(p1.enterBattle(throneId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardsInZone("shieldArea")).toHaveLength(1);
      expect(p2.getCardsInZone("trash")).toHaveLength(1);
    });
  });

  describe("【Activate･Main】【Once per Turn】Rest 3 of your (CB) Units：Choose 1 enemy Unit. Deal 4 damage to it.", () => {
    it("publishes exactly active CB Units for the cost, rests three choices, and deals 4", () => {
      const first = cbUnit("First CB");
      const second = cbUnit("Second CB");
      const third = cbUnit("Third CB");
      const rested = cbUnit("Rested CB");
      const nonCb = createMockUnit({ name: "Non-CB", traits: ["trinity"] });
      const enemy = createMockUnit({ name: "Enemy", hp: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [
            gd05GundamThroneEinsGnHighMegaLauncher038,
            first,
            second,
            third,
            { card: rested, exhausted: true },
            nonCb,
          ],
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [throneId, firstId, secondId, thirdId, restedId, nonCbId] =
        p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      const procedure = p1.getMoveProcedure("activateAbility", {
        cardId: throneId!,
        effectIndex: 0,
      });
      expect(procedure[0]).toMatchObject({
        kind: "selectTarget",
        role: "cost",
        candidateIds: expect.arrayContaining([throneId, firstId, secondId, thirdId]),
        minTargets: 3,
        maxTargets: 3,
      });
      if (procedure[0]?.kind !== "selectTarget") throw new Error("Expected the CB rest cost");
      expect(procedure[0].candidateIds).not.toContain(restedId);
      expect(procedure[0].candidateIds).not.toContain(nonCbId);

      expectSuccess(
        p1.activateAbility(throneId!, 0, {
          targets: [firstId!, secondId!, thirdId!, enemyId],
        }),
      );

      expect(p1.isExhausted(firstId!)).toBe(true);
      expect(p1.isExhausted(secondId!)).toBe(true);
      expect(p1.isExhausted(thirdId!)).toBe(true);
      expect(p1.isExhausted(throneId!)).toBe(false);
      expect(p2.getDamage(enemyId)).toBe(4);
    });

    it("cannot activate with fewer than three active friendly CB Units", () => {
      const first = cbUnit("First CB");
      const nonCb = createMockUnit({ name: "Non-CB", traits: ["trinity"] });
      const enemy = createMockUnit({ name: "Enemy", hp: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [gd05GundamThroneEinsGnHighMegaLauncher038, first, nonCb],
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [throneId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.activateAbility(throneId!, 0, { targets: [enemyId] }), "COST_NOT_PAYABLE");
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("cannot use the ability twice in one turn even with six more active CB Units", () => {
      const helpers = Array.from({ length: 6 }, (_, index) => cbUnit(`CB ${index + 1}`));
      const enemy = createMockUnit({ name: "Enemy", hp: 10 });
      const engine = GundamTestEngine.create(
        {
          play: [gd05GundamThroneEinsGnHighMegaLauncher038, ...helpers],
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [throneId, ...helperIds] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(
        p1.activateAbility(throneId!, 0, {
          targets: [...helperIds.slice(0, 3), enemyId],
        }),
      );
      expectFailure(
        p1.activateAbility(throneId!, 0, {
          targets: [...helperIds.slice(3, 6), enemyId],
        }),
        "ABILITY_LIMIT_REACHED",
      );

      expect(p2.getDamage(enemyId)).toBe(4);
      expect(helperIds.slice(3, 6).every((id) => !p1.isExhausted(id!))).toBe(true);
    });

    it("cannot activate outside the Main Phase", () => {
      const helpers = [cbUnit("First"), cbUnit("Second"), cbUnit("Third")];
      const defender = createMockUnit({ name: "Defender", hp: 10 });
      const engine = GundamTestEngine.create(
        {
          play: [gd05GundamThroneEinsGnHighMegaLauncher038, ...helpers],
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [throneId, ...helperIds] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(throneId!, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());

      expectFailure(
        p1.activateAbility(throneId!, 0, {
          targets: [...helperIds, defenderId],
        }),
        "WRONG_PHASE",
      );
    });
  });
});
