import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, markAsLinkUnit } from "@tcg/gundam-engine";
import { getEffectiveStats } from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd01DeltaPlus006 } from "./006-delta-plus.ts";

describe("Delta Plus (GD01-006)", () => {
  it("<Repair 1> recovers 1 HP at the end of the controller's turn", () => {
    const engine = GundamTestEngine.create({ play: [{ card: gd01DeltaPlus006 }] });
    const rt = engine.getRuntime();
    const unitId = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd01DeltaPlus006.cardNumber,
    )!;
    engine.getG().damage[unitId] = 2;

    engine.endTurn();

    expect(engine.getG().damage[unitId]).toBe(1);
  });

  it("【During Link】This Unit gets HP+1.", () => {
    const engine = GundamTestEngine.create({ play: [gd01DeltaPlus006] }, { deck: 5 });
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gd01DeltaPlus006.cardNumber)!;
    markAsLinkUnit(engine, uid);

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    // Base HP is 3, duringLink gives +1 → effective HP = 4
    expect(stats.hp).toBe(4);
  });

  it("not linked → no HP bonus", () => {
    const engine = GundamTestEngine.create({ play: [gd01DeltaPlus006] }, { deck: 5 });
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gd01DeltaPlus006.cardNumber)!;

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.hp).toBe(3);
  });
});
