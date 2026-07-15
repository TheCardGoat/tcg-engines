import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GundamDynames026 } from "./026-gundam-dynames.ts";

describe("Gundam Dynames (GD03-026)", () => {
  it("<Breach 3> destroys the top Shield after Dynames destroys an enemy Unit in battle", () => {
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const shield = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd03GundamDynames026] },
      { play: [{ card: defender, exhausted: true }], shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const dynamesId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(dynamesId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    expect(p2.getCardsInZone("trash")).toHaveLength(2);
  });
});
