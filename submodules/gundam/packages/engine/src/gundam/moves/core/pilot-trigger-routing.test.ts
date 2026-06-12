/**
 * Pilot-resident trigger routing (rule 3-3-9-1).
 *
 * Rule 3-3-9-1: the text printed above a pilot's card name belongs to
 * the pilot card itself. Triggered effects printed on a pilot card —
 * e.g. 【When Paired】, 【When Linked】, 【Attack】 — must therefore fire
 * off the pilot's own card definition when the corresponding event
 * happens, not only off the unit the pilot is paired with.
 *
 * Pre-fix `executePilotPairing` only enqueued the unit's own triggered
 * effects, so pilot-printed 【When Paired】 / 【When Linked】 silently
 * never fired. Observer scanning in attack-step already iterates every
 * battleArea card, which correctly includes paired pilots, so the
 * 【Attack】 case is covered end-to-end once the paired pilot is in the
 * battle area.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  createMockPilot,
  createMockResource,
} from "../../index.ts";
import type { TestCardEntry } from "../../testing/test-engine.ts";

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => ({
    card: createMockResource(),
    exhausted: false,
  }));
}

const pilotWhenPairedDraw: CardEffect = {
  type: "triggered",
  activation: { timing: ["whenPaired"] },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText: "【When Paired】 Draw 1.",
};

const pilotWhenLinkedDraw: CardEffect = {
  type: "triggered",
  activation: { timing: ["whenLinked"] },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText: "【When Linked】 Draw 1.",
};

const pilotAttackDraw: CardEffect = {
  type: "triggered",
  activation: { timing: ["attack"] },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText: "【Attack】 Draw 1.",
};

describe("Pilot-resident trigger routing (rule 3-3-9-1)", () => {
  it("fires a pilot's own 【When Paired】 trigger when the pilot is paired", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const pilot = createMockPilot({
      name: "Any Pilot",
      level: 1,
      cost: 1,
      effects: [pilotWhenPairedDraw],
    } as unknown as Parameters<typeof createMockPilot>[0]);

    const engine = GundamTestEngine.create(
      { hand: [unit, pilot], resourceArea: resources(5), deck: 10 },
      {},
    );
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(pilot, unit));

    // Pilot-printed 【When Paired】 fired → 1 card drawn.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before - 1);
  });

  it("fires a pilot's own 【When Linked】 trigger only on a link pairing", () => {
    // Non-link pairing: unit has no linkCondition, so pilot's whenLinked
    // must NOT fire (reuse of PR #95's isLink gating).
    const nonLinkUnit = createMockUnit({ level: 1, cost: 1 });
    const nonLinkPilot = createMockPilot({
      name: "Any Pilot",
      level: 1,
      cost: 1,
      effects: [pilotWhenLinkedDraw],
    } as unknown as Parameters<typeof createMockPilot>[0]);

    const nonLinkEngine = GundamTestEngine.create(
      { hand: [nonLinkUnit, nonLinkPilot], resourceArea: resources(5), deck: 10 },
      {},
    );
    const nonLinkBefore = nonLinkEngine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const p1a = nonLinkEngine.asPlayer(PLAYER_ONE);
    expectSuccess(p1a.deployUnit(nonLinkUnit));
    expectSuccess(p1a.assignPilot(nonLinkPilot, nonLinkUnit));
    expect(nonLinkEngine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(nonLinkBefore);

    // Link pairing: unit's linkCondition names the pilot → whenLinked fires.
    const linkUnit = createMockUnit({
      level: 1,
      cost: 1,
      linkCondition: "[Amuro Ray]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const linkPilot = createMockPilot({
      name: "Amuro Ray",
      level: 1,
      cost: 1,
      effects: [pilotWhenLinkedDraw],
    } as unknown as Parameters<typeof createMockPilot>[0]);

    const linkEngine = GundamTestEngine.create(
      { hand: [linkUnit, linkPilot], resourceArea: resources(5), deck: 10 },
      {},
    );
    const linkBefore = linkEngine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const p1b = linkEngine.asPlayer(PLAYER_ONE);
    expectSuccess(p1b.deployUnit(linkUnit));
    expectSuccess(p1b.assignPilot(linkPilot, linkUnit));
    expect(linkEngine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(linkBefore - 1);
  });

  it("fires a pilot's 【Attack】 setActive → refreshes a rested friendly Resource", () => {
    // Regression for beta.md §4: the target-DSL + executor must surface
    // resource-zone candidates to a filter `{ cardType: "resource" }`.
    // Pre-fix the setActive directive fired with zero candidates.
    const pilotAttackSetActive: CardEffect = {
      type: "triggered",
      activation: { timing: ["attack"] },
      directives: [
        {
          action: {
            action: "setActive",
            target: { owner: "friendly", cardType: "resource", count: 1 },
          },
        },
      ],
      sourceText: "【Attack】 Choose 1 of your Resources. Set it as active.",
    };
    const unit = createMockUnit({
      ap: 2,
      hp: 5,
      level: 1,
      cost: 1,
      linkCondition: "[Amuro Ray]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const pilot = createMockPilot({
      name: "Amuro Ray",
      level: 1,
      cost: 1,
      effects: [pilotAttackSetActive],
    } as unknown as Parameters<typeof createMockPilot>[0]);
    const defender = createMockUnit({ ap: 1, hp: 5 });

    // Pre-exhaust one resource so setActive has something to refresh.
    const restedRes = createMockResource();
    const engine = GundamTestEngine.create(
      {
        hand: [unit, pilot],
        resourceArea: [...resources(4), { card: restedRes, exhausted: true }],
        deck: 10,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(pilot, unit));

    // Locate the rested resource after the pair has been set up.
    const resourceIds = p1.getCardsInZone("resourceArea");
    const restedId = resourceIds.find((id) => engine.getG().exhausted[id] === true);
    if (!restedId) throw new Error("setup: no rested resource");

    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(unit, defenderId));

    // setActive drained on the attack observer scan → resource is active.
    expect(engine.getG().exhausted[restedId]).toBe(false);
  });

  it("fires a pilot's own 【Attack】 trigger when the paired unit attacks", () => {
    // Use a linkCondition the pilot satisfies so the paired unit gains
    // attack-on-deploy (rule 3-2-6-3) — the attack trigger case only cares
    // about the observer scan finding the paired pilot in the battle area.
    const unit = createMockUnit({
      ap: 2,
      hp: 5,
      level: 1,
      cost: 1,
      linkCondition: "[Amuro Ray]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const pilot = createMockPilot({
      name: "Amuro Ray",
      level: 1,
      cost: 1,
      effects: [pilotAttackDraw],
    } as unknown as Parameters<typeof createMockPilot>[0]);
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      { hand: [unit, pilot], resourceArea: resources(5), deck: 10 },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(pilot, unit));

    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.enterBattle(unit, defenderId));

    // Pilot's 【Attack】 fired via observer scan → 1 card drawn.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before - 1);
  });
});
