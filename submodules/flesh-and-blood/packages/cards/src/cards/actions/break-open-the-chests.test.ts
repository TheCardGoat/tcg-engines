import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { scurvStowaway } from "../heroes/scurv-stowaway.ts";
import { snatchRed } from "./snatch.ts";
import { disableYellow } from "./disable.ts";
import { breakOpenTheChestsYellow } from "./break-open-the-chests.ts";

/**
 * Break Open the Chests! (PEN170) — Pirate Action, cost 1, go again.
 * Printed: Turn all cards in all arsenals face-up. Then if there's a face-up
 * yellow card in any arsenal, create 2 Gold tokens.
 *
 */

describe("Break Open the Chests! (PEN170) AAA", () => {
  it("happy: a face-up yellow arsenal creates 2 Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        hand: [breakOpenTheChestsYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [disableYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Scurv = game.as(scurvStowaway);

    Scurv.play(breakOpenTheChestsYellow);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabToken(game, "gold").toHaveCount(2);
    expectFabCard(Scurv, breakOpenTheChestsYellow).toBeIn("graveyard");
  });

  it("boundary: empty arsenals create no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        hand: [breakOpenTheChestsYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Scurv = game.as(scurvStowaway);

    Scurv.play(breakOpenTheChestsYellow);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabToken(game, "gold").toHaveCount(0);
    expectFabCard(Scurv, breakOpenTheChestsYellow).toBeIn("graveyard");
  });

  it("timing: go again refunds when arsenals are empty", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        hand: [breakOpenTheChestsYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Scurv = game.as(scurvStowaway);

    Scurv.play(breakOpenTheChestsYellow);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabToken(game, "gold").toHaveCount(0);
    expectFabPlayer(Scurv).toHaveAP(1);
  });
});
