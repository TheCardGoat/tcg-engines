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
import { eb01Reiji066 } from "./066-reiji.ts";

describe("Reiji (EB01-066)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(eb01Reiji066);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [eb01Reiji066],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01Reiji066, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("lets the chosen friendly G Generation Unit attack an active enemy Blocker this turn", () => {
    const host = createMockUnit({ traits: ["g generation"] });
    const chosenAlly = createMockUnit({ traits: ["g generation"] });
    const eligibleBlocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const activeNonBlocker = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [eb01Reiji066],
        play: [host, chosenAlly],
        resourceArea: activeResources(4),
      },
      { play: [eligibleBlocker, activeNonBlocker], shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, allyId] = p1.getCardsInZone("battleArea");
    const [blockerId, nonBlockerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(eb01Reiji066, hostId!));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([hostId, allyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [allyId!] }));

    expect(p1.getLegalAttackTargets(allyId!)).toContain(blockerId);
    expect(p1.getLegalAttackTargets(allyId!)).not.toContain(nonBlockerId);
    expectSuccess(p1.enterBattle(allyId!, blockerId!));
  });
});
