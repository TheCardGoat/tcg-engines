import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockUnit,
  findStatModifier,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st04Vesalius016 } from "./016-vesalius.ts";

describe("Vesalius (ST04-016)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [st04Vesalius016], resourceArea: activeResources(3), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(st04Vesalius016));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Vesalius into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [st04Vesalius016] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st04Vesalius016);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Activate･Main】 Rest this Base: chosen friendly Unit gets AP+1 this turn", () => {
    const targetUnit = createMockUnit({ ap: 2, hp: 3 });
    const bystanderUnit = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { baseSection: [st04Vesalius016], play: [targetUnit, bystanderUnit] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [baseId] = p1.getCardsInZone("baseSection");
    const [targetId, bystanderId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.activateBaseAbility(st04Vesalius016, { targets: [targetId!] }));

    // restSelf cost paid — base exhausted.
    expect(engine.getG().exhausted[baseId!]).toBe(true);
    // Buff landed only on the chosen friendly (chosenTargets forwarding).
    expect(findStatModifier(engine, targetId!, "ap")?.modifier).toBe(1);
    expect(findStatModifier(engine, bystanderId!, "ap")).toBeUndefined();
  });
});
