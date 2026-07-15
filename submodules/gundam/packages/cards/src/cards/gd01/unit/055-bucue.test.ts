import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Bucue055 } from "./055-bucue.ts";

describe("BuCUE (GD01-055)", () => {
  it("rests to give one other friendly Unit AP+2 with Support", () => {
    const firstAlly = createMockUnit({ ap: 3, hp: 4 });
    const secondAlly = createMockUnit({ ap: 3, hp: 4 });
    const engine = GundamTestEngine.create({ play: [gd01Bucue055, firstAlly, secondAlly] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [bucueId, firstAllyId, secondAllyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(bucueId!, firstAllyId!));

    expect(p1.isExhausted(bucueId!)).toBe(true);
    expect(p1.getVisibleCard(firstAllyId!)?.effectiveAp).toBe(5);
    expect(p1.getVisibleCard(secondAllyId!)?.effectiveAp).toBe(3);
  });

  it("cannot use Support on itself", () => {
    const legalAlly = createMockUnit({ ap: 3, hp: 4 });
    const engine = GundamTestEngine.create({ play: [gd01Bucue055, legalAlly] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [bucueId, legalAllyId] = p1.getCardsInZone("battleArea");

    expectFailure(p1.useSupport(bucueId!, bucueId!), "ILLEGAL_TARGET");

    expect(p1.isExhausted(bucueId!)).toBe(false);
    expect(p1.getVisibleCard(bucueId!)?.effectiveAp).toBe(2);
    expect(p1.getVisibleCard(legalAllyId!)?.effectiveAp).toBe(3);
  });
});
