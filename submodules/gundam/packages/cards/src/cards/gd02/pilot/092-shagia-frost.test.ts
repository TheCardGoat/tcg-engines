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
import { gd02ShagiaFrost092 } from "./092-shagia-frost.ts";

describe("Shagia Frost (GD02-092)", () => {
  it("【Burst】Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02ShagiaFrost092] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【During Link】【Attack】 grants AP+2 to a friendly (New UNE) Unit", () => {
    // Host named "[Shagia Frost]" to satisfy linkCondition + duringLink gate.
    const host = createMockUnit({
      name: "Host",
      ap: 3,
      hp: 5,
      level: 4,
      cost: 2,
      linkCondition: "[Shagia Frost]",
      traits: ["new une"],
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const enemy = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      { hand: [host, gd02ShagiaFrost092], resourceArea: activeResources(6) },
      { play: [{ card: enemy, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd02ShagiaFrost092, host));

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(host, enemyId));

    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [attackerId] }));
    }

    const mod = findStatModifier(engine, attackerId, "ap");
    expect(mod?.modifier).toBe(2);
  });
});
