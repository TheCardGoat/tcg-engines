import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { amuletOfIgnitionYellow } from "./amulet-of-ignition.ts";

/**
 * Amulet of Ignition (EVR179) — Generic Item, cost 0, Go again.
 *
 * Printed Instant: Destroy this: The next ability you activate this turn
 * costs {r} less. Activate only if you haven't played a card or activated an
 * ability this turn.
 */

describe("Amulet of Ignition (EVR179) AAA", () => {
  it("happy: if you haven't played or activated this turn, destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [amuletOfIgnitionYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(amuletOfIgnitionYellow);
    game.untilIdle();

    expectFabCard(Dash, amuletOfIgnitionYellow).toBeIn("graveyard");
  });

  it("boundary: cannot activate after playing a card this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [amuletOfIgnitionYellow],
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(nimblismBlue);
    game.untilIdle();
    Dash.expectActivationRejected(amuletOfIgnitionYellow);
    expectFabCard(Dash, amuletOfIgnitionYellow).toBeIn("arena");
  });

  it("timing: the Instant cannot activate from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [amuletOfIgnitionYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(amuletOfIgnitionYellow);
    expectFabCard(Dash, amuletOfIgnitionYellow).toBeIn("hand");
  });
});
