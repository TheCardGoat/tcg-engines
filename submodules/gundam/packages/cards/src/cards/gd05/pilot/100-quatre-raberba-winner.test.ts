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
import { gd05QuatreRaberbaWinner100 } from "./100-quatre-raberba-winner.ts";

describe("Quatre Raberba Winner (GD05-100)", () => {
  /** @behavioral-proof complete: Burst retrieval, When Paired timing, enemy ownership, Lv.5 boundary, visible target choice, and rest result are public. */
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05QuatreRaberbaWinner100);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05QuatreRaberbaWinner100],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05QuatreRaberbaWinner100, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("rests only a chosen enemy Unit at the printed Lv.5 limit when paired", () => {
    const host = createMockUnit();
    const eligible = createMockUnit({ level: 5 });
    const ineligible = createMockUnit({ level: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05QuatreRaberbaWinner100],
        play: [host],
        resourceArea: activeResources(4),
      },
      { play: [eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd05QuatreRaberbaWinner100, hostId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected Quatre's rest target choice");
    expect(choice.legalTargetIds).toEqual([eligibleId]);
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.isExhausted(eligibleId!)).toBe(true);
    expect(p2.isExhausted(ineligibleId!)).toBe(false);
  });
});
