import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Messala003 } from "./003-messala.ts";

describe("Messala (GD03-003)", () => {
  it("<Blocker> lets Messala intercept a direct attack", () => {
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd03Messala003], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const messalaId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.declareBlock(messalaId));

    expect(p1.isExhausted(messalaId)).toBe(true);
    expect(p1.getBoardView().pendingCombat?.blockerId).toBe(messalaId);
  });

  it("<Repair 1> recovers 1 HP at the end of its controller's turn", () => {
    const engine = GundamTestEngine.create({ play: [{ card: gd03Messala003, damage: 2 }] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const messalaId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(messalaId)).toBe(1);
  });
});
