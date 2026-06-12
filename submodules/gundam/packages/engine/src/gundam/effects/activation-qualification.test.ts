/**
 * Activation qualification gating for triggered effects
 * (rules 3-2-5 Pairing, 3-2-6 Link Conditions, 10-2-1).
 *
 * `CardEffect.activation.qualification` is an AttributeFilter that
 * predicates a `whenPaired` / `whenLinked` trigger on the pilot card's
 * attributes (trait, color, level, etc.). The trigger-enqueue helpers in
 * `pending-effects.ts` must evaluate this predicate before enqueuing, or
 * the effect fires against every pilot — silently ignoring the printed
 * qualifier (e.g. "【When Paired･(White Base Team) Pilot】").
 *
 * Covers positive + negative cases for:
 *   - whenPaired (Gundam MA Form — ST01-002 shape: trait qualification)
 *   - whenLinked (observer-registered unit with a link condition met)
 *   - numeric qualification (level comparison via gd02/003-gundam-mk-ii-titans shape)
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
} from "../../index.ts";

function makeWhenPairedTraitDrawUnit(trait: string): UnitCard {
  return {
    cardNumber: "TEST-Q1",
    name: "Qualification Test Unit (whenPaired trait)",
    type: "unit",
    color: "blue",
    traits: ["earth federation"],
    level: 3,
    cost: 2,
    ap: 2,
    hp: 3,
    effect: `【When Paired･(${trait}) Pilot】Draw 1.`,
    effects: [
      {
        type: "triggered",
        activation: {
          timing: ["whenPaired"],
          qualification: { attribute: "trait", comparison: "includes", value: trait },
        },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: `【When Paired･(${trait}) Pilot】Draw 1.`,
      },
    ] as CardEffect[],
    keywordEffects: [],
    rarity: "common",
  };
}

function makeWhenLinkedLevelDrawUnit(maxLevel: number): UnitCard {
  return {
    cardNumber: "TEST-Q2",
    name: "Qualification Test Unit (whenLinked level)",
    type: "unit",
    color: "blue",
    traits: ["earth federation"],
    level: 3,
    cost: 2,
    ap: 2,
    hp: 3,
    // Bracketed link condition matched by pilot name contains "Pilot".
    linkCondition: "[Pilot]",
    effect: `【When Linked】If the paired pilot has Lv.${maxLevel} or lower, draw 1.`,
    effects: [
      {
        type: "triggered",
        activation: {
          timing: ["whenLinked"],
          qualification: { attribute: "level", comparison: "lte", value: maxLevel },
        },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: "【When Linked】Draw 1.",
      },
    ] as CardEffect[],
    keywordEffects: [],
    rarity: "common",
  };
}

describe("activation.qualification — whenPaired (trait predicate)", () => {
  it("fires when the paired pilot has the required trait", () => {
    const unit = makeWhenPairedTraitDrawUnit("white base team");
    const pilot = createMockPilot({
      traits: ["earth federation", "white base team"],
      level: 1,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [unit],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckKey = `deck:${PLAYER_ONE}`;
    const deckBefore = engine.getState().ctx.zones.private.zoneCards[deckKey]!.length;

    expectSuccess(p1.assignPilot(pilot, unit));

    const deckAfter = engine.getState().ctx.zones.private.zoneCards[deckKey]!.length;
    expect(deckAfter).toBe(deckBefore - 1);
  });

  it("does NOT fire when the paired pilot lacks the required trait", () => {
    const unit = makeWhenPairedTraitDrawUnit("white base team");
    const pilot = createMockPilot({
      // Same unit-link trait so pairing is legal, but no "white base team"
      // → qualification should fail and the draw should be skipped.
      traits: ["earth federation"],
      level: 1,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [unit],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckKey = `deck:${PLAYER_ONE}`;
    const deckBefore = engine.getState().ctx.zones.private.zoneCards[deckKey]!.length;

    expectSuccess(p1.assignPilot(pilot, unit));

    const deckAfter = engine.getState().ctx.zones.private.zoneCards[deckKey]!.length;
    expect(deckAfter).toBe(deckBefore);
  });
});

describe("activation.qualification — whenLinked (numeric predicate)", () => {
  it("fires when the paired pilot meets the numeric qualification", () => {
    const unit = makeWhenLinkedLevelDrawUnit(3);
    const pilot = createMockPilot({
      traits: ["earth federation"],
      level: 2,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [unit],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckKey = `deck:${PLAYER_ONE}`;
    const deckBefore = engine.getState().ctx.zones.private.zoneCards[deckKey]!.length;

    expectSuccess(p1.assignPilot(pilot, unit));

    const deckAfter = engine.getState().ctx.zones.private.zoneCards[deckKey]!.length;
    expect(deckAfter).toBe(deckBefore - 1);
  });

  it("does NOT fire when the paired pilot fails the numeric qualification", () => {
    const unit = makeWhenLinkedLevelDrawUnit(3);
    const pilot = createMockPilot({
      traits: ["earth federation"],
      level: 5,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [unit],
      resourceArea: activeResources(5),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckKey = `deck:${PLAYER_ONE}`;
    const deckBefore = engine.getState().ctx.zones.private.zoneCards[deckKey]!.length;

    expectSuccess(p1.assignPilot(pilot, unit));

    const deckAfter = engine.getState().ctx.zones.private.zoneCards[deckKey]!.length;
    expect(deckAfter).toBe(deckBefore);
  });
});
