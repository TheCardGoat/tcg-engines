import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05KayraSJegan028 } from "./028-kayra-s-jegan.ts";

describe("Kayra's Jegan (GD05-028)", () => {
  it("【Deploy】 lets one chosen Londo Bell Unit attack an active enemy with 4 AP or less", () => {
    const beneficiary = createMockUnit({ traits: ["londo bell"] });
    const activeEnemy = createMockUnit({ ap: 4 });
    const tooStrong = createMockUnit({ ap: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05KayraSJegan028],
        play: [beneficiary],
        resourceArea: activeResources(3),
      },
      { play: [activeEnemy, tooStrong] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const beneficiaryId = p1.getCardsInZone("battleArea")[0]!;
    const [activeEnemyId, tooStrongId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd05KayraSJegan028));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([beneficiaryId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [beneficiaryId] }));

    expectFailure(p1.enterBattle(beneficiaryId, tooStrongId!), "INVALID_TARGET");
    expectSuccess(p1.enterBattle(beneficiaryId, activeEnemyId!));
  });
});
