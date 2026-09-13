import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { lionSPounce } from "./lion-s-pounce.ts";

/**
 * Lion's Pounce (SMP028) — Event.
 *
 * Printed: This attacks each hero.
 * 1v1 product has no Event deck; a seated Event shell stays inert.
 */

describe("Lion's Pounce (SMP028) AAA", () => {
  it("happy: a seated Event does not open combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [lionSPounce], hand: [], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectCombat(game).toBeClosed();
    expectWait(game).notToHaveDecision();
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("boundary: the Event remains seated and does not damage the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [lionSPounce], hand: [], deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectCombat(game).toBeClosed();
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: ending the turn still does not resolve an Event attack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [lionSPounce], hand: [], deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).endTurn();
    game.helpers.untilIdle();
    expectCombat(game).toBeClosed();
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
