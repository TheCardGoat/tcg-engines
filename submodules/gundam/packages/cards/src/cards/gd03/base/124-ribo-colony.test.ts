import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockPilot,
  createMockUnit,
  enqueueOwnCardTriggers,
  expectSuccess,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03RiboColony124 } from "./124-ribo-colony.ts";

describe("Ribo Colony (GD03-124)", () => {
  it("【Burst】Deploy this card — flips into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03RiboColony124] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd03RiboColony124);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd03RiboColony124], resourceArea: activeResources(3), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd03RiboColony124));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getCardsInZone("baseSection").length).toBe(1);
  });

  it("【Once per Turn】 rests an enemy Unit with 3 or less HP for a Lv.3 or lower Pilot pair event", () => {
    const pilot = createMockPilot({ level: 3 });
    const unit = createMockUnit();
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [unit],
        baseSection: [gd03RiboColony124],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));
    const pilotId = engine
      .getRuntime()
      .getInstanceIdByDefinition(asPlayerId(PLAYER_ONE), pilot.cardNumber)!;
    engine.getRuntime().runTestMutation(asPlayerId(PLAYER_ONE), ({ G, framework }) => {
      enqueueOwnCardTriggers(
        G,
        { type: "pilotPaired", pilotId, unitId, playerId: PLAYER_ONE, isLink: false },
        baseId,
        PLAYER_ONE,
        framework,
      );
    });

    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });

  it("【Once per Turn】 does not enqueue for a Lv.4 Pilot", () => {
    const pilot = createMockPilot({ level: 4 });
    const unit = createMockUnit();
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [unit],
        baseSection: [gd03RiboColony124],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));
    const pilotId = engine
      .getRuntime()
      .getInstanceIdByDefinition(asPlayerId(PLAYER_ONE), pilot.cardNumber)!;
    engine.getRuntime().runTestMutation(asPlayerId(PLAYER_ONE), ({ G, framework }) => {
      enqueueOwnCardTriggers(
        G,
        { type: "pilotPaired", pilotId, unitId, playerId: PLAYER_ONE, isLink: false },
        baseId,
        PLAYER_ONE,
        framework,
      );
    });

    expect(engine.getPendingChoice()).toBeUndefined();
    expect(engine.getG().exhausted[enemyId]).not.toBe(true);
  });
});
