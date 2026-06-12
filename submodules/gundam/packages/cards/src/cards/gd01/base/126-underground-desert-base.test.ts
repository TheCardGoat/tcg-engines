import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  expectSuccess,
  asPlayerId,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01UndergroundDesertBase126 } from "./126-underground-desert-base.ts";

describe("Underground Desert Base (GD01-126)", () => {
  it("【Burst】Deploy this card — flips Underground Desert Base into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01UndergroundDesertBase126] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine
      .getRuntime()
      .registerCardInstance(
        shieldId,
        gd01UndergroundDesertBase126.cardNumber,
        asPlayerId(PLAYER_TWO),
      );

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("moves 1 shield from shield area to hand when base is deployed", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [gd01UndergroundDesertBase126],
          resourceArea: activeResources(4),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      for (let i = 0; i < 3; i++) {
        engine.giveCard(asPlayerId(PLAYER_ONE), createMockResource().cardNumber, {
          zone: "shieldArea",
          playerId: PLAYER_ONE,
        });
      }
      const shieldsBefore = p1.getCardsInZone("shieldArea").length;
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(gd01UndergroundDesertBase126));

      expect(p1.getCardsInZone("baseSection").length).toBe(1);
      expect(p1.getCardsInZone("shieldArea").length).toBe(shieldsBefore - 1);
      // Hand: -1 played base, +1 shield = net 0
      expect(p1.getHand().length).toBe(handBefore);
    });

    it("does not crash when deployed with zero shields", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [gd01UndergroundDesertBase126],
          resourceArea: activeResources(4),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployBase(gd01UndergroundDesertBase126));
      expect(p1.getCardsInZone("baseSection").length).toBe(1);
    });
  });
});
