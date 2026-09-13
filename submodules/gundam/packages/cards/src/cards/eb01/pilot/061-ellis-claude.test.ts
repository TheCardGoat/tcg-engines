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
import { eb01EllisClaude061 } from "./061-ellis-claude.ts";

describe("Ellis Claude (EB01-061)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(eb01EllisClaude061);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [eb01EllisClaude061],
      play: [unit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01EllisClaude061, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("rests only an eligible enemy after pairing while a friendly G Generation Unit is in play", () => {
    const host = createMockUnit({ traits: ["g generation"] });
    const eligible = createMockUnit({ level: 3 });
    const ineligible = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { hand: [eb01EllisClaude061], play: [host], resourceArea: activeResources(3) },
      { play: [eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(eb01EllisClaude061, hostId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.isExhausted(eligibleId!)).toBe(true);
    expect(p2.isExhausted(ineligibleId!)).toBe(false);
  });

  it("does not trigger its paired effect without any friendly G Generation Unit", () => {
    const host = createMockUnit({ traits: ["academy"] });
    const enemy = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      { hand: [eb01EllisClaude061], play: [host], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01EllisClaude061, hostId));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
