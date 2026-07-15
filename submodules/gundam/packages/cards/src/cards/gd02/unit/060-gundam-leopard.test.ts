import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  isCardExhausted,
} from "@tcg/gundam-engine";
import { gd02GundamLeopard060 } from "./060-gundam-leopard.ts";

describe("Gundam Leopard (GD02-060)", () => {
  it("【Deploy】 with 7+ cards in trash rests a Lv.4-or-lower enemy", () => {
    const enemy = createMockUnit({ ap: 2, hp: 3, level: 3 });
    // Seed 7 cards in trash to satisfy the condition.
    const trashCards = Array.from({ length: 7 }, () => createMockUnit({ ap: 1, hp: 1 }));
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamLeopard060],
        trash: trashCards,
        resourceArea: activeResources(5),
        deck: 5,
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [enemyId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd02GundamLeopard060, { targets: [enemyId!] }));

    expect(isCardExhausted(engine, enemyId!)).toBe(true);
  });

  it("【Deploy】 with fewer than 7 cards in trash does NOT rest", () => {
    const enemy = createMockUnit({ ap: 2, hp: 3, level: 3 });
    const trashCards = Array.from({ length: 5 }, () => createMockUnit({ ap: 1, hp: 1 }));
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamLeopard060],
        trash: trashCards,
        resourceArea: activeResources(5),
        deck: 5,
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [enemyId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd02GundamLeopard060));

    expect(isCardExhausted(engine, enemyId!)).toBe(false);
  });
});
