import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03AudaSMaganac028 } from "./028-auda-s-maganac.ts";

describe("Auda's Maganac (GD03-028)", () => {
  it("【Attack】 gets AP+2 during battle when attacking an enemy Unit", () => {
    const defender = { card: createMockUnit({ hp: 6 }), exhausted: true };
    const engine = GundamTestEngine.create({ play: [gd03AudaSMaganac028] }, { play: [defender] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));

    expect(p1.getVisibleCard(attackerId)?.effectiveAp).toBe(4);

    expectSuccess(engine.asPlayer(PLAYER_TWO).passBlock());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getVisibleCard(attackerId)?.effectiveAp).toBe(2);
  });

  it("does not get AP+2 when attacking the enemy player directly", () => {
    const engine = GundamTestEngine.create({ play: [gd03AudaSMaganac028], deck: 5 }, { deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));

    expect(p1.getVisibleCard(attackerId)?.effectiveAp).toBe(2);
  });
});
