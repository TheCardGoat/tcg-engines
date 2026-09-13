import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { proclamationOfAbundance } from "./proclamation-of-abundance.ts";

/**
 * Proclamation of Abundance (JDG009) — Adjudicator Off-Hand.
 * Printed: "Action - {r}{r}{r}, destroy this: Each hero draws up to their {i}."
 */

describe("Proclamation of Abundance (JDG009) AAA", () => {
  it("happy: both heroes draw up to their intellect of 4", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [proclamationOfAbundance],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(proclamationOfAbundance);
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveHandCount(4);
    expectFabPlayer(game.as(dash)).toHaveHandCount(4);
    expectFabCard(Bravo, proclamationOfAbundance).toBeIn("graveyard");
  });

  it("boundary: a hero with fewer deck cards than intellect draws only what remains", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [proclamationOfAbundance],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 2, // fewer cards than intellect — "up to" clamps at 2
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(proclamationOfAbundance);
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveHandCount(2);
    expectFabPlayer(game.as(dash)).toHaveHandCount(4);
  });
});
