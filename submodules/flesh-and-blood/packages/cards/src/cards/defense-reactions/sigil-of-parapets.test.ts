import { nimblismBlue } from "../actions/nimblism.ts";
import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tomeOfQuandariesBlue } from "../instants/tome-of-quandaries.ts";
import { sigilOfParapetsBlue } from "./sigil-of-parapets.ts";

/**
 * Sigil of Parapets (EVR122) — Wizard Defense Reaction, 2{d}.
 * Printed: While this is defending, whenever you play a Wizard card, this
 * gets +2{d}.
 */

describe("Sigil of Parapets (EVR122) AAA", () => {
  it("happy: playing a Wizard card while this defends grants +2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: blazeFiremind,
        hand: [sigilOfParapetsBlue, tomeOfQuandariesBlue],
        resourcePoints: 4,
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    // The Sigil must resolve onto the chain first so the Wizard play happens
    // "while this is defending".
    Blaze.must.playReaction(sigilOfParapetsBlue);
    game.passBoth();
    Dash.pass();
    Blaze.play(tomeOfQuandariesBlue);
    // Resolve the Wizard-play trigger while the instant is still on the stack.
    game.passBoth();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Blaze, sigilOfParapetsBlue).toHaveDefense(4);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Blaze).toHaveTokenCount("ponder", 2);
    expectFabPlayer(Blaze).toHaveLife(20);
    expectFabCard(Blaze, sigilOfParapetsBlue).toBeIn("graveyard").toHaveDefense(2);
    expectCombat(game).toBeClosed();
  });

  it("boundary: defending without a Wizard play stays 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: blazeFiremind,
        hand: [sigilOfParapetsBlue],
        resourcePoints: 1,
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    game.as(blazeFiremind).must.playReaction(sigilOfParapetsBlue);
    game.passBoth();

    expectFabCard(game.as(blazeFiremind), sigilOfParapetsBlue).toHaveDefense(2);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(game.as(blazeFiremind)).toHaveLife(18);
    expectFabCard(game.as(blazeFiremind), sigilOfParapetsBlue).toBeIn("graveyard").toHaveDefense(2);
  });

  it("timing: a Wizard play that is not while this is defending does not buff this", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [tomeOfQuandariesBlue, sigilOfParapetsBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );

    game.as(blazeFiremind).play(tomeOfQuandariesBlue);
    game.untilIdle({ optionals: "throw" });

    expectFabCard(game.as(blazeFiremind), sigilOfParapetsBlue).toBeIn("hand").toHaveDefense(2);
    expectFabPlayer(game.as(blazeFiremind)).toHaveTokenCount("ponder", 2);
    expectWait(game).notToHaveDecision();
  });
});
