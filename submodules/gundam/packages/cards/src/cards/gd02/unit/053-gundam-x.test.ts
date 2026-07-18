import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02GundamX053 } from "./053-gundam-x.ts";
import { gd02GarrodRanTiffaAdill094 } from "../pilot/094-garrod-ran-tiffa-adill.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";

describe("Gundam X (GD02-053)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.7 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamX053],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("stays in hand after another legal deployment leaves too few active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamX053],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("<Suppression>", () => {
    it("destroys the first 2 Shields simultaneously with a direct attack", () => {
      const firstShield = createMockUnit({ name: "First Shield" });
      const secondShield = createMockUnit({ name: "Second Shield" });
      const engine = GundamTestEngine.create(
        { play: [gd02GundamX053] },
        { shieldArea: [firstShield, secondShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamXId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(gundamXId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(0);
      expect(p2.getCardsInZone("trash")).toHaveLength(2);
    });
  });

  describe("【During Link】During your turn, while there are 7 or more cards in your trash, all your other (Vulture) Units get AP+2.", () => {
    it("gives AP+2 only to another friendly Vulture Unit while linked at the trash threshold", () => {
      const vultureAlly = createMockUnit({ traits: ["vulture"], ap: 2, hp: 4 });
      const outsider = createMockUnit({ traits: ["new une"], ap: 2, hp: 4 });
      const trash = Array.from({ length: 7 }, () => createMockUnit());
      const engine = GundamTestEngine.create({
        hand: [gd02GarrodRanTiffaAdill094],
        play: [gd02GundamX053, vultureAlly, outsider],
        trash,
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundamXId, allyId, outsiderId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd02GarrodRanTiffaAdill094, gundamXId!));

      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(4);
      expect(p1.getVisibleCard(outsiderId!)?.effectiveAp).toBe(2);
      expect(p1.getVisibleCard(gundamXId!)?.effectiveAp).toBe(7);
    });

    it("does not grant AP+2 with only 6 cards in trash", () => {
      const ally = createMockUnit({ traits: ["vulture"], ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [gd02GarrodRanTiffaAdill094],
        play: [gd02GundamX053, ally],
        trash: Array.from({ length: 6 }, () => createMockUnit()),
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundamXId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd02GarrodRanTiffaAdill094, gundamXId!));

      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(2);
    });

    it("does not grant AP+2 while paired with a Pilot that does not meet its Link Condition", () => {
      const ally = createMockUnit({ traits: ["vulture"], ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [gd02JeridMessa086],
        play: [gd02GundamX053, ally],
        trash: Array.from({ length: 7 }, () => createMockUnit()),
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundamXId, allyId] = p1.getCardsInZone("battleArea");
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(pilotId, gundamXId!));

      expect(p1.getPilotId(gundamXId!)).toBe(pilotId);
      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(2);
    });

    it("stops granting AP+2 during the opponent's turn", () => {
      const ally = createMockUnit({ traits: ["vulture"], ap: 2, hp: 4 });
      const keptCard = createMockUnit({ name: "Card kept after declining Garrod" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02GarrodRanTiffaAdill094, keptCard],
          play: [gd02GundamX053, ally],
          trash: Array.from({ length: 7 }, () => createMockUnit()),
          resourceArea: activeResources(4),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundamXId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd02GarrodRanTiffaAdill094, gundamXId!));
      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(4);
      const garrodChoice = p1.getBoardView().pendingChoice;
      if (garrodChoice?.kind !== "optional") {
        throw new Error("Expected Garrod's visible optional discard choice");
      }
      expectSuccess(
        p1.resolveEffect({ optionalAnswers: { [garrodChoice.directiveIndex]: false } }),
      );
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(2);
    });
  });
});
