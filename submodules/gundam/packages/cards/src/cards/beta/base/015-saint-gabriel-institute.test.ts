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
import { betaSaintGabrielInstitute015 } from "./015-saint-gabriel-institute.ts";
describe("Saint Gabriel Institute (ST02-015)", () => {
  it("【Burst】Deploy this card — flips Saint Gabriel into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [betaSaintGabrielInstitute015] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine
      .getRuntime()
      .registerCardInstance(
        shieldId,
        betaSaintGabrielInstitute015.cardNumber,
        asPlayerId(PLAYER_TWO),
      );

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 moves 1 Shield to hand and triggers the lookAtTopDeck rider", () => {
    const engine = GundamTestEngine.create({
      hand: [betaSaintGabrielInstitute015],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    for (let i = 0; i < 3; i++) giveShield(engine, p1.playerId);
    const shieldsBefore = p1.getCardsInZone("shieldArea").length;
    const deckBefore = p1.getCardsInZone("deck").length;

    expectSuccess(p1.deployBase(betaSaintGabrielInstitute015));

    expect(p1.getCardsInZone("baseSection").length).toBe(1);
    expect(p1.getCardsInZone("shieldArea").length).toBe(shieldsBefore - 1);
    // lookAtTopDeck top/bottom return leaves deck size unchanged.
    expect(p1.getCardsInZone("deck").length).toBe(deckBefore);
  });
});
