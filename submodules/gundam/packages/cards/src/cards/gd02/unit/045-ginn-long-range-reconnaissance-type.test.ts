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
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02GinnLongRangeReconnaissanceType045 } from "./045-ginn-long-range-reconnaissance-type.ts";

describe("GINN Long-Range Reconnaissance Type (GD02-045)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.2 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GinnLongRangeReconnaissanceType045],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("stays in hand after another legal deployment rests the active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GinnLongRangeReconnaissanceType045],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("【Attack】If this Unit has 5 or more AP and it is attacking an enemy Unit, draw 1.", () => {
    it("draws 1 while attacking an enemy Unit at 5 AP", () => {
      const pilot = createMockPilot({ apBonus: 4, level: 1, cost: 1 });
      const defender = createMockUnit({ hp: 6 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd02GinnLongRangeReconnaissanceType045],
          deck: 4,
          shieldArea: [openingShield],
          resourceArea: activeResources(1),
        },
        { play: [defender] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const ginnId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.assignPilot(pilot, ginnId));
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
      const handBefore = p1.getBoardView().players[PLAYER_ONE]!.handCount;
      expectSuccess(p1.enterBattle(ginnId, defenderId));

      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
      expect(p1.getBoardView().players[PLAYER_ONE]!.handCount).toBe(handBefore + 1);
    });

    it("does not draw while attacking an enemy Unit below 5 AP", () => {
      const defender = createMockUnit({ hp: 6 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        {
          play: [gd02GinnLongRangeReconnaissanceType045],
          deck: 4,
          shieldArea: [openingShield],
        },
        { play: [defender], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const ginnId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
      expectSuccess(p1.enterBattle(ginnId, defenderId));

      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
    });

    it("does not draw on a direct attack even when it has 5 AP", () => {
      const pilot = createMockPilot({ apBonus: 4, level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [gd02GinnLongRangeReconnaissanceType045],
        deck: 4,
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const ginnId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, ginnId));
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
      expectSuccess(p1.enterBattle(ginnId, "direct"));

      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
    });
  });
});
