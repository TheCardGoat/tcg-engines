import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockResource,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import type { TestCardEntry } from "@tcg/gundam-engine";
import { getEffectiveStats } from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd02GundamAge1Spallow023 } from "./023-gundam-age-1-spallow.ts";

function resources(n: number): TestCardEntry[] {
  return Array.from({ length: n }, () => ({ card: createMockResource(), exhausted: false }));
}

describe("Gundam AGE-1 Spallow (GD02-023)", () => {
  // 【During Link】While you are Lv.7+, this Unit gains <First Strike>.
  //
  // Constant-effect path: derived-state.ts re-evaluates both the duringLink
  // timing gate (requires Link Unit status via pilotAssignments +
  // linkCondition) AND the `playerLevel gte 7` condition on every
  // `getEffectiveStats` call — no caching.

  it("positive: linked + Lv.7 → gains <First Strike>", () => {
    const engine = GundamTestEngine.create(
      { play: [gd02GundamAge1Spallow023], resourceArea: resources(7) },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02GundamAge1Spallow023.cardNumber,
    )!;
    // Card as-printed lacks a `linkCondition` entry in this definition;
    // markAsLinkUnit synthesises one + a matching pilot so the duringLink
    // timing gate is satisfied.
    markAsLinkUnit(engine, uid);

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).toContain("FirstStrike");
  });

  it("negative: linked but Lv.6 → no <First Strike>", () => {
    const engine = GundamTestEngine.create(
      { play: [gd02GundamAge1Spallow023], resourceArea: resources(6) },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02GundamAge1Spallow023.cardNumber,
    )!;
    markAsLinkUnit(engine, uid);

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("FirstStrike");
  });

  it("negative: Lv.7 but not linked → duringLink gate unmet", () => {
    const engine = GundamTestEngine.create(
      { play: [gd02GundamAge1Spallow023], resourceArea: resources(7) },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02GundamAge1Spallow023.cardNumber,
    )!;

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("FirstStrike");
  });

  it("transition: starting at Lv.6 → raising to Lv.7 flips the grant on (no state caching)", () => {
    // Two engines differing only in resource count lock the regression:
    // the passive scan must read live state on every call rather than a
    // per-instance snapshot.
    const engineLow = GundamTestEngine.create(
      { play: [gd02GundamAge1Spallow023], resourceArea: resources(6) },
      { deck: 5 },
    );
    const rtLow = engineLow.getRuntime();
    const uidLow = rtLow.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02GundamAge1Spallow023.cardNumber,
    )!;
    markAsLinkUnit(engineLow, uidLow);
    const fwLow = rtLow.getFrameworkReadAPI();
    expect(getEffectiveStats(uidLow, engineLow.getG(), fwLow.cards, fwLow).keywords).not.toContain(
      "FirstStrike",
    );

    const engineHigh = GundamTestEngine.create(
      { play: [gd02GundamAge1Spallow023], resourceArea: resources(7) },
      { deck: 5 },
    );
    const rtHigh = engineHigh.getRuntime();
    const uidHigh = rtHigh.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02GundamAge1Spallow023.cardNumber,
    )!;
    markAsLinkUnit(engineHigh, uidHigh);
    const fwHigh = rtHigh.getFrameworkReadAPI();
    expect(getEffectiveStats(uidHigh, engineHigh.getG(), fwHigh.cards, fwHigh).keywords).toContain(
      "FirstStrike",
    );
  });
});
