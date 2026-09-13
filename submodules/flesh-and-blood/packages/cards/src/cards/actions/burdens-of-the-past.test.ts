import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { snatchRed } from "./snatch.ts";
import { burdensOfThePastBlue } from "./burdens-of-the-past.ts";

describe("Burdens of the Past (OUT187) AAA", () => {
  it("happy: 10+ defense reactions in the opposing graveyard draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [burdensOfThePastBlue],
        actionPoints: 1,
        deckTop: [sinkBelowRed],
      },
      {
        hero: bravo,
        hand: [],
        graveyard: Array.from({ length: 10 }, () => sinkBelowRed),
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(burdensOfThePastBlue);
    game.passBoth();
    Dash.target(game.as(bravo));
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, sinkBelowRed).toBeIn("hand");
    expectFabCard(Dash, burdensOfThePastBlue).toBeIn("graveyard");
  });

  it("happy: target hero can't play a defense reaction with the same name as a card in their graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [burdensOfThePastBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [sinkBelowRed],
        graveyard: [sinkBelowRed],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(burdensOfThePastBlue, { target: Bravo });
    game.untilIdle();
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();

    const inHand = Bravo.cardsIn("hand", sinkBelowRed)[0]!;
    expectFabUnplayable(() => Bravo.play(inHand), /restrict|defense reaction/i);
    expectFabCard(Bravo, inHand).toBeIn("hand");
  });

  it("boundary: fewer than 10 defense reactions draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [burdensOfThePastBlue],
        actionPoints: 1,
        deckTop: [sinkBelowRed],
      },
      { hero: bravo, hand: [], graveyard: [sinkBelowRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(burdensOfThePastBlue);
    game.passBoth();
    Dash.target(game.as(bravo));
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("deck")).toContain(sinkBelowRed.canonicalId);
  });

  it("timing: go again refunds the Action AP", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [burdensOfThePastBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(burdensOfThePastBlue);
    game.passBoth();
    Dash.target(game.as(bravo));
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
    expect(game.combat()).toBeNull();
  });
});
