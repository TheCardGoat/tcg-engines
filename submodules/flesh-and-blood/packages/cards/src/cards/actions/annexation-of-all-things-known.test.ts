import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snagBlue } from "../instants/snag.ts";
import { valdaSeismicImpact } from "../heroes/valda-seismic-impact.ts";
import { annexationOfAllThingsKnownYellow } from "./annexation-of-all-things-known.ts";

/**
 * Annexation of All Things Known (MPG029) — Guardian Attack 8{p}/3{d}.
 *
 * Printed: When this deals 4 or more damage to a Guardian hero, until the
 * end of your next turn, they can't play face-up cards from arsenal, and
 * you may play face-up cards from their arsenal.
 */

describe("Annexation of All Things Known (MPG029) AAA", () => {
  it("happy: crush vs a Guardian lets you play their face-up arsenal card", () => {
    const game = FabTestEngine.start(
      {
        hero: valdaSeismicImpact,
        hand: [annexationOfAllThingsKnownYellow],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        arsenal: [{ card: snagBlue, state: { faceDown: false } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(valdaSeismicImpact);
    const Bravo = game.as(bravo);
    const stolen = Bravo.cardIn("arsenal", snagBlue).instanceId;

    Valda.attackWith(annexationOfAllThingsKnownYellow);
    Bravo.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Bravo).toHaveLife(12);

    Valda.playInstance(stolen, { from: "arsenal" });
    game.untilIdle({ ordering: "listed" });
    // CR 3.8.2: graveyards hold only their owner's cards, so Bravo's Snag
    // resolves there even though Valda played it.
    expectFabCard(Bravo, snagBlue).toBeIn("graveyard");
  });

  it("boundary: crush vs a non-Guardian does not steal their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: valdaSeismicImpact,
        hand: [annexationOfAllThingsKnownYellow],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arsenal: [{ card: snagBlue, state: { faceDown: false } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(valdaSeismicImpact);
    const Dash = game.as(dash);
    const snagId = Dash.cardIn("arsenal", snagBlue).instanceId;

    Valda.attackWith(annexationOfAllThingsKnownYellow);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabUnplayable(
      () => Valda.playInstance(snagId, { from: "arsenal" }),
      /own zones|legal play zone|not in the declared play zone|couldn't be played/i,
    );
    expectFabCard(Dash, snagBlue).toBeIn("arsenal");
  });

  it("timing: the crushed Guardian cannot play their face-up arsenal card", () => {
    const game = FabTestEngine.start(
      {
        hero: valdaSeismicImpact,
        hand: [annexationOfAllThingsKnownYellow],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        arsenal: [{ card: snagBlue, state: { faceDown: false } }],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(valdaSeismicImpact);
    const Bravo = game.as(bravo);

    Valda.attackWith(annexationOfAllThingsKnownYellow);
    Bravo.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    Valda.endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabUnplayable(
      () => Bravo.play(snagBlue, { from: "arsenal" }),
      /restricts this object from being played/i,
    );
    expectFabCard(Bravo, snagBlue).toBeIn("arsenal");
  });
});
