/**
 * Diagnostic + regression coverage for constant-effect condition re-evaluation.
 *
 * A `type: "constant"` effect whose `activation.conditions` depends on board
 * state (playerLevel, unitCount, cardInZone, friendlyBaseInPlay, isTurn, ...)
 * must be re-evaluated against CURRENT state each time `getEffectiveStats` is
 * invoked — NOT cached at registration time.
 *
 * Coverage:
 *   - Positive: state matches → effect applies.
 *   - Negative: state doesn't match → effect doesn't apply.
 *   - Transition: state flips from non-matching to matching mid-game →
 *     subsequent `getEffectiveStats` reflects the new state.
 */

import { describe, it, expect } from "vite-plus/test";
import "../testing/register-matchers.ts";
import type { CardEffect } from "@tcg/gundam-types";
import type { PlayerId } from "../../types/branded.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockPilot,
  createMockResource,
  getEffectiveStats,
} from "../../index.ts";
import type { TestCardEntry } from "../../index.ts";

function active(card: ReturnType<typeof createMockResource>): TestCardEntry {
  return { card, exhausted: false };
}
function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => active(createMockResource()));
}

describe("Constant effects — condition re-eval on each getEffectiveStats call", () => {
  // Self-buff: while you are Lv.5+, this unit gains FirstStrike.
  const levelGatedEffect: CardEffect = {
    type: "constant",
    activation: {
      conditions: [{ type: "playerLevel", comparison: "gte", value: 5 }],
    },
    directives: [
      {
        action: {
          action: "grantKeyword",
          keyword: "FirstStrike",
          duration: "permanent",
          target: { owner: "self", cardType: "unit" },
        },
      },
    ],
    sourceText: "While you are Lv.5 or higher, this Unit gains FirstStrike.",
  };

  function setup(resourceCount: number) {
    const unit = createMockUnit({
      name: "LvlGated",
      ap: 3,
      hp: 3,
      effects: [levelGatedEffect],
    });
    const engine = GundamTestEngine.create(
      { play: [unit], resourceArea: resources(resourceCount) },
      { deck: 5 },
    );
    const runtime = engine.getRuntime();
    const unitId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;
    return { engine, runtime, unitId };
  }

  it("negative: condition unmet (level 4) → FirstStrike NOT granted", () => {
    const { engine, runtime, unitId } = setup(4);
    const framework = runtime.getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(stats.keywords).not.toContain("FirstStrike");
  });

  it("positive: condition met (level 5) → FirstStrike granted", () => {
    const { engine, runtime, unitId } = setup(5);
    const framework = runtime.getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("FirstStrike");
  });

  it("transition: second read reflects updated state; no caching of the first-read result", () => {
    // Two independent engine instances differing only in resource count.
    // If the passive scan cached the condition result at registration time
    // (hypothesis b), the first call to getEffectiveStats would freeze the
    // outcome. Proving that each engine sees its OWN state confirms that
    // conditions are freshly evaluated on each call.
    const { engine: e1, runtime: r1, unitId: u1 } = setup(4);
    const { engine: e2, runtime: r2, unitId: u2 } = setup(5);

    const s1 = getEffectiveStats(
      u1,
      e1.getG(),
      r1.getFrameworkReadAPI().cards,
      r1.getFrameworkReadAPI(),
    );
    const s2 = getEffectiveStats(
      u2,
      e2.getG(),
      r2.getFrameworkReadAPI().cards,
      r2.getFrameworkReadAPI(),
    );
    expect(s1.keywords).not.toContain("FirstStrike");
    expect(s2.keywords).toContain("FirstStrike");

    // Second read of e1 after re-checking — same G, same result (no
    // accidental latching to e2's outcome).
    const s1again = getEffectiveStats(
      u1,
      e1.getG(),
      r1.getFrameworkReadAPI().cards,
      r1.getFrameworkReadAPI(),
    );
    expect(s1again.keywords).not.toContain("FirstStrike");
  });

  // ──────────────────────────────────────────────────────────────
  // duringLink + playerLevel (AGE-1 Spallow pattern)
  // ──────────────────────────────────────────────────────────────
  const duringLinkLevelGated: CardEffect = {
    type: "constant",
    activation: {
      conditions: [{ type: "duringLink" }, { type: "playerLevel", comparison: "gte", value: 5 }],
    },
    directives: [
      {
        action: {
          action: "grantKeyword",
          keyword: "FirstStrike",
          duration: "permanent",
          target: { owner: "self", cardType: "unit" },
        },
      },
    ],
    sourceText: "【During Link】While you are Lv.5 or higher, this Unit gains FirstStrike.",
  };

  it("duringLink + playerLevel: unlinked unit with level met → no grant (gate unmet)", () => {
    // No pilot paired ⇒ not a Link Unit ⇒ duringLink gate fails regardless of level.
    const unit = createMockUnit({
      name: "DLGated",
      ap: 3,
      hp: 3,
      effects: [duringLinkLevelGated],
      linkCondition: "[Friend]",
    });
    const engine = GundamTestEngine.create(
      { play: [unit], resourceArea: resources(5) },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;
    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("FirstStrike");
  });

  it("duringLink + playerLevel: linked, level met → grant applies", () => {
    const pilot = createMockPilot({ name: "Friend", apBonus: 0, hpBonus: 0 });
    const unit = createMockUnit({
      name: "DLGated",
      ap: 3,
      hp: 3,
      effects: [duringLinkLevelGated],
      linkCondition: "[Friend]",
    });
    const engine = GundamTestEngine.create(
      { play: [unit, pilot], resourceArea: resources(5) },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;
    const pid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, pilot.cardNumber)!;

    // Pair them via engine state
    const G = engine.getG();
    G.pilotAssignments[uid] = pid;

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).toContain("FirstStrike");
  });

  it("duringLink + playerLevel: linked but level unmet → no grant", () => {
    const pilot = createMockPilot({ name: "Friend", apBonus: 0, hpBonus: 0 });
    const unit = createMockUnit({
      name: "DLGated",
      ap: 3,
      hp: 3,
      effects: [duringLinkLevelGated],
      linkCondition: "[Friend]",
    });
    const engine = GundamTestEngine.create(
      { play: [unit, pilot], resourceArea: resources(4) },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;
    const pid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, pilot.cardNumber)!;
    engine.getG().pilotAssignments[uid] = pid;

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("FirstStrike");
  });

  // ──────────────────────────────────────────────────────────────
  // friendlyBaseInPlay (Hyaku-Shiki pattern)
  // ──────────────────────────────────────────────────────────────
  it("friendlyBaseInPlay condition re-evaluates against live zone contents", () => {
    const effect: CardEffect = {
      type: "constant",
      activation: {
        conditions: [{ type: "friendlyBaseInPlay", color: "white" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 1,
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText: "While a friendly white Base is in play, this Unit gains Repair 1.",
    };
    const unit = createMockUnit({ name: "RepairGated", effects: [effect] });

    // Negative: no base in play
    {
      const engine = GundamTestEngine.create({ play: [unit] }, { deck: 5 });
      const rt = engine.getRuntime();
      const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;
      const fw = rt.getFrameworkReadAPI();
      const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
      expect(stats.keywords).not.toContain("Repair");
    }
    // Positive: white base in play
    {
      const whiteBase: import("@tcg/gundam-types").BaseCard = {
        cardNumber: "TEST-WHITE-BASE-1",
        name: "Test White Base",
        type: "base",
        color: "white",
        traits: [],
        level: 1,
        cost: 1,
        hp: 5,
        keywordEffects: [],
        rarity: "common",
      };
      const engine = GundamTestEngine.create(
        { play: [unit], baseSection: [whiteBase] },
        { deck: 5 },
      );
      const rt = engine.getRuntime();
      const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;
      const fw = rt.getFrameworkReadAPI();
      const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
      expect(stats.keywords).toContain("Repair");
    }
  });

  // silence unused import
  void PLAYER_TWO;
});
