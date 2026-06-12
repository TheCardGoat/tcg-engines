import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  enqueueOwnCardTriggers,
  getEffectiveStats,
  seedBaseAsShield,
  seedShieldsFromDeck,
  expectSuccess,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd049thTacticalTestingSector124 } from "./124-9th-tactical-testing-sector.ts";

describe("9th Tactical Testing Sector (GD04-124)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd049thTacticalTestingSector124],
      resourceArea: activeResources(3),
      deck: 4,
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd049thTacticalTestingSector124));

    expect(p1.getHand()).toContain(shieldId);
  });

  it("【Burst】 deploys this card from shield area", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd049thTacticalTestingSector124] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd049thTacticalTestingSector124);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("data listens for EX Resource placement", () => {
    expect(gd049thTacticalTestingSector124.effects?.[2]?.activation.timing).toEqual([
      "onExResourcePlaced",
    ]);
  });

  it("when you place an EX Resource, gives a friendly Academy Unit AP+2 this turn", () => {
    const academyUnit = createMockUnit({ traits: ["academy"], ap: 3 });
    const nonAcademyUnit = createMockUnit({ traits: ["civilian"], ap: 3 });
    const engine = GundamTestEngine.create({
      baseSection: [gd049thTacticalTestingSector124],
      play: [academyUnit, nonAcademyUnit],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [baseId] = p1.getCardsInZone("baseSection");
    const [academyUnitId, nonAcademyUnitId] = p1.getCardsInZone("battleArea");

    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueOwnCardTriggers(
        G,
        { type: "exResourcePlaced", cardId: "ex-token", playerId: PLAYER_ONE, ownerId: PLAYER_ONE },
        baseId!,
        PLAYER_ONE,
        framework,
        { chosenTargets: [academyUnitId!] },
      );
    });
    engine.tickFlow();

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(getEffectiveStats(academyUnitId!, engine.getG(), framework.cards, framework).ap).toBe(5);
    expect(getEffectiveStats(nonAcademyUnitId!, engine.getG(), framework.cards, framework).ap).toBe(
      3,
    );
  });
});
