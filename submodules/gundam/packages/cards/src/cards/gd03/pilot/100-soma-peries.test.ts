import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  findStatModifier,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03SomaPeries100 } from "./100-soma-peries.ts";

describe("Soma Peries (GD03-100)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03SomaPeries100] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("behavior: when destroyed, choose an enemy Unit and give it AP-3 during this turn", () => {
    const host = createMockUnit({ hp: 4 });
    const enemy = createMockUnit({ ap: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd03SomaPeries100], play: [host], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03SomaPeries100, hostId));
    engine.destroyUnit(hostId);

    expect(findStatModifier(engine, enemyId, "ap")?.modifier).toBe(-3);
  });
});
