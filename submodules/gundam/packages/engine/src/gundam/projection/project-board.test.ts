import { describe, expect, it } from "vite-plus/test";

import { activeResources } from "../testing/command-test-helpers.ts";
import { createMockPilot, createMockUnit } from "../testing/card-mocks.ts";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO } from "../testing/test-engine.ts";
import { expectSuccess } from "../testing/matchers.ts";

describe("Gundam board projection", () => {
  it("shows paired Pilot bonuses and keywords to both players", () => {
    const unit = createMockUnit({ ap: 2, hp: 3 });
    const pilot = createMockPilot({
      apBonus: 2,
      hpBonus: 1,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create({
      play: [unit],
      hand: [pilot],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [unitId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, unitId!));

    expect(p1.getVisibleCard(unitId!)).toMatchObject({
      effectiveAp: 4,
      effectiveHp: 4,
      keywords: ["Blocker"],
    });
    expect(p2.getVisibleCard(unitId!)).toMatchObject({
      effectiveAp: 4,
      effectiveHp: 4,
      keywords: ["Blocker"],
    });
  });

  it("shows temporary Support AP changes on the board", () => {
    const supporter = createMockUnit({
      keywordEffects: [{ keyword: "Support", value: 2 }],
    });
    const target = createMockUnit({ ap: 3 });
    const engine = GundamTestEngine.create({ play: [supporter, target] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [supporterId, targetId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(supporterId!, targetId!));

    expect(p1.getVisibleCard(targetId!)).toMatchObject({ effectiveAp: 5 });
  });
});
