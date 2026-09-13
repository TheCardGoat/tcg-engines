import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { briar } from "../heroes/briar.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { anthemOfSpringBlue } from "./anthem-of-spring.ts";

/**
 * Anthem of Spring, Blue (DTD196) — Earth Action, 2{d}.
 * Printed: Briar Specialization. The next attack action card you play this
 * turn gets +1{p}. Go again. Unity — When this defends together with a card
 * from hand, create an Embodiment of Earth token under any number of heroes'
 * control.
 */

describe("Anthem of Spring (DTD196) AAA", () => {
  it("happy: next attack action card this turn gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [anthemOfSpringBlue, brutalAssaultBlue],
        deck: 6,
        resourcePoints: 2,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(anthemOfSpringBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Briar.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: defending alone does not create Embodiment of Earth", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: briar, hand: [anthemOfSpringBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    game.as(bravo).playAttack(snatchRed);
    Briar.defendWith(anthemOfSpringBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 0);
    expectFabPlayer(Briar).toHaveLife(18);
  });

  it("timing: defending together with a hand card creates Embodiment of Earth", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: briar,
        hand: [anthemOfSpringBlue, brutalAssaultBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    game.as(bravo).playAttack(snatchRed);
    Briar.defendWith(anthemOfSpringBlue, brutalAssaultBlue);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1);
  });
});
