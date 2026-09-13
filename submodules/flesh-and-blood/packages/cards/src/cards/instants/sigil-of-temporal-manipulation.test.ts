import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { sigilOfFyendalBlue } from "../actions/sigil-of-fyendal.ts";
import { sigilOfTemporalManipulationBlue } from "./sigil-of-temporal-manipulation.ts";

/**
 * Sigil of Temporal Manipulation (ROS182) — Wizard Instant Aura.
 *
 * Printed: At the beginning of your action phase, destroy this.
 * When this leaves the arena, banish the top card of your deck. If it's a
 * non-attack action card, you may play it this turn as though it were an instant.
 */

const endPhaseDraw = [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue] as const;

describe("Sigil of Temporal Manipulation (ROS182) AAA", () => {
  it("happy: leaving the arena banishes a non-attack action that may be played this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [sigilOfTemporalManipulationBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [sigilOfFyendalBlue, ...endPhaseDraw],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.play(sigilOfTemporalManipulationBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Iyslander, sigilOfTemporalManipulationBlue).toBeIn("arena");

    Iyslander.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Iyslander, sigilOfTemporalManipulationBlue).toBeIn("graveyard");
    expectFabCard(Iyslander, sigilOfFyendalBlue).toBeBanished();
    Iyslander.play(sigilOfFyendalBlue, { from: "banished" });
    game.helpers.resolveUntilIdle();
    expectFabCard(Iyslander, sigilOfFyendalBlue).toBeIn("arena");
  });

  it("boundary: a banished attack action is not granted an Instant play", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [sigilOfTemporalManipulationBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed, ...endPhaseDraw],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.play(sigilOfTemporalManipulationBlue);
    game.helpers.resolveUntilIdle();
    Iyslander.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Iyslander, snatchRed).toBeBanished();
  });

  it("timing: declining the optional play leaves the banished non-attack in banished", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [sigilOfTemporalManipulationBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [sigilOfFyendalBlue, ...endPhaseDraw],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.play(sigilOfTemporalManipulationBlue);
    game.helpers.resolveUntilIdle();
    Iyslander.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Iyslander, sigilOfFyendalBlue).toBeBanished();
  });
});
