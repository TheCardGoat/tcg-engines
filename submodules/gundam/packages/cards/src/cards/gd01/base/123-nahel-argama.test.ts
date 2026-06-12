import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectSuccess,
  asPlayerId,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01NahelArgama123 } from "./123-nahel-argama.ts";

describe("Nahel Argama (GD01-123)", () => {
  it("【Burst】Deploy this card — flips Nahel Argama into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01NahelArgama123] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01NahelArgama123.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  describe("【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Rest it.", () => {
    it("moves 1 shield to hand and rests a chosen enemy on deploy", () => {
      const enemy = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd01NahelArgama123],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      for (let i = 0; i < 3; i++) {
        engine.giveCard(asPlayerId(PLAYER_ONE), createMockResource().cardNumber, {
          zone: "shieldArea",
          playerId: PLAYER_ONE,
        });
      }

      const shieldsBefore = p1.getCardsInZone("shieldArea").length;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployBase(gd01NahelArgama123, { targets: [enemyId] }));

      // Pre-committed targets should auto-drain without halting.
      expect(engine.getPendingChoice()).toBeUndefined();
      expect(p1.getCardsInZone("baseSection").length).toBe(1);
      expect(p1.getCardsInZone("shieldArea").length).toBe(shieldsBefore - 1);
      expect(p1.isExhausted(enemyId)).toBe(true);
    });
  });
});
