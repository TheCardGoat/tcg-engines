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
import { betaWhiteBase015 } from "./015-white-base.ts";
describe("White Base (ST01-015)", () => {
  it("【Burst】Deploy this card — flips White Base into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [betaWhiteBase015] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine
      .getRuntime()
      .registerCardInstance(shieldId, betaWhiteBase015.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 moves 1 Shield into the controller's hand", () => {
    const engine = GundamTestEngine.create({
      hand: [betaWhiteBase015],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    for (let i = 0; i < 3; i++) giveShield(engine, p1.playerId);

    const shieldsBefore = p1.getCardsInZone("shieldArea").length;

    expectSuccess(p1.deployBase(betaWhiteBase015));

    expect(p1.getCardsInZone("baseSection").length).toBe(1);
    expect(p1.getCardsInZone("shieldArea").length).toBe(shieldsBefore - 1);
  });

  it("【Activate·Main】【Once per Turn】②：deploys a token (Gundam when no friendly Units in play)", () => {
    const engine = GundamTestEngine.create({
      baseSection: [betaWhiteBase015],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);

    expectSuccess(p1.activateBaseAbility(betaWhiteBase015));

    // 0 friendly Units → Gundam token branch deploys 1 token.
    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
  });
});
