import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { shockCharmers } from "./shock-charmers.ts";

describe("Shock Charmers (ELE173) AAA", () => {
  it("happy: Instant {r}{r} then Snatch hit deals 5 (4+1)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [shockCharmers],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(shockCharmers);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Bravo, shockCharmers).toBeIn("arms");
  });

  it("boundary: without the Instant, Snatch only deals 4", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [shockCharmers],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(snatchRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: a blocked miss does not deal the extra 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [shockCharmers],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(shockCharmers);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    game.as(dash).defendWith([nimblismBlue, nimblismBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
