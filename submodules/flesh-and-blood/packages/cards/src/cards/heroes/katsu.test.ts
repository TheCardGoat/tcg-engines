import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { katsu } from "./katsu.ts";
import { harmonizedKodachi } from "../weapons/harmonized-kodachi.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { whelmingGustwaveRed } from "../actions/whelming-gustwave.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Katsu (KSU002).
 *
 * Printed: The first time an attack action card you control hits each turn,
 * you may discard a card with cost 0. If you do, search your deck for a card
 * with combo, banish it face up, then shuffle your deck. You may play it this
 * turn.
 */

const opponentHero = dash;

const comboDeck = [
  snatchRed,
  snatchRed,
  snatchRed,
  snatchRed,
  snatchRed,
  whelmingGustwaveRed, // top of deck — the only combo card
] as const;

describe("katsu (KSU002)", () => {
  it("core mechanic: first attack-action hit → discard cost-0 → tutor combo to banished", () => {
    // head-jab is a cost-0 attack with go again; snatch-red is the cost-0
    // discard payment.
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headJabRed, snatchRed],
        deck: [...comboDeck],
        actionPoints: 1,
        resourcePoints: 0,
      },
      { hero: opponentHero, hand: [], deck: 6 },
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(headJabRed);
    game.closeCombat({ optionals: "accept", entityTargets: "pause", ordering: "listed" });
    Katsu.targetRequired(Katsu.cardIn("deck", whelmingGustwaveRed));

    // The cost-0 card was discarded and the combo card banished.
    expectFabCard(Katsu, snatchRed).toBeIn("graveyard");
    expectFabCard(Katsu, whelmingGustwaveRed).toBeIn("banished");
  });

  it("core interaction: the tutored combo card may be played from banished this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headJabRed, snatchRed],
        deck: [...comboDeck],
        actionPoints: 2,
        resourcePoints: 0,
      },
      { hero: opponentHero, hand: [], deck: 6 },
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(headJabRed);
    game.closeCombat({ optionals: "accept", entityTargets: "pause", ordering: "listed" });
    Katsu.targetRequired(Katsu.cardIn("deck", whelmingGustwaveRed));
    expectFabCard(Katsu, whelmingGustwaveRed).toBeIn("banished");

    // The printed this-turn play permission: cast the combo from banished.
    if (!Katsu.hasPriority()) game.as(opponentHero).pass();
    Katsu.play(whelmingGustwaveRed, { from: "banished" });
    game.passBoth();

    // Head Jab (3) + the unblocked 3-power Gustwave resolved from banished.
    expectFabCard(Katsu, whelmingGustwaveRed).toBeIn("graveyard");
    expectFabPlayer(game.as(opponentHero)).toHaveLife(14);
  });

  it("boundary: a defended (missed) attack does not tutor a combo card", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headJabRed, snatchRed],
        deck: [...comboDeck],
        actionPoints: 1,
      },
      { hero: opponentHero, hand: [snatchRed], deck: 6 },
    );
    const Katsu = game.as(katsu);
    const Opponent = game.as(opponentHero);

    Katsu.playAttack(headJabRed);
    Opponent.defendWith(snatchRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Katsu.zone("deck")).toContain(whelmingGustwaveRed.canonicalId);
    expectFabCard(Katsu, snatchRed).toBeIn("hand");
    expect(Katsu.zone("banished")).not.toContain(whelmingGustwaveRed.canonicalId);
  });

  it("boundary: declining the optional cost-0 discard does not search or banish", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headJabRed, snatchRed],
        deck: [...comboDeck],
        actionPoints: 1,
      },
      { hero: opponentHero, hand: [], deck: 6 },
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(headJabRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Katsu.zone("hand")).toContain(snatchRed.canonicalId);
    expect(Katsu.zone("deck")).toContain(whelmingGustwaveRed.canonicalId);
    expect(Katsu.zone("banished")).not.toContain(whelmingGustwaveRed.canonicalId);
  });

  it("signature weapon: Harmonized Kodachi (KSU003) can attack for 1", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [harmonizedKodachi],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Katsu = game.as(katsu);

    Katsu.activate(harmonizedKodachi);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(1);
  });

  it("signature weapon: Kodachi attacks gain go again with a cost-0 card in pitch", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [harmonizedKodachi],
        pitch: [snatchRed], // cost-0 in pitch → enables go again
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Katsu = game.as(katsu);

    Katsu.activate(harmonizedKodachi);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveKeyword("go-again");
  });
});
