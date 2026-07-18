import { describe, expect, it } from "vite-plus/test";
import type { TargetOwner } from "@tcg/gundam-types";
import {
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02GundamMkIiTitans003 } from "./003-gundam-mk-ii-titans.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import { gd02QuattroBajeena098 } from "../pilot/098-quattro-bajeena.ts";

function destroyUnitCommand(owner: TargetOwner) {
  return createMockCommand({
    name: "Destruction Test Command",
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "destroy",
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Destroy 1 Unit.",
      },
    ],
  });
}

describe("Gundam Mk-II (Titans) (GD02-003)", () => {
  describe("Printed Lv.4 and cost 3", () => {
    it("cannot deploy with only 3 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamMkIiTitans003],
        resourceArea: activeResources(3),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 2 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamMkIiTitans003],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: (Titans) Trait", () => {
    it("can attack on its deploy turn after a Titans Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamMkIiTitans003, gd02JeridMessa086],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamMkIiTitans003));
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02JeridMessa086, unitId));
      expectSuccess(p1.enterBattle(unitId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: unitId });
    });

    it("cannot attack on its deploy turn after a non-Titans Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamMkIiTitans003, gd02QuattroBajeena098],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamMkIiTitans003));
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02QuattroBajeena098, unitId));

      expectFailure(p1.enterBattle(unitId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("【During Pair･Lv.3 or Lower Pilot】【Destroyed】You may discard 1 Unit card. If you do, return the card paired with this Unit to your hand.", () => {
    it("discards a Unit and returns its Lv.3-or-lower paired Pilot after being destroyed", () => {
      const pilot = createMockPilot({ level: 3, cost: 1 });
      const discard = createMockUnit({ name: "Discarded Unit" });
      const destroy = destroyUnitCommand("friendly");
      const engine = GundamTestEngine.create({
        hand: [pilot, discard, destroy],
        play: [gd02GundamMkIiTitans003],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const discardId = p1.getHand()[1]!;

      expectSuccess(p1.assignPilot(pilot, unitId));
      const pilotId = p1.getPilotId(unitId)!;
      expectSuccess(p1.playCommand(destroy));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [unitId],
      });
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));
      const optionalChoice = p1.getBoardView().pendingChoice;
      if (optionalChoice?.kind !== "optional") {
        throw new Error("Expected a visible optional discard choice");
      }
      expectSuccess(
        p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: true } }),
      );
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [discardId],
      });
      expectSuccess(p1.resolveEffect({ targets: [discardId] }));

      expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(discardId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("may decline the discard and lets the paired Pilot follow the Unit to trash", () => {
      const pilot = createMockPilot({ level: 2, cost: 1 });
      const discard = createMockUnit({ name: "Kept Unit" });
      const destroy = destroyUnitCommand("friendly");
      const engine = GundamTestEngine.create({
        hand: [pilot, discard, destroy],
        play: [gd02GundamMkIiTitans003],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const discardId = p1.getHand()[1]!;

      expectSuccess(p1.assignPilot(pilot, unitId));
      const pilotId = p1.getPilotId(unitId)!;
      expectSuccess(p1.playCommand(destroy));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [unitId],
      });
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));
      const optionalChoice = p1.getBoardView().pendingChoice;
      if (optionalChoice?.kind !== "optional") {
        throw new Error("Expected a visible optional discard choice");
      }
      expectSuccess(
        p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: false } }),
      );

      expect(p1.getCardZone(discardId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not offer the effect for a paired Pilot above Lv.3", () => {
      const highLevelPilot = createMockPilot({ level: 4, cost: 1 });
      const discard = createMockUnit({ name: "Kept Unit" });
      const destroy = destroyUnitCommand("friendly");
      const engine = GundamTestEngine.create({
        hand: [highLevelPilot, discard, destroy],
        play: [gd02GundamMkIiTitans003],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const discardId = p1.getHand()[1]!;

      expectSuccess(p1.assignPilot(highLevelPilot, unitId));
      const pilotId = p1.getPilotId(unitId)!;
      expectSuccess(p1.playCommand(destroy));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [unitId],
      });
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(discardId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId)).toBe(`trash:${PLAYER_ONE}`);
    });
  });
});
