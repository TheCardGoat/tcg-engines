import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01ByarlantCustom019 } from "./019-byarlant-custom.ts";

function startEnemyDirectAttack(enemyUnitCount: number): {
  engine: GundamTestEngine;
  byarlantId: string;
} {
  const enemies = Array.from({ length: enemyUnitCount }, () => createMockUnit({ hp: 5 }));
  const engine = GundamTestEngine.create(
    { play: [gd01ByarlantCustom019], deck: 5 },
    { play: enemies, shieldArea: [createMockUnit()], deck: 5 },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const byarlantId = p1.getCardsInZone("battleArea")[0]!;
  const attackerId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p1.passPhase());
  expectSuccess(p2.passActionStep());
  expectSuccess(p1.passActionStep());
  expectSuccess(p2.enterBattle(attackerId, "direct"));

  return { engine, byarlantId };
}

describe("Byarlant Custom (GD01-019)", () => {
  it("can declare Blocker while 4 enemy Units are in play", () => {
    const { engine, byarlantId } = startEnemyDirectAttack(4);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.declareBlock(byarlantId));

    expect(p1.isExhausted(byarlantId)).toBe(true);
    expect(p1.getBoardView().pendingCombat).toMatchObject({ blockerId: byarlantId });
  });

  it("cannot declare Blocker while fewer than 4 enemy Units are in play", () => {
    const { engine, byarlantId } = startEnemyDirectAttack(3);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.declareBlock(byarlantId), "CANNOT_BLOCK_DIRECT");

    expect(p1.isExhausted(byarlantId)).toBe(false);
  });
});
