import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockUnit,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st01WhiteBase015 } from "./015-white-base.ts";

describe("White Base (ST01-015)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [st01WhiteBase015], resourceArea: activeResources(3), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(st01WhiteBase015));

    // Base leaves hand, 1 shield enters hand → net-zero hand count.
    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
      shieldIds[1],
    ]);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips White Base into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [st01WhiteBase015] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st01WhiteBase015);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Activate･Main】【Once per Turn】② — deploys Gundam token when no friendly Units are in play", () => {
    const engine = GundamTestEngine.create(
      {
        baseSection: [st01WhiteBase015],
        resourceArea: activeResources(2),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const before = p1.getCardsInZone("battleArea").length;
    expect(before).toBe(0);

    expectSuccess(p1.activateBaseAbility(st01WhiteBase015));

    // No units in play → Gundam token (AP3/HP3) deployed.
    const after = p1.getCardsInZone("battleArea");
    expect(after).toHaveLength(1);
  });

  it("【Activate･Main】 — deploys a different token depending on friendly unit count", () => {
    // With exactly 1 friendly Unit the conditional directive should land
    // on the `elseDirectives` branch that picks the Guncannon token.
    const ally = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [st01WhiteBase015],
        play: [ally],
        resourceArea: activeResources(2),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.activateBaseAbility(st01WhiteBase015));

    // Before: 1 unit. After: original unit + 1 deployed token = 2.
    expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
  });
});
