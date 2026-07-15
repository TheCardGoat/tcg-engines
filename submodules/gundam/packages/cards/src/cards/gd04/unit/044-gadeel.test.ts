import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Gadeel044 } from "./044-gadeel.ts";

describe("Gadeel (GD04-044)", () => {
  it("【Attack】 gains Breach 3 during this battle when attacking a damaged enemy Unit", () => {
    const enemy = createMockUnit({ ap: 1, hp: 4 });
    const shield = createMockUnit({ name: "Enemy Shield" });
    const engine = GundamTestEngine.create(
      { play: [gd04Gadeel044] },
      { play: [{ card: enemy, exhausted: true, damage: 1 }], shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;
    expectSuccess(p1.enterBattle(attackerId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("does not gain Breach when attacking an undamaged enemy Unit", () => {
    const enemy = createMockUnit({ ap: 1, hp: 3 });
    const shield = createMockUnit({ name: "Enemy Shield" });
    const engine = GundamTestEngine.create(
      { play: [gd04Gadeel044] },
      { play: [{ card: enemy, exhausted: true }], shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(shieldId)).toBe(`shieldArea:${PLAYER_TWO}`);
  });
});
