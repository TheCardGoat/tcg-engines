import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { spellbladeStrikeBlue } from "../actions/spellblade-strike.ts";
import { mordredTideRed } from "../actions/mordred-tide.ts";
import { crownOfDichotomy } from "./crown-of-dichotomy.ts";

/**
 * Crown of Dichotomy — Runeblade Head d0, Arcane Barrier 1.
 * Printed: "Action - {r}, destroy Crown of Dichotomy: Put target Runeblade
 * attack action card and target Runeblade non-attack action card from your
 * graveyard on top of your deck in any order."
 * With an empty deck, the end-phase draw up to Viserai's 4 intellect proves
 * both cards landed on top.
 */

describe("Crown of Dichotomy AAA", () => {
  it("happy: both graveyard targets land on top of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        head: [crownOfDichotomy],
        hand: [],
        graveyard: [spellbladeStrikeBlue, mordredTideRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 0,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.activate(crownOfDichotomy);
    game.untilIdle({ entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Viserai, crownOfDichotomy).toBeIn("graveyard");
    const strike = Viserai.cardIn("deck", spellbladeStrikeBlue);
    const tide = Viserai.cardIn("deck", mordredTideRed);
    expectFabCard(Viserai, strike).toBeIn("deck");
    expectFabCard(Viserai, tide).toBeIn("deck");

    // End-phase draw up to 4 intellect takes both cards off the top.
    Viserai.endTurn();
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(Viserai).toHaveHandCount(2);
    expectFabCard(Viserai, spellbladeStrikeBlue).toBeIn("hand");
    expectFabCard(Viserai, mordredTideRed).toBeIn("hand");
  });

  it("boundary: without a non-attack Runeblade in the graveyard the crown cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        head: [crownOfDichotomy],
        hand: [],
        graveyard: [spellbladeStrikeBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 0,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.expectActivationRejected(crownOfDichotomy);
    expectFabCard(Viserai, crownOfDichotomy).toBeIn("head");
  });
});
