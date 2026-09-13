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
import { st10KamilleBidan011 } from "./011-kamille-bidan.ts";

describe("Kamille Bidan (ST10-011)", () => {
  it("【Burst】 adds the revealed Pilot to its owner's hand", () => {
    expectPilotBurstAddsToHand(st10KamilleBidan011);
  });

  it("【When Linked】rests an enemy at or below the linked Unit's level after two Units are rested", () => {
    const host = createMockUnit({
      name: "Kamille Host",
      level: 5,
      ap: 2,
      hp: 4,
      linkCondition: "[Kamille Bidan]",
    });
    const friendlyRested = createMockUnit({ name: "Friendly Rested", level: 1 });
    const eligible = createMockUnit({ name: "Eligible Enemy", level: 5 });
    const tooHighRested = createMockUnit({ name: "Lv.6 Rested Enemy", level: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [st10KamilleBidan011],
        play: [host, { card: friendlyRested, exhausted: true }],
        resourceArea: activeResources(4),
      },
      { play: [eligible, { card: tooHighRested, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, tooHighId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(st10KamilleBidan011, hostId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Kamille to ask for an eligible enemy Unit");
    }
    expect(choice.legalTargetIds).toEqual([eligibleId]);
    expect(choice.legalTargetIds).not.toContain(tooHighId);
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.isExhausted(eligibleId!)).toBe(true);
  });

  it("does not offer a target when fewer than two Units are rested", () => {
    const host = createMockUnit({ level: 5, linkCondition: "[Kamille Bidan]" });
    const onlyRested = createMockUnit({ level: 4 });
    const eligible = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [st10KamilleBidan011],
        play: [host, { card: onlyRested, exhausted: true }],
        resourceArea: activeResources(4),
      },
      { play: [eligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st10KamilleBidan011, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getPilotId(hostId)).toBeDefined();
  });
});
