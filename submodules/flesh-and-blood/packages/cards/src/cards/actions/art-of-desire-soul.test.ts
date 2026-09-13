import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue, headShotYellow } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { artOfDesireSoulYellow } from "./art-of-desire-soul.ts";

/**
 * Art of Desire: Soul (MST107) — Assassin Action - Attack, cost 0, 2{p}/3{d}.
 * Printed: Stealth. When this hits a hero, banish the top card of their deck.
 * Whenever this banishes a yellow card, draw a card and gain 1{h}.
 */

describe("Art of Desire: Soul (MST107) AAA", () => {
  it("happy: a hit that banishes a yellow card draws and gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [artOfDesireSoulYellow],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [headShotYellow], life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(artOfDesireSoulYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, headShotYellow).toBeBanished();
    expectFabPlayer(Bravo).toHaveLife(21);
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });

  it("boundary: banishing a non-yellow card does not draw or gain life", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [artOfDesireSoulYellow],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [snatchRed], life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(artOfDesireSoulYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveHandCount(0);
  });

  it("timing: a miss does not banish the defending deck-top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [artOfDesireSoulYellow],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        deckTop: [headShotYellow],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(artOfDesireSoulYellow);
    Dash.defendWith(brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveLife(20);
    expect(Dash.zone("banished")).toHaveLength(0);
    expect(Dash.cardsIn("deck", headShotYellow)).toHaveLength(1);
  });
});
