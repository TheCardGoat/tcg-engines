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
import { eb01BesidePain069 } from "./069-beside-pain.ts";

describe("Beside Pain (EB01-069)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(eb01BesidePain069);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [eb01BesidePain069],
      play: [unit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01BesidePain069, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("【Attack】 exposes only a friendly <Blocker> and grants it AP+2 during the turn", () => {
    const host = createMockUnit();
    const blocker = createMockUnit({ ap: 2, keywordEffects: [{ keyword: "Blocker" }] });
    const nonBlocker = createMockUnit({ ap: 2 });
    const defender = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01BesidePain069],
        play: [host, blocker, nonBlocker],
        resourceArea: activeResources(3),
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, blockerId, nonBlockerId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01BesidePain069, hostId!));
    expectSuccess(p1.enterBattle(hostId!, defenderId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [blockerId],
    });
    expectSuccess(p1.resolveEffect({ targets: [blockerId!] }));

    expect(p1.getVisibleCard(blockerId!)?.effectiveAp).toBe(4);
    expect(p1.getVisibleCard(nonBlockerId!)?.effectiveAp).toBe(2);
  });
});
