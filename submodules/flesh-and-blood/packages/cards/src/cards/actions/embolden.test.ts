import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { fogDownYellow } from "./fog-down.ts";
import { emboldenRed } from "./embolden.ts";

/**
 * Embolden Red (ELE206) — Guardian Action Aura. Go again.
 *
 * Printed: When this enters the arena, if you control another non-token
 * aura, draw a card.
 */

describe("Embolden (ELE206) AAA", () => {
  it("happy: entering beside another aura draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [emboldenRed],
        arena: [fogDownYellow], // a non-token aura is already seated
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(emboldenRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Oldhim, emboldenRed).toBeIn("arena");
    // The aura's own play consumed the hand slot; the enter trigger drew 1.
    expectFabPlayer(Oldhim).toHaveHandCount(1);
  });

  it("boundary: entering alone draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [emboldenRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(emboldenRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Oldhim, emboldenRed).toBeIn("arena");
    expectFabPlayer(Oldhim).toHaveHandCount(0);
  });
});
