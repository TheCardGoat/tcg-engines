import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { cheaterSCharmYellow } from "./cheater-s-charm.ts";

/**
 * Cheater's Charm, Yellow (SUP068) — Reviled/Brute Instant. Yellow entry;
 * SUP076 Liar's Charm shares the printed modal.
 * Printed: "Choose any number;
 * - Steal a Confidence or Toughness token.
 * - The crowd boos you.
 * - If you control an attack with 6 or more {p}, deal 2 damage to target hero
 *   unless they discard a card."
 * Modal modes declare at play time via modeIndexes; "any number" includes
 * zero, and a chosen mode whose condition is false resolves without effect.
 */

describe("Cheater's Charm, Yellow (SUP068) AAA", () => {
  it("happy: the steal mode moves an opposing Confidence token to Bravo", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cheaterSCharmYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [fabToken("confidence")], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(cheaterSCharmYellow, { modeIndexes: [0] });
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: "token:confidence",
    });

    expectFabPlayer(Bravo).toHaveTokenCount("confidence", 1);
    expect(Dash.zone("arena")).toHaveLength(0);
  });

  it("happy: the boo mode boos Bravo's own crowd", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cheaterSCharmYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(cheaterSCharmYellow, { modeIndexes: [1] });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveCrowdBooedThisTurn();
  });

  it("boundary: choosing no modes is legal and changes nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cheaterSCharmYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [fabToken("confidence")], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(cheaterSCharmYellow, { modeIndexes: [] });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).notToHaveCrowdBooedThisTurn();
    expect(Dash.zone("arena")).toHaveLength(1); // token stays with Dash
  });

  it("boundary: the 6{p}-attack mode with no attack resolves without damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cheaterSCharmYellow], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).play(cheaterSCharmYellow, { modeIndexes: [2] });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20); // condition false, no damage
  });
});
