import { describe, expect, it } from "vite-plus/test";
import type { UnitCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02GundamAge1Normal021 } from "./021-gundam-age-1-normal.ts";
import { gd02FlitAsuno088 } from "../pilot/088-flit-asuno.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";

describe("Gundam AGE-1 Normal (GD02-021)", () => {
  describe("Printed Lv.3", () => {
    it("cannot deploy with only 2 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamAge1Normal021],
        resourceArea: activeResources(2),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });
  });

  describe("Link Condition: (Asuno Family) Trait", () => {
    it("can attack on its deploy turn after an Asuno Family Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamAge1Normal021, gd02FlitAsuno088],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamAge1Normal021));
      const age1Id = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02FlitAsuno088, age1Id));
      expectSuccess(p1.enterBattle(age1Id, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: age1Id });
    });

    it("cannot attack on its deploy turn after a Pilot outside the Asuno Family is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamAge1Normal021, gd02JeridMessa086],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamAge1Normal021));
      const age1Id = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02JeridMessa086, age1Id));

      expectFailure(p1.enterBattle(age1Id, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("【Deploy】You may discard 1 green (Earth Federation) Unit card. If you do, place 1 EX Resource. Then, if you are Lv.7 or higher, draw 1.", () => {
    const greenEarthFederationUnit = createMockUnit({
      name: "Green Earth Federation Unit",
      color: "green",
      traits: ["earth federation"],
    });
    const greenNonEarthFederationUnit = createMockUnit({
      name: "Green Non-Earth Federation Unit",
      color: "green",
      traits: ["zeon"],
    });
    const blueEarthFederationUnit = createMockUnit({
      name: "Blue Earth Federation Unit",
      color: "blue",
      traits: ["earth federation"],
    });

    function deployWith({
      hand = [greenEarthFederationUnit],
      resources = activeResources(7),
      deck = 5,
    }: {
      hand?: UnitCard[];
      resources?: ReturnType<typeof activeResources>;
      deck?: number;
    } = {}) {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamAge1Normal021, ...hand],
        resourceArea: resources,
        deck,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const age1Id = p1.getHand()[0]!;
      const discardId = p1.getHand()[1];
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
      const resourcesBefore = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.deployUnit(gd02GundamAge1Normal021));

      return { p1, age1Id, discardId, deckBefore, resourcesBefore };
    }

    it("discards a matching green Earth Federation Unit, places an active EX Resource, and draws at Lv.7+", () => {
      const { p1, age1Id, discardId, deckBefore, resourcesBefore } = deployWith();

      const optionalChoice = p1.getBoardView().pendingChoice;
      if (optionalChoice?.kind !== "optional") {
        throw new Error("Expected a visible optional discard choice");
      }
      expectSuccess(
        p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: true } }),
      );
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible discard target choice");
      }
      expect(targetChoice.legalTargetIds).toEqual([discardId]);
      expectSuccess(p1.resolveEffect({ targets: [discardId!] }));

      const resourcesAfter = p1.getCardsInZone("resourceArea");
      const newResourceId = resourcesAfter.find((id) => !resourcesBefore.includes(id));

      expect(p1.getCardsInZone("battleArea")).toContain(age1Id);
      expect(p1.getCardsInZone("trash")).toContain(discardId);
      expect(resourcesAfter).toHaveLength(resourcesBefore.length + 1);
      expect(newResourceId).toBeDefined();
      expect(p1.isExhausted(newResourceId!)).toBe(false);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
    });

    it("places the deployed Unit into the battle area after deploy resolution", () => {
      const { p1, age1Id } = deployWith();

      expect(p1.getCardsInZone("battleArea")).toContain(age1Id);
    });

    it("does not place an EX Resource when the optional discard is declined", () => {
      const { p1, resourcesBefore } = deployWith();

      const optionalChoice = p1.getBoardView().pendingChoice;
      if (optionalChoice?.kind !== "optional") {
        throw new Error("Expected a visible optional discard choice");
      }
      expectSuccess(
        p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: false } }),
      );

      expect(p1.getCardsInZone("resourceArea")).toHaveLength(resourcesBefore.length);
    });

    it("still draws at Lv.7+ when the optional discard is declined", () => {
      const { p1, deckBefore } = deployWith();

      const optionalChoice = p1.getBoardView().pendingChoice;
      if (optionalChoice?.kind !== "optional") {
        throw new Error("Expected a visible optional discard choice");
      }
      expectSuccess(
        p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: false } }),
      );

      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
    });

    it("does not draw when the EX Resource still leaves you below Lv.7", () => {
      const { p1, deckBefore } = deployWith({ resources: activeResources(5) });

      const optionalChoice = p1.getBoardView().pendingChoice;
      if (optionalChoice?.kind !== "optional") {
        throw new Error("Expected a visible optional discard choice");
      }
      expectSuccess(
        p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: true } }),
      );
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible discard target choice");
      }
      expectSuccess(p1.resolveEffect({ targets: [targetChoice.legalTargetIds[0]!] }));

      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
    });

    it("rejects the EX Resource branch when the only Unit in hand is not Earth Federation", () => {
      const { p1, discardId, resourcesBefore } = deployWith({
        hand: [greenNonEarthFederationUnit],
      });

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardsInZone("hand")).toContain(discardId);
      expect(p1.getCardsInZone("resourceArea")).toHaveLength(resourcesBefore.length);
    });

    it("rejects the EX Resource branch when the only Earth Federation Unit in hand is not green", () => {
      const { p1, discardId, resourcesBefore } = deployWith({ hand: [blueEarthFederationUnit] });

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardsInZone("hand")).toContain(discardId);
      expect(p1.getCardsInZone("resourceArea")).toHaveLength(resourcesBefore.length);
    });

    it("cannot be deployed after another legal play leaves only 1 active Resource", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamAge1Normal021, greenEarthFederationUnit],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });
});
