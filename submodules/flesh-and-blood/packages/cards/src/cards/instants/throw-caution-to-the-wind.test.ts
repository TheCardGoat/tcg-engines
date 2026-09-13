import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { throwCautionToTheWindBlue } from "./throw-caution-to-the-wind.ts";

/**
 * Throw Caution to the Wind (SEA150) — Pirate Instant.
 *
 * Printed:
 *   Reveal the top card of your deck. The next time you would be dealt damage
 *   this turn, prevent X of that damage, where X is the pitch value of the
 *   card revealed this way.
 */

describe("Throw Caution to the Wind (SEA150) AAA", () => {
  it("happy: revealing a blue card prevents 3 of the next damage this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: gravyBones,
        hand: [throwCautionToTheWindBlue],
        deck: 6,
        deckTop: [brutalAssaultBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Gravy.play(throwCautionToTheWindBlue);
    game.passBoth();
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    // Reveal leaves the card on top; Snatch 4{p} prevent 3 → 1 damage.
    expect(Gravy.cardsIn("deck", brutalAssaultBlue)).toHaveLength(1);
    expectFabPlayer(Gravy).toHaveLife(19);
  });

  it("boundary: revealing a red card prevents only 1 of the next damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, resourcePoints: 2, deck: 6 },
      {
        hero: gravyBones,
        hand: [throwCautionToTheWindBlue],
        deck: 6,
        deckTop: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    Gravy.play(throwCautionToTheWindBlue);
    game.passBoth();
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    // Brutal Assault 4{p} prevent 1 → 3 damage.
    expectFabPlayer(Gravy).toHaveLife(17);
  });

  it("timing: only the next damage this turn is prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: gravyBones,
        hand: [throwCautionToTheWindBlue],
        deck: 6,
        deckTop: [brutalAssaultBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Gravy.play(throwCautionToTheWindBlue);
    game.passBoth();
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(Gravy).toHaveLife(19);

    Dash.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });
    // Second Snatch is unprevented: 19 - 4 = 15.
    expectFabPlayer(Gravy).toHaveLife(15);
  });
});
