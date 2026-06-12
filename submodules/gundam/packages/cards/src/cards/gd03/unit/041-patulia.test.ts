import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd03Patulia041 } from "./041-patulia.ts";

describe("Patulia (GD03-041)", () => {
  it("【Deploy】 deals 3 damage to all Bases", () => {
    const friendlyBase = createMockBase({ hp: 6 });
    const enemyBase = createMockBase({ hp: 6 });
    const engine = GundamTestEngine.create(
      { hand: [gd03Patulia041], baseSection: [friendlyBase], resourceArea: activeResources(7) },
      { baseSection: [enemyBase] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyBaseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyBaseId = engine.asPlayer(PLAYER_TWO).getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.deployUnit(gd03Patulia041));

    expect(getDamageCounter(engine, friendlyBaseId)).toBe(3);
    expect(getDamageCounter(engine, enemyBaseId)).toBe(3);
  });
});
