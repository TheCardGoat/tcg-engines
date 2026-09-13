import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { st10ZetaGundamEx001 } from "./001-zeta-gundam-ex.ts";

describe("Zeta Gundam (EX) (ST10-001)", () => {
  it("after destroying a Shield in battle sets itself active but cannot attack that player again", () => {
    const engine = GundamTestEngine.create(
      { play: [st10ZetaGundamEx001] },
      { shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(sourceId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.isExhausted(sourceId)).toBe(false);
    expectFailure(p1.enterBattle(sourceId, "direct"), "CANNOT_TARGET_PLAYER");
  });
});
