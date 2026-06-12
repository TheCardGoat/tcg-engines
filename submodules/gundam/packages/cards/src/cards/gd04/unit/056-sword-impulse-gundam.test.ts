import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd04SwordImpulseGundam056 } from "./056-sword-impulse-gundam.ts";

describe("Sword Impulse Gundam (GD04-056)", () => {
  it("【Deploy】 deals 1 to itself, then rests an enemy Unit with 3 or less AP", () => {
    const lowAp = createMockUnit({ ap: 2, hp: 5 });
    const highAp = createMockUnit({ ap: 5, hp: 5 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd04SwordImpulseGundam056],
        resourceArea: activeResources(4),
      },
      { play: [lowAp, highAp] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [lowApId, highApId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd04SwordImpulseGundam056, { targets: [lowApId!] }));

    const swordImpulseId = p1.getCardsInZone("battleArea")[0]!;
    // Self damage applied.
    expect(getDamageCounter(engine, swordImpulseId)).toBe(1);
    // Chosen low-AP enemy is rested.
    expect(engine.getG().exhausted[lowApId!]).toBe(true);
    // High-AP enemy is not eligible and remains active.
    expect(engine.getG().exhausted[highApId!]).toBeFalsy();
  });
});
