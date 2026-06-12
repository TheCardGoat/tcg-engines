import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  findStatModifier,
} from "@tcg/gundam-engine";
import { st03Zaku008 } from "./008-zaku.ts";

describe("Zaku Ⅱ (ST03-008)", () => {
  it("【Attack】 grants this unit AP+2 during the turn it declares an attack", () => {
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [st03Zaku008], resourceArea: activeResources(3), deck: 5 },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, enemyId));

    // The `attack` triggered effect should fire as part of attack
    // declaration — attaching an AP+2 continuous modifier to the attacker.
    const mod = findStatModifier(engine, attackerId, "ap");
    expect(mod?.modifier).toBe(2);
  });
});
