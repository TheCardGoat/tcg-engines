import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  hasContinuousRestriction,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04GrahamSUnionFlagCustomGnFlag071 } from "./071-graham-s-union-flag-custom-gn-flag.ts";

describe("Graham's Union Flag Custom Ⅱ (GN Flag) (GD04-071)", () => {
  it("【Burst】 adds this card to hand when an enemy CB Unit is in play", () => {
    const cbEnemy = createMockUnit({ traits: ["cb"] });
    const engine = GundamTestEngine.create(
      { play: [cbEnemy] },
      { deck: [gd04GrahamSUnionFlagCustomGnFlag071] },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【Activate･Main】 exiles Superpower Bloc and UN trash cards, sets active, and prevents attacking", () => {
    const superpower = createMockUnit({ traits: ["superpower bloc"] });
    const un = createMockUnit({ traits: ["un"] });
    const engine = GundamTestEngine.create({
      play: [{ card: gd04GrahamSUnionFlagCustomGnFlag071, exhausted: true }],
      trash: [superpower, un],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const trashIds = p1.getCardsInZone("trash");

    expectSuccess(p1.activateAbility(unitId, 0, { targets: trashIds }));

    expect(engine.getCardsInZone({ zone: "removalArea" })).toHaveLength(2);
    expect(engine.getG().exhausted[unitId]).toBe(false);
    expect(hasContinuousRestriction(engine, unitId, "cannot-attack")).toBe(true);
  });

  it("does not ready itself when the UN trash card is missing", () => {
    const superpower = createMockUnit({ traits: ["superpower bloc"] });
    const engine = GundamTestEngine.create({
      play: [{ card: gd04GrahamSUnionFlagCustomGnFlag071, exhausted: true }],
      trash: [superpower],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const trashIds = p1.getCardsInZone("trash");

    expectSuccess(p1.activateAbility(unitId, 0, { targets: trashIds }));

    expect(engine.getCardsInZone({ zone: "removalArea" })).toHaveLength(1);
    expect(engine.getG().exhausted[unitId]).toBe(true);
    expect(hasContinuousRestriction(engine, unitId, "cannot-attack")).toBe(false);
  });
});
