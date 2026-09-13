import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { tensionInTheAirRed } from "../instants/tension-in-the-air.ts";
import { fullOfBravadoRed } from "./full-of-bravado.ts";

/**
 * Full of Bravado (SUP178) — When this attacks or defends, if you control an aura of suspense, create a Confidence token.
 */

describe("Full of Bravado family AAA", () => {
  it("happy: attacking while controlling an aura of suspense creates a Confidence", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [fullOfBravadoRed],
        arena: [tensionInTheAirRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(fullOfBravadoRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("confidence", 1);
  });

  it("boundary: attacking with no aura of suspense creates no Confidence", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [fullOfBravadoRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(fullOfBravadoRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("confidence", 0);
  });

  it("timing: Confidence exists at on-attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [fullOfBravadoRed],
        arena: [tensionInTheAirRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(fullOfBravadoRed, { stopAt: "on-attack" });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveTokenCount("confidence", 1);
  });
});
