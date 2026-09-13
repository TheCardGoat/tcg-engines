import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { eb01MeirSiva065 } from "./065-meir-siva.ts";

describe("Meir Siva (EB01-065)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(eb01MeirSiva065);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [eb01MeirSiva065],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01MeirSiva065, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("【When Linked】 exposes only friendly (G Generation) Units and grants the chosen Unit Breach 1", () => {
    const host = createMockUnit({ linkCondition: "[Meir Siva]" });
    const eligible = createMockUnit({ traits: ["g generation"] });
    const ineligible = createMockUnit({ traits: ["academy"] });
    const engine = GundamTestEngine.create({
      hand: [eb01MeirSiva065],
      play: [host, eligible, ineligible],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, eligibleId, ineligibleId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(eb01MeirSiva065, hostId!));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p1.getVisibleCard(eligibleId!)?.keywords).toContain("Breach");
    expect(p1.getVisibleCard(ineligibleId!)?.keywords).not.toContain("Breach");
  });
});
