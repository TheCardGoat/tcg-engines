import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GnArmorTypeE057 } from "./057-gn-armor-type-e.ts";

describe("GN Armor (Type-E) (GD03-057)", () => {
  it("<Blocker> lets GN Armor intercept a direct attack", () => {
    const attacker = createMockUnit({ ap: 2, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd03GnArmorTypeE057], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.declareBlock(unitId));

    expect(p1.isExhausted(unitId)).toBe(true);
    expect(p1.getBoardView().pendingCombat?.blockerId).toBe(unitId);
  });
});
