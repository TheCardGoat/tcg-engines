import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabToken,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { beatTheSameDrumBlue } from "./beat-the-same-drum.ts";

/**
 * Beat the Same Drum (SUP219) — Generic Action, cost 0, 3{d}, Go again.
 *
 * Printed: If you've controlled an Agility token this turn, create an Agility
 * token, then repeat for Confidence, Might, Toughness, and Vigor.
 */

describe("Beat the Same Drum (SUP219) AAA", () => {
  it("after controlling an Agility this turn, creates Agility then Confidence, Might, Toughness, and Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [beatTheSameDrumBlue],
        arena: [fabToken("agility")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(beatTheSameDrumBlue);
    game.untilIdle();

    expectFabCard(Bravo, beatTheSameDrumBlue).toBeIn("graveyard");
    expectFabToken(game, "agility").toHaveCount(2);
    expectFabToken(game, "confidence").toHaveCount(1);
    expectFabToken(game, "might").toHaveCount(1);
    expectFabToken(game, "toughness").toHaveCount(1);
    expectFabToken(game, "vigor").toHaveCount(1);
  });

  it("boundary: without an Agility this turn, resolves without creating tokens", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [beatTheSameDrumBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(beatTheSameDrumBlue);
    game.untilIdle();

    expectFabCard(Bravo, beatTheSameDrumBlue).toBeIn("graveyard");
    expectFabToken(game, "agility").toHaveCount(0);
    expectFabToken(game, "might").toHaveCount(0);
  });

  it("timing: does not open combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [beatTheSameDrumBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).play(beatTheSameDrumBlue);
    game.untilIdle();
    expectCombat(game).toBeClosed();
  });
});
