import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  getEffectiveStats,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd02RedGundam024 } from "./024-red-gundam.ts";

describe("Red Gundam (GD02-024)", () => {
  // 【During Link】This Unit gains <High-Maneuver>.
  // Pure duringLink timing gate — no additional conditions. Constant-effect
  // path checks Link Unit status per getEffectiveStats call.

  it("positive: Link Unit → gains <High-Maneuver>", () => {
    const engine = GundamTestEngine.create({ play: [gd02RedGundam024] }, { deck: 5 });
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gd02RedGundam024.cardNumber)!;
    markAsLinkUnit(engine, uid);

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).toContain("HighManeuver");
  });

  it("negative: not linked → no <High-Maneuver>", () => {
    const engine = GundamTestEngine.create({ play: [gd02RedGundam024] }, { deck: 5 });
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gd02RedGundam024.cardNumber)!;

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("HighManeuver");
  });

  it("transition: pairing the unit flips the grant on (passive-scan reads live state)", () => {
    const engineA = GundamTestEngine.create({ play: [gd02RedGundam024] }, { deck: 5 });
    const rtA = engineA.getRuntime();
    const uidA = rtA.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02RedGundam024.cardNumber,
    )!;
    const fwA = rtA.getFrameworkReadAPI();
    expect(getEffectiveStats(uidA, engineA.getG(), fwA.cards, fwA).keywords).not.toContain(
      "HighManeuver",
    );

    // Pair the unit; a subsequent getEffectiveStats against the SAME engine
    // must now report HighManeuver — proving conditions are re-evaluated
    // on every call rather than cached on the first read.
    markAsLinkUnit(engineA, uidA);
    expect(getEffectiveStats(uidA, engineA.getG(), fwA.cards, fwA).keywords).toContain(
      "HighManeuver",
    );
  });
});
