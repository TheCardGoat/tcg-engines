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
import { gd02GundamGusionRebake055 } from "./055-gundam-gusion-rebake.ts";
import { createLinkUnitCheckCommand } from "../../../test-helpers/link-condition-test-helpers.ts";

describe("Gundam Gusion Rebake (GD02-055)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.5 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamGusionRebake055],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("stays in hand after another legal deployment leaves too few active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamGusionRebake055],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: [Akihiro Altland]", () => {
    it("becomes a Link Unit when paired with Akihiro Altland", () => {
      const pilot = createMockPilot({ name: "Akihiro Altland", level: 1, cost: 1 });
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [pilot, linkCheck],
        play: [gd02GundamGusionRebake055],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, unitId));
      const apBefore = p1.getVisibleCard(unitId)?.effectiveAp;
      expectSuccess(p1.playCommand(commandId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [unitId],
      });
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(apBefore).toBeDefined();
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(apBefore! + 1);
    });

    it("does not become a Link Unit when paired with a different Pilot", () => {
      const pilot = createMockPilot({ name: "Mikazuki Augus", level: 1, cost: 1 });
      const linkCheck = createLinkUnitCheckCommand();
      const engine = GundamTestEngine.create({
        hand: [pilot, linkCheck],
        play: [gd02GundamGusionRebake055],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, commandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, unitId));
      expectFailure(p1.playCommand(commandId!), "NO_LEGAL_TARGETS");

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Deploy】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.", () => {
    it("publishes separate friendly and enemy choices before damaging both selected Units", () => {
      const ally = createMockUnit({ hp: 5 });
      const otherAlly = createMockUnit({ hp: 5 });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02GundamGusionRebake055],
          play: [ally, otherAlly],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [allyId, otherAllyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd02GundamGusionRebake055));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected separate friendly and enemy target groups");
      }
      expect(choice).toMatchObject({ minTargets: 2, maxTargets: 2 });
      expect(choice.groups).toHaveLength(2);
      expect(choice.groups[0]?.legalTargetIds).toEqual(
        expect.arrayContaining([allyId, otherAllyId]),
      );
      expect(choice.groups[1]?.legalTargetIds).toEqual([enemyId]);
      expectSuccess(p1.resolveEffect({ targets: [otherAllyId!, enemyId] }));

      expect(p1.getDamage(allyId!)).toBe(0);
      expect(p1.getDamage(otherAllyId!)).toBe(1);
      expect(p2.getDamage(enemyId)).toBe(1);
    });

    it("deploys without a prompt when there is no enemy Unit to choose", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamGusionRebake055],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const sourceId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(sourceId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(sourceId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getDamage(sourceId)).toBe(0);
    });
  });

  describe("<Blocker>", () => {
    it("rests to redirect a direct attack to itself", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [gd02GundamGusionRebake055], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(blockerId));

      expect(p2.isExhausted(blockerId)).toBe(true);
      expect(p2.getBoardView().pendingCombat).toMatchObject({ attackerId, blockerId });
    });
  });
});
