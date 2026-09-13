import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { desiresOfFleshRed } from "./desires-of-flesh.ts";

/**
 * Desires of Flesh (MST118) — Assassin Action - Attack, cost 0, 3{p}/3{d}.
 * Printed: Stealth. When this hits a hero, banish the top card of their deck.
 * Whenever this banishes an attack action card, gain 1{h}.
 */

describe("Desires of Flesh (MST118) AAA", () => {
  it("happy: a hit that banishes an attack action card gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [desiresOfFleshRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [snatchRed], life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(desiresOfFleshRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabPlayer(Bravo).toHaveLife(21);
  });

  it("boundary: banishing a non-attack-action card does not gain life", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [desiresOfFleshRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [nimblismBlue], life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(desiresOfFleshRed);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, nimblismBlue).toBeBanished();
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: a miss does not banish the defending deck-top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [desiresOfFleshRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        deckTop: [snatchRed],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(desiresOfFleshRed);
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveLife(20);
    expect(Dash.zone("banished")).toHaveLength(0);
    expect(Dash.cardsIn("deck", snatchRed)).toHaveLength(1);
  });
});
