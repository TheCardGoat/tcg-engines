import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { dash } from "../heroes/dash.ts";
import { helmOfIsenSPeak } from "./helm-of-isen-s-peak.ts";

describe("Helm of Isen's Peak (BVO004) AAA", () => {
  it("happy: activate destroys self and grants +1{i} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        head: [helmOfIsenSPeak],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.activate(helmOfIsenSPeak);
    game.passBoth();

    // Helm destroyed
    expectFabCard(Bravo, helmOfIsenSPeak).toBeIn("graveyard");
    // Head slot empty
    expect(Bravo.zone("head")).toHaveLength(0);
  });

  it("boundary: 0 AP cannot activate (action ability costs 1 AP)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        head: [helmOfIsenSPeak],
        resourcePoints: 1,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    expect(() => Bravo.activate(helmOfIsenSPeak)).toThrow();
  });

  it("timing: +1{i} is this-turn duration — gone after end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        head: [helmOfIsenSPeak],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.activate(helmOfIsenSPeak);
    game.passBoth();

    // End turn — the +1{i} buff expires
    Bravo.endTurn();
    game.as(dash).endTurn();

    // Head slot remains empty (destroyed), intellect back to base
    expect(Bravo.zone("head")).toHaveLength(0);
  });
});
