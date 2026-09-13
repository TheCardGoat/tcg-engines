import { photonSplicingBlue } from "./photon-splicing.ts";

import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { photonSplicingRed } from "./photon-splicing.ts";

describe("Photon Splicing (OSC018) AAA", () => {
  it("happy: Instant discards this from hand", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [photonSplicingRed], resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    Kano.activate(photonSplicingRed);
    game.untilIdle();
    expectFabCard(Kano, photonSplicingRed).toBeIn("graveyard");
  });

  it("boundary: Bravo's copy in hand is not discarded", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [photonSplicingRed], deck: 6 },
      { hero: dash, hand: [photonSplicingRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(kano).activate(photonSplicingRed);
    game.untilIdle();
    expectFabCard(game.as(kano), photonSplicingRed).toBeIn("graveyard");
    expectFabCard(game.as(dash), photonSplicingRed).toBeIn("hand");
  });

  it("happy: deals 2 arcane to the targeted hero", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [photonSplicingBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(photonSplicingBlue, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Blaze, photonSplicingBlue).toBeIn("graveyard");
  });
});
