import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd02Gquuuuuux034 } from "./034-gquuuuuux.ts";

describe("GQuuuuuuX (GD02-034)", () => {
  it("【During Pair·Red Pilot】This Unit gets AP+2 with a red pilot.", () => {
    const redPilot = createMockPilot({
      name: "Red Pilot",
      color: "red",
      apBonus: 0,
      hpBonus: 0,
    });
    const engine = GundamTestEngine.create({
      hand: [redPilot],
      play: [gd02Gquuuuuux034],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const rt = engine.getRuntime();
    const unitId = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02Gquuuuuux034.cardNumber,
    )!;

    // Before pairing: base AP 0
    const fw = rt.getFrameworkReadAPI();
    expect(getEffectiveStats(unitId, engine.getG(), fw.cards, fw).ap).toBe(0);

    // Pair with red pilot
    expectSuccess(p1.assignPilot(redPilot, gd02Gquuuuuux034));

    // After pairing: base AP 0 + pilot apBonus 0 + constant +2 = 2
    const fw2 = rt.getFrameworkReadAPI();
    expect(getEffectiveStats(unitId, engine.getG(), fw2.cards, fw2).ap).toBe(2);
  });

  it("does NOT get AP+2 with a non-red pilot", () => {
    const bluePilot = createMockPilot({
      name: "Blue Pilot",
      color: "blue",
      apBonus: 0,
      hpBonus: 0,
    });
    const engine = GundamTestEngine.create({
      hand: [bluePilot],
      play: [gd02Gquuuuuux034],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const rt = engine.getRuntime();
    const unitId = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02Gquuuuuux034.cardNumber,
    )!;

    expectSuccess(p1.assignPilot(bluePilot, gd02Gquuuuuux034));

    // After pairing with blue: base AP 0 + pilot apBonus 0, NO +2 = 0
    const fw = rt.getFrameworkReadAPI();
    expect(getEffectiveStats(unitId, engine.getG(), fw.cards, fw).ap).toBe(0);
  });
});
