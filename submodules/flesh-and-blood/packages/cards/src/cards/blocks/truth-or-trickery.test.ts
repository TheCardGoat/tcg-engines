import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectCombat,
  expectWait,
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
  it.each([
    ["red", "no", true],
    ["red", "yes", false],
    ["blue", "yes", true],
    ["blue", "no", false],
  ] as const)("choose %s and guess %s: discard only when wrong (%s)", (color, guess, wrong) => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [truthOrTrickeryYellow],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
        deckTop: [snatchRed], // explicitly red at the top
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);
    const heldCard = Kassai.cardIn("hand", nimblismBlue);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(truthOrTrickeryYellow);
    game.advanceToDecision(Dash, "boolean");
    // The defender knows the top card is red before choosing a color.
    Dash.accept();
    Dash.choose(color);
    game.advanceToDecision(Kassai, "effect-resolution");
    Kassai.choose(guess);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Kassai, heldCard).toBeIn(wrong ? "graveyard" : "hand");
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, Dash.cardIn("deck", snatchRed)).toBeIn("deck");
    expectCombat(game).toBeClosed();
    expectFabCard(Kassai, snatchRed).toBeIn("graveyard");
  });

  it("boundary: declining the look skips the guess and no card is discarded", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [truthOrTrickeryYellow],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
        deckTop: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);
    const heldCard = Kassai.cardIn("hand", nimblismBlue);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(truthOrTrickeryYellow);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Kassai, heldCard).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(19);
    expectWait(game).notToHaveDecision();
    expectCombat(game).toBeClosed();
  });
});
