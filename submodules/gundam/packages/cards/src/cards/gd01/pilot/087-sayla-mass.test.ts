import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01SaylaMass087 } from "./087-sayla-mass.ts";

describe("Sayla Mass (GD01-087)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01SaylaMass087] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01SaylaMass087.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const zone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(zone).toBe(`hand:${PLAYER_TWO}`);
  });

  it("While this Unit is blue, it gains <Repair 1>.", () => {
    // Pair Sayla with a blue unit → constant effect grants Repair 1.
    const blueUnit = createMockUnit({
      ap: 2,
      hp: 4,
      level: 3,
      cost: 1,
      color: "blue",
      linkCondition: "[Sayla Mass]",
    } as unknown as Parameters<typeof createMockUnit>[0]);

    const engine = GundamTestEngine.create(
      {
        hand: [blueUnit, gd01SaylaMass087],
        resourceArea: activeResources(6),
        deck: 5,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(blueUnit));
    expectSuccess(p1.assignPilot(gd01SaylaMass087, blueUnit));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const fw = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId, engine.getG(), fw.cards, fw);
    expect(stats.keywords).toContain("Repair");
  });
});
