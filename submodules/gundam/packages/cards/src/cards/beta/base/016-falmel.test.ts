import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  expectSuccess,
  activeResources,
  giveShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaFalmel016 } from "./016-falmel.ts";
describe("Falmel (ST03-016)", () => {
  it("【Burst】Deploy this card — flips Falmel into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [betaFalmel016] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine
      .getRuntime()
      .registerCardInstance(shieldId, betaFalmel016.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 moves 1 Shield into hand and deploys a rested Char's Zaku Ⅱ token", () => {
    const engine = GundamTestEngine.create({
      hand: [betaFalmel016],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    for (let i = 0; i < 3; i++) giveShield(engine, p1.playerId);

    const shieldsBefore = p1.getCardsInZone("shieldArea").length;
    const battleBefore = p1.getCardsInZone("battleArea").length;

    expectSuccess(p1.deployBase(betaFalmel016));

    expect(p1.getCardsInZone("baseSection").length).toBe(1);
    expect(p1.getCardsInZone("shieldArea").length).toBe(shieldsBefore - 1);
    // deployToken places a rested unit token in battleArea.
    expect(p1.getCardsInZone("battleArea").length).toBe(battleBefore + 1);
  });
});
