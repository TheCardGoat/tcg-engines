import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01FierceEnemyAssault075 } from "./075-fierce-enemy-assault.ts";

describe("Fierce Enemy Assault (EB01-075)", () => {
  it("rests one or two enemy Units with 2 or less HP", () => {
    const engine = GundamTestEngine.create(
      { hand: [eb01FierceEnemyAssault075], resourceArea: activeResources(3) },
      { play: [createMockUnit({ hp: 2 }), createMockUnit({ hp: 2 }), createMockUnit({ hp: 3 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [first, second, ineligible] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(eb01FierceEnemyAssault075));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      legalTargetIds: [first, second],
      minTargets: 1,
      maxTargets: 2,
    });
    expectSuccess(p1.resolveEffect({ targets: [first!, second!] }));

    expect(p2.isExhausted(first!)).toBe(true);
    expect(p2.isExhausted(second!)).toBe(true);
    expect(p2.isExhausted(ineligible!)).toBe(false);
  });

  it("can be played during the Action step", () => {
    const enemy = createMockUnit({ hp: 2 });
    const engine = GundamTestEngine.create(
      { hand: [eb01FierceEnemyAssault075], resourceArea: activeResources(3) },
      { play: [enemy], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(eb01FierceEnemyAssault075));
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expect(p2.isExhausted(enemyId)).toBe(true);
  });
});
