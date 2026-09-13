import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { blessingOfDeliveranceBlue } from "../actions/blessing-of-deliverance.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { solitaryCompanionBlue } from "../actions/solitary-companion.ts";
import { whoBlinksFirstBlue } from "./who-blinks-first.ts";

/**
 * Who Blinks First? (SUP177) — Guardian Instant Aura, cost 3, Suspense.
 *
 * Printed: When this leaves the arena, you may destroy an aura permanent that
 * a Guardian hero controls.
 */

describe("Who Blinks First? (SUP177) AAA", () => {
  it("happy: playing this enters the arena with 2 suspense counters", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [whoBlinksFirstBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(whoBlinksFirstBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Bravo, whoBlinksFirstBlue).toBeIn("arena");
    expectFabCard(Bravo, whoBlinksFirstBlue).toHaveCounters(2, "suspense");
  });

  it("boundary: the opposing hero's first end of turn does not yet remove the last suspense counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [whoBlinksFirstBlue], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    expectFabCard(Bravo, whoBlinksFirstBlue).toBeIn("arena");

    Dash.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    expectFabCard(Bravo, whoBlinksFirstBlue).toBeIn("arena");
  });

  it("timing: after this leaves, you may destroy an aura a Guardian hero controls", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [whoBlinksFirstBlue], hand: [], deck: 6 },
      { hero: oldhim, arena: [blessingOfDeliveranceBlue], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Oldhim = game.as(oldhim);

    Bravo.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Oldhim.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Bravo.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Oldhim.endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Bravo, whoBlinksFirstBlue).toBeIn("graveyard");
    expectFabCard(Oldhim, blessingOfDeliveranceBlue).toBeIn("graveyard");
  });

  it("happy: after this leaves, you may destroy an aura its controller's Guardian hero controls", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [whoBlinksFirstBlue, blessingOfDeliveranceBlue],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Dash.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Bravo.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Dash.endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Bravo, whoBlinksFirstBlue).toBeIn("graveyard");
    expectFabCard(Bravo, blessingOfDeliveranceBlue).toBeIn("graveyard");
  });

  it("boundary: an aura a non-Guardian hero controls is not destroyed", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [whoBlinksFirstBlue], hand: [], deck: 6 },
      { hero: dash, arena: [solitaryCompanionBlue], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Dash.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Bravo.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Dash.endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Bravo, whoBlinksFirstBlue).toBeIn("graveyard");
    expectFabCard(Dash, solitaryCompanionBlue).toBeIn("arena");
  });
});
