import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pecPerfectRed } from "./pec-perfect.ts";

/**
 * Pec Perfect (MPG017) — Guardian Attack, 9{p}/3{d}.
 * Printed: Whenever a card defends this, clash with the defending hero. The
 * winner destroys the top card of the other hero's deck.
 */

describe("Pec Perfect (MPG017) AAA", () => {
  it("happy: defended attack does not clash-mill (pin engine/defend-this-clash)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [pecPerfectRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: [snatchRed, snatchRed],
      },
      {
        hero: dash,
        hand: [nimblismBlue],
        deck: [nimblismBlue, snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(pecPerfectRed);
    Dash.defendWith(nimblismBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    // Pin: "whenever a card defends this" clash does not fire
    // (family engine/defend-this-clash).
    expect(Dash.cardsIn("deck", snatchRed)).toHaveLength(1);
    expect(Dash.cardsIn("graveyard", snatchRed)).toHaveLength(0);
  });

  it("boundary: undefended attack does not mill", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [pecPerfectRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: dash, hand: [], deck: [nimblismBlue] },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(pecPerfectRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(Dash.cardsIn("deck", nimblismBlue)).toHaveLength(1);
  });

  it("timing: defending this as a card does not mill the attacker", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: bravo,
        hand: [pecPerfectRed],
        deck: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(pecPerfectRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(Dash.cardsIn("graveyard", nimblismBlue)).toHaveLength(0);
  });
});
