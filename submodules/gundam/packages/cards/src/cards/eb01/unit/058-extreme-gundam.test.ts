import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01ExtremeGundam058 } from "./058-extreme-gundam.ts";

describe("Extreme Gundam (EB01-058)", () => {
  /** @behavioral-proof complete: the standard two-player enemy-count gate and actual Blocker rejection are public. */
  it("does not gain Blocker with only one enemy player", () => {
    const attacker = createMockUnit({ name: "Attacker" });
    const engine = GundamTestEngine.create(
      { play: [eb01ExtremeGundam058] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const extremeId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expect(p1.getVisibleCard(extremeId)?.keywords).not.toContain("Blocker");
    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectFailure(p1.declareBlock(extremeId), "CANNOT_BLOCK_DIRECT");
  });
});
