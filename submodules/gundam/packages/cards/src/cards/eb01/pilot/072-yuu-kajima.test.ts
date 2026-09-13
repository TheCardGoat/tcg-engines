import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { eb01YuuKajima072 } from "./072-yuu-kajima.ts";

describe("Yuu Kajima (EB01-072)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(eb01YuuKajima072);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [eb01YuuKajima072],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01YuuKajima072, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("rests both the active friendly Blocker and the chosen Lv.4-or-lower enemy Unit when paired", () => {
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const enemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01YuuKajima072],
        play: [blocker],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const blockerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01YuuKajima072, blockerId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([blockerId, enemyId]),
      minTargets: 2,
      maxTargets: 2,
    });
    expectSuccess(p1.resolveEffect({ targets: [blockerId, enemyId] }));

    expect(p1.isExhausted(blockerId)).toBe(true);
    expect(p2.isExhausted(enemyId)).toBe(true);
  });
});
