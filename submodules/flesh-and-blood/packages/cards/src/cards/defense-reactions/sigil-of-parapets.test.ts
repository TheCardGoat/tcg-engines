import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
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
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [sigilOfParapetsBlue, tomeOfQuandariesBlue],
        resourcePoints: 4,
        life: 20,
        deck: 6,
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
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Blaze, sigilOfParapetsBlue).toHaveDefense(4);
    expectFabPlayer(Blaze).toHaveLife(20);
  });

  it("boundary: defending without a Wizard play stays 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: blazeFiremind, hand: [sigilOfParapetsBlue], resourcePoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    game.as(blazeFiremind).must.playReaction(sigilOfParapetsBlue);
    game.passBoth();

    expectFabCard(game.as(blazeFiremind), sigilOfParapetsBlue).toHaveDefense(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(blazeFiremind)).toHaveLife(18);
  });

  it("timing: a Wizard play that is not while this is defending does not buff this", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [tomeOfQuandariesBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [sigilOfParapetsBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(blazeFiremind).play(tomeOfQuandariesBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(game.as(dash), sigilOfParapetsBlue).toHaveDefense(2);
  });
});
