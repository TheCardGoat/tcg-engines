import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockPilot,
  createMockUnit,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { betaGuncannon004 } from "./004-guncannon.ts";

describe("Guncannon (GD01-004)", () => {
  it("<Repair 1> heals 1 HP at the end of the controller's turn", () => {
    const engine = GundamTestEngine.create({ play: [betaGuncannon004], deck: 5 }, { deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const guncannonId = p1.getCardsInZone("battleArea")[0]!;

    engine.getG().damage[guncannonId] = 2;
    expect(getDamageCounter(engine, guncannonId)).toBe(2);

    // endTurn() drives the flow through end-phase → turnCycleOnEnd
    // (where Repair fires) → next turn's start/draw/resource/main.
    engine.endTurn();

    expect(getDamageCounter(engine, guncannonId)).toBe(1);
  });

  it("【When Paired】 auto-rests an enemy Unit with 2 or less HP", () => {
    const smallEnemy = createMockUnit({ ap: 1, hp: 2 });
    const bigEnemy = createMockUnit({ ap: 4, hp: 8 });
    const pilotCard = createMockPilot();
    const engine = GundamTestEngine.create(
      {
        play: [betaGuncannon004],
        hand: [pilotCard],
        resourceArea: activeResources(2),
      },
      { play: [smallEnemy, bigEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [smallId, bigId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilotCard, betaGuncannon004));

    // Target filter hp <= 2 matches only the small enemy; auto-pick rests it.
    expect(engine.getG().exhausted[smallId!]).toBe(true);
    expect(engine.getG().exhausted[bigId!] ?? false).toBe(false);
  });
});
