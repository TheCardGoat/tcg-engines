import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { eb01IoFleming063 } from "./063-io-fleming.ts";

describe("Io Fleming (EB01-063)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(eb01IoFleming063);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [eb01IoFleming063],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01IoFleming063, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("grants Repair 2 to its paired Unit when two other Units are rested", () => {
    const host = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [eb01IoFleming063],
      play: [
        host,
        { card: createMockUnit(), exhausted: true },
        { card: createMockUnit(), exhausted: true },
      ],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01IoFleming063, hostId));
    expect(p1.getVisibleCard(hostId)?.keywords).toContain("Repair");
  });

  it("does not grant Repair when fewer than two other Units are rested", () => {
    const host = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [eb01IoFleming063],
      play: [host, { card: createMockUnit(), exhausted: true }],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01IoFleming063, hostId));
    expect(p1.getVisibleCard(hostId)?.keywords).not.toContain("Repair");
  });
});
