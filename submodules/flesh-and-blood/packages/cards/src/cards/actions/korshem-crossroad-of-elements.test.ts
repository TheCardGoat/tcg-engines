import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { korshemCrossroadOfElements } from "./korshem-crossroad-of-elements.ts";

/**
 * Korshem, Crossroad of Elements (ELE000) — Elemental Landmark, Legendary, go again.
 * Printed: whenever a hero reveals 1+ cards they choose {r} / {h} / next
 * attack +1{p} / next defending action +1{d}. End phase: destroy this if none
 * of those gains happened this turn.
 */

describe("Korshem, Crossroad of Elements (ELE000) AAA", () => {
  it("happy: playing this with go again refunds the action point and seats the landmark", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [korshemCrossroadOfElements],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(korshemCrossroadOfElements);
    game.untilIdle();

    expectFabCard(Briar, korshemCrossroadOfElements).toBeIn("arena");
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: it is not an attack and does not open combat", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [korshemCrossroadOfElements],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).play(korshemCrossroadOfElements);
    game.untilIdle();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: end phase without a reveal-choice this turn destroys this", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [korshemCrossroadOfElements],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(korshemCrossroadOfElements);
    game.untilIdle();
    Briar.endTurn();
    game.untilIdle();

    expectFabCard(Briar, korshemCrossroadOfElements).toBeIn("graveyard");
  });
});
