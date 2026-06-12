import { describe, expect, it } from "vite-plus/test";
import type { UnitCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd02GundamAge1Normal021 } from "./021-gundam-age-1-normal.ts";

describe("Gundam AGE-1 Normal (GD02-021)", () => {
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
      const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
      const resourcesBefore = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.deployUnit(gd02GundamAge1Normal021));

      return { engine, p1, age1Id, discardId, deckBefore, resourcesBefore };
    }

    it("discards a matching green Earth Federation Unit, places an active EX Resource, and draws at Lv.7+", () => {
      const { engine, p1, age1Id, discardId, deckBefore, resourcesBefore } = deployWith();

      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

      const resourcesAfter = p1.getCardsInZone("resourceArea");
      const newResourceId = resourcesAfter.find((id) => !resourcesBefore.includes(id));

      expect(p1.getCardsInZone("battleArea")).toContain(age1Id);
      expect(p1.getCardsInZone("trash")).toContain(discardId);
      expect(resourcesAfter).toHaveLength(resourcesBefore.length + 1);
      expect(newResourceId).toBeDefined();
      expect(
        engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(newResourceId!)?.name,
      ).toBe("EX Resource");
      expect(engine.getG().exhausted[newResourceId!] ?? false).toBe(false);
      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    });

    it("places the deployed Unit into the battle area after deploy resolution", () => {
      const { p1, age1Id } = deployWith();

      expect(p1.getCardsInZone("battleArea")).toContain(age1Id);
    });

    it("does not place an EX Resource when the optional discard is declined", () => {
      const { p1, resourcesBefore } = deployWith();

      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      expect(p1.getCardsInZone("resourceArea")).toHaveLength(resourcesBefore.length);
    });

    it("still draws at Lv.7+ when the optional discard is declined", () => {
      const { engine, p1, deckBefore } = deployWith();

      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    });

    it("does not draw when the EX Resource still leaves you below Lv.7", () => {
      const { engine, p1, deckBefore } = deployWith({ resources: activeResources(5) });

      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    });

    it("rejects the EX Resource branch when the only Unit in hand is not Earth Federation", () => {
      const { p1, discardId, resourcesBefore } = deployWith({
        hand: [greenNonEarthFederationUnit],
      });

      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

      expect(p1.getCardsInZone("hand")).toContain(discardId);
      expect(p1.getCardsInZone("resourceArea")).toHaveLength(resourcesBefore.length);
    });

    it("rejects the EX Resource branch when the only Earth Federation Unit in hand is not green", () => {
      const { p1, discardId, resourcesBefore } = deployWith({ hand: [blueEarthFederationUnit] });

      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

      expect(p1.getCardsInZone("hand")).toContain(discardId);
      expect(p1.getCardsInZone("resourceArea")).toHaveLength(resourcesBefore.length);
    });

    it("cannot be deployed without enough active resources for its printed cost", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamAge1Normal021, greenEarthFederationUnit],
        resourceArea: [...restedResources(2), ...activeResources(1)],
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expect(p1.deployUnit(gd02GundamAge1Normal021)).toMatchObject({
        success: false,
        errorCode: "INSUFFICIENT_RESOURCES",
      });
    });
  });
});
