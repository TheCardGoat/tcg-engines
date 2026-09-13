import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { regrowthShockBlue } from "./regrowth-shock.ts";

/**
 * Regrowth Shock Blue (ROS253) — Earth Runeblade Action. Meld. Go again.
 *
 * Printed: Return an attack action card with cost less than X from your
 * graveyard to your hand, where X is the total arcane damage you've dealt
 * to opposing heroes this turn.
 * (Meld back face out of single-card scope here.)
 */

describe("Regrowth Shock (ROS253) AAA", () => {
  it("boundary: with no arcane damage this turn (X=0) nothing is returnable and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [regrowthShockBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(regrowthShockBlue, { playMethod: { kind: "face", face: "left" } });
    game.helpers.resolveUntilIdle();

    // X = 0: no attack action card has cost < 0, so the card just resolves.
    expectFabPlayer(Briar).toHaveAP(1); // go again
    expectFabCard(Briar, regrowthShockBlue).toBeIn("graveyard");
  });
});
