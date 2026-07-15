import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04ChuchuSDemiTrainer030 } from "./030-chuchu-s-demi-trainer.ts";

describe("Chuchu's Demi Trainer (GD04-030)", () => {
  it("【Attack】 lets the chosen Academy Unit attack an active enemy Unit at Lv.3", () => {
    const ally = createMockUnit({ ap: 2, hp: 3, traits: ["academy"] });
    const restedDefender = createMockUnit({ name: "Rested Defender", ap: 1, hp: 5 });
    const eligibleTarget = createMockUnit({ name: "Eligible Target", level: 3, hp: 5 });
    const highLevelTarget = createMockUnit({ name: "High-Level Target", level: 4, hp: 5 });

    const engine = GundamTestEngine.create(
      { play: [gd04ChuchuSDemiTrainer030, ally] },
      {
        play: [{ card: restedDefender, exhausted: true }, eligibleTarget, highLevelTarget],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [chuchuId, allyId] = p1.getCardsInZone("battleArea");
    const [restedDefenderId, eligibleTargetId, highLevelTargetId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(chuchuId!, restedDefenderId!));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      sourceCardId: chuchuId,
      minTargets: 1,
      maxTargets: 1,
      legalTargetIds: [allyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [allyId!] }));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getLegalAttackTargets(allyId!)).toContain(eligibleTargetId);
    expect(p1.getLegalAttackTargets(allyId!)).not.toContain(highLevelTargetId);
    expectSuccess(p1.enterBattle(allyId!, eligibleTargetId!));
  });
});
