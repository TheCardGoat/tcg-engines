import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { betaZaku008 } from "./008-zaku.ts";

describe("Zaku Ⅱ (ST03-008)", () => {
  it("【Attack】This Unit gets AP+2 during this turn.", () => {
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [betaZaku008] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zakuId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expect(p1.getVisibleCard(zakuId)?.effectiveAp).toBe(1);

    expectSuccess(p1.enterBattle(zakuId, defenderId));

    expect(p1.getVisibleCard(zakuId)?.effectiveAp).toBe(3);
  });
});
