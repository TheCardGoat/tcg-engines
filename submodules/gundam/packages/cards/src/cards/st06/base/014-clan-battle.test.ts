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
import { st06ClanBattle014 } from "./014-clan-battle.ts";

describe("Clan Battle (ST06-014)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [st06ClanBattle014], resourceArea: activeResources(3), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(st06ClanBattle014));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Clan Battle into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [st06ClanBattle014] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st06ClanBattle014);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Activate･Main】 Rest this Base: chosen friendly Unit gets AP+2 during this turn", () => {
    // NOTE: the printed "If a friendly (Clan) Link Unit is in play"
    // precondition is NOT encoded in card data — the directive currently
    // runs unconditionally. This test exercises the directive that IS
    // encoded (restSelf cost → AP+2 on a chosen friendly). The missing
    // precondition is tracked in docs/card-delegations/st06.md §D.
    const target = createMockUnit({ ap: 2, hp: 3 });
    const bystander = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { baseSection: [st06ClanBattle014], play: [target, bystander] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [baseId] = p1.getCardsInZone("baseSection");
    const [targetId, bystanderId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.activateBaseAbility(st06ClanBattle014, { targets: [targetId!] }));

    expect(engine.getG().exhausted[baseId!]).toBe(true);
    expect(findStatModifier(engine, targetId!, "ap")?.modifier).toBe(2);
    expect(findStatModifier(engine, bystanderId!, "ap")).toBeUndefined();
  });
});
