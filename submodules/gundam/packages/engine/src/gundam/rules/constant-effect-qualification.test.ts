/**
 * Constant-effect `activation.qualification` gate in stat-modifier pipeline.
 *
 * Validates that `getEffectiveStats` evaluates the `qualification` field on
 * constant effects (Gap B fix). Before the fix, the qualification was ignored
 * and the stat-modifier applied unconditionally — e.g. GD02-034's AP+2 would
 * fire for any paired pilot, not just red pilots.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";
import type { PlayerId } from "../../types/branded.ts";
import { GundamTestEngine, PLAYER_ONE, activeResources, createMockPilot } from "../../index.ts";
import { getEffectiveStats } from "./derived-state.ts";

/**
 * GD02-034 shape: constant duringPair with color qualification.
 * 【During Pair·Red Pilot】This Unit gets AP+2.
 */
const gquuuuuux: UnitCard = {
  cardNumber: "TEST-QUAL-01",
  name: "Qualification Test Unit",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  level: 2,
  cost: 1,
  ap: 0,
  hp: 3,
  effect: "【During Pair·Red Pilot】This Unit gets AP+2.",
  effects: [
    {
      type: "constant",
      activation: {
        qualification: { attribute: "color", comparison: "eq", value: "red" },
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【During Pair·Red Pilot】This Unit gets AP+2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};

describe("constant-effect qualification gate (duringPair + color)", () => {
  it("AP+2 applies when paired with a red pilot", () => {
    const redPilot = createMockPilot({
      color: "red",
      traits: ["zeon"],
      level: 1,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      hand: [redPilot],
      play: [gquuuuuux],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const rt = engine.getRuntime();
    const unitId = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gquuuuuux.cardNumber)!;

    // Before pairing: base AP 0
    const fw = rt.getFrameworkReadAPI();
    expect(getEffectiveStats(unitId, engine.getG(), fw.cards, fw).ap).toBe(0);

    // Pair with red pilot
    p1.assignPilot(redPilot, gquuuuuux);

    // After pairing: base AP 0 + pilot AP bonus (1) + constant +2 = 3
    const fw2 = rt.getFrameworkReadAPI();
    expect(getEffectiveStats(unitId, engine.getG(), fw2.cards, fw2).ap).toBe(3);
  });

  it("AP+2 does NOT apply when paired with a non-red pilot", () => {
    const bluePilot = createMockPilot({
      color: "blue",
      traits: ["zeon"],
      level: 1,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      hand: [bluePilot],
      play: [gquuuuuux],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const rt = engine.getRuntime();
    const unitId = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gquuuuuux.cardNumber)!;

    // Pair with blue pilot
    p1.assignPilot(bluePilot, gquuuuuux);

    // After pairing: base AP 0 + pilot AP bonus (1) = 1, NO +2
    const fw = rt.getFrameworkReadAPI();
    expect(getEffectiveStats(unitId, engine.getG(), fw.cards, fw).ap).toBe(1);
  });

  it("AP+2 does NOT apply when no pilot is paired", () => {
    const engine = GundamTestEngine.create({
      play: [gquuuuuux],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const rt = engine.getRuntime();
    const unitId = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gquuuuuux.cardNumber)!;

    const fw = rt.getFrameworkReadAPI();
    expect(getEffectiveStats(unitId, engine.getG(), fw.cards, fw).ap).toBe(0);
  });
});
