import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  findStatModifier,
} from "@tcg/gundam-engine";
import { betaZaku008 } from "./008-zaku.ts";

describe("Zaku Ⅱ (ST03-008)", () => {
  it("【Attack】This Unit gets AP+2 during this turn.", () => {
    const blocker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({ play: [betaZaku008] }, { play: [blocker] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zakuId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    // No AP modifier before the attack.
    expect(findStatModifier(engine, zakuId, "ap")).toBeUndefined();

    expectSuccess(p1.enterBattle(zakuId, blockerId));

    // 【Attack】 auto-drained: AP+2 stat-modifier now present.
    expect(findStatModifier(engine, zakuId, "ap")?.modifier).toBe(2);
  });
});
