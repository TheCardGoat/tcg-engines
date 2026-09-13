import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCard,
  expectFailure,
  expectLogType,
  expectPlayer,
  expectPublicLog,
} from "@tcg/gundam-engine";
import { gd03GundamBarbatosLupus050 } from "./050-gundam-barbatos-lupus.ts";

describe("Gundam Barbatos Lupus (GD03-050)", () => {
  describe("【Activate･Main】Choose 3 (Tekkadan)/(Teiwaz) Unit cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit. Deal 2 damage to it.", () => {
    it("exiles 3 Tekkadan/Teiwaz Units and then deals 2 damage", () => {
      const trashA = createMockUnit({ traits: ["tekkadan"] });
      const trashB = createMockUnit({ traits: ["teiwaz"] });
      const trashC = createMockUnit({ traits: ["tekkadan"] });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          play: [gd03GundamBarbatosLupus050],
          trash: [trashA, trashB, trashC],
          resourceArea: activeResources(7),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const trashIds = p1.getCardsInZone("trash");

      p1.must.activateAbility(gd03GundamBarbatosLupus050, 0);
      expectPublicLog(engine, "gundam.move.activateAbility", {
        playerId: PLAYER_ONE,
      });
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: trashIds,
        minTargets: 3,
        maxTargets: 3,
      });
      p1.must.resolveEffect({ targets: trashIds });

      expectPlayer(p1).toHaveZoneCount("trash", 0);
      for (const trashId of trashIds) expect(p1.getCardZone(trashId)).toBe("removalArea");
      expectCard(p2, enemy).toHaveDamage(0);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [p2.unit(enemy).instanceId],
      });
      p1.must.resolveTargets(enemy);
      expectLogType(engine, "gundam.combat.damageDealt", { min: 1 });
      expectCard(p2, enemy).toHaveDamage(2);
    });

    it("rejects a trash card without the Tekkadan or Teiwaz trait", () => {
      const eligibleA = createMockUnit({ traits: ["tekkadan"] });
      const eligibleB = createMockUnit({ traits: ["teiwaz"] });
      const eligibleC = createMockUnit({ traits: ["tekkadan"] });
      const wrongTrait = createMockUnit({ traits: ["cb"] });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          play: [gd03GundamBarbatosLupus050],
          trash: [eligibleA, eligibleB, eligibleC, wrongTrait],
          resourceArea: activeResources(7),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const trashIds = p1.getCardsInZone("trash");

      p1.must.activateAbility(gd03GundamBarbatosLupus050, 0);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: trashIds.slice(0, 3),
      });
      expectFailure(
        p1.resolveEffect({ targets: [trashIds[0]!, trashIds[1]!, trashIds[3]!] }),
        "ILLEGAL_TARGET",
      );

      expect(p1.getCardsInZone("trash")).toEqual(trashIds);
      expectCard(p2, enemy).toHaveDamage(0);
    });

    it("cannot activate when no enemy Unit is in play", () => {
      const trashA = createMockUnit({ traits: ["tekkadan"] });
      const trashB = createMockUnit({ traits: ["teiwaz"] });
      const trashC = createMockUnit({ traits: ["tekkadan"] });
      const engine = GundamTestEngine.create({
        play: [gd03GundamBarbatosLupus050],
        trash: [trashA, trashB, trashC],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.activateAbility(gd03GundamBarbatosLupus050, 0), "CONDITIONS_NOT_MET");
      expectPlayer(p1).toHaveZoneCount("trash", 3);
    });

    it("cannot activate when fewer than 3 eligible Units are in trash", () => {
      const trashA = createMockUnit({ traits: ["tekkadan"] });
      const trashB = createMockUnit({ traits: ["teiwaz"] });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          play: [gd03GundamBarbatosLupus050],
          trash: [trashA, trashB],
          resourceArea: activeResources(7),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectFailure(p1.activateAbility(gd03GundamBarbatosLupus050, 0), "NO_LEGAL_TARGETS");
      expectPlayer(p1).toHaveZoneCount("trash", 2);
      expectCard(p2, enemy).toHaveDamage(0);
    });

    it("lets the player choose among multiple enemy Units for the 2 damage", () => {
      const trashA = createMockUnit({ traits: ["tekkadan"] });
      const trashB = createMockUnit({ traits: ["teiwaz"] });
      const trashC = createMockUnit({ traits: ["tekkadan"] });
      const firstEnemy = createMockUnit({ name: "First Enemy", hp: 5 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", hp: 5 });
      const engine = GundamTestEngine.create(
        {
          play: [gd03GundamBarbatosLupus050],
          trash: [trashA, trashB, trashC],
          resourceArea: activeResources(7),
        },
        { play: [firstEnemy, secondEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const trashIds = p1.getCardsInZone("trash");

      p1.must.activateAbility(gd03GundamBarbatosLupus050, 0);
      p1.must.resolveEffect({ targets: trashIds });
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([
          p2.unit(firstEnemy).instanceId,
          p2.unit(secondEnemy).instanceId,
        ]),
        minTargets: 1,
        maxTargets: 1,
      });
      p1.must.resolveTargets(secondEnemy);

      expectCard(p2, firstEnemy).toHaveDamage(0);
      expectCard(p2, secondEnemy).toHaveDamage(2);
    });
  });
});
