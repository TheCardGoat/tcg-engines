import { describe, it, expect } from "vite-plus/test";
import {
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd04GundamVirtueTransAm054 } from "./054-gundam-virtue-trans-am.ts";

describe("Gundam Virtue (Trans-Am) (GD04-054)", () => {
  it("destroys an enemy Unit after dealing battle damage to it", () => {
    const enemy = createMockUnit({ hp: 6, level: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamVirtueTransAm054] },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const virtueId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    engine.resolveCombat({ attackerId: virtueId, target: enemyId });

    expect(p2.getCardsInZone("trash")).toContain(enemyId);
  });

  it("does not destroy an enemy Unit when a different Unit dealt the battle damage", () => {
    const attacker = createMockUnit({ ap: 2, hp: 6 });
    const enemy = createMockUnit({ hp: 6, level: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamVirtueTransAm054, attacker] },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[1]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
  });
});
