import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { liarSCharmYellow } from "./liar-s-charm.ts";

/**
 * Liar's Charm, Yellow (SUP076) — Reviled/Brute Instant. Yellow entry.
 * Printed: "Choose any number;
 * - Steal a Toughness or Vigor token.
 * - The crowd boos you.
 * - Target hero loses and can't gain abilities this action phase unless they
 *   discard a card."
 * The any-number modal declares modes at play time; choosing zero is legal
 * and the steal redirect moves the token to Bravo's side of the table.
 */

describe("Liar's Charm, Yellow (SUP076) AAA", () => {
  it("happy: the steal mode moves an opposing Vigor token to Bravo", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [liarSCharmYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arena: [fabToken("vigor")], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(liarSCharmYellow, { modeIndexes: [0] });
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: "token:vigor",
    });

    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 1);
    expect(Dash.zone("arena")).toHaveLength(0);
  });

  it("happy: the boo mode boos Bravo's own crowd", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [liarSCharmYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(liarSCharmYellow, { modeIndexes: [1] });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveCrowdBooedThisTurn();
  });

  it("boundary: choosing no modes is legal and changes nothing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [liarSCharmYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arena: [fabToken("vigor")], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(liarSCharmYellow, { modeIndexes: [] });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).notToHaveCrowdBooedThisTurn();
    expect(Dash.zone("arena")).toHaveLength(1); // token stays with Dash
  });
});
