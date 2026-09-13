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
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { st10MarkGuilder012 } from "./012-mark-guilder.ts";

describe("Mark Guilder (ST10-012)", () => {
  it("【Burst】 adds the revealed Pilot to its owner's hand", () => {
    expectPilotBurstAddsToHand(st10MarkGuilder012);
  });

  it("【When Paired】gives AP-2 to the chosen enemy Unit that is Lv.5 or lower until turn end", () => {
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const eligible = createMockUnit({ name: "Eligible Enemy", level: 5, ap: 4, hp: 5 });
    const tooHigh = createMockUnit({ name: "Lv.6 Enemy", level: 6, ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [st10MarkGuilder012],
        play: [unit],
        resourceArea: activeResources(4),
      },
      { play: [eligible, tooHigh] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, tooHighId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(st10MarkGuilder012, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Mark Guilder to ask for an enemy Unit");
    }
    expect(choice.legalTargetIds).toEqual([eligibleId]);
    expect(choice.legalTargetIds).not.toContain(tooHighId);
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getVisibleCard(eligibleId!)).toMatchObject({ effectiveAp: 2 });
    expect(p2.getVisibleCard(tooHighId!)).toMatchObject({ effectiveAp: 4 });
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expect(p2.getVisibleCard(eligibleId!)).toMatchObject({ effectiveAp: 4 });
  });
});
