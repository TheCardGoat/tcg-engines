import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  getEffectiveStats,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { betaGundamHeavyarms034 } from "./034-gundam-heavyarms.ts";

describe("Gundam Heavyarms (GD01-034)", () => {
  // 【During Pair】This Unit gains <Breach 3>.
  // Pure duringPair timing gate — derived-state.ts checks pilotAssignments
  // each getEffectiveStats call.

  it("positive: paired → gains <Breach>", () => {
    const engine = GundamTestEngine.create({ play: [betaGundamHeavyarms034] }, { deck: 5 });
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      betaGundamHeavyarms034.cardNumber,
    )!;
    markAsLinkUnit(engine, uid);

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).toContain("Breach");
  });

  it("negative: unpaired → no <Breach>", () => {
    const engine = GundamTestEngine.create({ play: [betaGundamHeavyarms034] }, { deck: 5 });
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      betaGundamHeavyarms034.cardNumber,
    )!;
    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("Breach");
  });

  it("transition: pairing flips the grant on (passive scan reads live state)", () => {
    const engine = GundamTestEngine.create({ play: [betaGundamHeavyarms034] }, { deck: 5 });
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      betaGundamHeavyarms034.cardNumber,
    )!;
    const fw = rt.getFrameworkReadAPI();

    expect(getEffectiveStats(uid, engine.getG(), fw.cards, fw).keywords).not.toContain("Breach");
    markAsLinkUnit(engine, uid);
    expect(getEffectiveStats(uid, engine.getG(), fw.cards, fw).keywords).toContain("Breach");
  });
});
