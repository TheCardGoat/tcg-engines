import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { starlightRoadBlue } from "./starlight-road.ts";

/**
 * Starlight Road (OMN189) — Lightning Instant, cost 0.
 * Printed: "Create an Embodiment of Lightning or Lightning Flow token."
 */

describe("Starlight Road (OMN189) AAA", () => {
  it("happy: resolution tries to create the chosen lightning token", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [starlightRoadBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(starlightRoadBlue);
    game.passBoth();
    Briar.choose("embodiment-of-lightning");
    game.untilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 1);
    expectFabCard(Briar, starlightRoadBlue).toBeIn("graveyard");
  });

  it("boundary: the card is still an instant in hand until resolution succeeds", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [starlightRoadBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(starlightRoadBlue);
    expectFabCard(Briar, starlightRoadBlue).toBeIn("stack");
  });
});
