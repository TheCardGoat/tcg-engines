import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05LaudaNeill087 } from "./087-lauda-neill.ts";

describe("Lauda Neill (GD05-087)", () => {
  /** @behavioral-proof complete: Burst retrieval, Academy host condition, High-Maneuver's public blocking prohibition, and non-Academy false branch are public. */
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05LaudaNeill087);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05LaudaNeill087],
      play: [unit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05LaudaNeill087, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("gives an Academy host High-Maneuver, preventing a normal Blocker from intercepting", () => {
    const host = createMockUnit({ traits: ["academy"] });
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05LaudaNeill087],
        play: [host],
        resourceArea: activeResources(3),
      },
      { play: [blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05LaudaNeill087, hostId));
    expect(p1.getVisibleCard(hostId)?.keywords).toContain("HighManeuver");
    expectSuccess(p1.enterBattle(hostId, "direct"));
    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
  });

  it("does not grant High-Maneuver to a non-Academy host", () => {
    const host = createMockUnit({ traits: ["earth federation"] });
    const engine = GundamTestEngine.create({
      hand: [gd05LaudaNeill087],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05LaudaNeill087, hostId));

    expect(p1.getVisibleCard(hostId)?.keywords).not.toContain("HighManeuver");
  });
});
