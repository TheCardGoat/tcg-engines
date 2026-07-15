import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GundamHajiroboshi068 } from "./068-gundam-hajiroboshi.ts";

describe("Gundam Hajiroboshi (GD03-068)", () => {
  it("can block while a friendly Base is in play", () => {
    const attacker = createMockUnit({ ap: 2, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        play: [gd03GundamHajiroboshi068],
        baseSection: [createMockBase()],
        deck: 5,
      },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.declareBlock(unitId));

    expect(p1.getBoardView().pendingCombat?.blockerId).toBe(unitId);
  });

  it("cannot block without a friendly Base", () => {
    const attacker = createMockUnit({ ap: 2, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd03GundamHajiroboshi068], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectFailure(p1.declareBlock(unitId), "CANNOT_BLOCK_DIRECT");
  });
});
