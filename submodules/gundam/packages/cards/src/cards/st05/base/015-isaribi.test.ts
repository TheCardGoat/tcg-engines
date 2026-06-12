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
import { st05Isaribi015 } from "./015-isaribi.ts";

describe("Isaribi (ST05-015)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [st05Isaribi015], resourceArea: activeResources(3), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(st05Isaribi015));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Isaribi into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [st05Isaribi015] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st05Isaribi015);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Activate･Main】 Rest this Base: chosen damaged friendly gets AP+2", () => {
    const damagedUnit = createMockUnit({ ap: 2, hp: 5 });
    const healthyUnit = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [st05Isaribi015],
        play: [{ card: damagedUnit, damage: 2 }, healthyUnit],
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [baseId] = p1.getCardsInZone("baseSection");
    const [damagedId, healthyId] = p1.getCardsInZone("battleArea");
    // TestCardEntry.damage writes to `cardMeta`, but directives read
    // `G.damage` — seed the counter directly so the `state: "damaged"`
    // target filter sees the unit as damaged.
    engine.getG().damage[damagedId!] = 2;

    expectSuccess(p1.activateBaseAbility(st05Isaribi015, { targets: [damagedId!] }));

    expect(engine.getG().exhausted[baseId!]).toBe(true);
    expect(findStatModifier(engine, damagedId!, "ap")?.modifier).toBe(2);
    expect(findStatModifier(engine, healthyId!, "ap")).toBeUndefined();
  });
});
