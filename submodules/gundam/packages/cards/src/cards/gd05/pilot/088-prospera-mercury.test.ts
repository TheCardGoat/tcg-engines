import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05ProsperaMercury088 } from "./088-prospera-mercury.ts";

describe("Prospera Mercury (GD05-088)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05ProsperaMercury088);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05ProsperaMercury088],
      play: [unit],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05ProsperaMercury088, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("permanently buffs its host and only friendly Gundam Lfrith or Gundnode Units", () => {
    const host = createMockUnit({ name: "Host", ap: 2, hp: 5 });
    const lfrith = createMockUnit({ name: "Gundam Lfrith Ur", ap: 2, hp: 5 });
    const gundnode = createMockUnit({ name: "Gundnode", ap: 2, hp: 5 });
    const outsider = createMockUnit({ name: "Gundam Aerial", ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [gd05ProsperaMercury088],
      play: [host, lfrith, gundnode, outsider],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, lfrithId, gundnodeId, outsiderId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd05ProsperaMercury088, hostId!));

    // The paired Pilot contributes its printed AP+1 in addition to the
    // continuous AP+1 granted by its own text.
    expect(p1.getVisibleCard(hostId!)?.effectiveAp).toBe(4);
    expect(p1.getVisibleCard(lfrithId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(gundnodeId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(outsiderId!)?.effectiveAp).toBe(2);
  });
});
