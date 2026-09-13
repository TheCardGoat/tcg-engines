import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";

import { briar } from "../heroes/briar.ts";
import { hauntingRenditionRed } from "./haunting-rendition.ts";

/**
 * Haunting Rendition (ROS120) — Runeblade Block, red d4.
 *
 * Printed Instant: Discard this: Prevent the next 2 damage that would be
 * dealt to you this turn. The first time you prevent damage this way,
 * create a Runechant token.
 */

describe("Haunting Rendition (ROS120) AAA", () => {
  it("happy: discard this from hand as an Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [hauntingRenditionRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    Briar.activate(hauntingRenditionRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Briar, hauntingRenditionRed).toBeIn("graveyard");
  });

  it("boundary: the Instant cannot be activated from the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [],
        graveyard: [hauntingRenditionRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(briar).expectActivationRejected(hauntingRenditionRed);
  });

  it("timing: without incoming damage this turn no Runechant is created", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [hauntingRenditionRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    Briar.activate(hauntingRenditionRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 0);
  });
});
