import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";

import { nimblismBlue, nimblismYellow } from "../actions/nimblism.ts";
import { spoilsOfWarRed } from "../actions/spoils-of-war.ts";
import { lightOfSolYellow } from "./light-of-sol.ts";

/**
 * Light of Sol (DTD000) — Light Resource - Gem, Legendary.
 *
 * Printed: "When this is pitched, reveal the top card of your deck. If it's
 * yellow, you may put it into your soul."
 */

describe("Light of Sol (DTD000) AAA", () => {
  it("happy: pitching with a yellow top card charges it into the soul", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [lightOfSolYellow, spoilsOfWarRed],
        deck: [nimblismYellow],
        resourcePoints: 0, // Light of Sol must be the pitch payment
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const topCard = Kassai.cardIn("deck", nimblismYellow);

    Kassai.must
      .pitch(lightOfSolYellow) // costs 1{r}: Light of Sol is the only pitch
      .play(spoilsOfWarRed);
    game.passBoth();
    Kassai.accept(); // charge the revealed yellow into the soul

    expectFabCard(Kassai, topCard).toBeIn("soul");
  });

  it("boundary: a non-yellow top card is not charged into the soul", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [lightOfSolYellow, spoilsOfWarRed],
        deck: [nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const topCard = Kassai.cardIn("deck", nimblismBlue);

    Kassai.must.pitch(lightOfSolYellow).play(spoilsOfWarRed);
    game.passBoth();

    // The reveal was blue: no charge optional opens at all.
    expectFabCard(Kassai, topCard).toBeIn("deck");
  });

  it("timing: declining the charge keeps the yellow card out of the soul", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [lightOfSolYellow, spoilsOfWarRed],
        deck: [nimblismYellow],
        resourcePoints: 0, // Light of Sol must be the pitch payment
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    Kassai.cardIn("deck", nimblismYellow);

    Kassai.must.pitch(lightOfSolYellow).play(spoilsOfWarRed);
    game.passBoth();
    Kassai.decline(); // leave the revealed yellow in the deck

    expect(Kassai.zone("soul")).not.toContain(nimblismYellow.canonicalId);
  });
});
