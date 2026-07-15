import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockUnit,
  findStatModifier,
  markAsLinkUnit,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st01AsticassiaSchoolOfTechnologyEarthHouse016 } from "./016-asticassia-school-of-technology-earth-house.ts";

describe("Asticassia School of Technology, Earth House (ST01-016)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [st01AsticassiaSchoolOfTechnologyEarthHouse016],
        resourceArea: activeResources(2),
        deck: 6,
      },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(st01AsticassiaSchoolOfTechnologyEarthHouse016));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
      shieldIds[1],
    ]);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips the base into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create(
      {},
      { deck: [st01AsticassiaSchoolOfTechnologyEarthHouse016] },
    );
    const shieldId = seedBaseAsShield(
      engine,
      PLAYER_TWO,
      st01AsticassiaSchoolOfTechnologyEarthHouse016,
    );

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Activate･Main】 Rest this Base: friendly Link Units get AP+1 during this turn", () => {
    const linkUnit = createMockUnit({ ap: 2, hp: 3 });
    const nonLinkUnit = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [st01AsticassiaSchoolOfTechnologyEarthHouse016],
        play: [linkUnit, nonLinkUnit],
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [baseId] = p1.getCardsInZone("baseSection");
    const [linkId, nonLinkId] = p1.getCardsInZone("battleArea");
    // Mark only the first unit as a Link Unit so the `isLinkUnit: true`
    // target filter picks exactly one of the two friendlies.
    markAsLinkUnit(engine, linkId!);

    expectSuccess(p1.activateBaseAbility(st01AsticassiaSchoolOfTechnologyEarthHouse016));

    expect(engine.getG().exhausted[baseId!]).toBe(true);
    expect(findStatModifier(engine, linkId!, "ap")?.modifier).toBe(1);
    expect(findStatModifier(engine, nonLinkId!, "ap")).toBeUndefined();
  });
});
