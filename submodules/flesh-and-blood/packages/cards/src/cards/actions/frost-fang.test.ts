import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { snatchRed } from "./snatch.ts";
import { frostFangRed } from "./frost-fang.ts";

/**
 * Frost Fang Red (ELE148) — Ice Attack Action.
 *
 * Printed: If Frost Fang hits a hero, they discard a card unless they pay
 * {r}{r}.
 */

describe("Frost Fang (ELE148) AAA", () => {
  it("happy: a hit on a hero who cannot pay forces a discard", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [frostFangRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.playAttack(frostFangRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(15); // 20 - 5
    expectFabCard(Dash, snatchRed).toBeIn("graveyard"); // discarded
  });

  it("boundary: a paying defender keeps their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [frostFangRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 2, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.playAttack(frostFangRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });
});
