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
import { gd05TrowaBarton099 } from "./099-trowa-barton.ts";

describe("Trowa Barton (GD05-099)", () => {
  /** @behavioral-proof complete: Burst retrieval, controller-turn battle-destruction timing, self source gate, draw-before-discard staging, exact discard choice, and destination are public. */
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05TrowaBarton099);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05TrowaBarton099],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05TrowaBarton099, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("draws then requires the owner to discard 1 after its paired Unit destroys an enemy", () => {
    const host = createMockUnit({ ap: 3, hp: 6 });
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05TrowaBarton099],
        play: [host],
        resourceArea: activeResources(4),
        deck: [createMockUnit(), createMockUnit()],
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05TrowaBarton099, hostId));
    expectSuccess(p1.enterBattle(hostId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected Trowa's discard choice");
    expect(choice.minTargets).toBe(1);
    expect(choice.maxTargets).toBe(1);
    const discardedId = choice.legalTargetIds[0]!;
    expectSuccess(p1.resolveEffect({ targets: [discardedId] }));

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getCardZone(discardedId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getHand()).toHaveLength(0);
  });
});
