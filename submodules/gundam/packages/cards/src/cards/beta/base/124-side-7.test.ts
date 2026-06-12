import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  expectSuccess,
  activeResources,
  createMockUnit,
  giveShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaSide7124 } from "./124-side-7.ts";
describe("Side 7 (GD01-124)", () => {
  it("【Burst】Deploy this card — flips Side 7 into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [betaSide7124] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine
      .getRuntime()
      .registerCardInstance(shieldId, betaSide7124.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 moves 1 Shield into the controller's hand", () => {
    const engine = GundamTestEngine.create({
      hand: [betaSide7124],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    for (let i = 0; i < 3; i++) giveShield(engine, p1.playerId);

    const shieldsBefore = p1.getCardsInZone("shieldArea").length;

    expectSuccess(p1.deployBase(betaSide7124));

    expect(p1.getCardsInZone("baseSection").length).toBe(1);
    expect(p1.getCardsInZone("shieldArea").length).toBe(shieldsBefore - 1);
  });

  it("【Activate·Main】Rest this Base：chosen friendly Unit recovers 1 HP", () => {
    const target = createMockUnit({ ap: 2, hp: 5 });
    const bystander = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({
      baseSection: [betaSide7124],
      play: [target, bystander],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [baseId] = p1.getCardsInZone("baseSection");
    const [targetId, bystanderId] = p1.getCardsInZone("battleArea");
    // Seed damage so recoverHP has something to remove.
    engine.getG().damage[targetId!] = 3;
    engine.getG().damage[bystanderId!] = 2;

    expectSuccess(p1.activateBaseAbility(betaSide7124, { targets: [targetId!] }));

    expect(engine.getG().exhausted[baseId!]).toBe(true);
    // recoverHP removes 1 damage from the chosen target only.
    expect(engine.getG().damage[targetId!]).toBe(2);
    expect(engine.getG().damage[bystanderId!]).toBe(2);
  });
});
