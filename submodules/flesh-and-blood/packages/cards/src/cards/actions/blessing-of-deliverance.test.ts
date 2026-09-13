import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { disableRed } from "./disable.ts";
import { evergreenRed } from "./evergreen.ts";
import { snatchRed } from "./snatch.ts";
import { blessingOfDeliveranceRed } from "./blessing-of-deliverance.ts";

/**
 * Blessing of Deliverance Red (WTR054) — Guardian Action Aura. Go again.
 *
 * Printed: When Blessing of Deliverance enters the arena, if you have a
 * card with cost 3 or greater in your pitch zone, draw a card.
 */

describe("Blessing of Deliverance (WTR054) AAA", () => {
  it("happy: draws when a cost-3 card is in the pitch zone", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [blessingOfDeliveranceRed],
        pitch: [disableRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(blessingOfDeliveranceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Bravo, blessingOfDeliveranceRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveHandCount(1);
    expect(Bravo.zone("pitch")).toContain(disableRed.canonicalId);
  });

  it("boundary: no pitched cost-3 card draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [blessingOfDeliveranceRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(blessingOfDeliveranceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Bravo, blessingOfDeliveranceRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveHandCount(1); // snatch only, no draw
  });

  it("timing: at the start of your action phase it reveals three cards and gains life", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [blessingOfDeliveranceRed],
        life: 20,
        deck: [disableRed, evergreenRed, evergreenRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Bravo, blessingOfDeliveranceRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(23);
  });
});
