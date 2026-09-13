import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { scurvStowaway } from "../heroes/scurv-stowaway.ts";
import { treasureIsland } from "../macros/treasure-island.ts";
import { lostInTransitYellow } from "./lost-in-transit.ts";

/**
 * Lost in Transit, Yellow (SEA151) — Pirate Block, 3{d}.
 * Printed: When this defends, you may remove a gold counter from Treasure
 * Island. If you do and you are a Thief, create a Gold token.
 */

describe("Lost in Transit (SEA151) AAA", () => {
  it("happy: a Thief who removes a gold counter creates a Gold token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: scurvStowaway,
        macros: [treasureIsland],
        hand: [lostInTransitYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Scurv = game.as(scurvStowaway);

    game.as(dash).attackWith(snatchRed);
    Scurv.defendWith(lostInTransitYellow);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Scurv.target(treasureIsland);

    expectFabCard(Scurv, treasureIsland).toHaveCounters(0, "gold");
    expectFabPlayer(Scurv).toHaveTokenCount("gold", 1);
    expectFabPlayer(Scurv).toHaveLife(19);
  });

  it("boundary: a non-Thief who removes a gold counter does not create Gold", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: gravyBones,
        macros: [treasureIsland],
        hand: [lostInTransitYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    game.as(dash).attackWith(snatchRed);
    Gravy.defendWith(lostInTransitYellow);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Gravy.target(treasureIsland);

    expectFabCard(Gravy, treasureIsland).toHaveCounters(0, "gold");
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 0);
    expectFabPlayer(Gravy).toHaveLife(19);
  });

  it("timing: declining the remove creates no Gold", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: scurvStowaway,
        macros: [treasureIsland],
        hand: [lostInTransitYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Scurv = game.as(scurvStowaway);

    game.as(dash).attackWith(snatchRed);
    Scurv.defendWith(lostInTransitYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Scurv, treasureIsland).toHaveCounters(1, "gold");
    expectFabPlayer(Scurv).toHaveTokenCount("gold", 0);
    expectFabPlayer(Scurv).toHaveLife(19);
  });
});
