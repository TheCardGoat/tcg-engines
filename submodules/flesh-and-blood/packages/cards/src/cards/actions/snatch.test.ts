import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";

describe("Snatch Red (WTR167) family behavior AAA", () => {
  it("happy: an unblocked hit draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deckTop: [autumnSTouchBlue],
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(bravo)).toHaveLife(16);
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });

  it("boundary: a fully defended attack does not draw a card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deckTop: [autumnSTouchBlue],
        deck: 6,
      },
      {
        hero: bravo,
        hand: [brutalAssaultBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.as(bravo).defendWith(brutalAssaultBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(bravo)).toHaveLife(20);
    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });

  it("regression: only the attacking Snatch triggers when another copy defends", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deckTop: [autumnSTouchBlue],
        deck: 6,
      },
      {
        hero: bravo,
        hand: [snatchRed],
        life: 20,
        deckTop: [autumnSTouchBlue],
        deck: 6,
      },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(18).toHaveHandCount(0);
    expectFabPlayer(Dash).toHaveHandCount(1);
  });
});
