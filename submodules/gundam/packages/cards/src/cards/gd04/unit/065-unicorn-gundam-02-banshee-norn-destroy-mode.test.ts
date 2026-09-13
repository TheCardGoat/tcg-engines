import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectCard,
  expectFailure,
  expectLogType,
  expectPublicLog,
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

      p1.must.attack(gd04UnicornGundam02BansheeNornDestroyMode065).into(defender);

      expectPublicLog(engine, "gundam.move.attackDeclared", {
        attackerPlayerId: PLAYER_ONE,
      });
      expectCard(p2, defender).toHaveAp(3);
      expectCard(p2, otherEnemy).toHaveAp(4);

      p2.must.passBlock().passBattleAction();
      p1.must.passBattleAction();

      expectLogType(engine, "gundam.combat.damageDealt", { min: 1 });
      expectCard(p1, gd04UnicornGundam02BansheeNornDestroyMode065).toHaveDamage(3);
    });

    it("applies the AP-1 even without a linked Pilot", () => {
      const defender = createMockUnit({ ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [gd04UnicornGundam02BansheeNornDestroyMode065] },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expect(
        p1.getPilotId(p1.unit(gd04UnicornGundam02BansheeNornDestroyMode065).instanceId),
      ).toBeUndefined();
      p1.must.attack(gd04UnicornGundam02BansheeNornDestroyMode065).into(defender);

      expectCard(p2, defender).toHaveAp(2);
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
      const bansheeId = p1.unit(gd04UnicornGundam02BansheeNornDestroyMode065).instanceId;

      p1.must.assignPilot(riddhe, gd04UnicornGundam02BansheeNornDestroyMode065);
      const blueAId = p1.cardIn("trash", blueA).instanceId;
      const blueBId = p1.cardIn("trash", blueB).instanceId;
      const blueCId = p1.cardIn("trash", blueC).instanceId;
      const blueDId = p1.cardIn("trash", blueD).instanceId;
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

      // Negative path uses instance ids (raw activateAbility does not resolve defs)
      expectFailure(
        p1.activateAbility(bansheeId, 0, { targets: [blueAId, blueAId, blueCId] }),
        "DUPLICATE_TARGETS",
      );
      expectCard(p1, blueA).toBeIn("trash");
      expectCard(p1, gd04UnicornGundam02BansheeNornDestroyMode065).toBeRested();

      p1.must.activateAbility(gd04UnicornGundam02BansheeNornDestroyMode065, 0, {
        targets: [blueA, blueC, blueD],
      });

      expect(p1.getCardZone(blueA)).toBe("removalArea");
      expect(p1.getCardZone(blueC)).toBe("removalArea");
      expect(p1.getCardZone(blueD)).toBe("removalArea");
      expectCard(p1, blueB).toBeIn("trash");
      expectCard(p1, whiteCard).toBeIn("trash");
      expectCard(p1, gd04UnicornGundam02BansheeNornDestroyMode065).toBeReady();
      expect(p1.getLegalAttackTargets(bansheeId)).not.toContain("direct");
      expectFailure(
        p1.enterBattle(gd04UnicornGundam02BansheeNornDestroyMode065, "direct"),
        "CANNOT_TARGET_PLAYER",
      );
    });

    it("cannot activate while unpaired", () => {
      const blueA = createMockUnit({ color: "blue" });
      const blueB = createMockUnit({ color: "blue" });
      const blueC = createMockUnit({ color: "blue" });
      const engine = GundamTestEngine.create({
        play: [{ card: gd04UnicornGundam02BansheeNornDestroyMode065, exhausted: true }],
        trash: [blueA, blueB, blueC],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const trashIds = p1.getCardsInZone("trash");

      expectFailure(
        p1.activateAbility(gd04UnicornGundam02BansheeNornDestroyMode065, 0, {
          targets: trashIds,
        }),
        "CONDITIONS_NOT_MET",
      );
      expectCard(p1, gd04UnicornGundam02BansheeNornDestroyMode065).toBeRested();
      expectCard(p1, blueA).toBeIn("trash");
      expectCard(p1, blueB).toBeIn("trash");
      expectCard(p1, blueC).toBeIn("trash");
    });

    it("cannot activate when paired with a Pilot that does not satisfy Link", () => {
      const wrongPilot = createMockPilot({ name: "Not Riddhe", level: 4, cost: 1 });
      const blueA = createMockUnit({ color: "blue" });
      const blueB = createMockUnit({ color: "blue" });
      const blueC = createMockUnit({ color: "blue" });
      const engine = GundamTestEngine.create({
        hand: [wrongPilot],
        play: [{ card: gd04UnicornGundam02BansheeNornDestroyMode065, exhausted: true }],
        trash: [blueA, blueB, blueC],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const trashIds = p1.getCardsInZone("trash");

      p1.must.assignPilot(wrongPilot, gd04UnicornGundam02BansheeNornDestroyMode065);
      expectFailure(
        p1.activateAbility(gd04UnicornGundam02BansheeNornDestroyMode065, 0, {
          targets: trashIds,
        }),
        "CONDITIONS_NOT_MET",
      );
      expectCard(p1, gd04UnicornGundam02BansheeNornDestroyMode065).toBeRested();
    });

    it("cannot pay the exile cost with fewer than 3 blue cards in trash", () => {
      const riddhe = createMockPilot({ name: "Riddhe Marcenas", level: 4, cost: 1 });
      const blueA = createMockUnit({ color: "blue" });
      const blueB = createMockUnit({ color: "blue" });
      const whiteCard = createMockUnit({ color: "white" });
      const engine = GundamTestEngine.create({
        hand: [riddhe],
        play: [{ card: gd04UnicornGundam02BansheeNornDestroyMode065, exhausted: true }],
        trash: [blueA, blueB, whiteCard],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const blueAId = p1.cardIn("trash", blueA).instanceId;
      const blueBId = p1.cardIn("trash", blueB).instanceId;
      const whiteCardId = p1.cardIn("trash", whiteCard).instanceId;

      p1.must.assignPilot(riddhe, gd04UnicornGundam02BansheeNornDestroyMode065);
      expectFailure(
        p1.activateAbility(gd04UnicornGundam02BansheeNornDestroyMode065, 0, {
          targets: [blueAId, blueBId, whiteCardId],
        }),
        "COST_NOT_PAYABLE",
      );
      expectCard(p1, gd04UnicornGundam02BansheeNornDestroyMode065).toBeRested();
      expectCard(p1, blueA).toBeIn("trash");
      expectCard(p1, whiteCard).toBeIn("trash");
    });
  });
});
