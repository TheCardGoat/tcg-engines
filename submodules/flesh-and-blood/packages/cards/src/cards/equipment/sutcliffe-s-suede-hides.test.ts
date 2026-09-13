import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { sutcliffeSSuedeHides } from "./sutcliffe-s-suede-hides.ts";

/**
 * Sutcliffe's Suede Hides (ELE225) — Runeblade Equipment Legs.
 *
 * Printed AR: {r}, destroy this: Target attack action card gets go again.
 * Activate only if you've played a non-attack action card this turn.
 *
 * Snapdragon Scalers already proves destroy-self AR grant-go-again onto a chain
 * AAC. This trio proves the non-attack-this-turn activate gate and the AP refund.
 */

describe("Sutcliffe's Suede Hides (ELE225) AAA", () => {
  it("happy: after a non-attack action, destroy this so the AAC gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        legs: [sutcliffeSSuedeHides],
        hand: [tomeOfFyendalYellow, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(tomeOfFyendalYellow);
    game.untilIdle({ ordering: "listed" });
    Chane.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Chane.activate(sutcliffeSSuedeHides);
    game.passBoth();

    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Chane, sutcliffeSSuedeHides).toBeIn("graveyard");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Chane).toHaveAP(1);
  });

  it("boundary: without a non-attack action this turn the AR is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        legs: [sutcliffeSSuedeHides],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Chane.expectActivationRejected(sutcliffeSSuedeHides);
    expectCombat(game).notToHaveKeyword("go-again");
    expectFabCard(Chane, sutcliffeSSuedeHides).toBeIn("legs");
  });

  it("timing: the go again refunds AP after combat closes", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        legs: [sutcliffeSSuedeHides],
        hand: [tomeOfFyendalYellow, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(tomeOfFyendalYellow);
    game.untilIdle({ ordering: "listed" });
    Chane.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Chane.activate(sutcliffeSSuedeHides);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Chane, sutcliffeSSuedeHides).toBeIn("graveyard");
    expectFabPlayer(Chane).toHaveAP(1);
  });
});
