import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Zuoot061 } from "./061-zuoot.ts";

describe("ZuOOT (GD01-061)", () => {
  it("rests to give one other friendly Unit AP+1 with Support", () => {
    const firstAlly = createMockUnit({ ap: 2, hp: 4 });
    const secondAlly = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({ play: [gd01Zuoot061, firstAlly, secondAlly] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [zuootId, firstAllyId, secondAllyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(zuootId!, firstAllyId!));

    expect(p1.isExhausted(zuootId!)).toBe(true);
    expect(p1.getVisibleCard(firstAllyId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(secondAllyId!)?.effectiveAp).toBe(2);
  });

  it("cannot use Support on itself", () => {
    const legalAlly = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({ play: [gd01Zuoot061, legalAlly] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [zuootId, legalAllyId] = p1.getCardsInZone("battleArea");

    expectFailure(p1.useSupport(zuootId!, zuootId!), "ILLEGAL_TARGET");

    expect(p1.isExhausted(zuootId!)).toBe(false);
    expect(p1.getVisibleCard(zuootId!)?.effectiveAp).toBe(0);
    expect(p1.getVisibleCard(legalAllyId!)?.effectiveAp).toBe(2);
  });
});
