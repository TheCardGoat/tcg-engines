import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  findStatModifier,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd03Rouei067 } from "./067-rouei.ts";

describe("Rouei (GD03-067)", () => {
  it("【Deploy】 may deal 1 damage to a friendly Unit and give it AP+1", () => {
    const ally = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd03Rouei067],
      play: [ally],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03Rouei067, { targets: [allyId] }));
    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    }

    expect(getDamageCounter(engine, allyId)).toBe(1);
    expect(findStatModifier(engine, allyId, "ap")?.modifier).toBe(1);
  });
});
