import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  expectSuccess,
  activeResources,
  createMockUnit,
  findStatModifier,
  giveShield,
  markAsLinkUnit,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaAsticassiaSchoolOfTechnologyEarthHouse016 as betaAsticassia016 } from "./016-asticassia-school-of-technology-earth-house.ts";
describe("Asticassia School of Technology, Earth House (ST01-016)", () => {
  it("【Burst】Deploy this card — flips Asticassia into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [betaAsticassia016] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine
      .getRuntime()
      .registerCardInstance(shieldId, betaAsticassia016.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 moves 1 Shield into the controller's hand", () => {
    const engine = GundamTestEngine.create({
      hand: [betaAsticassia016],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    for (let i = 0; i < 3; i++) giveShield(engine, p1.playerId);

    const shieldsBefore = p1.getCardsInZone("shieldArea").length;

    expectSuccess(p1.deployBase(betaAsticassia016));

    expect(p1.getCardsInZone("baseSection").length).toBe(1);
    expect(p1.getCardsInZone("shieldArea").length).toBe(shieldsBefore - 1);
  });

  it("【Activate·Main】Rest this Base：all friendly Link Units get AP+1 during this turn", () => {
    const linkUnit = createMockUnit({ ap: 2, hp: 3 });
    const nonLinkUnit = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({
      baseSection: [betaAsticassia016],
      play: [linkUnit, nonLinkUnit],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [baseId] = p1.getCardsInZone("baseSection");
    const [linkId, nonLinkId] = p1.getCardsInZone("battleArea");
    markAsLinkUnit(engine, linkId!);

    expectSuccess(p1.activateBaseAbility(betaAsticassia016));

    expect(engine.getG().exhausted[baseId!]).toBe(true);
    expect(findStatModifier(engine, linkId!, "ap")?.modifier).toBe(1);
    expect(findStatModifier(engine, nonLinkId!, "ap")).toBeUndefined();
  });
});
