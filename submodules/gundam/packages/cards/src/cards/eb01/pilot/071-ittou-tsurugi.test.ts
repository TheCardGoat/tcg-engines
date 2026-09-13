import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { eb01IttouTsurugi071 } from "./071-ittou-tsurugi.ts";

describe("Ittou Tsurugi (EB01-071)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(eb01IttouTsurugi071);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [eb01IttouTsurugi071],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01IttouTsurugi071, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("adds its continuous AP bonus while linked", () => {
    const host = createMockUnit({ ap: 2, linkCondition: "[Ittou Tsurugi]" });
    const engine = GundamTestEngine.create({
      hand: [eb01IttouTsurugi071],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01IttouTsurugi071, hostId));
    expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(5);
  });

  it("does not add the continuous AP bonus while paired but unlinked", () => {
    const host = createMockUnit({ ap: 2, linkCondition: "[Other Pilot]" });
    const engine = GundamTestEngine.create({
      hand: [eb01IttouTsurugi071],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01IttouTsurugi071, hostId));
    expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(4);
  });
});
