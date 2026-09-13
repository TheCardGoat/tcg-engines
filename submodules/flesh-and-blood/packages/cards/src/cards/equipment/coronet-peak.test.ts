import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { iyslander } from "../heroes/iyslander.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed, snatchYellow } from "../actions/snatch.ts";
import { coronetPeak } from "./coronet-peak.ts";

/**
 * Coronet Peak — Ice Head d2, Blade Break.
 * Printed: "Action - {r}{r}{r}: Target hero discards a card unless they pay
 * {r}. Blade Break"
 */

describe("Coronet Peak AAA", () => {
  it("happy: the target pays 1{r} and keeps their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        head: [coronetPeak],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchYellow], resourcePoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.activate(coronetPeak);
    Iyslander.target(dash);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Iyslander, coronetPeak).toBeIn("head");
    expectFabPlayer(Iyslander).toHaveResourceCount(0);
    expectFabPlayer(Dash).toHaveResourceCount(0);
    expectFabPlayer(Dash).toHaveHandCount(2);
  });

  it("boundary: a broke target discards instead", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        head: [coronetPeak],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchYellow], resourcePoints: 0, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.activate(coronetPeak);
    Iyslander.target(dash);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });
});
