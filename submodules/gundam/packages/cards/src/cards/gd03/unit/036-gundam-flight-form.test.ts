import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd03GundamFlightForm036 } from "./036-gundam-flight-form.ts";

describe("Ξ Gundam (Flight Form) (GD03-036)", () => {
  it("【When Linked】 deals 1 damage to all enemy Units", () => {
    const hathaway = createMockPilot({ name: "Hathaway Noa" });
    const enemyA = createMockUnit({ hp: 4 });
    const enemyB = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [hathaway],
        play: [gd03GundamFlightForm036],
        resourceArea: activeResources(5),
      },
      { play: [enemyA, enemyB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [enemyAId, enemyBId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(hathaway, unitId));

    expect(getDamageCounter(engine, enemyAId!)).toBe(1);
    expect(getDamageCounter(engine, enemyBId!)).toBe(1);
  });
});
