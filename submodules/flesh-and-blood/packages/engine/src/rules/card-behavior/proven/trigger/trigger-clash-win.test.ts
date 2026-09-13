/**
 * AAA test for trigger:clash-win.
 * Representative card: Unexpected Backhand Red (SUP161) — Brute Attack.
 * Triggered ability: "When you win a clash revealing this, deal 1 damage to
 * the other hero." (CR 8.5.45)
 *
 * Setup: Dash defends with Stonewall Impasse (which fires a clash on defend).
 * Unexpected Backhand (power 7) is on top of Dash's deck and is revealed
 * during the clash. Dash wins the clash, firing Unexpected Backhand's
 * clash-win trigger which deals 1 damage to Bravo.
 */
import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "../../../../testing/index.ts";
import { bravo, dash, nimblismBlue, snatchRed, stonewallImpasse } from "../../../fixtures.ts";
import { unexpectedBackhandRed } from "../../../../../../cards/src/cards/actions/unexpected-backhand.ts";
import { wreckerRompRed } from "../../../../../../cards/src/cards/actions/wrecker-romp.ts";

describe("trigger: clash-win", () => {
  it("AAA — Unexpected Backhand revealed in a won clash deals 1 damage to opponent", () => {
    // Arrange — Bravo attacks with Snatch (power 4). Dash defends with
    // Stonewall Impasse, whose defend trigger fires a clash. Unexpected
    // Backhand (power 7) tops Dash's deck; Nimblism (power 0) tops Bravo's.
    // Dash wins the clash, revealing Unexpected Backhand, whose clash-win
    // trigger deals 1 damage to Bravo.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        hand: [snatchRed],
        deck: [snatchRed, nimblismBlue],
        intellect: 0,
      },
      {
        hero: dash,
        life: 20,
        arms: [stonewallImpasse],
        deck: [nimblismBlue, unexpectedBackhandRed],
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    Dash.defendWith(stonewallImpasse);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(game.getState().lastClashWinnerId).toBe(Dash.id);
    expect(Dash.zone("deck")).toContain(unexpectedBackhandRed.canonicalId);
    expect(
      game
        .committedEvents()
        .some(
          (event) =>
            event.name === "dealt-damage" &&
            event.data.amount === 1 &&
            event.data.damageType === "generic",
        ),
    ).toBe(true);
  });

  it("AAA — Unexpected Backhand revealed in a lost clash does not deal damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        hand: [snatchRed],
        deck: [wreckerRompRed],
        intellect: 0,
      },
      {
        hero: dash,
        life: 20,
        arms: [stonewallImpasse],
        deck: [unexpectedBackhandRed],
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    Dash.defendWith(stonewallImpasse);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(game.getState().lastClashWinnerId).toBe(Bravo.id);
    expect(
      game
        .committedEvents()
        .some(
          (event) =>
            event.name === "dealt-damage" &&
            event.data.amount === 1 &&
            event.data.damageType === "generic",
        ),
    ).toBe(false);
  });
});
