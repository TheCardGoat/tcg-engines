import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { gazeTheAgesBlue } from "./gaze-the-ages.ts";
import { zapRed } from "./zap.ts";

/**
 * Gaze the Ages Blue (CRU163) — Wizard Action.
 *
 * Printed: Opt 2
 * If you've played another Wizard 'non-attack' action card this turn, put
 * this into its owner's hand.
 */

describe("Gaze the Ages (CRU163) AAA", () => {
  it("happy: after another Wizard non-attack action it returns to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [zapRed, gazeTheAgesBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    const Dash = game.as(dash);
    Kano.play(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    Kano.play(gazeTheAgesBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Kano, gazeTheAgesBlue).toBeIn("hand");
  });

  it("boundary: as the first Wizard action it resolves to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [gazeTheAgesBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(gazeTheAgesBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Kano, gazeTheAgesBlue).toBeIn("graveyard");
    expectFabPlayer(Kano).toHaveHandCount(0);
  });
});
