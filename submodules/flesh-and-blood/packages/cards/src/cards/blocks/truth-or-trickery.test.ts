import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { truthOrTrickeryYellow } from "./truth-or-trickery.ts";

/**
 * Truth or Trickery (SUP077) — Reviled Guardian Block, 3{d}.
 *
 * Printed: "When this defends, you may look at the top card of your deck and
 * choose a color. If you do, the attacking hero guesses if that card is the
 * chosen color, then they look at it. If they guessed wrong, they discard a
 * card."
 */

describe("Truth or Trickery (SUP077) AAA", () => {
  it("happy: a wrong guess makes the attacking hero discard a card", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [truthOrTrickeryYellow],
        life: 20,
        deckTop: [snatchRed], // top card is red
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(truthOrTrickeryYellow);
    game.passBoth(); // resolve the defend trigger up to the look optional
    // Dash accepts the look, chooses Red; Kassai guesses "no" — wrong.
    Dash.accept();
    Dash.choose("red");
    Kassai.choose("no"); // guessed wrong on purpose
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Kassai, nimblismBlue).toBeIn("graveyard"); // the wrong-guess discard
    expectFabCard(Kassai, snatchRed).toBeIn("graveyard");
  });

  it("boundary: declining the look skips the guess and no card is discarded", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [truthOrTrickeryYellow],
        life: 20,
        deckTop: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(truthOrTrickeryYellow);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Kassai, nimblismBlue).toBeIn("hand"); // nothing was discarded
  });
});
