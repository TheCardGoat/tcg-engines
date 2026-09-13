import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { staticShelterYellow } from "./static-shelter.ts";

/**
 * Static Shelter, Yellow (OMN147) — Lightning Defense Reaction, 0-cost 3{d}.
 * Printed: When this defends, you may pay {r}. If you do, create a Lightning Flow token.
 */

describe("Static Shelter (OMN147) AAA", () => {
  it("happy: paying {r} while defending creates a Lightning Flow", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: bravo,
        hand: [staticShelterYellow],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.toReaction("defender");
    Bravo.must.playReaction(staticShelterYellow);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("lightning-flow", 1);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectFabCard(Bravo, staticShelterYellow).toBeIn("graveyard");
  });

  it("boundary: declining the pay does not create a Lightning Flow", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: bravo,
        hand: [staticShelterYellow],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.toReaction("defender");
    Bravo.must.playReaction(staticShelterYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("lightning-flow", 0);
    expectFabPlayer(Bravo).toHaveResourceCount(1);
  });

  it("timing: with 0{r} the optional cannot create a Lightning Flow", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: bravo,
        hand: [staticShelterYellow],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.toReaction("defender");
    Bravo.must.playReaction(staticShelterYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("lightning-flow", 0);
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
