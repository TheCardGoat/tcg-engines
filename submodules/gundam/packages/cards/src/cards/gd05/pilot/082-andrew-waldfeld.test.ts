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
import { gd05AndrewWaldfeld082 } from "./082-andrew-waldfeld.ts";

describe("Andrew Waldfeld (GD05-082)", () => {
  /** @behavioral-proof complete: Burst retrieval, During Link Repair 2 grant, controller End Phase healing, and unlinked false branch are public. */
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05AndrewWaldfeld082);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05AndrewWaldfeld082],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05AndrewWaldfeld082, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("gives a linked Unit Repair 2 and heals exactly 2 at its controller's End Phase", () => {
    const host = createMockUnit({ linkCondition: "[Andrew Waldfeld]" });
    const engine = GundamTestEngine.create({
      hand: [gd05AndrewWaldfeld082],
      play: [{ card: host, damage: 2 }],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05AndrewWaldfeld082, hostId));
    expect(p1.getVisibleCard(hostId)?.keywords).toContain("Repair");
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(hostId)).toBe(0);
  });

  it("does not grant Repair or heal a merely paired, unlinked Unit", () => {
    const host = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [gd05AndrewWaldfeld082],
      play: [{ card: host, damage: 2 }],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05AndrewWaldfeld082, hostId));
    expect(p1.getVisibleCard(hostId)?.keywords).not.toContain("Repair");
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(hostId)).toBe(2);
  });
});
