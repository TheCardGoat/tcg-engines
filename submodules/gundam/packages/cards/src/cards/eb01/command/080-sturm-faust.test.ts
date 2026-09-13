import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01SturmFaust080 } from "./080-sturm-faust.ts";

describe("Sturm Faust (EB01-080)", () => {
  it("lets the chosen G Generation Unit attack an active enemy Unit this turn", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [eb01SturmFaust080],
        play: [createMockUnit({ traits: ["g generation"] })],
        resourceArea: activeResources(4),
      },
      { play: [createMockUnit({ hp: 6 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expect(p1.getLegalAttackTargets(attackerId)).not.toContain(enemyId);
    expectSuccess(p1.playCommand(eb01SturmFaust080));
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

    expect(p1.getLegalAttackTargets(attackerId)).toContain(enemyId);
  });

  it("can grant the active-enemy attack target during the Action step", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [eb01SturmFaust080],
        play: [createMockUnit({ traits: ["g generation"] })],
        resourceArea: activeResources(4),
      },
      { play: [createMockUnit({ hp: 6 })], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(eb01SturmFaust080));
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));
    expect(p1.getLegalAttackTargets(attackerId)).toContain(enemyId);
  });
});
