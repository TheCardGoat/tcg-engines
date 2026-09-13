import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { bonebreakerBellowRed } from "../actions/bonebreaker-bellow.ts";
import { wageMightRed } from "../actions/wage-might.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { overbearingPresence } from "./overbearing-presence.ts";

/**
 * Overbearing Presence (SUP126) — Brute Chest d1, Blade Break.
 * Printed: "Action - {r}{r}{r}, destroy this: Create 3 Vigor tokens. Activate
 * this only if there is a card with 6 or more {p} in your pitch zone. Go again"
 */

describe("Overbearing Presence (SUP126) AAA", () => {
  it("happy: with a 7{p} card pitched, pay 3 and destroy this for 3 Vigor and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        chest: [overbearingPresence],
        hand: [bonebreakerBellowRed, wageMightRed, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    // Bellow costs 1 and Rhinar is broke: Wage Might Red (7{p}) must land in
    // the pitch zone to pay it.
    Rhinar.play(bonebreakerBellowRed, { pitch: wageMightRed });
    game.untilIdle();
    Rhinar.activate(overbearingPresence);
    game.helpers.resolveUntilIdle({ paymentCanonicalId: nimblismBlue.canonicalId });

    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 3);
    expectFabCard(Rhinar, overbearingPresence).toBeIn("graveyard");
    // The activation's go again refunds its action point.
    expectFabPlayer(Rhinar).toHaveAP(1);
  });

  it("boundary: with only a 4{p} card in the pitch zone the action stays locked", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        chest: [overbearingPresence],
        hand: [bonebreakerBellowRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    // Best card in the pitch zone is Snatch's 4{p} — below the printed gate.
    Rhinar.play(bonebreakerBellowRed, { pitch: snatchRed });
    game.untilIdle();
    Rhinar.expectActivationRejected(overbearingPresence);
    expectFabCard(Rhinar, overbearingPresence).toBeIn("chest");
    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 0);
  });
});
