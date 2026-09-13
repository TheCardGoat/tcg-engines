import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05StingOakley091 } from "./091-sting-oakley.ts";

describe("Sting Oakley (GD05-091)", () => {
  /** @behavioral-proof complete: Burst retrieval, opponent-trash threshold, paired host AP/HP gains, and six-card false branch are public. */
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05StingOakley091);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05StingOakley091],
      play: [unit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05StingOakley091, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("gives its paired Unit AP+1 and HP+1 at seven enemy trash cards", () => {
    const host = createMockUnit({ ap: 3, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05StingOakley091],
        play: [host],
        resourceArea: activeResources(3),
      },
      { trash: Array.from({ length: 7 }, () => createMockUnit()) },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05StingOakley091, hostId));

    expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(3 + gd05StingOakley091.apBonus + 1);
    expect(p1.getVisibleCard(hostId)?.effectiveHp).toBe(4 + gd05StingOakley091.hpBonus + 1);
  });

  it("does not give the bonuses with only six enemy trash cards", () => {
    const host = createMockUnit({ ap: 3, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05StingOakley091],
        play: [host],
        resourceArea: activeResources(3),
      },
      { trash: Array.from({ length: 6 }, () => createMockUnit()) },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05StingOakley091, hostId));

    expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(3 + gd05StingOakley091.apBonus);
    expect(p1.getVisibleCard(hostId)?.effectiveHp).toBe(4 + gd05StingOakley091.hpBonus);
  });
});
