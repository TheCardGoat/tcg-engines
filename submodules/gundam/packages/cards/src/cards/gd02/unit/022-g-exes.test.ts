import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02GExes022 } from "./022-g-exes.ts";
import { gd02WhiteWolf106 } from "../command/106-white-wolf.ts";
import { gd02FlitAsuno088 } from "../pilot/088-flit-asuno.ts";

function placeExResourceCommand() {
  return createMockCommand({
    name: "Place EX Resource",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [{ action: { action: "placeExResource", state: "active" } }],
        sourceText: "【Main】Place 1 EX Resource.",
      },
    ],
  });
}

describe("G-Exes (GD02-022)", () => {
  describe("Printed Lv.3 and cost 2", () => {
    it("cannot deploy with only 2 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GExes022],
        resourceArea: activeResources(2),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 1 active Resource", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GExes022],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: [Woolf Enneacle]", () => {
    it("can attack on its deploy turn after Woolf Enneacle is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GExes022, gd02WhiteWolf106],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GExes022));
      const gExesId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.playCommandAsPilot(gd02WhiteWolf106, gExesId));
      expectSuccess(p1.enterBattle(gExesId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: gExesId });
    });

    it("cannot attack on its deploy turn after a different Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GExes022, gd02FlitAsuno088],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GExes022));
      const gExesId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02FlitAsuno088, gExesId));

      expectFailure(p1.enterBattle(gExesId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("【Once per Turn】When you place an EX Resource, choose 1 of your (AGE System) Units. It gains <Breach 2> during this turn.", () => {
    it("publishes an AGE System target choice and visibly grants Breach 2", () => {
      const placeResource = placeExResourceCommand();
      const ageSystemUnit = createMockUnit({ traits: ["age system"] });
      const engine = GundamTestEngine.create({
        hand: [placeResource],
        play: [gd02GExes022, ageSystemUnit],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const ageSystemId = p1.getCardsInZone("battleArea")[1]!;
      const resourcesBefore = p1.getResourceCount();

      expectSuccess(p1.playCommand(placeResource));
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible AGE System target choice");
      }
      expect(targetChoice.legalTargetIds).toEqual([ageSystemId]);
      expectSuccess(p1.resolveEffect({ targets: [ageSystemId] }));

      expect(p1.getResourceCount()).toBe(resourcesBefore + 1);
      expect(p1.getVisibleCard(ageSystemId)?.keywordEffects).toContainEqual({
        keyword: "Breach",
        value: 2,
      });
    });

    it("does not offer a friendly non-AGE Unit or an enemy AGE System Unit", () => {
      const placeResource = placeExResourceCommand();
      const friendlyOther = createMockUnit({ traits: ["earth federation"] });
      const enemyAgeSystem = createMockUnit({ traits: ["age system"] });
      const engine = GundamTestEngine.create(
        {
          hand: [placeResource],
          play: [gd02GExes022, friendlyOther],
          resourceArea: activeResources(1),
        },
        { play: [enemyAgeSystem] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyId = p1.getCardsInZone("battleArea")[1]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(placeResource));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getVisibleCard(friendlyId)?.keywords).not.toContain("Breach");
      expect(p2.getVisibleCard(enemyId)?.keywords).not.toContain("Breach");
    });

    it("triggers only once when two EX Resources are placed in the same turn", () => {
      const firstResource = placeExResourceCommand();
      const secondResource = placeExResourceCommand();
      const firstAgeUnit = createMockUnit({ name: "First AGE Unit", traits: ["age system"] });
      const secondAgeUnit = createMockUnit({ name: "Second AGE Unit", traits: ["age system"] });
      const engine = GundamTestEngine.create({
        hand: [firstResource, secondResource],
        play: [gd02GExes022, firstAgeUnit, secondAgeUnit],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [, firstAgeId, secondAgeId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(firstResource));
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible AGE System target choice");
      }
      expect(targetChoice.legalTargetIds).toEqual(
        expect.arrayContaining([firstAgeId, secondAgeId]),
      );
      expectSuccess(p1.resolveEffect({ targets: [firstAgeId!] }));
      expectSuccess(p1.playCommand(secondResource));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getVisibleCard(firstAgeId!)?.keywords).toContain("Breach");
      expect(p1.getVisibleCard(secondAgeId!)?.keywords).not.toContain("Breach");
    });

    it("does not trigger when the opponent places an EX Resource", () => {
      const opponentResource = placeExResourceCommand();
      const ageSystemUnit = createMockUnit({ traits: ["age system"] });
      const engine = GundamTestEngine.create(
        { play: [gd02GExes022, ageSystemUnit] },
        { hand: [opponentResource], resourceArea: activeResources(1) },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const ageSystemId = p1.getCardsInZone("battleArea")[1]!;

      expectSuccess(p2.playCommand(opponentResource));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getVisibleCard(ageSystemId)?.keywords).not.toContain("Breach");
      expect(p2.getResourceCount()).toBe(2);
    });

    it("removes the granted Breach when the turn ends", () => {
      const placeResource = placeExResourceCommand();
      const ageSystemUnit = createMockUnit({ traits: ["age system"] });
      const engine = GundamTestEngine.create(
        {
          hand: [placeResource],
          play: [gd02GExes022, ageSystemUnit],
          resourceArea: activeResources(1),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const targetId = p1.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.playCommand(placeResource));
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible AGE System target choice");
      }
      expect(targetChoice.legalTargetIds).toContain(targetId);
      expectSuccess(p1.resolveEffect({ targets: [targetId] }));
      expect(p1.getVisibleCard(targetId)?.keywords).toContain("Breach");
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(targetId)?.keywords).not.toContain("Breach");
    });
  });
});
