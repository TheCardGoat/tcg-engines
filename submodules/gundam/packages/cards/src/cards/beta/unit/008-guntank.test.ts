import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockUnit,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { betaGuntank008 } from "./008-guntank.ts";

describe("Guntank (GD01-008)", () => {
  it("【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.", () => {
    const rested = createMockUnit({ ap: 1, hp: 3 });
    const active = createMockUnit({ ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [betaGuntank008], resourceArea: activeResources(2) },
      { play: [{ card: rested, exhausted: true }, active] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [restedId, activeId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(betaGuntank008, { targets: [restedId!] }));

    expect(getDamageCounter(engine, restedId!)).toBe(1);
    // Active enemy untouched.
    expect(getDamageCounter(engine, activeId!)).toBe(0);
  });

  it("cannot target an active enemy Unit", () => {
    const active = createMockUnit({ ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [betaGuntank008], resourceArea: activeResources(2) },
      { play: [active] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [activeId] = p2.getCardsInZone("battleArea");

    const result = p1.deployUnit(betaGuntank008, { targets: [activeId!] });
    expect(result.success).toBe(false);
  });
});
