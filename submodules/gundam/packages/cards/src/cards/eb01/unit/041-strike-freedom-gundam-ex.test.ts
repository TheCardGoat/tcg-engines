import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectHighManeuverAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { eb01StrikeFreedomGundamEx041 } from "./041-strike-freedom-gundam-ex.ts";

describe("Strike Freedom Gundam (EX) (EB01-041)", () => {
  /** @behavioral-proof complete: High-Maneuver and each-enemy-player return choice are both public. */
  it("<High-Maneuver> prevents an enemy Blocker from intercepting its attack", () => {
    expectHighManeuverAbility(eb01StrikeFreedomGundamEx041);
  });

  it("【Deploy】 lets each enemy player choose one of their eligible Units to return", () => {
    const eligible = createMockUnit({ name: "Eligible", hp: 4 });
    const ineligible = createMockUnit({ name: "Ineligible", hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [eb01StrikeFreedomGundamEx041], resourceArea: activeResources(7) },
      { play: [eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sourceId] = p1.getHand();
    const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(sourceId!));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected opponent's return choice");
    expect(choice.legalTargetIds).toEqual([eligibleId]);
    expectSuccess(p2.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(ineligibleId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
