import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03Doritea128 } from "./128-doritea.ts";

describe("Doritea (GD03-128)", () => {
  it("【Burst】Deploy this card — flips into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03Doritea128] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd03Doritea128);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd03Doritea128], resourceArea: activeResources(4), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd03Doritea128));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getCardsInZone("baseSection").length).toBe(1);
  });

  it("【Once per Turn】during the opponent's turn, when a friendly Unit is rested by an opponent effect, deals 1 damage to an enemy Unit", () => {
    const friendlyUnit = createMockUnit({ hp: 4 });
    const enemyUnit = createMockUnit({ hp: 4 });
    const restCommand = createRestCommand("opponent");
    const engine = GundamTestEngine.create(
      { baseSection: [gd03Doritea128], play: [friendlyUnit] },
      {
        hand: [restCommand],
        play: [enemyUnit],
        resourceArea: activeResources(2),
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.playCommand(restCommand, { targets: [friendlyId] }));

    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(getDamageCounter(engine, enemyId)).toBe(1);
  });

  it("does not trigger for a friendly effect resting your own Unit", () => {
    const friendlyUnit = createMockUnit({ hp: 4 });
    const enemyUnit = createMockUnit({ hp: 4 });
    const restCommand = createRestCommand("friendly");
    const engine = GundamTestEngine.create(
      {
        hand: [restCommand],
        baseSection: [gd03Doritea128],
        play: [friendlyUnit],
        resourceArea: activeResources(2),
      },
      { play: [enemyUnit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(restCommand, { targets: [friendlyId] }));

    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(getDamageCounter(engine, enemyId)).toBe(0);
  });
});

function createRestCommand(owner: "friendly" | "opponent") {
  return createMockCommand({
    effect: "【Main】Choose 1 Unit. Rest it.",
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "rest",
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 Unit. Rest it.",
      },
    ],
  });
}
