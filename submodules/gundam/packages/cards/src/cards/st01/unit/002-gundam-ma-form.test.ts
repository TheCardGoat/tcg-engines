import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st01GundamMaForm002 } from "./002-gundam-ma-form.ts";

function pilotWithTraits(traits: string[]) {
  return createMockPilot({ traits, level: 1, cost: 1, apBonus: 0, hpBonus: 0 });
}

describe("Gundam (MA Form) (ST01-002)", () => {
  describe("Printed Lv.5 and cost 3", () => {
    it("cannot deploy with only 4 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st01GundamMaForm002],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy with fewer than 3 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, st01GundamMaForm002],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");
      expect(p1.getHand()).toContain(cardId);
    });

    it("deploys from hand to the battle area for 3 active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st01GundamMaForm002],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(cardId));

      expect(p1.getHand()).not.toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toContain(cardId);
      expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });

  describe("【When Paired･(White Base Team) Pilot】Draw 1.", () => {
    it("draws 1 when a White Base Team Pilot is paired with this Unit", () => {
      const pilot = pilotWithTraits(["white base team"]);
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [st01GundamMaForm002],
        resourceArea: activeResources(5),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.assignPilot(pilotId, unitId));

      expect(p1.getPilotId(unitId)).toBe(pilotId);
      expect(p1.getHand()).toHaveLength(1);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore - 1);
    });

    it("draws when the Pilot has White Base Team among multiple traits", () => {
      const pilot = pilotWithTraits(["earth federation", "white base team"]);
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [st01GundamMaForm002],
        resourceArea: activeResources(5),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, unitId));

      expect(p1.getHand()).toHaveLength(1);
      expect(p1.getCardsInZone("deck")).toHaveLength(2);
    });

    it("does not draw when the paired Pilot lacks White Base Team", () => {
      const pilot = pilotWithTraits(["zeon"]);
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [st01GundamMaForm002],
        resourceArea: activeResources(5),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.assignPilot(pilot, unitId));

      expect(p1.getHand()).toHaveLength(0);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
    });

    it("does not trigger when a qualifying Pilot is paired with another friendly Unit", () => {
      const otherUnit = createMockUnit({ name: "Other Unit" });
      const pilot = pilotWithTraits(["white base team"]);
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [st01GundamMaForm002, otherUnit],
        resourceArea: activeResources(5),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [, otherUnitId] = p1.getCardsInZone("battleArea");
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.assignPilot(pilot, otherUnitId!));

      expect(p1.getHand()).toHaveLength(0);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
    });

    it("cannot pair the Pilot without enough active Resources", () => {
      const pilot = pilotWithTraits(["white base team"]);
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [st01GundamMaForm002],
        resourceArea: [],
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;

      expectFailure(p1.assignPilot(pilotId, unitId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(pilotId);
      expect(p1.getPilotId(unitId)).toBeUndefined();
      expect(p1.getCardsInZone("deck")).toHaveLength(5);
    });
  });
});
