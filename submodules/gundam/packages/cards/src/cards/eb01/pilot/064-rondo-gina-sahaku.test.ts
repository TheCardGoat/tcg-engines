import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { eb01RondoGinaSahaku064 } from "./064-rondo-gina-sahaku.ts";

describe("Rondo Gina Sahaku (EB01-064)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(eb01RondoGinaSahaku064);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [eb01RondoGinaSahaku064],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01RondoGinaSahaku064, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("grants Breach 1 to its paired Unit while that Unit has Repair", () => {
    const host = createMockUnit({ keywordEffects: [{ keyword: "Repair", value: 1 }] });
    const engine = GundamTestEngine.create({
      hand: [eb01RondoGinaSahaku064],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01RondoGinaSahaku064, hostId));
    expect(p1.getVisibleCard(hostId)?.keywords).toContain("Breach");
  });

  it("does not grant Breach to a paired Unit without Repair", () => {
    const host = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [eb01RondoGinaSahaku064],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01RondoGinaSahaku064, hostId));
    expect(p1.getVisibleCard(hostId)?.keywords).not.toContain("Breach");
  });
});
