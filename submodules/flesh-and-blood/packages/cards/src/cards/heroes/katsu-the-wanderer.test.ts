import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "./bravo.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { whelmingGustwaveRed } from "../actions/whelming-gustwave.ts";
import { snatchRed } from "../actions/snatch.ts";
import { katsuTheWanderer } from "./katsu-the-wanderer.ts";

/**
 * Katsu, the Wanderer (KSU001) — Ninja Hero, 40 life.
 * Printed: "The first time an attack action card you control hits each turn,
 * you may discard a card with cost 0. If you do, search your deck for a card
 * with combo, banish it face up, then shuffle your deck. You may play it this
 * turn."
 */

describe("Katsu, the Wanderer (KSU001) AAA", () => {
  it("happy: first AAC hit may discard cost 0 then banish a combo from deck", () => {
    const game = FabTestEngine.start(
      {
        hero: katsuTheWanderer,
        hand: [headJabRed, snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        actionPoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Katsu = game.as(katsuTheWanderer);

    Katsu.playAttack(headJabRed);
    game.closeCombat({ optionals: "accept", entityTargets: "pause", ordering: "listed" });
    Katsu.targetRequired(Katsu.cardIn("deck", whelmingGustwaveRed));

    expectFabCard(Katsu, whelmingGustwaveRed).toBeIn("banished");
    expectFabCard(Katsu, snatchRed).toBeIn("graveyard");
  });

  it("boundary: a miss does not tutor a combo card", () => {
    const game = FabTestEngine.start(
      {
        hero: katsuTheWanderer,
        hand: [headJabRed, snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        actionPoints: 1,
      },
      { hero: bravo, hand: [brutalAssaultBlue], deck: 6 },
    );
    const Katsu = game.as(katsuTheWanderer);
    const Bravo = game.as(bravo);

    Katsu.playAttack(headJabRed);
    Bravo.defendWith(brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Katsu.zone("deck")).toContain(whelmingGustwaveRed.canonicalId);
    expectFabCard(Katsu, snatchRed).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: declining the first-hit optional leaves combo in deck", () => {
    const game = FabTestEngine.start(
      {
        hero: katsuTheWanderer,
        hand: [headJabRed, snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        actionPoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Katsu = game.as(katsuTheWanderer);

    expectFabPlayer(Katsu).toHaveLife(40);
    Katsu.playAttack(headJabRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Katsu.zone("deck")).toContain(whelmingGustwaveRed.canonicalId);
    expectFabCard(Katsu, snatchRed).toBeIn("hand");
  });
});
