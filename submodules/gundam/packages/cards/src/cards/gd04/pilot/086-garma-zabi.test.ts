import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockResource,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04GarmaZabi086 } from "./086-garma-zabi.ts";

describe("Garma Zabi (GD04-086)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04GarmaZabi086] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  describe("【During Link】【Destroyed】If you have no EX Resources, place 1 EX Resource.", () => {
    it("places an active EX Resource token when Garma's linked Unit is destroyed with no EX Resources", () => {
      const host = createMockUnit({
        name: "Garma Host",
        linkCondition: "[Garma Zabi]",
        ap: 2,
        hp: 2,
      });
      const engine = GundamTestEngine.create({
        hand: [gd04GarmaZabi086],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const resourcesBefore = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.assignPilot(gd04GarmaZabi086, hostId));
      engine.destroyUnit(hostId);

      const resourcesAfter = p1.getCardsInZone("resourceArea");
      const newResourceId = resourcesAfter.find((id) => !resourcesBefore.includes(id));
      const framework = engine.getRuntime().getFrameworkReadAPI();

      expect(resourcesAfter).toHaveLength(resourcesBefore.length + 1);
      expect(newResourceId).toBeDefined();
      expect(framework.cards.getDefinition(newResourceId!)?.name).toBe("EX Resource");
      expect(engine.getG().exhausted[newResourceId!] ?? false).toBe(false);
      expect(p1.getCardsInZone("trash")).toContain(hostId);
    });

    it("does not place an EX Resource when you already have one", () => {
      const host = createMockUnit({
        name: "Garma Host",
        linkCondition: "[Garma Zabi]",
        ap: 2,
        hp: 2,
      });
      const existingExResource = createMockResource({ name: "EX Resource" });
      const engine = GundamTestEngine.create({
        hand: [gd04GarmaZabi086],
        play: [host],
        resourceArea: [...activeResources(3), { card: existingExResource, exhausted: false }],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const resourcesBefore = p1.getCardsInZone("resourceArea").length;

      expectSuccess(p1.assignPilot(gd04GarmaZabi086, hostId));
      engine.destroyUnit(hostId);

      expect(p1.getCardsInZone("resourceArea")).toHaveLength(resourcesBefore);
    });
  });
});
